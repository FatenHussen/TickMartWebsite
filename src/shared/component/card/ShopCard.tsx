import { useMemo } from "react";

import { cn } from "@/shared/lib/utils";
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
}: ShopCardProps) {
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
                      "bg-green-500 text-white text-xs font-medium shadow-sm",
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
                "flex h-full flex-col overflow-hidden rounded-2xl bg-custom-card shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-shadow hover:shadow-md",
                onClick && "cursor-pointer",
                className
            )}
        >
            {/* Image area */}
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-t-2xl bg-custom-muted">
                <LazyImage
                    src={imageSrc}
                    alt={name}
                    className="h-full w-full object-cover"
                    wrapperClassName="h-full w-full"
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
                <div className="absolute bottom-3 left-3 z-10 rounded-full bg-white/95 px-2.5 py-1 shadow-sm backdrop-blur-[1px]">
                    <Rating
                        rating={rating}
                        size="sm"
                        className="[&_span:last-child]:font-semibold [&_span:last-child]:text-custom-primary"
                    />
                </div>
            </div>

            {/* Info — mint tint */}
            <div className="flex flex-1 flex-col rounded-b-2xl bg-[rgb(22_163_74/0.1)] px-4 pb-4 pt-3">
                <h3 className="line-clamp-2 text-lg font-bold leading-snug text-custom-primary">
                    {name}
                </h3>
                {description && (
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-custom-secondary">
                        {description}
                    </p>
                )}

                <div className="mt-auto flex w-full flex-col gap-2 pt-3">
                    {hasApiBottomBadges && (
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                                <span className="shrink-0 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-800">
                                    Delivery
                                </span>
                                {discountLabel && (
                                    <span className="shrink-0 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-red-600">
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
                                className="w-full justify-center rounded-full bg-sky-400 text-sm font-medium text-white hover:bg-sky-500"
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
                                    className="w-full justify-center rounded-full bg-red-500 text-xs font-medium text-white hover:opacity-90"
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
