import { useMemo, type CSSProperties } from "react";

import type { SectionCardVariant } from "@/features/home/types";
import { cn } from "../../lib/utils";
import Rating from "@/shared/component/Rating";
import AnimatedButton, { type AnimatedButtonItem } from "../../ui/AnimatedButton";
import Button from "@/shared/ui/Button";
import Badge from "@/shared/component/Badge";
import FavoriteButton from "@/shared/component/FavoriteButton";
import FormattedPrice from "@/shared/component/FormattedPrice";
import LazyImage from "@/shared/component/LazyImage";
import { splitSavingsLabel } from "@/shared/lib/formatApiPrice";

export type ProductCardBadge = {
    label: string;
    className?: string;
    /** Inline colors from the API/database color picker (hex / rgb). */
    style?: CSSProperties;
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
        (): AnimatedButtonItem[] =>
            bottomBadgesShown.map((b) => ({
                label: resolveProductCardBadgeLabel(b, t),
                className: b.className,
                ...(b.style ? { style: b.style } : {}),
            })),
        [bottomBadgesShown, t],
    );
    const mergedBottomBadgeItems = useMemo((): AnimatedButtonItem[] => {
        const items: AnimatedButtonItem[] = [...bottomBadgeItems];
        if (discountLabel) {
            items.unshift({ label: discountLabel });
        }
        return items;
    }, [bottomBadgeItems, discountLabel]);

    const showRating = Number(rating) > 0;
    const showSold = sold != null && sold > 0;

    return (
        <div
            className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-stone-200/80 bg-custom-primary",
                "shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_20px_-12px_rgba(15,23,42,0.12)]",
                "transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "hover:-translate-y-0.5 hover:border-stone-300/90 hover:shadow-[0_12px_28px_-12px_rgba(15,23,42,0.16)]",
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
            {/* Image */}
            <div className="shrink-0">
                <div
                    className={cn(
                        "relative overflow-hidden bg-custom-secondary dark:bg-[#0B0B0C]",
                        imageFrameClass,
                    )}
                >
                    <LazyImage
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                        wrapperClassName="h-full w-full"
                    />

                    {/* Start-side badges (top-start — right in RTL) */}
                    {leftBadges.length > 0 && (
                        <div className="absolute start-3 top-3 z-10 flex flex-col gap-1.5">
                            {leftBadges.map((b, idx) => (
                                <Badge
                                    key={idx}
                                    label={resolveProductCardBadgeLabel(b, t)}
                                    type={b.type}
                                    imageSrc={b.image}
                                    imageAlt={resolveProductCardBadgeLabel(b, t)}
                                    className={cn(
                                        "rounded-full px-2.5 py-0.5 text-sm font-semibold shadow-lg ring-1 ring-white/25 backdrop-blur-[2px]",
                                        b.style
                                            ? undefined
                                            : b.className ||
                                              "bg-gradient-to-br from-sky-500 to-blue-600 text-white",
                                    )}
                                    style={b.style}
                                />
                            ))}
                        </div>
                    )}

                    {/* End-side badges (top-end — left in RTL, under favorite) */}
                    {rightBadges.length > 0 && (
                        <div className="absolute end-3 top-14 z-10 flex flex-col items-end gap-1.5">
                            {rightBadges.map((b, idx) => (
                                <Badge
                                    key={idx}
                                    label={resolveProductCardBadgeLabel(b, t)}
                                    type={b.type}
                                    imageSrc={b.image}
                                    imageAlt={resolveProductCardBadgeLabel(b, t)}
                                    className={cn(
                                        "rounded-full px-2.5 py-0.5 text-sm font-semibold shadow-lg ring-1 ring-white/20 backdrop-blur-[2px]",
                                        b.style
                                            ? undefined
                                            : b.className ||
                                              "bg-gradient-to-br from-amber-400 to-orange-500 text-white",
                                    )}
                                    style={b.style}
                                />
                            ))}
                        </div>
                    )}

                    <div className="absolute end-3 top-3 z-20">
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
                    "relative flex min-h-0 flex-1 flex-col border-t border-stone-100/90 px-4 pb-4 dark:border-white/[0.06]",
                    showRating ? "pt-7" : "pt-3.5",
                    !surfaceColor &&
                        !surfaceGradient &&
                        "bg-custom-secondary dark:bg-[var(--color-bg-card-elevated)]",
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
                {/* Rating — only when the product has been rated */}
                {showRating ? (
                <div
                    dir="ltr"
                    className="absolute -top-5 start-4 z-30 rounded-full bg-white px-3 py-1.5 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)] ring-1 ring-stone-900/[0.06] dark:bg-[rgba(20,21,24,0.97)] dark:ring-white/[0.1]"
                >
                    <Rating
                        rating={rating}
                        size="sm"
                        className="px-0 py-0 [&_span:last-child]:font-semibold [&_span:last-child]:text-custom-primary dark:[&_span:last-child]:text-white"
                    />
                </div>
                ) : null}

                <h3 className="line-clamp-2 min-h-[2.75rem] text-[1.0625rem] font-semibold leading-snug tracking-tight text-custom-primary dark:text-white sm:text-[1.125rem]">
                    {name}
                </h3>

                {(description || category) && (
                    <p className="mt-1 line-clamp-1 text-[14px] leading-5 text-custom-secondary dark:text-zinc-400">
                        {description || category}
                    </p>
                )}

                {/* Price: selected currency — after discount, before discount, % off, saved */}
                <div className="mt-3 flex items-end justify-between gap-3 border-t border-stone-100/90 pt-3 dark:border-white/[0.06]">
                    <div className="min-w-0 flex-1">
                        <FormattedPrice
                            value={price}
                            compareValue={originalPrice}
                            prominent
                            layout="stack"
                            className="text-[1.35rem] font-bold tracking-tight text-[color-mix(in_srgb,var(--color-main)_42%,#1c1917)] dark:text-white sm:text-[1.45rem]"
                        />
                        {(discountLabel || savings) && (
                            <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                                {discountLabel ? (
                                    <span className="inline-flex items-center rounded-full bg-[color-mix(in_srgb,var(--color-main)_12%,transparent)] px-2 py-0.5 text-[13px] font-semibold text-[color-mix(in_srgb,var(--color-main)_78%,#44403c)] dark:text-[color-mix(in_srgb,var(--color-main)_60%,white)]">
                                        {discountLabel}
                                    </span>
                                ) : null}
                                {savings ? <SavingsChip savings={savings} /> : null}
                            </div>
                        )}
                    </div>

                    {showSold && sold != null ? (
                        <div className="flex shrink-0 items-center gap-2 border-s border-stone-200/70 ps-3 dark:border-white/10">
                            <span
                                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--color-main)_10%,transparent)] text-[var(--color-main)]"
                                aria-hidden
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-3.5 w-3.5"
                                >
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                    <path d="M3 6h18" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                            </span>
                            <span className="inline-flex flex-col leading-tight">
                                <span dir="ltr" className="tabular-nums text-base font-bold text-custom-primary dark:text-white">
                                    {sold.toLocaleString()}
                                </span>
                                <span className="text-[12px] font-medium text-custom-secondary dark:text-zinc-400">
                                    {t?.("product.sold") || "Sold"}
                                </span>
                            </span>
                        </div>
                    ) : null}
                </div>

                {/* Open-details button + bottom badges */}
                {(onViewDetails ||
                    mergedBottomBadgeItems.length > 0 ||
                    deliveryInfo) && (
                    <div className="mt-auto flex w-full flex-col items-center gap-2.5 pt-4">
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
                                heightClassName="h-6"
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                                className="self-center justify-center text-sm font-semibold"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function SavingsChip({ savings }: { savings: string }) {
    const { label, amount } = splitSavingsLabel(savings);
    return (
        <span className="inline-flex max-w-full items-center gap-1 text-[13px] font-medium leading-none text-[color-mix(in_srgb,var(--color-main)_72%,#44403c)] dark:text-[color-mix(in_srgb,var(--color-main)_55%,white)]">
            {label ? <span>{label}</span> : null}
            <FormattedPrice value={amount} className="text-[13px] font-semibold" />
        </span>
    );
}
