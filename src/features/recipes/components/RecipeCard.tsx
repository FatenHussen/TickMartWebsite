import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import Rating from "@/shared/component/Rating";
import Badge from "@/shared/component/Badge";
import LazyImage from "@/shared/component/LazyImage";
import FavoriteButton from "@/shared/component/FavoriteButton";
import type { Recipe } from "../types";
import { mapActionPageSlugToRoute } from "@/utils/routeMapper";
import { useNavigate } from "react-router-dom";

export type RecipeCardProps = {
    recipe: Recipe;
    className?: string;
    isFavorite?: boolean;
    onToggleFavorite?: (id: number) => void;
};

const badgeColorMap: Record<string, string> = {
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    danger: "bg-red-500 text-white",
    primary: "bg-blue-500 text-white",
};

export default function RecipeCard({
    recipe,
    className,
    isFavorite = false,
    onToggleFavorite,
}: RecipeCardProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const hasDiscount = recipe.discount && parseFloat(recipe.discount) > 0;
    const topBadge = recipe.budges?.find(
        (b) => (b.postion === "top" || b.postion === null) && (b.type === "image" || Boolean(b.image) || Boolean(b.color))
    );
    const topBadgeColorClass =
        topBadge?.color ? badgeColorMap[topBadge.color] : undefined;

    const handleClick = () => {
        const route = mapActionPageSlugToRoute("recipe_details", recipe.id);
        navigate(route);
    };

    // Build image URL
    const imageUrl = recipe.image.startsWith("http")
        ? recipe.image
        : `https://tickdash.tickmartsy.com/storage/${recipe.image}`;

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl bg-custom-secondary shadow-sm transition hover:shadow-md cursor-pointer flex flex-col h-full",
                className
            )}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "") handleClick();
            }}
        >
            {/* Image Section */}
            <div className="relative h-48 w-full">
                <LazyImage
                    src={imageUrl}
                    alt={recipe.name}
                    className="h-full w-full object-cover"
                    wrapperClassName="h-full w-full"
                />

                {/* Discount Badge */}
                {hasDiscount && (
                    <div className="absolute left-3 top-3 z-10">
                        <Badge
                            label={`-${recipe.discount}%`}
                            className="bg-red-500 text-white"
                        />
                    </div>
                )}

                {/* Top Badge (if no discount) */}
                {!hasDiscount && topBadge && (
                    <div className="absolute left-3 top-3 z-10">
                        <Badge
                            label={topBadge.name}
                            type={topBadge.type}
                            imageSrc={topBadge.image ?? undefined}
                            imageAlt={topBadge.name}
                            className={
                                topBadgeColorClass || "bg-blue-500 text-white"
                            }
                        />
                    </div>
                )}

                {/* Favorite Button (top-right) */}
                <div className="absolute right-3 top-3 z-10">
                    <FavoriteButton
                        isFavorite={isFavorite}
                        onToggle={(e) => {
                            e.stopPropagation();
                            onToggleFavorite?.(recipe.id);
                        }}
                        size="md"
                        ariaLabel="Toggle favorite"
                    />
                </div>

                {/* Rating (bottom-left) */}
                {recipe.rating > 0 && (
                    <div className="absolute left-3 bottom-3 z-10 bg-custom-primary/90 backdrop-blur-sm rounded-sm [&_span:last-child]:text-white">
                        <Rating rating={recipe.rating} size="sm" className="px-2 py-1" />
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="bg-custom-secondary px-4 pb-4 pt-4 flex flex-col flex-1">
                {/* Recipe Name */}
                <h3 className="text-base font-bold text-[color:var(--color-text,var(--color-text-primary))] line-clamp-1">
                    {recipe.name}
                </h3>

                {/* Description */}
                {recipe.description && (
                    <p className="mt-1 text-xs text-white line-clamp-2">
                        {recipe.description}
                    </p>
                )}

                {/* Price Section */}
                <div className="mt-3">
                    <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-lg font-bold text-[color:var(--color-text,var(--color-text-primary))]">
                            {recipe.price_after_discount}
                        </span>
                        {hasDiscount && recipe.price && (
                            <span className="text-sm text-white/80 line-through">
                                {recipe.price}
                            </span>
                        )}
                        {recipe.sold !== undefined && recipe.sold > 0 && (
                            <span className="ml-auto text-sm font-medium text-white">
                                {recipe.sold.toLocaleString()} {t("home.sold")}
                            </span>
                        )}
                    </div>

                    {/* Orders Count */}
                    {recipe.orders_count > 0 && (
                        <p className="text-sm font-medium text-white mt-1">
                            {recipe.orders_count.toLocaleString()} {t("recipes.orders")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
