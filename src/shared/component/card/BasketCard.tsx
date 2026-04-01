import Button from "@/shared/ui/Button";
import AnimatedButton from "@/shared/ui/AnimatedButton";
import FavoriteButton from "@/shared/component/FavoriteButton";
import Rating from "@/shared/component/Rating";
import Badge from "@/shared/component/Badge";
import LazyImage from "@/shared/component/LazyImage";
import { cn } from "@/shared/lib/utils";
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
}: BasketCardProps) {
    const saveAsBadge: ProductCardBadge[] = saveAmount
        ? [
            {
                label: saveAmount,
                className:
                    "bg-yellow-400 text-slate-900 shadow-sm text-xs font-semibold",
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

    return (
        <div
            className={cn(
                "relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md",
                onClick && "cursor-pointer",
                className
            )}
            onClick={() => onClick?.(id)}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={(e) => {
                if (!onClick) return;
                if (e.key === "Enter" || e.key === "") onClick(id);
            }}
        >
            {/* Image */}
            <div className="relative h-56 w-full">
                <LazyImage
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover"
                    wrapperClassName="h-full w-full"
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
                                    "rounded-lg px-2.5 py-1 text-xs font-semibold leading-none shadow-none",
                                    b.className || "bg-yellow-400 text-slate-900"
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

            {/* Body - Light green background */}
            <div className="flex flex-1 flex-col bg-[#EEF8F0] px-5 pb-5 pt-5">
                {/* Title */}
                <h3 className="line-clamp-1 text-xl font-bold leading-snug text-slate-900">
                    {name}
                </h3>

                {/* Description */}
                <p className="mt-2 line-clamp-1 text-base font-normal leading-snug text-slate-700">
                    {description}
                </p>

                {/* Rating */}
                {rating != null && (
                    <div className="mt-2">
                        <Rating rating={typeof rating === "number" ? rating.toFixed(1) : rating} size="sm" />
                    </div>
                )}

                {/* Price Section */}
                <div className="mt-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold leading-none text-slate-900">{price}</span>
                    </div>

                    {/* Original Price and Savings */}
                    {originalPrice && savings && (
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-base leading-none">
                            <span className="font-normal text-slate-400 line-through decoration-2">
                                {originalPrice}
                            </span>
                            <span className="font-normal text-green-600 line-through decoration-2">
                                {savings}
                            </span>
                        </div>
                    )}
                </div>

                {/* Offer Ending Date */}
                {offerEndingDate && (
                    <p className="mt-4 text-sm font-normal leading-snug text-slate-900">
                        <span>Offer ending date:</span>{" "}
                        <span className="text-red-500">{offerEndingDate}</span>
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
                        className="min-h-[56px] rounded-xl bg-yellow-400 px-5 text-xl font-bold text-slate-900 hover:bg-yellow-500"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart?.(id);
                        }}
                    >
                        {t ? t("home.addToCart") : "Add to Cart"}
                    </Button>

                    {bottomBadges != null &&
                        bottomBadges.length > 0 &&
                        bottomBadges.slice(0, 1).map((b, idx) => {
                            const text = resolveProductCardBadgeLabel(b, t);
                            return (
                                <AnimatedButton
                                    key={idx}
                                    variant="primary"
                                    size="sm"
                                    type="button"
                                    onClick={(e) => e.stopPropagation()}
                                    className={cn(
                                        "min-h-0 w-auto min-w-0 rounded-lg px-4 py-1.5 text-xs font-medium leading-none shadow-none",
                                        b.className
                                    )}
                                    note={{
                                        primary: text,
                                        secondary: text,
                                    }}
                                />
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
