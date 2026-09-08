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
    address?: string | null;
    isServiceProvider?: boolean;
    isRestaurant?: boolean;
    pricingTier?: string | null;
    paymentMethods?: string[];
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
    /** API-driven gradient for the content panel — wins over `surfaceColor`. */
    surfaceGradient?: string | null;
};

export default function ShopCard({
    id,
    name,
    description,
    image,
    isOpenNow: _isOpenNow = false,
    badge,
    rating = 0,
    address,
    isServiceProvider = false,
    isRestaurant = false,
    pricingTier,
    paymentMethods,
    deliveryPrice: _deliveryPrice,
    discountLabel,
    bottomBadges,
    isFavorite = false,
    onFavorite,
    onClick,
    className,
    layout,
    surfaceColor,
    surfaceGradient,
}: ShopCardProps) {
    const imageAspectClass = layout
        ? layout === "horizontal"
            ? "aspect-[16/10] max-h-44 sm:max-h-48"
            : layout === "vertical"
              ? "aspect-[3/4] max-h-72 sm:max-h-80"
              : "aspect-[4/3]"
        : "aspect-[4/3]";

    const imageSrc = image || DEFAULT_STORE_IMAGE;
    const extraBadge = badge
        ? Array.isArray(badge)
            ? badge
            : [badge]
        : [];
    const allTop = [...extraBadge].slice(0, 1);
    const topBadge = allTop[0];

    const hasApiBottomBadges = Boolean(bottomBadges?.length);
    const hasPaymentMethods = Boolean(paymentMethods?.length);
    const roleLabel = isServiceProvider
        ? "Service Provider"
        : isRestaurant
          ? "Restaurant"
          : "Shop";
    const normalizedPricingTier =
        pricingTier && pricingTier.length > 0
            ? `${pricingTier[0].toUpperCase()}${pricingTier.slice(1)}`
            : null;

    const bottomBadgeItems = useMemo(
        () =>
            (bottomBadges ?? []).map((b) => ({
                label: resolveProductCardBadgeLabel(b),
                className: b.className,
                style: b.style,
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
                    "group flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-custom-card",
                "shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06),0_8px_20px_-6px_rgba(15,23,42,0.08)]",
                "transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "hover:-translate-y-1.5 hover:shadow-[0_16px_32px_-10px_rgba(15,23,42,0.16),0_6px_14px_-6px_rgba(15,23,42,0.1)]",
                "dark:border-white/[0.12] dark:bg-[var(--color-bg-card-elevated)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_28px_-10px_rgba(0,0,0,0.5)] dark:hover:border-white/[0.18] dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_14px_44px_-14px_rgba(0,0,0,0.62)]",
                "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                onClick &&
                    "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-main)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]",
                className,
            )}
        >
            {/* Image area */}
            <div
                className={cn(
                    "relative w-full shrink-0 overflow-hidden rounded-t-2xl bg-custom-muted dark:bg-[#0B0B0C]",
                    imageAspectClass,
                )}
            >
                <LazyImage
                    src={imageSrc}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                    wrapperClassName="h-full w-full"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 via-black/5 to-transparent dark:from-black/45" aria-hidden />
                {topBadge && (
                    <div className="absolute left-3 top-3 z-10">
                        <Badge
                            label={resolveProductCardBadgeLabel(topBadge)}
                            type={topBadge.type}
                            imageSrc={topBadge.image}
                            imageAlt={resolveProductCardBadgeLabel(topBadge)}
                            className={cn(
                                "rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-stone-800 ring-1 ring-stone-200/70 dark:bg-[rgba(16,17,20,0.92)] dark:text-white dark:ring-white/[0.08]",
                                topBadge.className,
                            )}
                        />
                    </div>
                )}
                <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
                    <span
                        className={cn(
                            "inline-flex max-w-[150px] items-center gap-1 truncate rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm ring-1 backdrop-blur-sm",
                            isServiceProvider
                                ? "bg-violet-100/95 text-violet-800 ring-violet-200/80 dark:bg-[rgba(16,17,20,0.88)] dark:text-zinc-200 dark:ring-white/[0.08]"
                                : isRestaurant
                                  ? "bg-sky-100/95 text-sky-800 ring-sky-200/80 dark:bg-[rgba(16,17,20,0.88)] dark:text-zinc-200 dark:ring-white/[0.08]"
                                  : "bg-white/95 text-stone-700 ring-stone-200/70 dark:bg-[rgba(16,17,20,0.88)] dark:text-zinc-200 dark:ring-white/[0.08]",
                        )}
                        title={roleLabel}
                    >
                        <span
                            className={cn(
                                "h-1.5 w-1.5 shrink-0 rounded-full",
                                isServiceProvider
                                    ? "bg-violet-500 dark:bg-violet-300"
                                    : isRestaurant
                                      ? "bg-sky-500 dark:bg-sky-300"
                                      : "bg-emerald-500 dark:bg-emerald-300",
                            )}
                        />
                        {roleLabel}
                    </span>
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
                <div className="absolute bottom-3 left-3 z-10 rounded-full bg-white/95 px-3 py-1 shadow-md ring-1 ring-stone-900/5 backdrop-blur-sm dark:bg-[rgba(16,17,20,0.92)] dark:ring-white/[0.08]">
                    <Rating
                        rating={rating}
                        size="sm"
                        className="[&_span:last-child]:font-semibold [&_span:last-child]:text-custom-primary dark:[&_span:last-child]:text-white"
                    />
                </div>
            </div>

            {/* Info — soft wash when no API card tint */}
            <div
                className={cn(
                    "flex flex-1 flex-col rounded-b-3xl border-t border-stone-200/60 px-4 pb-4 pt-3.5 dark:border-white/[0.10]",
                    !surfaceColor &&
                        !surfaceGradient &&
                        "bg-gradient-to-b from-emerald-50/95 via-sky-50/55 to-white dark:from-[var(--color-bg-card-elevated)] dark:via-[color-mix(in_srgb,var(--color-bg-card-elevated)_90%,var(--color-bg-secondary)_10%)] dark:to-[color-mix(in_srgb,var(--color-bg-card-elevated)_68%,var(--color-bg-tertiary)_32%)]",
                )}
                style={
                    surfaceGradient
                        ? { backgroundImage: surfaceGradient }
                        : surfaceColor
                        ? { backgroundColor: surfaceColor }
                        : undefined
                }
            >
                <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-custom-primary dark:text-white">
                    {name}
                </h3>
                {description && (
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-custom-secondary/95 dark:text-zinc-400">
                        {description}
                    </p>
                )}
                {address && (
                    <p className="mt-1 line-clamp-1 text-xs text-custom-secondary/80 dark:text-zinc-500">
                        {address}
                    </p>
                )}

                <div className="mt-auto flex w-full flex-col gap-2.5 pt-3">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                        {normalizedPricingTier && (
                            <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-100 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900/40">
                                {normalizedPricingTier}
                            </span>
                        )}
                        {hasPaymentMethods && paymentMethods?.[0] && (
                            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900/40">
                                {paymentMethods[0].replaceAll("_", " ")}
                            </span>
                        )}
                    </div>
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
                        </div>
                    )}

                    {hasApiBottomBadges && (
                        <AnimatedButton
                            items={bottomBadgeItems}
                            heightClassName="h-[18px]"
                            type="button"
                            onClick={(e) => e.stopPropagation()}
                            className="self-center justify-center text-xs font-semibold"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
