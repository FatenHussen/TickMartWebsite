import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { _PopupApi } from "../api/popupApi";
import { enqueue, dequeue, clearQueue } from "../queue/popupQueue";
import { recordImpression, recordDismissal } from "../storage/popupStorage";
import { PopupTracker } from "../tracking/popupTracking";
import { getPageTypeFromPath } from "../utils/pageType";
import { useEntityContext } from "../hooks/useEntityContext";
import type { PopupCampaign, PopupCloseReason, PopupTrackPayload } from "../types";
import PopupCampaignComponent from "../components/PopupCampaign";

// ─── Context ──────────────────────────────────────────────────────────────────

type PopupContextValue = {
    activePopup: PopupCampaign | null;
    close: (reason?: PopupCloseReason) => void;
    trackClick: () => void;
    trackPayload: PopupTrackPayload;
};

const PopupContext = createContext<PopupContextValue | null>(null);

export function usePopupContext(): PopupContextValue {
    const ctx = useContext(PopupContext);
    if (!ctx) throw new Error("usePopupContext must be used within PopupProvider");
    return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

type Props = { children: ReactNode };

export function PopupProvider({ children }: Props) {
    const location = useLocation();
    const entityContext = useEntityContext();
    const pageType = getPageTypeFromPath(location.pathname);
    const currentUrl =
        typeof window !== "undefined" ? window.location.href : undefined;

    const [activePopup, setActivePopup] = useState<PopupCampaign | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Guards against triggering the same popup twice in a single app session.
    // Lives in a ref so it resets on every fresh component mount while surviving
    // React's internal reconciler re-renders.
    const triggeredRef = useRef<number | null>(null);

    const queryParams = useMemo(
        () => ({ page_type: pageType, current_url: currentUrl, ...entityContext }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pageType, currentUrl, JSON.stringify(entityContext)]
    );

    const { data: fetchedPopup } = useQuery({
        queryKey: queryKeys.popups.active(queryParams),
        queryFn: () => _PopupApi.getActive(queryParams),
        staleTime: 60_000,
    });

    // Enqueue the campaign returned from the server.
    useEffect(() => {
        if (fetchedPopup) enqueue(fetchedPopup);
    }, [fetchedPopup]);

    // When nothing is showing, pick the next eligible campaign from the queue.
    useEffect(() => {
        if (isOpen || activePopup) return;
        const next = dequeue();
        if (!next) return;
        setActivePopup(next);
    }, [fetchedPopup, isOpen, activePopup]);

    // Stable tracking payload — memoized so it doesn't recreate on every render.
    const trackPayload: PopupTrackPayload = useMemo(
        () => ({
            page_type: pageType,
            current_url: currentUrl,
            referrer:
                typeof document !== "undefined"
                    ? document.referrer || undefined
                    : undefined,
        }),
        [pageType, currentUrl]
    );

    // Trigger logic — fires once per popup per provider mount.
    useEffect(() => {
        if (!activePopup) return;
        // triggeredRef guards against double-fire (React StrictMode, HMR).
        if (triggeredRef.current === activePopup.id) return;

        const triggerType = (activePopup.trigger?.type ?? "delay").toLowerCase();
        const triggerValue = activePopup.trigger?.value ?? 0;

        const open = () => {
            if (triggeredRef.current === activePopup.id) return;
            triggeredRef.current = activePopup.id;
            recordImpression(activePopup);
            setIsOpen(true);
            PopupTracker.trackView(activePopup.id, trackPayload);
        };

        // "load" and "on_load" are equivalent
        if (triggerType === "load" || triggerType === "on_load") {
            open();
            return;
        }

        if (triggerType === "delay") {
            const ms = Math.max(0, triggerValue) * 1000;
            const id = window.setTimeout(open, ms);
            return () => window.clearTimeout(id);
        }

        if (triggerType === "scroll") {
            const targetPct = Math.min(100, Math.max(1, triggerValue || 50));
            const onScroll = () => {
                const scrolled = window.scrollY + window.innerHeight;
                const total = document.documentElement.scrollHeight;
                if (total > 0 && (scrolled / total) * 100 >= targetPct) {
                    window.removeEventListener("scroll", onScroll);
                    open();
                }
            };
            window.addEventListener("scroll", onScroll, { passive: true });
            return () => window.removeEventListener("scroll", onScroll);
        }

        if (triggerType === "exit_intent" || triggerType === "exit") {
            const onMouseLeave = (e: MouseEvent) => {
                if (e.clientY <= 0) {
                    document.removeEventListener("mouseleave", onMouseLeave);
                    open();
                }
            };
            document.addEventListener("mouseleave", onMouseLeave);
            return () => document.removeEventListener("mouseleave", onMouseLeave);
        }

        // Unknown trigger type — treat as immediate load
        open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePopup]);

    // Reset the queue when the provider unmounts (e.g. on HMR full reload).
    useEffect(() => () => clearQueue(), []);

    const close = useCallback(
        (reason: PopupCloseReason = "close_button") => {
            if (activePopup) {
                recordDismissal(activePopup, reason);
                PopupTracker.trackDismiss(activePopup.id, reason, trackPayload);
            }
            setIsOpen(false);
            // Wait for exit animation before clearing popup state.
            setTimeout(() => {
                setActivePopup(null);
                triggeredRef.current = null;
            }, 300);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [activePopup]
    );

    const trackClick = useCallback(() => {
        if (activePopup) {
            PopupTracker.trackClick(activePopup.id, trackPayload);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePopup]);

    return (
        <PopupContext.Provider
            value={{ activePopup, close, trackClick, trackPayload }}
        >
            {children}
            <PopupCampaignComponent popup={activePopup} isOpen={isOpen} />
        </PopupContext.Provider>
    );
}
