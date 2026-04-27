import { useMemo } from "react";

import { cn } from "@/shared/lib/utils";
import type { SectionCardVariant } from "@/features/home/types";
import AnimatedButton from "@/shared/ui/AnimatedButton";
import Badge from "../Badge";
import FavoriteButton from "../FavoriteButton";
import LazyImage from "../LazyImage";
import Rating from "../Rating";
import {
    type ProductCardBadge,
    resolveProductCardBadgeLabel,
} from "./ProductCard";

const DEFAULT_STORE_IMAGE =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400";

type ShopCardProps = {
    id: number | string;
    name: string;
    description?: string | null;
    image?: string | null;
    isOpenNow?: boolean;
    /** Extra top badges (same as ProductCard); "Open" is still controlled by `isOpenNow` */
    badge?: ProductCardBadge | ProductCardBadge[];
    rating?: number;
    deliveryPrice?: string | number | null;
    discountLabel?: string | null;
    /** API `bottom_badges` — cycled in one animated control when present */
    bottomBadges?: ProductCardBadge[];
    isFavorite?: boolean;
    onFavorite?: (id: number | string) => void;
    onClick?: () => void;
    className?: string;
    layout?: SectionCardVariant;
    surfaceColor?: string | null;
};

export default function ShopCard({
    id,
    name,
    description,
    image,
    isOpenNow = false,
    badge,
    rating = 0,
    deliveryPrice,
    discountLabel,
    bottomBadges,
    isFavorite = false,
    onFavorite,
    onClick,
    className,
    layout,
    surfaceColor,
}: ShopCardProps) {
    const imageAspectClass = layout
        ? layout === "horizontal"
            ? "aspect-[16/10] max-h-44 sm:max-h-48"
            : layout === "vertical"
              ? "aspect-[3/4] max-h-72 sm:max-h-80"
              : "aspect-[4/3]"
        : "aspect-[4/3]";

    const imageSrc = image || DEFAULT_STORE_IMAGE;
    const deliveryText =
        deliveryPrice != null && deliveryPrice !== ""
            ? typeof deliveryPrice === "number"
                ? `£${deliveryPrice.toFixed(2)} delivery`
                : String(deliveryPrice)
            : null;

    const openBadge: ProductCardBadge[] = isOpenNow
        ? [
              {
                  label: "Open",
                  className:
                      "rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow-md ring-1 ring-emerald-400/40",
                  align: "left",
              },
          ]
        : [];
    const extraBadge = badge
        ? Array.isArray(badge)
            ? badge
            : [badge]
        : [];
    const allTop = [...openBadge, ...extraBadge].slice(0, 1);
    const leftBadges = allTop.filter((b) => (b.align ?? "left") === "left");
    const rightBadges = allTop.filter((b) => b.align === "right");

    const hasApiBottomBadges = Boolean(bottomBadges?.length);

    const bottomBadgeItems = useMemo(
        () =>
            (bottomBadges ?? []).map((b) => ({
                label: resolveProductCardBadgeLabel(b),
                className: b.className,
            })),
        [bottomBadges],
    );

    return (
        <div
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onClick={onClick}
            onKeyDown={(e) => {
                if (!onClick) return;
                if (e.key === "Enter" || e.key === " ") onClick();
            }}
            className={cn(
                "group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-custom-card",
                "shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06),0_8px_20px_-6px_rgba(15,23,42,0.08)]",
                "transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "hover:-translate-y-1 hover:shadow-[0_12px_28px_-8px_rgba(15,23,42,0.12),0_4px_12px_-4px_rgba(15,23,42,0.08)]",
                "dark:border-white/10 dark:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.55)]",
                "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                onClick &&
                    "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-main)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]",
                className,
            )}
        >
            {/* Image area */}
            <div
                className={cn(
                    "relative w-full shrink-0 overflow-hidden rounded-t-2xl bg-custom-muted",
                    imageAspectClass,
                )}
            >
                <LazyImage
                    src={imageSrc}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                    wrapperClassName="h-full w-full"
                />
                <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 via-black/5 to-transparent dark:from-black/40"
                    aria-hidden
                />
                {leftBadges.length > 0 && (
                    <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
                        {leftBadges.map((b, idx) => (
                            <Badge
                                key={idx}
                                label={resolveProductCardBadgeLabel(b)}
                                type={b.type}
                                imageSrc={b.image}
                                imageAlt={resolveProductCardBadgeLabel(b)}
                                className={cn(
                                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                                    b.className
                                )}
                            />
                        ))}
                    </div>
                )}
                <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1">
                    {rightBadges.map((b, idx) => (
                        <Badge
                            key={idx}
                            label={resolveProductCardBadgeLabel(b)}
                            type={b.type}
                            imageSrc={b.image}
                            imageAlt={resolveProductCardBadgeLabel(b)}
                            className={cn("rounded-lg", b.className)}
                        />
                    ))}
                    <FavoriteButton
                        isFavorite={isFavorite}
                        onToggle={(e) => {
                            e.stopPropagation();
                            onFavorite?.(id);
                        }}
                        size="md"
                        ariaLabel="Toggle favorite"
                    />
                </div>
                {/* Rating — white pill (Figma) */}
                <div className="absolute bottom-3 left-3 z-10 rounded-full bg-white/95 px-3 py-1 shadow-md ring-1 ring-stone-900/5 backdrop-blur-sm dark:bg-stone-900/90 dark:ring-white/10">
                    <Rating
                        rating={rating}
                        size="sm"
                        className="[&_span:last-child]:font-semibold [&_span:last-child]:text-custom-primary dark:[&_span:last-child]:text-stone-100"
                    />
                </div>
            </div>

            {/* Info — soft wash when no API card tint */}
            <div
                className={cn(
                    "flex flex-1 flex-col rounded-b-2xl border-t border-stone-200/60 px-4 pb-4 pt-3.5 dark:border-white/[0.08]",
                    !surfaceColor &&
                        "bg-gradient-to-b from-emerald-50/90 via-emerald-50/50 to-white dark:from-emerald-950/35 dark:via-stone-900/70 dark:to-stone-900",
                )}
                style={
                    surfaceColor ? { backgroundColor: surfaceColor } : undefined
                }
            >
                <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-custom-primary">
                    {name}
                </h3>
                {description && (
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-custom-secondary/95">
                        {description}
                    </p>
                )}

                <div className="mt-auto flex w-full flex-col gap-2 pt-3">
                    {hasApiBottomBadges && (
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                                <span className="shrink-0 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-900 ring-1 ring-sky-100 dark:bg-sky-950/50 dark:text-sky-100 dark:ring-sky-800/40">
                                    Delivery
                                </span>
                                {discountLabel && (
                                    <span className="shrink-0 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-100 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-900/40">
                                        {discountLabel}
                                    </span>
                                )}
                            </div>
                            {deliveryText && (
                                <span className="shrink-0 text-right text-xs font-medium text-custom-secondary">
                                    {deliveryText}
                                </span>
                            )}
                        </div>
                    )}

                    {hasApiBottomBadges ? (
                        <AnimatedButton
                            items={bottomBadgeItems}
                            heightClassName="h-[18px]"
                            type="button"
                            onClick={(e) => e.stopPropagation()}
                            className="self-center justify-center text-xs font-semibold"
                        />
                    ) : (
                        <>
                            <AnimatedButton
                                variant="primary"
                                size="sm"
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                                className="w-full justify-center rounded-full bg-gradient-to-r from-sky-500 to-sky-600 text-sm font-semibold text-white shadow-md ring-1 ring-sky-400/30 transition-[transform,box-shadow] hover:shadow-lg"
                                note={{
                                    primary: "Delivery",
                                    secondary: deliveryText ?? "Order now",
                                }}
                            />
                            {discountLabel && (
                                <AnimatedButton
                                    variant="primary"
                                    size="sm"
                                    type="button"
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full justify-center rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-xs font-semibold text-white shadow-md ring-1 ring-rose-400/30 transition-[transform,box-shadow] hover:shadow-lg"
                                    note={{
                                        primary: discountLabel,
                                        secondary: discountLabel,
                                    }}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
