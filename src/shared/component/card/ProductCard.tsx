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
    /**
     * Categories listing (dark luxury API surface): align card chrome with glass panels
     * (`buildCategoriesLuxuryDarkSurface`).
     */
    categoriesLuxuryListing?: boolean;
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
    categoriesLuxuryListing = false,
}: ProductCardProps) {
    const imageFrameClass = layout
        ? layout === "horizontal"
            ? "h-40 sm:h-44"
            : layout === "vertical"
              ? "h-56 sm:h-64"
              : "h-48 sm:h-52"
        : "h-[216px]";

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
                "dark:border-white/[0.12] dark:bg-[var(--color-bg-card-elevated)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_28px_-10px_rgba(0,0,0,0.5)] dark:hover:border-white/[0.18] dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_14px_44px_-14px_rgba(0,0,0,0.62)]",
                categoriesLuxuryListing &&
                    "dark:border-white/[0.07] dark:bg-[rgba(16,17,20,0.72)] dark:shadow-[0_8px_32px_-14px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.06)] dark:hover:border-white/[0.10] dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_14px_44px_-14px_rgba(0,0,0,0.62)]",
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
            {/* Image — full-bleed editorial header */}
            <div className="shrink-0">
                <div
                    className={cn(
                        "relative overflow-hidden bg-stone-100 dark:bg-[#0B0B0C]",
                        imageFrameClass,
                    )}
                >
                    <LazyImage
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.07] motion-reduce:group-hover:scale-100"
                        wrapperClassName="h-full w-full"
                    />
                    {/* Cinematic bottom fade for chip legibility + depth */}
                    <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 via-black/10 to-transparent dark:from-black/60"
                        aria-hidden
                    />
                    {/* Soft sheen sweep on hover */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:hidden"
                        style={{
                            backgroundImage:
                                "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.16) 48%, transparent 66%)",
                        }}
                        aria-hidden
                    />

                    {/* Left Badges (top-left, stacked vertically) */}
                    {leftBadges.length > 0 && (
                        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
                            {leftBadges.map((b, idx) => (
                                <Badge
                                    key={idx}
                                    label={resolveProductCardBadgeLabel(b, t)}
                                    type={b.type}
                                    imageSrc={b.image}
                                    imageAlt={resolveProductCardBadgeLabel(b, t)}
                                    className={cn(
                                        "shadow-lg ring-1 ring-white/25 backdrop-blur-[2px]",
                                        b.className ||
                                            "rounded-full bg-gradient-to-br from-sky-500 to-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white",
                                    )}
                                />
                            ))}
                        </div>
                    )}

                    {/* Right Badges (top-right, stacked vertically under favorite) */}
                    {rightBadges.length > 0 && (
                        <div className="absolute right-3 top-14 z-10 flex flex-col items-end gap-1.5">
                            {rightBadges.map((b, idx) => (
                                <Badge
                                    key={idx}
                                    label={resolveProductCardBadgeLabel(b, t)}
                                    type={b.type}
                                    imageSrc={b.image}
                                    imageAlt={resolveProductCardBadgeLabel(b, t)}
                                    className={cn(
                                        "shadow-lg ring-1 ring-white/20 backdrop-blur-[2px]",
                                        b.className ||
                                            "rounded-full bg-gradient-to-br from-amber-400 to-orange-500 px-2.5 py-0.5 text-xs font-semibold text-white",
                                    )}
                                />
                            ))}
                        </div>
                    )}

                    {/* Favorite — frosted chip */}
                    <div className="absolute right-3 top-3 z-20 rounded-full bg-white/90 p-0.5 shadow-lg ring-1 ring-stone-900/8 backdrop-blur-md transition-transform duration-300 hover:scale-110 dark:bg-[rgba(16,17,20,0.92)] dark:ring-white/[0.08]">
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
            </div>

            {/* Info Section */}
            <div
                className={cn(
                    "relative flex min-h-0 flex-1 flex-col px-4 pb-5 pt-7",
                    !surfaceColor &&
                        !surfaceGradient &&
                        "bg-gradient-to-b from-custom-secondary via-custom-secondary to-[color-mix(in_srgb,var(--color-bg-card)_85%,#dbeafe)] dark:from-[var(--color-bg-card-elevated)] dark:via-[color-mix(in_srgb,var(--color-bg-card-elevated)_90%,var(--color-bg-secondary)_10%)] dark:to-[color-mix(in_srgb,var(--color-bg-card-elevated)_68%,var(--color-bg-tertiary)_32%)]",
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
                {/* Rating — floats up over the image/content seam (panel isn't clipped) */}
                <div className="absolute -top-5 left-4 z-30 rounded-full bg-white px-3 py-1.5 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)] ring-1 ring-stone-900/[0.06] dark:bg-[rgba(20,21,24,0.97)] dark:ring-white/[0.1]">
                    <Rating
                        rating={rating}
                        size="sm"
                        className="px-0 py-0 [&_span:last-child]:font-semibold [&_span:last-child]:text-custom-primary dark:[&_span:last-child]:text-white"
                    />
                </div>

                {/* Product Name - 2 lines */}
                <h3 className="line-clamp-2 text-[0.9375rem] font-bold leading-snug tracking-tight text-custom-primary dark:text-white sm:text-base">
                    {name}
                </h3>

                {/* Description or category */}
                {(description || category) && (
                    <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-custom-secondary/90 dark:text-zinc-400 sm:text-sm">
                        {description || category}
                    </p>
                )}

                {/* Price + sold row */}
                <div className="mt-4 flex items-center gap-3">
                    {/* Price block */}
                    <div className="min-w-0 flex-1">
                        <span className="block bg-gradient-to-br from-[color-mix(in_srgb,var(--color-main)_45%,black)] to-[color-mix(in_srgb,var(--color-api-second)_45%,black)] bg-clip-text text-xl font-extrabold tabular-nums tracking-tight text-transparent dark:from-white dark:to-white/80 sm:text-[1.45rem] sm:leading-none">
                            {price}
                        </span>
                        {originalPrice && (
                            <span className="mt-1 block text-sm text-custom-tertiary/90 line-through decoration-custom-tertiary/50 dark:text-zinc-500 dark:decoration-zinc-600">
                                {originalPrice}
                            </span>
                        )}
                    </div>

                    {/* Sold block — bag icon + count, divider on its left */}
                    {sold != null && (
                        <div className="flex shrink-0 items-center gap-2.5 self-stretch border-l border-stone-200/70 pl-3 dark:border-white/10">
                            <span
                                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--color-main)_10%,transparent)] text-[var(--color-main)]"
                                aria-hidden
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                >
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                    <path d="M3 6h18" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                            </span>
                            <span className="text-sm font-bold uppercase tracking-wide leading-tight text-custom-primary dark:text-white">
                                {sold.toLocaleString()}{" "}
                                {t?.("product.sold") || "Sold"}
                            </span>
                        </div>
                    )}
                </div>

                {/* Savings — own full-width row so it never collides with the sold block */}
                {savings && (
                    <div className="mt-2.5">
                        <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/25">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-3.5 w-3.5 shrink-0"
                                aria-hidden
                            >
                                <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
                                <path d="M2 7h20v5H2z" />
                                <path d="M12 22V7" />
                                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z" />
                                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z" />
                            </svg>
                            <span className="truncate">{savings}</span>
                        </span>
                    </div>
                )}

                {/* Open-details button + bottom badges */}
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
                                fullWidth
                                className="h-12 min-h-12 w-full rounded-2xl bg-gradient-to-r from-[var(--color-main)] to-[var(--color-api-second)] px-5 text-sm font-bold text-white shadow-lg shadow-[color-mix(in_srgb,var(--color-main)_30%,transparent)] transition-[transform,box-shadow,filter] duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:brightness-[1.04] motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:to-[color-mix(in_srgb,var(--color-api-second)_82%,var(--color-main))]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onViewDetails(id);
                                }}
                            >
                                <span className="inline-flex items-center justify-center gap-2">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-[18px] w-[18px]"
                                        aria-hidden
                                    >
                                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    {viewDetailsLabel ?? "View details"}
                                </span>
                            </Button>
                        )}
                        {mergedBottomBadgeItems.length > 0 && (
                            <AnimatedButton
                                items={mergedBottomBadgeItems}
                                heightClassName="h-5"
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                                className="self-center justify-center text-xs font-semibold text-custom-secondary dark:text-zinc-400"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
