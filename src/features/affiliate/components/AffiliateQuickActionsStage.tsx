import {
    useId,
    useState,
    useSyncExternalStore,
    type CSSProperties,
} from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Autoplay,
    EffectCards,
    Keyboard,
    Pagination,
} from "swiper/modules";
import { HiChevronRight } from "react-icons/hi";
import { Layers, Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { paths } from "@/app/routes/path/paths";
import type { QuickActionItem } from "../types";
import { resolveQuickActionPath } from "../lib/resolveQuickActionPath";
import "swiper/css/effect-cards";
import "./affiliate-quick-actions-stage.css";

/** Time between automatic slide advances (progress bar uses the same duration). */
const AFFILIATE_QA_AUTOPLAY_MS = 1500;

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

export default function AffiliateQuickActionsStage({
    actions,
    isLoading,
    isError,
    isRTL,
}: AffiliateQuickActionsStageProps) {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);
    const paginationClassName = `affiliate-qa-pag-${useId().replace(/:/g, "")}`;
    const prefersReducedMotion = usePrefersReducedMotion();
    const enableAutoplay =
        !prefersReducedMotion && actions.length > 1;

    const current = actions[activeIndex];

    if (isError) {
        return (
            <p className="text-sm text-red-600 dark:text-red-400">
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
                className="relative flex min-h-[min(72dvh,44rem)] w-full flex-col items-center justify-center gap-6 rounded-[1.35rem] bg-[color-mix(in_srgb,var(--color-main)_6%,var(--color-bg-card))] px-6 py-14"
                aria-busy
                aria-label={t("affiliateWelcome.quickActions", "Quick actions")}
            >
                <div className="relative h-[min(52dvh,420px)] w-full max-w-[22.5rem] animate-pulse overflow-hidden rounded-[1.65rem] bg-custom-tertiary/25 shadow-inner ring-1 ring-custom-primary/40" />
                <div className="flex w-full max-w-[22.5rem] flex-col gap-3">
                    <div className="mx-auto h-5 w-3/5 rounded-md bg-custom-tertiary/30" />
                    <div className="mx-auto h-12 w-4/5 rounded-full bg-custom-tertiary/25" />
                </div>
            </div>
        );
    }

    if (!actions.length) {
        return null;
    }

    return (
        <div
            className="relative flex min-h-[min(78dvh,46rem)] w-full flex-col overflow-hidden rounded-[1.35rem] border-0 shadow-none"
            role="region"
            aria-roledescription="carousel"
            aria-label={t("affiliateWelcome.quickActions", "Quick actions")}
            aria-live="polite"
            style={
                {
                    "--affiliate-qa-autoplay-ms": `${AFFILIATE_QA_AUTOPLAY_MS}ms`,
                } as CSSProperties
            }
        >
            {/* Deck backdrop */}
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,color-mix(in_srgb,var(--color-main)_14%,transparent)_0%,transparent_65%)]"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute inset-x-6 top-24 h-px bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--color-api-second)_35%,transparent)] to-transparent opacity-70"
                aria-hidden
            />

            {/* Top chrome */}
            <div className="relative z-20 flex w-full shrink-0 justify-between gap-3 px-5 pb-2 pt-5 sm:px-8 sm:pt-7">
                <div className="flex items-center gap-2 text-[var(--color-text-primary)] drop-shadow-sm">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-main)_12%,var(--color-bg-card))] text-[var(--color-main)] ring-1 ring-[color-mix(in_srgb,var(--color-api-second)_28%,var(--color-border-primary))]">
                        <Layers className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="max-w-[10rem] text-[11px] font-bold uppercase leading-tight tracking-[0.12em] text-[var(--color-text-secondary)] sm:max-w-none">
                        {t(
                            "affiliateWelcome.quickActionsDeckLabel",
                            "Swipe the deck"
                        )}
                    </span>
                </div>
                <Link
                    to={paths.client.home}
                    className={cn(
                        "inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--color-main)_22%,var(--color-border-primary))] bg-custom-card/90 px-3.5 py-2 text-sm font-semibold text-[var(--color-main)] shadow-sm backdrop-blur-sm transition hover:border-[color-mix(in_srgb,var(--color-api-second)_40%,var(--color-border-primary))] hover:text-[var(--color-api-second)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-main)]",
                        isRTL && "flex-row-reverse"
                    )}
                >
                    {t("affiliateWelcome.goToHome", "Go to home")}
                    <HiChevronRight
                        className={cn(
                            "h-4 w-4 shrink-0",
                            isRTL && "rotate-180"
                        )}
                    />
                </Link>
            </div>

            <div className="relative z-10 flex w-full flex-col items-center gap-4 pb-6">
            <div
                className={`${paginationClassName} affiliate-qa-pagination-shell order-3 mx-auto flex min-h-[1.25rem] w-full max-w-[20rem] justify-center px-4`}
            />

            <Swiper
                className="affiliate-qa-cards-swiper order-1 !h-[min(56dvh,468px)] w-full max-w-[min(92vw,24rem)] px-4 pb-1 pt-2 sm:max-w-[26rem]"
                modules={[EffectCards, Pagination, Keyboard, Autoplay]}
                effect="cards"
                grabCursor
                slidesPerView={1}
                loop={actions.length > 1}
                speed={480}
                keyboard={{ enabled: true }}
                cardsEffect={{
                    slideShadows: true,
                    rotate: true,
                    perSlideRotate: 6,
                    perSlideOffset: 12,
                }}
                autoplay={
                    enableAutoplay
                        ? {
                              delay: AFFILIATE_QA_AUTOPLAY_MS,
                              disableOnInteraction: false,
                              pauseOnMouseEnter: true,
                              waitForTransition: true,
                          }
                        : false
                }
                pagination={{
                    clickable: true,
                    dynamicBullets: actions.length > 6,
                    el: `.${paginationClassName}`,
                }}
                onSlideChange={(s) => setActiveIndex(s.realIndex)}
            >
                {actions.map((action, index) => {
                    const to = resolveQuickActionPath(action.page_slug);
                    const label =
                        action.button_text?.trim() ||
                        t("affiliateWelcome.openAction", "Open");
                    return (
                        <SwiperSlide
                            key={action.id}
                            className="affiliate-qa-card-slide !flex !h-full overflow-visible !py-1"
                        >
                            <article className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[1.65rem] border border-white/10 bg-[var(--color-bg-card)] shadow-[0_28px_60px_-28px_rgba(0,0,0,0.55),0_0_0_1px_color-mix(in_srgb,var(--color-main)_22%,transparent)] dark:shadow-[0_28px_70px_-30px_rgba(0,0,0,0.75)]">
                                <div
                                    className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-12 bg-gradient-to-b from-black/45 to-transparent"
                                    aria-hidden
                                />
                                <div
                                    className="pointer-events-none absolute -start-8 top-16 z-[1] h-24 w-24 rounded-full bg-[var(--color-main)] opacity-[0.12] blur-3xl"
                                    aria-hidden
                                />
                                {action.icon ? (
                                    <img
                                        src={action.icon}
                                        alt=""
                                        className="affiliate-qa-card-img absolute start-0 end-0 top-0 h-[62%] w-full object-cover sm:h-[58%]"
                                        referrerPolicy="no-referrer"
                                        loading={index === 0 ? "eager" : "lazy"}
                                        decoding="async"
                                    />
                                ) : (
                                    <div
                                        className="absolute inset-x-0 top-0 h-[62%] bg-gradient-to-br from-[var(--color-main)] to-[var(--color-api-second)] sm:h-[58%]"
                                        aria-hidden
                                    />
                                )}
                                <div
                                    className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[62%] bg-gradient-to-t from-black/55 via-black/15 to-transparent sm:h-[58%]"
                                    aria-hidden
                                />

                                <div className="relative z-[2] mt-auto flex min-h-[42%] flex-col justify-end gap-4 bg-gradient-to-t from-[var(--color-bg-card)] from-35% via-[color-mix(in_srgb,var(--color-bg-card)_92%,transparent)] to-transparent px-6 pb-7 pt-16 sm:px-7">
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--color-main)_12%,var(--color-bg-card))] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-main)] ring-1 ring-[color-mix(in_srgb,var(--color-main)_25%,var(--color-border-primary))]">
                                            <Sparkles className="h-3 w-3" />
                                            {t(
                                                "affiliateWelcome.quickActions",
                                                "Quick actions"
                                            )}
                                        </span>
                                        <span className="rounded-md bg-custom-tertiary/50 px-2 py-0.5 font-mono text-[11px] font-semibold text-[var(--color-text-secondary)] tabular-nums">
                                            {String(index + 1).padStart(2, "0")}
                                            <span className="opacity-50">
                                                /
                                                {String(actions.length).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>
                                        </span>
                                    </div>
                                    <h2
                                        className="affiliate-qa-card-title text-balance font-black leading-[1.12] text-[var(--color-text-heading)]"
                                        style={
                                            {
                                                fontSize:
                                                    "clamp(1.35rem, min(5.5vw, 5vh), 2.15rem)",
                                            } as CSSProperties
                                        }
                                    >
                                        {action.title}
                                    </h2>
                                    <Link
                                        to={to}
                                        className="flex min-h-[3.1rem] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--color-main)] to-[var(--color-api-second)] px-5 text-base font-bold text-[var(--color-text-inverse)] shadow-[0_14px_36px_-14px_color-mix(in_srgb,var(--color-main)_60%,transparent)] transition hover:brightness-110 active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100"
                                    >
                                        <span className="max-w-[92%] truncate text-center">
                                            {label}
                                        </span>
                                    </Link>
                                </div>
                            </article>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {enableAutoplay && (
                <div
                    className="order-2 mx-auto mt-1 h-[3px] w-[min(88%,20rem)] overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-main)_15%,var(--color-border-primary))]"
                    aria-hidden
                >
                    <div
                        key={activeIndex}
                        className="affiliate-qa-autoplay-fill affiliate-qa-progress-brand h-full w-full rounded-full"
                    />
                </div>
            )}

            </div>

            <span className="sr-only">
                {current?.title != null && current.title !== ""
                    ? `${t("affiliateWelcome.quickActions", "Quick actions")}: ${current.title}`
                    : ""}
            </span>
        </div>
    );
}
