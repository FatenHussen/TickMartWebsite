import { useMemo } from "react";

import Button from "@/shared/ui/Button";
import AnimatedButton from "@/shared/ui/AnimatedButton";
import FavoriteButton from "@/shared/component/FavoriteButton";
import Rating from "@/shared/component/Rating";
import Badge from "@/shared/component/Badge";
import LazyImage from "@/shared/component/LazyImage";
import { cn } from "@/shared/lib/utils";
import type { SectionCardVariant } from "@/features/home/types";
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
    isFavorite?: boolean;
    onToggleFavorite?: (id: number) => void;
    onAddToCart?: (id: number) => void;
    onClick?: (id: number) => void;
    t?: (key: string) => string;
    className?: string;
    layout?: SectionCardVariant;
    surfaceColor?: string | null;
};

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
    isFavorite = false,
    onToggleFavorite,
    onAddToCart,
    onClick,
    t,
    className,
    layout,
    surfaceColor,
}: BasketCardProps) {
    const imageFrameClass = layout
        ? layout === "horizontal"
            ? "h-44 sm:h-48"
            : layout === "vertical"
              ? "h-64 sm:h-72"
              : "h-56 sm:h-60"
        : "h-56";
    const saveAsBadge: ProductCardBadge[] = saveAmount
        ? [
            {
                label: saveAmount,
                className:
                    "rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-amber-950 shadow-sm ring-1 ring-amber-400/30",
                align: "left",
                rawLabel: true,
            },
        ]
        : [];
    const extraBadges = badge
        ? Array.isArray(badge)
            ? badge
            : [badge]
        : [];
    /** Prefer API `top_badges`, else savings strip */
    const allTopBadges = [...extraBadges, ...saveAsBadge].slice(0, 1);
    const leftBadges = allTopBadges.filter((b) => (b.align ?? "left") === "left");
    const rightBadges = allTopBadges.filter((b) => b.align === "right");

    const bottomBadgeItems = useMemo(
        () =>
            (bottomBadges ?? []).map((b) => ({
                label: resolveProductCardBadgeLabel(b, t),
                className: b.className,
            })),
        [bottomBadges, t],
    );

    return (
        <div
            className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white",
                "shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06),0_8px_20px_-6px_rgba(15,23,42,0.08)]",
                "transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "hover:-translate-y-1 hover:shadow-[0_12px_28px_-8px_rgba(15,23,42,0.12),0_4px_12px_-4px_rgba(15,23,42,0.08)]",
                "dark:border-white/10 dark:bg-stone-900 dark:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.55)]",
                "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
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
        >
            {/* Image */}
            <div
                className={cn(
                    "relative w-full shrink-0 overflow-hidden rounded-t-2xl bg-stone-100 dark:bg-stone-900/50",
                    imageFrameClass,
                )}
            >
                <LazyImage
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                    wrapperClassName="h-full w-full"
                />
                <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 to-transparent dark:from-black/35"
                    aria-hidden
                />

                {/* Top-left badges */}
                {leftBadges.length > 0 && (
                    <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
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
                )}

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
            </div>

            {/* Body — soft mint wash when no API card tint */}
            <div
                className={cn(
                    "flex flex-1 flex-col border-t border-stone-200/60 px-4 pb-5 pt-4 dark:border-white/[0.08]",
                    !surfaceColor &&
                        "bg-gradient-to-b from-emerald-50/95 via-emerald-50/70 to-white dark:from-emerald-950/40 dark:via-stone-900/80 dark:to-stone-900",
                )}
                style={
                    surfaceColor ? { backgroundColor: surfaceColor } : undefined
                }
            >
                {/* Title */}
                <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-slate-900 dark:text-stone-50">
                    {name}
                </h3>

                {/* Description */}
                <p className="mt-1.5 line-clamp-2 text-sm font-normal leading-relaxed text-slate-600 dark:text-stone-400">
                    {description}
                </p>

                {/* Rating */}
                {rating != null && (
                    <div className="mt-2">
                        <Rating rating={typeof rating === "number" ? rating.toFixed(1) : rating} size="sm" />
                    </div>
                )}

                {/* Price Section */}
                <div className="mt-3">
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold tabular-nums leading-none tracking-tight text-slate-900 dark:text-stone-50">
                            {price}
                        </span>
                    </div>

                    {/* Original Price and Savings */}
                    {originalPrice && savings && (
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm leading-snug">
                            <span className="text-slate-400 line-through decoration-1">
                                {originalPrice}
                            </span>
                            <span className="font-medium text-green-600">
                                {savings}
                            </span>
                        </div>
                    )}
                </div>

                {/* Offer Ending Date */}
                {offerEndingDate && (
                    <p className="mt-3 text-sm font-normal leading-snug">
                        <span className="text-slate-500">Offer ending date:</span>{" "}
                        <span className="text-red-600">{offerEndingDate}</span>
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
                        className="h-11 min-h-[44px] rounded-xl border-0 bg-gradient-to-b from-amber-300 to-amber-400 px-4 pb-2 pt-3 text-base font-bold text-amber-950 shadow-md transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:from-amber-200 hover:to-amber-300 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-amber-500/50 motion-reduce:hover:translate-y-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart?.(id);
                        }}
                    >
                        {t ? t("home.addToCart") : "Add to Cart"}
                    </Button>

                    {bottomBadges != null &&
                        bottomBadges.length > 0 && (
                            <AnimatedButton
                                items={bottomBadgeItems}
                                heightClassName="h-9"
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                                className="justify-center text-xs font-semibold"
                            />
                        )}
                </div>
            </div>
        </div>
    );
}
