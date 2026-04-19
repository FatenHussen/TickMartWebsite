import { useMemo } from "react";

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
}: ProductCardProps) {
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

    return (
        <div
            className={cn(
                "relative flex h-full flex-col overflow-hidden rounded-xl bg-custom-primary shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition hover:shadow-md",
                onClick && "cursor-pointer",
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
            {/* Image Section */}
            <div className="relative h-[200px] w-full shrink-0">
                <LazyImage
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover"
                    wrapperClassName="h-full w-full"
                />

                {/* Left Badges (top-left, stacked vertically) */}
                {leftBadges.length > 0 && (
                    <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
                        {leftBadges.map((b, idx) => (
                            <Badge
                                key={idx}
                                label={resolveProductCardBadgeLabel(b, t)}
                                type={b.type}
                                imageSrc={b.image}
                                imageAlt={resolveProductCardBadgeLabel(b, t)}
                                className={cn(b.className || "bg-blue-500 text-white")}
                            />
                        ))}
                    </div>
                )}

                {/* Right Badges (top-right, stacked vertically under favorite) */}
                {rightBadges.length > 0 && (
                    <div className="absolute right-3 top-14 z-10 flex flex-col items-end gap-1">
                        {rightBadges.map((b, idx) => (
                            <Badge
                                key={idx}
                                label={resolveProductCardBadgeLabel(b, t)}
                                type={b.type}
                                imageSrc={b.image}
                                imageAlt={resolveProductCardBadgeLabel(b, t)}
                                className={cn(b.className || "bg-yellow-500 text-white")}
                            />
                        ))}
                    </div>
                )}

                {/* Favorite Button (top-right) */}
                <div className="absolute right-3 top-3 z-20">
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
                <div className="absolute bottom-3 left-3 z-10 rounded-full bg-white/95 px-2.5 py-1 shadow-sm backdrop-blur-[1px]">
                    <Rating
                        rating={rating}
                        size="sm"
                        className="px-0 py-0 [&_span:last-child]:font-semibold [&_span:last-child]:text-custom-primary"
                    />
                </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-1 flex-col bg-custom-secondary px-4 pb-4 pt-3">
                {/* Product Name - 2 lines */}
                <h3 className="line-clamp-2 text-base font-bold leading-snug text-custom-primary">
                    {name}
                </h3>

                {/* Description or category */}
                {(description || category) && (
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-custom-secondary">
                        {description || category}
                    </p>
                )}

                {/* Price Section */}
                <div className="mt-2">
                    {/* Main (discounted) price */}
                    <span className="text-lg font-bold text-custom-primary">{price}</span>

                    {/* Original price + savings + sold (same row — Figma) */}
                    {(originalPrice || savings || sold != null) && (
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            {originalPrice && (
                                <span className="text-sm text-custom-tertiary line-through">
                                    {originalPrice}
                                </span>
                            )}
                            {savings && (
                                <span
                                    className="text-sm font-medium"
                                    style={{ color: "var(--color-green)" }}
                                >
                                    {savings}
                                </span>
                            )}
                            {sold != null && (
                                <span className="ml-auto text-sm font-medium text-custom-secondary">
                                    {sold.toLocaleString()}{" "}
                                    {t?.("product.sold") || "Sold"}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* View details + discount label + bottom badges + delivery */}
                {(onViewDetails ||
                    bottomBadgesShown.length > 0 ||
                    deliveryInfo ||
                    discountLabel) && (
                    <div className="mt-auto flex w-full flex-col items-center gap-2 pt-4">
                        {onViewDetails && (
                            <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                fullWidth={false}
                                className="h-9 min-h-9 w-[185px] max-w-full rounded-md px-4 py-2 text-sm font-semibold shadow-none"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onViewDetails(id);
                                }}
                            >
                                {viewDetailsLabel ?? "View details"}
                            </Button>
                        )}
                        {discountLabel && (
                            <span className="rounded bg-red-400 px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-white">
                                {discountLabel}
                            </span>
                        )}
                        {bottomBadgesShown.length > 0 && (
                            <AnimatedButton
                                items={bottomBadgeItems}
                                heightClassName="h-[18px]"
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                                className="self-center justify-center text-xs font-semibold"
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
