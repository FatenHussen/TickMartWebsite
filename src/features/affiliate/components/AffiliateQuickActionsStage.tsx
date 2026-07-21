import {
    useCallback,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    AnimatePresence,
    LayoutGroup,
    motion,
    useMotionValue,
    useSpring,
} from "framer-motion";
import { HiChevronRight } from "react-icons/hi";
import { Layers } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { paths } from "@/app/routes/path/paths";
import type { QuickActionItem } from "../types";
import { resolveQuickActionPath } from "../lib/resolveQuickActionPath";
import FeaturedActionPanel from "./quick-actions/FeaturedActionPanel";
import ActionRailItem from "./quick-actions/ActionRailItem";
import AmbientField from "./quick-actions/AmbientField";
import "./quick-actions/quick-actions-deck.css";

/** Auto-advance duration; the spotlight ring animates over the same window. */
const AFFILIATE_QA_AUTOPLAY_MS = 4200;

function subscribeReducedMotion(callback: () => void) {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", callback);
    return () => mq.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot() {
    return false;
}
function usePrefersReducedMotion() {
    return useSyncExternalStore(
        subscribeReducedMotion,
        getReducedMotionSnapshot,
        getReducedMotionServerSnapshot
    );
}

type AffiliateQuickActionsStageProps = {
    actions: QuickActionItem[];
    isLoading: boolean;
    isError: boolean;
    isRTL: boolean;
};

type PortalState = { x: number; y: number; to: string } | null;

export default function AffiliateQuickActionsStage({
    actions,
    isLoading,
    isError,
    isRTL,
}: AffiliateQuickActionsStageProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const prefersReducedMotion = usePrefersReducedMotion();

    const [activeIndex, setActiveIndex] = useState(0);
    const [hovering, setHovering] = useState(false);
    const [focusWithin, setFocusWithin] = useState(false);
    const [portal, setPortal] = useState<PortalState>(null);

    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    // Cursor spotlight (root-level), smoothed with springs.
    const rawX = useMotionValue(50);
    const rawY = useMotionValue(50);
    const pointerActive = useMotionValue(0);
    const pointerX = useSpring(rawX, { stiffness: 120, damping: 26 });
    const pointerY = useSpring(rawY, { stiffness: 120, damping: 26 });
    const spotlightActive = useSpring(pointerActive, {
        stiffness: 140,
        damping: 26,
    });

    const total = actions.length;
    const autoAdvance = !prefersReducedMotion && total > 1;
    const isPaused = hovering || focusWithin || portal !== null;

    const advance = useCallback(() => {
        setActiveIndex((i) => (total ? (i + 1) % total : 0));
    }, [total]);

    const preview = useCallback((index: number) => {
        setActiveIndex(index);
    }, []);

    const openAction = useCallback(
        (to: string, event: React.MouseEvent) => {
            // Respect new-tab / modifier intents — let the browser handle those.
            if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }
            event.preventDefault();
            if (prefersReducedMotion) {
                navigate(to);
                return;
            }
            setPortal({ x: event.clientX, y: event.clientY, to });
        },
        [navigate, prefersReducedMotion]
    );

    const focusItem = useCallback(
        (index: number) => {
            if (!total) return;
            const clamped = (index + total) % total;
            itemRefs.current[clamped]?.focus();
        },
        [total]
    );

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            const nextKey = isRTL ? "ArrowLeft" : "ArrowRight";
            const prevKey = isRTL ? "ArrowRight" : "ArrowLeft";
            if (event.key === "ArrowDown" || event.key === nextKey) {
                event.preventDefault();
                focusItem(activeIndex + 1);
            } else if (event.key === "ArrowUp" || event.key === prevKey) {
                event.preventDefault();
                focusItem(activeIndex - 1);
            } else if (event.key === "Home") {
                event.preventDefault();
                focusItem(0);
            } else if (event.key === "End") {
                event.preventDefault();
                focusItem(total - 1);
            } else if (/^[1-9]$/.test(event.key)) {
                const idx = Number(event.key) - 1;
                if (idx < total) {
                    event.preventDefault();
                    focusItem(idx);
                }
            }
        },
        [activeIndex, focusItem, isRTL, total]
    );

    const handleRootPointerMove = useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            if (event.pointerType === "touch") return;
            const rect = event.currentTarget.getBoundingClientRect();
            rawX.set(((event.clientX - rect.left) / rect.width) * 100);
            rawY.set(((event.clientY - rect.top) / rect.height) * 100);
        },
        [rawX, rawY]
    );

    const current = actions[activeIndex];
    const eyebrowFor = (a: QuickActionItem) =>
        a.page_title?.trim() ||
        t("affiliateWelcome.quickActions", "Quick actions");

    const railItems = useMemo(
        () =>
            actions.map((action, index) => {
                const to = resolveQuickActionPath(action.page_slug);
                return (
                    <ActionRailItem
                        key={action.id}
                        ref={(el) => {
                            itemRefs.current[index] = el;
                        }}
                        action={action}
                        index={index}
                        to={to}
                        eyebrow={eyebrowFor(action)}
                        isActive={index === activeIndex}
                        isRTL={isRTL}
                        reducedMotion={prefersReducedMotion}
                        onPreview={preview}
                        onOpen={openAction}
                    />
                );
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [actions, activeIndex, isRTL, prefersReducedMotion, preview, openAction]
    );

    if (isError) {
        return (
            <p className="p-8 text-sm text-red-600 dark:text-red-400">
                {t(
                    "affiliateWelcome.quickActionsError",
                    "Couldn't load quick actions. Please try again later."
                )}
            </p>
        );
    }

    if (isLoading) {
        return (
            <div
                className="relative grid min-h-[30rem] gap-4 p-4 sm:p-6 lg:grid-cols-[1.1fr_0.9fr]"
                aria-busy
                aria-label={t("affiliateWelcome.quickActions", "Quick actions")}
            >
                <div className="min-h-[19rem] animate-pulse rounded-[1.9rem] bg-[color-mix(in_srgb,var(--color-main)_8%,var(--color-bg-card))] ring-1 ring-[color-mix(in_srgb,var(--color-main)_14%,var(--color-border-primary))]" />
                <div className="flex flex-col gap-2.5">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-[4.5rem] animate-pulse rounded-2xl bg-[color-mix(in_srgb,var(--color-main)_7%,var(--color-bg-card))] ring-1 ring-[color-mix(in_srgb,var(--color-main)_12%,var(--color-border-primary))]"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (!total || !current) {
        return null;
    }

    const currentTo = resolveQuickActionPath(current.page_slug);
    const currentLabel =
        current.button_text?.trim() || t("affiliateWelcome.openAction", "Open");

    return (
        <div
            className="qa-deck relative isolate min-h-[30rem] overflow-hidden rounded-[1.45rem]"
            role="region"
            aria-roledescription="command deck"
            aria-label={t("affiliateWelcome.quickActions", "Quick actions")}
            onPointerMove={handleRootPointerMove}
            onPointerEnter={(e) => {
                if (e.pointerType !== "touch") {
                    setHovering(true);
                    pointerActive.set(1);
                }
            }}
            onPointerLeave={() => {
                setHovering(false);
                pointerActive.set(0);
            }}
            onFocusCapture={() => setFocusWithin(true)}
            onBlurCapture={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setFocusWithin(false);
                }
            }}
        >
            <AmbientField
                pointerX={pointerX}
                pointerY={pointerY}
                pointerActive={spotlightActive}
            />

            <div className="relative z-[1] flex h-full flex-col gap-4 p-4 sm:p-6">
                {/* Top chrome */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--color-main)_12%,var(--color-bg-card))] text-[var(--color-main)] ring-1 ring-[color-mix(in_srgb,var(--color-main)_24%,var(--color-border-primary))]">
                            <Layers className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
                            {t(
                                "affiliateWelcome.quickActionsDeckLabel",
                                "Command deck"
                            )}
                        </span>
                    </div>
                    <Link
                        to={paths.client.home}
                        className={cn(
                            "inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--color-main)_22%,var(--color-border-primary))] bg-[color-mix(in_srgb,var(--color-bg-card)_80%,transparent)] px-3.5 py-2 text-sm font-semibold text-[var(--color-main)] shadow-sm backdrop-blur-sm transition hover:border-[color-mix(in_srgb,var(--color-api-second)_40%,var(--color-border-primary))] hover:text-[var(--color-api-second)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-main)]",
                            isRTL && "flex-row-reverse"
                        )}
                    >
                        {t("affiliateWelcome.goToHome", "Go to home")}
                        <HiChevronRight
                            className={cn("h-4 w-4 shrink-0", isRTL && "rotate-180")}
                        />
                    </Link>
                </div>

                {/* Command deck: spotlight + rail */}
                <div className="grid flex-1 gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-5">
                    <FeaturedActionPanel
                        action={current}
                        index={activeIndex}
                        total={total}
                        to={currentTo}
                        label={currentLabel}
                        eyebrow={eyebrowFor(current)}
                        routeLabel={currentTo}
                        isRTL={isRTL}
                        reducedMotion={prefersReducedMotion}
                        isPaused={isPaused}
                        autoplayMs={AFFILIATE_QA_AUTOPLAY_MS}
                        autoAdvance={autoAdvance}
                        onOpen={openAction}
                        onCycleEnd={advance}
                    />

                    <LayoutGroup>
                        <div
                            className="qa-rail qa-rail--dock flex gap-2.5 overflow-x-auto pb-1 lg:max-h-[26rem] lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:pb-0"
                            role="listbox"
                            aria-label={t(
                                "affiliateWelcome.quickActions",
                                "Quick actions"
                            )}
                            aria-orientation="vertical"
                            onKeyDown={handleKeyDown}
                        >
                            {railItems}
                        </div>
                    </LayoutGroup>
                </div>
            </div>

            {/* Iris portal transition on open */}
            <AnimatePresence>
                {portal && (
                    <motion.div
                        className="pointer-events-none fixed inset-0 z-[999]"
                        initial={{
                            clipPath: `circle(0px at ${portal.x}px ${portal.y}px)`,
                        }}
                        animate={{
                            clipPath: `circle(${Math.hypot(
                                window.innerWidth,
                                window.innerHeight
                            )}px at ${portal.x}px ${portal.y}px)`,
                        }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        onAnimationComplete={() => {
                            const to = portal.to;
                            setPortal(null);
                            navigate(to);
                        }}
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-main),color-mix(in_srgb,var(--color-api-second)_70%,var(--color-main)))]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.28),transparent_55%)]" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Live region for auto-advance */}
            <span className="sr-only" aria-live="polite">
                {current.title
                    ? `${t("affiliateWelcome.quickActions", "Quick actions")}: ${current.title}`
                    : ""}
            </span>
        </div>
    );
}
