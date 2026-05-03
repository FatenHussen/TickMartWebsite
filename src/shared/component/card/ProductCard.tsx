import { useMemo } from "react";

import type { SectionCardVariant } from "@/features/home/types";
import { cn } from "../../lib/utils";
import Rating from "@/shared/component/Rating";
import AnimatedButton from "../../ui/AnimatedButton";
import Button from "@/shared/ui/Button";
import Badge from "@/shared/component/Badge";
import FavoriteButton from "@/shared/component/FavoriteButton";
import LazyImage from "@/shared/component/LazyImage";

export type ProductCardBadge = {
    label: string;
    className?: string;
    align?: "left" | "right";
    type?: "image" | "text" | string;
    image?: string;
    /** When true, `label` is shown as-is (API `name`). Otherwise `t` maps `home.${label}` when `t` is passed */
    rawLabel?: boolean;
};

/** Shared by ProductCard / BestSellersCard for badge + animated rows */
export function resolveProductCardBadgeLabel(
    b: ProductCardBadge,
    t?: (key: string) => string
): string {
    if (b.rawLabel) return b.label;
    return t ? t(`home.${b.label}`) : b.label;
}

export type ProductCardProps = {
    id: number;
    name: string;
    description?: string;
    store?: string;
    price: string;
    originalPrice?: string;
    rating: number;
    image: string;

    badge?: ProductCardBadge | ProductCardBadge[];
    category?: string;
    isFavorite?: boolean;
    sold?: number;
    savings?: string;
    discountLabel?: string;
    deliveryInfo?: string;
    /** Bottom-row badges (e.g. API `bottom_badges`) — cycled in one animated button */
    bottomBadges?: ProductCardBadge[];

    onToggleFavorite?: (id: number) => void;
    onClick?: (id: number) => void;
    /** Opens a details dialog instead of relying on card navigation alone */
    onViewDetails?: (id: number) => void;
    viewDetailsLabel?: string;

    t?: (key: string) => string;
    className?: string;
    /** API section `variant` — image block height (home API rows). */
    layout?: SectionCardVariant;
    /** API `background_card_color` — lower content panel tint. */
    surfaceColor?: string | null;
    /** API-driven gradient for lower content panel. */
    surfaceGradient?: string | null;
};

export default function ProductCard({

    id,
    name,
    description,
    store: _store,
    price,
    originalPrice,
    rating,
    image,
    badge,
    category,
    isFavorite = false,
    sold,
    savings,
    discountLabel,
    deliveryInfo,
    bottomBadges,
    onToggleFavorite,
    onClick,
    onViewDetails,
    viewDetailsLabel,
    t,
    className,
    layout,
    surfaceColor,
    surfaceGradient,
}: ProductCardProps) {
    const imageFrameClass = layout
        ? layout === "horizontal"
            ? "h-36 sm:h-40"
            : layout === "vertical"
              ? "h-52 sm:h-56"
              : "h-44 sm:h-48"
        : "h-[200px]";

    const allBadges = badge ? (Array.isArray(badge) ? badge : [badge]) : [];
    const leftBadges = allBadges.filter((b) => (b.align ?? "left") === "left");
    const rightBadges = allBadges.filter((b) => b.align === "right");
    const bottomBadgesShown = bottomBadges ?? [];

    const bottomBadgeItems = useMemo(
        () =>
            bottomBadgesShown.map((b) => ({
                label: resolveProductCardBadgeLabel(b, t),
                className: b.className,
            })),
        [bottomBadgesShown, t],
    );
    const mergedBottomBadgeItems = useMemo(() => {
        const items = [...bottomBadgeItems];
        if (discountLabel) {
            items.unshift({
                label: discountLabel,
                className: undefined,
            });
        }
        return items;
    }, [bottomBadgeItems, discountLabel]);

    return (
        <div
            className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200/70 bg-custom-primary",
                "shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05),0_10px_24px_-8px_rgba(15,23,42,0.09)]",
                "before:pointer-events-none before:absolute before:inset-x-4 before:top-0 before:z-[1] before:h-px before:rounded-full before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent dark:before:via-white/15",
                "transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "hover:-translate-y-1 hover:border-stone-300/90 hover:shadow-[0_16px_36px_-10px_rgba(15,23,42,0.14),0_6px_14px_-4px_rgba(15,23,42,0.08)]",
                "dark:border-[color-mix(in_srgb,var(--color-main)_22%,#1f2230)] dark:bg-[color-mix(in_srgb,var(--color-main)_18%,#13151c)] dark:shadow-[0_2px_14px_-2px_rgba(0,0,0,0.5)] dark:hover:border-[color-mix(in_srgb,var(--color-api-second)_30%,#22253a)] dark:hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]",
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
            {/* Image — inset frame for a calmer, gallery-like look */}
            <div className="shrink-0 p-2.5 pb-0">
                <div
                    className={cn(
                        "relative overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-inset ring-black/[0.04] dark:bg-[color-mix(in_srgb,var(--color-api-second)_14%,#10121a)] dark:ring-[color-mix(in_srgb,var(--color-main)_22%,transparent)]",
                        imageFrameClass,
                    )}
                >
                    <LazyImage
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                        wrapperClassName="h-full w-full"
                    />
                    <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 via-black/[0.07] to-transparent dark:from-black/50"
                        aria-hidden
                    />

                    {/* Left Badges (top-left, stacked vertically) */}
                    {leftBadges.length > 0 && (
                        <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1.5">
                            {leftBadges.map((b, idx) => (
                                <Badge
                                    key={idx}
                                    label={resolveProductCardBadgeLabel(b, t)}
                                    type={b.type}
                                    imageSrc={b.image}
                                    imageAlt={resolveProductCardBadgeLabel(b, t)}
                                    className={cn(
                                        "shadow-md ring-1 ring-white/25",
                                        b.className ||
                                            "rounded-full bg-gradient-to-br from-sky-500 to-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white",
                                    )}
                                />
                            ))}
                        </div>
                    )}

                    {/* Right Badges (top-right, stacked vertically under favorite) */}
                    {rightBadges.length > 0 && (
                        <div className="absolute right-2.5 top-14 z-10 flex flex-col items-end gap-1.5">
                            {rightBadges.map((b, idx) => (
                                <Badge
                                    key={idx}
                                    label={resolveProductCardBadgeLabel(b, t)}
                                    type={b.type}
                                    imageSrc={b.image}
                                    imageAlt={resolveProductCardBadgeLabel(b, t)}
                                    className={cn(
                                        "shadow-md ring-1 ring-white/20",
                                        b.className ||
                                            "rounded-full bg-gradient-to-br from-amber-400 to-orange-500 px-2.5 py-0.5 text-xs font-semibold text-white",
                                    )}
                                />
                            ))}
                        </div>
                    )}

                    {/* Favorite — frosted chip */}
                    <div className="absolute right-2.5 top-2.5 z-20 rounded-full bg-white/90 p-0.5 shadow-md ring-1 ring-stone-900/8 backdrop-blur-md dark:bg-[color-mix(in_srgb,var(--color-main)_22%,#0e1017)]/90 dark:ring-[color-mix(in_srgb,var(--color-api-second)_28%,transparent)]">
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

                    {/* Rating (bottom-left) */}
                    <div className="absolute bottom-2.5 left-2.5 z-10 rounded-full bg-white/95 px-3 py-1.5 shadow-md ring-1 ring-stone-900/[0.06] backdrop-blur-md dark:bg-[color-mix(in_srgb,var(--color-main)_24%,#0e1017)]/92 dark:ring-[color-mix(in_srgb,var(--color-api-second)_28%,transparent)]">
                        <Rating
                            rating={rating}
                            size="sm"
                            className="px-0 py-0 [&_span:last-child]:font-semibold [&_span:last-child]:text-custom-primary dark:[&_span:last-child]:text-[var(--color-text)]"
                        />
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div
                className={cn(
                    "flex min-h-0 flex-1 flex-col px-4 pb-5 pt-4",
                    "border-t border-stone-200/50 dark:border-[color-mix(in_srgb,var(--color-main)_18%,transparent)]",
                    !surfaceColor &&
                        !surfaceGradient &&
                        "bg-gradient-to-b from-custom-secondary via-custom-secondary to-[color-mix(in_srgb,var(--color-bg-card)_85%,#dbeafe)] dark:from-[color-mix(in_srgb,var(--color-main)_16%,#11131a)] dark:via-[color-mix(in_srgb,var(--color-api-second)_14%,#10121a)] dark:to-[color-mix(in_srgb,var(--color-main)_10%,#0d0f16)]",
                )}
                style={
                    surfaceGradient
                        ? {
                              backgroundImage: surfaceGradient,
                              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)",
                          }
                        : surfaceColor
                        ? {
                              backgroundColor: surfaceColor,
                              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)",
                          }
                        : undefined
                }
            >
                {/* Product Name - 2 lines */}
                <h3 className="line-clamp-2 text-[0.9375rem] font-bold leading-snug tracking-tight text-custom-primary dark:text-[var(--color-text)] sm:text-base">
                    {name}
                </h3>

                {/* Description or category */}
                {(description || category) && (
                    <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-custom-secondary/90 dark:text-white/90 sm:text-sm">
                        {description || category}
                    </p>
                )}

                {/* Price Section */}
                <div className="mt-3">
                    <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
                        <span className="text-xl font-extrabold tabular-nums tracking-tight text-custom-primary dark:text-[var(--color-text)] sm:text-[1.35rem] sm:leading-none">
                            {price}
                        </span>
                    </div>

                    {/* Original price + savings + sold */}
                    {(originalPrice || savings || sold != null) && (
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5">
                            {originalPrice && (
                                <span className="text-sm text-custom-tertiary/90 line-through decoration-custom-tertiary/50 dark:text-white/70 dark:decoration-white/40">
                                    {originalPrice}
                                </span>
                            )}
                            {savings && (
                                <span className="inline-flex items-center rounded-lg bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/15 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20">
                                    {savings}
                                </span>
                            )}
                            {sold != null && (
                                <span className="ml-auto text-xs font-medium uppercase tracking-wide text-custom-secondary/80 dark:text-white/85">
                                    {sold.toLocaleString()}{" "}
                                    {t?.("product.sold") || "Sold"}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* View details + discount label + bottom badges + delivery */}
                {(onViewDetails ||
                    mergedBottomBadgeItems.length > 0 ||
                    deliveryInfo ||
                    discountLabel) && (
                    <div className="mt-auto flex w-full flex-col items-center gap-3 pt-5">
                        {onViewDetails && (
                            <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                fullWidth={false}
                                className="h-10 min-h-10 w-[min(100%,200px)] rounded-full bg-gradient-to-r from-[var(--color-main)] to-[var(--color-api-second)] px-5 text-sm font-semibold text-white shadow-md transition-[transform,box-shadow] duration-300 hover:shadow-lg motion-reduce:transition-none dark:to-[color-mix(in_srgb,var(--color-api-second)_82%,var(--color-main))]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onViewDetails(id);
                                }}
                            >
                                {viewDetailsLabel ?? "View details"}
                            </Button>
                        )}
                        {mergedBottomBadgeItems.length > 0 && (
                            <AnimatedButton
                                items={mergedBottomBadgeItems}
                                heightClassName="h-5"
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                                className="self-center justify-center text-xs font-semibold text-custom-secondary dark:text-white/90"
                            />
                        )}
                        {/* {deliveryInfo && (
                            <AnimatedButton
                                variant="primary"
                                size="sm"
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                                className="w-full justify-center bg-custom-accent text-xs font-semibold text-custom-inverse hover:opacity-90"
                                note={{
                                    primary: deliveryInfo,
                                    secondary: t ? t("home.orderNow") : "Order now",
                                }}
                            />
                        )} */}
                    </div>
                )}
            </div>
        </div>
    );
}
