import { cn } from "../../lib/utils";
import FavoriteButton from "@/shared/component/FavoriteButton";
import Rating from "@/shared/component/Rating";
import AnimatedButton from "../../ui/AnimatedButton";
import Badge from "@/shared/component/Badge";
import LazyImage from "@/shared/component/LazyImage";
import {
    type ProductCardBadge,
    resolveProductCardBadgeLabel,
} from "./ProductCard";

export type BestSellersCardProps = {
    id: number;
    name: string;
    price: string;
    originalPrice?: string;
    rating: number;
    image: string;
    category?: string; // e.g.,"Clothes"
    /** Top badges (left/right) — same shape as ProductCard */
    badge?: ProductCardBadge | ProductCardBadge[];
    /** @deprecated Prefer `badge`; kept for sliders that still pass these */
    badges?: Array<{ label: string; className?: string }>;
    /** @deprecated Prefer `badge` with align:"right" */
    topRightBadge?: { label: string; className?: string };
    /** Bottom animated label rows (same as ProductCard `bottomBadges`) */
    bottomBadges?: ProductCardBadge[];
    isFavorite?: boolean;
    sold?: number; // Quantity sold like 1238
    savings?: string; // Savings text like"You saved $180"
    /** Legacy single bottom animated row when `bottomBadges` is omitted */
    buttonText?: string;
    buttonTextSecond?: string;

    onToggleFavorite?: (id: number) => void;
    onClick?: (id: number) => void;

    t?: (key: string) => string;
    className?: string;
};

export default function BestSellersCard({
    id,
    name,
    price,
    originalPrice,
    rating,
    image,
    category,
    badge,
    badges = [],
    topRightBadge,
    bottomBadges,
    isFavorite = false,
    sold,
    savings,
    buttonText,
    buttonTextSecond,
    onToggleFavorite,
    onClick,
    t,
    className,
}: BestSellersCardProps) {
    const legacyTop: ProductCardBadge[] = [
        ...badges.map((b) => ({ ...b, align: "left" as const })),
        ...(topRightBadge
            ? [{ ...topRightBadge, align: "right" as const }]
            : []),
    ];
    const explicitTop =
        badge !== undefined
            ? Array.isArray(badge)
                ? badge
                : [badge]
            : null;
    const allTopBadges = (explicitTop ?? legacyTop).slice(0, 1);
    const leftBadges = allTopBadges.filter((b) => (b.align ?? "left") === "left");
    const rightBadges = allTopBadges.filter((b) => b.align === "right");

    const resolvedBottomBadges: ProductCardBadge[] | undefined =
        bottomBadges !== undefined
            ? bottomBadges.slice(0, 1)
            : buttonText
                ? [
                    {
                        label: buttonText,
                        className:
                            "bg-blue-500 hover:bg-blue-600 text-xs font-semibold text-white",
                    },
                ]
                : undefined;

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl bg-custom-primary shadow-sm transition hover:shadow-md flex flex-col h-full",
                "dark:bg-[color-mix(in_srgb,var(--color-main)_18%,#13151c)] dark:shadow-[0_2px_14px_-2px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_18px_38px_-8px_rgba(0,0,0,0.6)]",
                "dark:ring-1 dark:ring-[color-mix(in_srgb,var(--color-main)_22%,transparent)]",
                onClick && "cursor-pointer",
                className
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
            <div className="relative h-64 w-full">
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
                                className={cn(b.className || "bg-blue-500 text-white")}
                            />
                        ))}
                    </div>
                )}

                {/* Top-right badges */}
                {rightBadges.length > 0 && (
                    <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1">
                        {rightBadges.map((b, idx) => (
                            <Badge
                                key={idx}
                                label={resolveProductCardBadgeLabel(b, t)}
                                type={b.type}
                                imageSrc={b.image}
                                imageAlt={resolveProductCardBadgeLabel(b, t)}
                                className={cn(b.className || "bg-yellow-400 text-black")}
                            />
                        ))}
                    </div>
                )}

                {/* Rating badge (bottom-left) - White with yellow star */}
                <div className="absolute left-3 bottom-3 z-10 rounded-lg bg-custom-card px-2.5 py-1 shadow-sm">
                    <Rating
                        rating={rating}
                        size="sm"
                        className="gap-1.5 [&>span:first-child]:text-yellow-500 [&>span:last-child]:font-semibold [&>span:last-child]:text-slate-800 dark:[&>span:last-child]:text-[var(--color-text)]"
                    />
                </div>

                {/* Favorite Button (bottom-right) */}
                <div className="absolute right-3 bottom-3 z-10">
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

            {/* Info Section - light blue-gray, or API setting dark blend in dark mode */}
            <div className="bg-[#E4F0FB] px-4 pb-4 pt-4 flex flex-col flex-1 dark:bg-[color-mix(in_srgb,var(--color-api-second)_20%,#10121a)] dark:border-t dark:border-[color-mix(in_srgb,var(--color-main)_18%,transparent)]">
                {/* Product Name */}
                <h3 className="text-base font-bold text-slate-900 line-clamp-2 dark:text-[var(--color-text)]">
                    {name}
                </h3>

                {/* Category */}
                {category && (
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-white/90">
                        {category}
                    </p>
                )}

                {/* Price Section */}
                <div className="mt-3">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-slate-900 dark:text-[var(--color-text)]">
                            {price}
                        </span>
                        {originalPrice && (
                            <span className="text-sm text-slate-500 line-through dark:text-white/70 dark:decoration-white/40">
                                {originalPrice}
                            </span>
                        )}
                    </div>

                    {/* Savings */}
                    {savings && (
                        <p className="mt-1 text-sm font-medium text-green-600 dark:text-emerald-300">
                            {savings}
                        </p>
                    )}
                </div>

                {/* Sold Quantity */}
                {sold !== undefined && (
                    <p className="mt-2 text-xs text-slate-500 dark:text-white/85">
                        {sold.toLocaleString()} {t ? t("home.sold") : "Sold"}
                    </p>
                )}

                {/* Bottom animated badges (same pattern as ProductCard) */}
                {resolvedBottomBadges && resolvedBottomBadges.length > 0 && (
                    <div className="mt-auto flex w-full flex-col gap-2 pt-3">
                        {resolvedBottomBadges.map((b, idx) => {
                            const primary = resolveProductCardBadgeLabel(b, t);
                            const secondary =
                                buttonTextSecond && idx === 0 && bottomBadges === undefined
                                    ? buttonTextSecond
                                    : primary;
                            return (
                                <AnimatedButton
                                    key={idx}
                                    variant="primary"
                                    size="sm"
                                    type="button"
                                    onClick={(e) => e.stopPropagation()}
                                    className={cn(
                                        "w-full justify-center text-xs font-semibold",
                                        "dark:[&_.ab-track_.ab-row:first-child]:text-[var(--color-text)] dark:[&_.ab-track_.ab-row:last-child]:text-white/90",
                                        b.className
                                    )}
                                    note={{
                                        primary,
                                        secondary,
                                    }}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
