import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { useState, type ReactNode } from "react";
import type { Swiper as SwiperClass } from "swiper";
import Button from "@/shared/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/shared/lib/utils";
import FlashSaleBadge from "./FlashSaleBadge";

type SliderProps = {
    title?: string;
    /** When set (light UI), section title uses a clipped gradient instead of plain theme text. */
    titleMainColor?: string | null;
    titleSecondColor?: string | null;
    flashSaleEndDate?: string | null;
    flashSaleMainColor?: string | null;
    flashSaleSecondColor?: string | null;
    /** e.g. "خصم حتى 50%" — highlighted above the title on flash-sale rows. */
    flashSaleDiscountLabel?: string;
    /** Localized "Fast discounts" caption rendered before the discount label. */
    flashSaleFastDiscountsLabel?: string;
    viewAllLabel?: string;
    onViewAll?: () => void;
    /** Merged onto the “View all” control (e.g. `dark:text-white` for dark rows). */
    viewAllButtonClassName?: string;
    children: ReactNode[];
    slidesPerView?: number | "auto";
    spaceBetween?: number;
    breakpoints?: {
        [width: number]: {
            slidesPerView: number | "auto";
            spaceBetween?: number;
        };
    };
    className?: string;
    slideClassName?: string;
    sectionBackgroundColor?: string | null;
    /**
     * When `sectionBackgroundColor` is set, the tint always spans the full viewport
     * (breakout from `.page-container`); title + swiper stay in `.page-container`.
     * When true without a section color, wraps content in `.page-container` only.
     */
    edgeToEdgeSectionBackground?: boolean;
    removeVerticalSpacing?: boolean;
    /** Opt-in prev/next arrows overlaid on the row edges; hidden when nothing overflows. */
    showNavigation?: boolean;
    /**
     * How the items are laid out: `slider` scrolls them sideways, `list` stacks
     * them one per row, `grid` tiles them. Everything else — header, flash-sale
     * chrome, full-bleed band, spacing — is identical in all three, so a section
     * can switch layout without changing how it reads.
     */
    layout?: "slider" | "list" | "grid";
    /**
     * Tailwind classes for the non-slider layouts: columns and gap for `grid`,
     * gap alone for `list` (one item per row needs no columns).
     */
    gridClassName?: string;
    /**
     * Rendered in place of the row when there are no children. A caller that
     * opts in keeps the section heading and states why the row is bare, instead
     * of the section disappearing or leaving an empty track behind.
     */
    emptyState?: ReactNode;
};

/**
 * Module-level so the object identity is stable: swiper/react compares passed
 * params by reference and re-runs `swiper.update()` whenever it sees a new one.
 */
const FALLBACK_BREAKPOINTS = {
    640: { slidesPerView: 2.5 },
    768: { slidesPerView: 3.5 },
    1024: { slidesPerView: 4.5 },
};

export default function Slider({
    title,
    titleMainColor,
    titleSecondColor,
    flashSaleEndDate,
    flashSaleMainColor,
    flashSaleSecondColor,
    flashSaleDiscountLabel,
    flashSaleFastDiscountsLabel,
    viewAllLabel,
    onViewAll,
    viewAllButtonClassName,
    children,
    slidesPerView = 2.2,
    spaceBetween = 16,
    breakpoints,
    className = "",
    slideClassName = "",
    sectionBackgroundColor,
    edgeToEdgeSectionBackground = false,
    removeVerticalSpacing = false,
    showNavigation = false,
    layout = "slider",
    gridClassName,
    emptyState,
}: SliderProps) {
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";
    const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);
    const [nav, setNav] = useState({ canPrev: false, canNext: false });

    /**
     * freeMode makes the active index unreliable, so read the edges directly.
     *
     * Swiper emits `progress` on every `update()`, and swiper/react calls
     * `update()` after any render that passes a fresh `breakpoints` object — so
     * a state write here feeds straight back into another `progress`. Returning
     * the previous state when the edges did not move keeps that from becoming
     * an endless render loop (which pegged the CPU and spun the mouse cursor).
     */
    const syncNav = (swiper: SwiperClass) =>
        setNav((prev) => {
            const canPrev = !swiper.isBeginning;
            const canNext = !swiper.isEnd;
            return prev.canPrev === canPrev && prev.canNext === canNext
                ? prev
                : { canPrev, canNext };
        });

    const defaultBreakpoints = breakpoints || FALLBACK_BREAKPOINTS;

    const titleGradientMain = titleMainColor?.trim() || titleSecondColor?.trim();
    const titleGradientSecond = titleSecondColor?.trim() || titleMainColor?.trim();
    /** Dark: always solid API `text_color` from settings (`--color-text`), not brand gradient. */
    const useTitleGradient =
        Boolean(title && titleGradientMain && titleGradientSecond) && !isDarkTheme;

    const isFlashSale = Boolean(flashSaleEndDate);

    /** Decorative gradient accent bar rendered before every section title. */
    const accentFrom = isFlashSale
        ? flashSaleMainColor?.trim() || "#ff4d6d"
        : titleMainColor?.trim() || titleSecondColor?.trim() || "var(--color-gradient-from, var(--color-main))";
    const accentTo = isFlashSale
        ? flashSaleSecondColor?.trim() || "#ffb703"
        : titleSecondColor?.trim() || titleMainColor?.trim() || "var(--color-gradient-to, var(--color-main))";

    /**
     * "⚡ Fast discounts • Up to X%" highlight shown above the flash-sale title.
     * Light pill matching the countdown badge chrome, with the discount value in
     * red — the number is what should catch the eye, not the campaign gradient.
     */
    const discountHeadline = isFlashSale && flashSaleDiscountLabel && (
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-stone-200/70 bg-white/80 px-3 py-1 text-xs font-bold shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]">
            <span aria-hidden="true">⚡</span>
            {flashSaleFastDiscountsLabel && (
                <span className="text-stone-500 dark:text-zinc-400">
                    {flashSaleFastDiscountsLabel}
                </span>
            )}
            <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-red-600 dark:bg-red-500/15 dark:text-red-400">
                {flashSaleDiscountLabel}
            </span>
        </div>
    );

    const header =
        (title || viewAllLabel || flashSaleEndDate) && (
            <>
                {discountHeadline}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                    {title && (
                        <div className="flex items-center gap-2.5 sm:gap-3">
                            <span
                                aria-hidden="true"
                                className="h-6 w-1.5 shrink-0 rounded-full sm:h-7"
                                style={{
                                    background: `linear-gradient(180deg, ${accentFrom}, ${accentTo})`,
                                }}
                            />
                            {isFlashSale ? (
                                <h2 className="text-2xl font-extrabold tracking-tight text-stone-900 sm:text-[1.7rem] dark:text-[color:var(--color-text,var(--color-text-primary))]">
                                    {title}
                                </h2>
                            ) : useTitleGradient ? (
                                <h2
                                    className="text-2xl font-bold tracking-tight bg-clip-text text-transparent"
                                    style={{
                                        backgroundImage: `linear-gradient(105deg, ${titleGradientMain}, ${titleGradientSecond})`,
                                        WebkitBackgroundClip: "text",
                                        backgroundClip: "text",
                                    }}
                                >
                                    {title}
                                </h2>
                            ) : isDarkTheme ? (
                                <h2 className="text-2xl font-bold tracking-tight text-[color:var(--color-text,var(--color-text-primary))]">
                                    {title}
                                </h2>
                            ) : (
                                <h2
                                    className="text-2xl font-bold tracking-tight bg-clip-text text-transparent"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(105deg, var(--color-gradient-from, var(--color-main)), var(--color-gradient-to, var(--color-main)))",
                                        WebkitBackgroundClip: "text",
                                        backgroundClip: "text",
                                    }}
                                >
                                    {title}
                                </h2>
                            )}
                        </div>
                    )}
                    {flashSaleEndDate && (
                        <FlashSaleBadge
                            endDate={flashSaleEndDate}
                            mainColor={flashSaleMainColor}
                            secondColor={flashSaleSecondColor}
                        />
                    )}
                </div>
                {viewAllLabel && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onViewAll}
                        className={cn(
                            "group h-auto rounded-full border border-primary/20 bg-white/70 px-3.5 py-1.5 text-sm font-semibold text-primary shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary hover:text-white hover:shadow-md dark:border-white/15 dark:bg-white/5 dark:text-[color:var(--color-text,var(--color-text-primary))] dark:hover:border-primary/40 dark:hover:bg-primary dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                            viewAllButtonClassName,
                        )}
                    >
                        <span>{viewAllLabel}</span>
                        <span
                            aria-hidden="true"
                            className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/12 text-xs leading-none transition-all duration-200 group-hover:bg-white/20 group-hover:translate-x-0.5 dark:bg-white/12"
                        >
                            <svg
                                viewBox="0 0 20 20"
                                fill="none"
                                className="h-3.5 w-3.5"
                            >
                                <path
                                    d="M7 5L12 10L7 15"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                    </Button>
                )}
            </div>
            </>
        );

    const navButton = (direction: "prev" | "next") => {
        const enabled = direction === "prev" ? nav.canPrev : nav.canNext;
        return (
            <button
                type="button"
                aria-label={direction === "prev" ? "Previous" : "Next"}
                onClick={() =>
                    direction === "prev"
                        ? swiperInstance?.slidePrev()
                        : swiperInstance?.slideNext()
                }
                disabled={!enabled}
                className={cn(
                    // Logical inset so RTL flips the pair automatically, matching
                    // Swiper's own RTL translate.
                    "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200/70 bg-white/90 text-custom-primary shadow-[0_6px_20px_-8px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-200 hover:border-primary-light/45 hover:bg-white hover:text-primary-light hover:shadow-[0_10px_26px_-8px_rgba(0,0,0,0.45)] active:scale-95 disabled:pointer-events-none disabled:opacity-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:flex",
                    "dark:border-white/10 dark:bg-white/[0.08] dark:text-white dark:hover:bg-white/15",
                    direction === "prev" ? "start-0 -ms-3" : "end-0 -me-3",
                )}
            >
                {/*
                 * Each direction draws its own chevron, then RTL mirrors the pair
                 * with `scaleX(-1)` — the same trick the promo banner arrows use.
                 *
                 * The previous version drew one right-pointing chevron and stacked
                 * `rtl:rotate-180` on top of a conditional `rotate-180`. Tailwind
                 * emits both as the same `rotate` declaration, so they never
                 * cancelled: in Arabic the "previous" arrow stayed flipped and both
                 * ends of the row pointed the same way.
                 */}
                <svg
                    className="h-[18px] w-[18px] rtl:scale-x-[-1]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.2}
                        d={direction === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
                    />
                </svg>
            </button>
        );
    };

    const swiperEl = (
        <Swiper
            modules={[FreeMode]}
            spaceBetween={spaceBetween}
            slidesPerView={slidesPerView}
            breakpoints={defaultBreakpoints}
            freeMode={true}
            className="shared-swiper"
            onSwiper={showNavigation ? (s) => { setSwiperInstance(s); syncNav(s); } : undefined}
            onProgress={showNavigation ? syncNav : undefined}
            onResize={showNavigation ? syncNav : undefined}
            onSlidesLengthChange={showNavigation ? syncNav : undefined}
        >
            {children.map((child, index) => (
                <SwiperSlide key={index} className={slideClassName}>
                    {child}
                </SwiperSlide>
            ))}
        </Swiper>
    );

    const swiper = showNavigation ? (
        <div className="relative min-w-0">
            {swiperEl}
            {navButton("prev")}
            {navButton("next")}
        </div>
    ) : (
        swiperEl
    );

    /** List and grid rows never overflow sideways, so the arrows have nothing to do. */
    const body =
        children.length === 0 && emptyState ? (
            emptyState
        ) : layout === "slider" ? (
            swiper
        ) : (
            <div
                className={cn(
                    layout === "list" ? "flex min-w-0 flex-col" : "grid min-w-0",
                    gridClassName
                )}
            >
                {children.map((child, index) => (
                    <div key={index} className={slideClassName}>
                        {child}
                    </div>
                ))}
            </div>
        );

    /**
     * Flash-sale rows group every element (headline, title, timer, "view all"
     * and the products) into one `<section>` wrapper, but otherwise flow through
     * the exact same full-bleed colored-band layout as every other section
     * (Featured, Nearby Shops…) so the container matches edge-to-edge.
     */
    const inner = isFlashSale ? (
        <section data-flash-section className="relative">
            {header}
            {body}
        </section>
    ) : (
        <>
            {header}
            {body}
        </>
    );

    /**
     * Full-viewport tint while keeping title + swiper aligned to `.page-container`.
     *
     * Light rows ease the tint in at the top and out at the bottom instead of
     * butting a saturated slab against the white row above it — the seam between
     * two stacked sections was a hard color step. Dark rows keep the flat charcoal
     * band; `getDarkSectionBackground()` hands us a gradient string, so the
     * shorthand (not `backgroundColor`, which silently dropped it) has to carry it.
     */
    if (sectionBackgroundColor) {
        const bandBackground = isDarkTheme
            ? sectionBackgroundColor
            : [
                  "linear-gradient(180deg,",
                  `color-mix(in srgb, ${sectionBackgroundColor} 28%, #ffffff) 0%,`,
                  `${sectionBackgroundColor} 16%,`,
                  `${sectionBackgroundColor} 84%,`,
                  `color-mix(in srgb, ${sectionBackgroundColor} 55%, #ffffff) 100%)`,
              ].join(" ");

        return (
            <div className={`${removeVerticalSpacing ? "mt-0" : "mt-8"} w-full min-w-0 ${className}`}>
                <div
                    className="relative w-screen max-w-[100vw] py-7 sm:py-9 [margin-inline-start:calc(50%-50vw)]"
                    style={{
                        background: bandBackground,
                        boxShadow: isDarkTheme
                            ? "inset 0 1px 0 0 rgba(255,255,255,0.085), inset 0 -1px 0 0 rgba(0,0,0,0.35)"
                            : undefined,
                    }}
                >
                    <div className="page-container">{inner}</div>
                </div>
            </div>
        );
    }

    if (edgeToEdgeSectionBackground) {
        return (
            <div className={`${removeVerticalSpacing ? "mt-0" : "mt-8"} w-full ${className}`}>
                <div className="page-container">{inner}</div>
            </div>
        );
    }

    return (
        <div className={`${removeVerticalSpacing ? "mt-0" : "mt-8"} w-full ${className}`}>
            {inner}
        </div>
    );
}
