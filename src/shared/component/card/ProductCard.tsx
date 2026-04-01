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
    /** Bottom-row badges (e.g. API `bottom_badges`) — each rendered as an animated label button */
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
    const bottomBadgesShown = bottomBadges?? [];

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl bg-custom-primary shadow-sm transition hover:shadow-md flex flex-col h-full",
                onClick && "cursor-pointer",
                className,
            )}
            onClick={() => onClick?.(id)}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={(e) => {
                if (!onClick) return;
                if (e.key === "Enter" || e.key === "") onClick(id);
            }}
        >
            {/* Image Section */}
            <div className="relative h-48 w-full">
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
                <div className="absolute bottom-3 left-3 z-10 rounded-sm bg-blue-off">
                    <Rating rating={rating} size="sm" className="px-2 py-1" />
                </div>
            </div>

            {/* Info Section */}
            <div className="bg-custom-secondary px-4 pb-4 pt-4 flex flex-col flex-1">
                {/* Product Name - 2 lines */}
                <h3 className="line-clamp-2 text-base font-bold text-custom-primary">
                    {name}
                </h3>

                {/* Description or category */}
                {(description || category) && (
                    <p className="mt-1 line-clamp-1 text-xs text-custom-secondary">
                        {description || category}
                    </p>
                )}

                {/* Price Section */}
                <div className="mt-3">
                    {/* Main (discounted) price */}
                    <span className="text-lg font-bold text-custom-primary">{price}</span>

                    {/* Original price + savings + sold — all on the same row */}
                    {(originalPrice || savings || sold != null || discountLabel) && (
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            {discountLabel && (
                                <span className="text-sm font-semibold text-red-500">
                                    {discountLabel}
                                </span>
                            )}
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
                                    {sold.toLocaleString()} {t?.("product.sold") || "Sold"}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* View details + bottom badges + delivery */}
                {(onViewDetails || bottomBadgesShown.length > 0 || deliveryInfo) && (
                    <div className="mt-auto flex w-full flex-col gap-2 pt-3">
                        {onViewDetails && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                fullWidth
                                className="text-xs font-semibold"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onViewDetails(id);
                                }}
                            >
                                {viewDetailsLabel ?? "View details"}
                            </Button>
                        )}
                        {bottomBadgesShown.map((b, idx) => {
                            const text = resolveProductCardBadgeLabel(b, t);
                            return (
                                <AnimatedButton
                                    key={idx}
                                    variant="primary"
                                    size="sm"
                                    type="button"
                                    onClick={(e) => e.stopPropagation()}
                                    className={cn(
                                        "w-full justify-center text-xs font-semibold",
                                        b.className
                                    )}
                                    note={{
                                        primary: text,
                                        secondary: text,
                                    }}
                                />
                            );
                        })}
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
