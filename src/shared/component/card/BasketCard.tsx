import { useMemo } from "react";

import Button from "@/shared/ui/Button";
import AnimatedButton from "@/shared/ui/AnimatedButton";
import FavoriteButton from "@/shared/component/FavoriteButton";
import Rating from "@/shared/component/Rating";
import Badge from "@/shared/component/Badge";
import LazyImage from "@/shared/component/LazyImage";
import { cn } from "@/shared/lib/utils";
import type { SectionCardVariant } from "@/features/home/types";
import { useTheme } from "@/context/ThemeContext";
import {
    type ProductCardBadge,
    resolveProductCardBadgeLabel,
} from "./ProductCard";

export type BasketCardProps = {
    id: number;
    name: string;
    description: string;
    price: string;
    originalPrice?: string;
    rating?: number;
    image: string;
    /** Top-left savings label — rendered as a Badge (same family as ProductCard top badges) */
    saveAmount?: string; //"Save $12"
    /** Extra top badges (left/right), same shape as ProductCard */
    badge?: ProductCardBadge | ProductCardBadge[];
    savings?: string; //"You saved $180"
    offerEndingDate?: string; //"Offer ending date: 11/1/2022"
    /** Bottom animated rows from API `bottom_badges` — no static fallback when omitted */
    bottomBadges?: ProductCardBadge[];
    /** Number of products bundled inside this basket (drives the "bundle" identity) */
    itemCount?: number;
    /** Social proof — how many times this basket has been ordered */
    soldCount?: number;
    isFavorite?: boolean;
    onToggleFavorite?: (id: number) => void;
    onAddToCart?: (id: number) => void;
    onClick?: (id: number) => void;
    t?: (key: string) => string;
    className?: string;
    layout?: SectionCardVariant;
    surfaceColor?: string | null;
    /** API-driven gradient for the content panel — wins over `surfaceColor`. */
    surfaceGradient?: string | null;
    mainColor?: string | null;
    secondColor?: string | null;
    textColor?: string | null;
};

/** Woven-basket glyph — the visual anchor that distinguishes a bundle from a product. */
function BasketGlyph({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            aria-hidden
        >
            <path
                d="M3 8.5h18l-1.4 9.1a2 2 0 0 1-2 1.7H6.4a2 2 0 0 1-2-1.7L3 8.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <path
                d="M8 8.5 11 3.5M16 8.5 13 3.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
            <path
                d="M9 12.5v3M12 12.5v3M15 12.5v3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity="0.6"
            />
        </svg>
    );
}

export default function BasketCard({
    id,
    name,
    description,
    price,
    originalPrice,
    rating,
    image,
    saveAmount,
    badge,
    savings,
    offerEndingDate,
    bottomBadges,
    itemCount,
    soldCount,
    isFavorite = false,
    onToggleFavorite,
    onAddToCart,
    onClick,
    t,
    className,
    layout,
    surfaceColor,
    surfaceGradient,
    mainColor,
    secondColor,
    textColor,
}: BasketCardProps) {
    const cardShapeClass = layout
        ? layout === "horizontal"
            ? "rounded-2xl"
            : layout === "vertical"
              ? "rounded-[2rem]"
              : "rounded-3xl"
        : "rounded-2xl";
    const imageShapeClass = layout
        ? layout === "horizontal"
            ? "rounded-t-2xl"
            : layout === "vertical"
              ? "rounded-t-[2rem]"
              : "rounded-t-3xl"
        : "rounded-t-2xl";
    const buttonShapeClass = layout
        ? layout === "horizontal"
            ? "rounded-xl"
            : layout === "vertical"
              ? "rounded-full"
              : "rounded-2xl"
        : "rounded-xl";
    const imageFrameClass = layout
        ? layout === "horizontal"
            ? "h-44 sm:h-48"
            : layout === "vertical"
              ? "h-64 sm:h-72"
              : "h-56 sm:h-60"
        : "h-56";
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";
    /**
     * In dark mode, ignore per-item brand colors and pull main/second/text from
     * the API settings dark palette so every basket reads consistently dark.
     */
    const resolvedMainColor = isDarkTheme
        ? "var(--color-main)"
        : (mainColor?.trim() || "var(--color-main)");
    const resolvedSecondColor = isDarkTheme
        ? "var(--color-api-second)"
        : (secondColor?.trim() || "var(--color-api-second)");
    const resolvedTextColor = isDarkTheme
        ? "var(--color-text)"
        : (textColor?.trim() || "var(--color-text)");
    /** Dark foundation — neutral panels; API colors stay subtle in gradients only. */
    const gradientBase = isDarkTheme
        ? "var(--color-bg-card-elevated)"
        : "var(--color-bg-card)";
    const extraBadges = badge
        ? Array.isArray(badge)
            ? badge
            : [badge]
        : [];
    /** API top badges only — savings now has its own dedicated treatments below. */
    const leftBadges = extraBadges
        .filter((b) => (b.align ?? "left") === "left")
        .slice(0, 1);
    const rightBadges = extraBadges.filter((b) => b.align === "right").slice(0, 1);

    const bottomBadgeItems = useMemo(
        () =>
            (bottomBadges ?? []).map((b) => ({
                label: resolveProductCardBadgeLabel(b, t),
                className: b.className,
            })),
        [bottomBadges, t],
    );
    const tr = (key: string, fallback: string) => {
        if (!t) return fallback;
        const value = t(key);
        return value === key ? fallback : value;
    };
    const ctaLabel = tr("home.openBasket", "Open Basket");
    /** Savings ticket prefers the rich `savings` copy, falls back to the short `saveAmount`. */
    const savingsLabel = savings || saveAmount;
    /** Bundle ribbon copy: exact item count when known, otherwise a generic "curated" tag. */
    const bundleLabel = itemCount && itemCount > 0
        ? `${itemCount} ${tr("baskets.items", itemCount === 1 ? "item" : "items")}`
        : tr("baskets.curated", "Curated bundle");

    return (
        <div
            className={cn(
                "group relative flex h-full flex-col overflow-hidden border border-stone-200/80 bg-white",
                "shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06),0_8px_20px_-6px_rgba(15,23,42,0.08)]",
                "transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "hover:-translate-y-1 hover:shadow-[0_12px_28px_-8px_rgba(15,23,42,0.12),0_4px_12px_-4px_rgba(15,23,42,0.08)]",
                "dark:border-white/[0.12] dark:bg-[var(--color-bg-card-elevated)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_28px_-10px_rgba(0,0,0,0.5)] dark:hover:border-white/[0.18] dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_14px_44px_-14px_rgba(0,0,0,0.62)]",
                "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                cardShapeClass,
                onClick &&
                    "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-main)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]",
                className,
            )}
            onClick={() => onClick?.(id)}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={(e) => {
                if (!onClick) return;
                if (e.key === "Enter" || e.key === " ") onClick(id);
            }}
            style={{
                backgroundImage: `linear-gradient(145deg, color-mix(in srgb, ${resolvedMainColor} ${isDarkTheme ? 8 : 13}%, ${gradientBase}) 0%, color-mix(in srgb, ${resolvedSecondColor} ${isDarkTheme ? 9 : 18}%, ${gradientBase}) 48%, ${gradientBase} 100%)`,
                color: isDarkTheme ? resolvedTextColor : undefined,
            }}
        >
            {/* Stacked-layer depth — two slivers peeking behind the top edge imply a bundle */}
            <div
                className="pointer-events-none absolute inset-x-5 -top-2 z-0 h-4 rounded-t-2xl bg-white/55 opacity-70 blur-[0.5px] transition-transform duration-300 group-hover:-translate-y-0.5 dark:bg-white/[0.07]"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute inset-x-2.5 -top-1 z-0 h-4 rounded-t-2xl bg-white/80 dark:bg-white/[0.1]"
                aria-hidden
            />

            {/* Image */}
            <div
                className={cn(
                    "relative z-[1] w-full shrink-0 overflow-hidden bg-stone-100 dark:bg-[#0B0B0C]",
                    imageFrameClass,
                    imageShapeClass,
                )}
            >
                <LazyImage
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                    wrapperClassName="h-full w-full"
                />
                <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 via-black/10 to-transparent"
                    aria-hidden
                />

                {/* Top-left: bundle identity ribbon + any API left badge */}
                <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
                    <span
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-stone-800 shadow-sm backdrop-blur-md dark:border-white/15 dark:bg-black/55 dark:text-white"
                    >
                        <BasketGlyph className="h-3.5 w-3.5 text-[var(--color-main)] dark:text-white" />
                        {bundleLabel}
                    </span>
                    {leftBadges.map((b, idx) => (
                        <Badge
                            key={idx}
                            label={resolveProductCardBadgeLabel(b, t)}
                            type={b.type}
                            imageSrc={b.image}
                            imageAlt={resolveProductCardBadgeLabel(b, t)}
                            className={cn(
                                "rounded-full px-3 py-1 text-xs font-semibold leading-none shadow-sm ring-1 ring-amber-400/25",
                                b.className || "bg-amber-300 text-amber-950"
                            )}
                        />
                    ))}
                </div>

                {/* Top-right badges + favorite */}
                <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1">
                    {rightBadges.map((b, idx) => (
                        <Badge
                            key={`rb-${idx}`}
                            label={resolveProductCardBadgeLabel(b, t)}
                            type={b.type}
                            imageSrc={b.image}
                            imageAlt={resolveProductCardBadgeLabel(b, t)}
                            className={cn(b.className || "bg-blue-500 text-white")}
                        />
                    ))}
                    <FavoriteButton
                        isFavorite={isFavorite}
                        onToggle={(e) => {
                            e.stopPropagation();
                            onToggleFavorite?.(id);
                        }}
                        size="md"
                        ariaLabel="Toggle favorite"
                    />
                </div>

                {/* Bottom-of-image social proof — only renders when the API gives us a count */}
                {soldCount != null && soldCount > 0 && (
                    <span className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
                        {soldCount.toLocaleString()} {tr("baskets.sold", "sold")}
                    </span>
                )}
            </div>

            {/* Body — soft mint wash when no API card tint */}
            <div
                className={cn(
                    "relative z-[1] flex flex-1 flex-col border-t border-stone-200/60 px-4 pb-5 pt-4 dark:border-white/[0.06]",
                    !surfaceColor &&
                        !surfaceGradient &&
                        "bg-gradient-to-b from-emerald-50/95 via-emerald-50/70 to-white dark:from-[var(--color-bg-card-elevated)] dark:via-[color-mix(in_srgb,var(--color-bg-card-elevated)_88%,var(--color-bg-secondary)_12%)] dark:to-[color-mix(in_srgb,var(--color-bg-card-elevated)_65%,var(--color-bg-tertiary)_35%)]",
                )}
                style={
                    surfaceGradient
                        ? {
                              backgroundImage: surfaceGradient,
                              color: isDarkTheme ? resolvedTextColor : undefined,
                          }
                        : surfaceColor
                        ? {
                              backgroundColor: surfaceColor,
                              color: isDarkTheme ? resolvedTextColor : undefined,
                          }
                        : {
                              backgroundImage: `linear-gradient(160deg, color-mix(in srgb, ${resolvedMainColor} ${isDarkTheme ? 7 : 8}%, ${gradientBase}) 0%, color-mix(in srgb, ${resolvedSecondColor} ${isDarkTheme ? 8 : 12}%, ${gradientBase}) 60%, ${gradientBase} 100%)`,
                              color: isDarkTheme ? resolvedTextColor : undefined,
                          }
                }
            >
                {/* Title */}
                <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-custom-primary dark:text-white">
                    {name}
                </h3>

                {/* Description */}
                <p className="mt-1.5 line-clamp-2 text-sm font-normal leading-relaxed text-custom-secondary dark:text-zinc-400">
                    {description}
                </p>

                {/* Rating */}
                {rating != null && (
                    <div className="mt-2">
                        <Rating
                            rating={typeof rating === "number" ? rating.toFixed(1) : rating}
                            size="sm"
                            className="dark:[&_span:last-child]:text-white"
                        />
                    </div>
                )}

                {/* Price + savings ticket */}
                <div className="mt-3 flex items-end justify-between gap-3">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-medium uppercase tracking-wide text-custom-tertiary dark:text-zinc-500">
                            {tr("baskets.bundlePrice", "Bundle price")}
                        </span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold tabular-nums leading-none tracking-tight text-custom-primary dark:text-white">
                                {price}
                            </span>
                            {originalPrice && (
                                <span className="text-sm text-custom-tertiary line-through decoration-1 dark:text-zinc-500 dark:decoration-zinc-600">
                                    {originalPrice}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Receipt-style savings ticket — perforated edge nods to a basket checkout */}
                    {savingsLabel && (
                        <span className="relative inline-flex items-center rounded-md bg-emerald-500/12 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-500/25 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/25">
                            <span
                                className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[var(--color-bg-card)] dark:bg-[var(--color-bg-card-elevated)]"
                                aria-hidden
                            />
                            {savingsLabel}
                        </span>
                    )}
                </div>

                {/* Offer Ending Date */}
                {offerEndingDate && (
                    <p className="mt-3 text-sm font-normal leading-snug">
                        <span className="text-custom-secondary dark:text-zinc-400">
                            {tr("baskets.offerEnding", "Offer ending date")}:
                        </span>{" "}
                        <span className="text-red-600 dark:text-red-400">{offerEndingDate}</span>
                    </p>
                )}

                {/* Buttons + bottom animated badges (ProductCard pattern) */}
                <div
                    className={cn(
                        "mt-auto flex flex-col items-center gap-3",
                        offerEndingDate ? "pt-5" : "pt-6"
                    )}
                >
                    <Button
                        variant="primary"
                        size="md"
                        fullWidth
                        className={cn(
                            "group/cta flex h-11 min-h-[44px] items-center justify-center gap-2 border-0 px-4 pb-2 pt-3 text-base font-bold shadow-md transition-[transform,box-shadow,background-color,filter] duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:brightness-105 motion-reduce:hover:translate-y-0",
                            "bg-[var(--color-api-second)] hover:bg-[var(--color-api-second-hover)]",
                            "focus-visible:ring-2 focus-visible:ring-[var(--color-main)]/40",
                            buttonShapeClass,
                        )}
                        style={{
                            backgroundColor: resolvedSecondColor,
                            color: "#ffffff",
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart?.(id);
                        }}
                    >
                        <BasketGlyph className="h-5 w-5 transition-transform duration-300 group-hover/cta:-translate-y-0.5" />
                        {ctaLabel}
                    </Button>

                    {bottomBadges != null &&
                        bottomBadges.length > 0 && (
                            <AnimatedButton
                                items={bottomBadgeItems}
                                heightClassName="h-9"
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                                className="justify-center text-xs font-semibold text-custom-secondary dark:text-zinc-400"
                            />
                        )}
                </div>
            </div>
        </div>
    );
}
