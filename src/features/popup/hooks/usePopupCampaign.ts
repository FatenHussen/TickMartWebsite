import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { _PopupApi } from "../api/popupApi";
import { canShowPopup, recordImpression } from "../utils/frequency";
import { getPageTypeFromPath } from "../utils/pageType";
import type { PopupCampaign, PopupTrackPayload } from "../types";

type UsePopupCampaignReturn = {
    popup: PopupCampaign | null;
    isOpen: boolean;
    close: () => void;
    trackClick: () => void;
};

export function usePopupCampaign(): UsePopupCampaignReturn {
    const location = useLocation();
    const pageType = getPageTypeFromPath(location.pathname);
    const currentUrl =
        typeof window !== "undefined" ? window.location.href : undefined;

    const { data: popup } = useQuery({
        queryKey: queryKeys.popups.active({
            page_type: pageType,
            current_url: currentUrl,
        }),
        queryFn: () =>
            _PopupApi.getActive({
                page_type: pageType,
                current_url: currentUrl,
            }),
        staleTime: 60_000,
    });

    const [isOpen, setIsOpen] = useState(false);
    const triggeredRef = useRef<number | null>(null);

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

    useEffect(() => {
        if (!popup) return;
        if (triggeredRef.current === popup.id) return;
        if (!canShowPopup(popup)) return;

        const triggerType = popup.trigger?.type ?? "delay";
        const triggerValue = popup.trigger?.value ?? 0;

        const open = () => {
            if (triggeredRef.current === popup.id) return;
            triggeredRef.current = popup.id;
            recordImpression(popup);
            setIsOpen(true);
            _PopupApi.trackView(popup.id, trackPayload).catch(() => {});
        };

        if (triggerType === "load") {
            open();
            return;
        }

        if (triggerType === "delay") {
            const ms = Math.max(0, triggerValue) * 1000;
            const id = window.setTimeout(open, ms);
            return () => window.clearTimeout(id);
        }

        if (triggerType === "scroll") {
            const targetPercent = Math.min(
                100,
                Math.max(1, triggerValue || 50)
            );
            const onScroll = () => {
                const scrolled = window.scrollY + window.innerHeight;
                const total = document.documentElement.scrollHeight;
                if (total <= 0) return;
                const percent = (scrolled / total) * 100;
                if (percent >= targetPercent) {
                    window.removeEventListener("scroll", onScroll);
                    open();
                }
            };
            window.addEventListener("scroll", onScroll, { passive: true });
            return () => window.removeEventListener("scroll", onScroll);
        }

        if (triggerType === "exit") {
            const onMouseLeave = (e: MouseEvent) => {
                if (e.clientY <= 0) {
                    document.removeEventListener("mouseleave", onMouseLeave);
                    open();
                }
            };
            document.addEventListener("mouseleave", onMouseLeave);
            return () => document.removeEventListener("mouseleave", onMouseLeave);
        }

        // Unknown trigger — fall back to immediate
        open();
    }, [popup, trackPayload]);

    const close = () => setIsOpen(false);

    const trackClick = () => {
        if (!popup) return;
        _PopupApi.trackClick(popup.id, trackPayload).catch(() => {});
    };

    return {
        popup: popup ?? null,
        isOpen,
        close,
        trackClick,
    };
}
