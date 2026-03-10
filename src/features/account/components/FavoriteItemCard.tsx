import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Rating from "@/shared/component/Rating";
import Badge from "@/shared/component/Badge";
import FavoriteButton from "@/shared/component/FavoriteButton";
import { paths } from "@/app/routes/path/paths";
import type { FavoriteItem, FavoriteType } from "../types";

const badgeColorMap: Record<string, string> = {
  success: "bg-green-500 text-white",
  warning: "bg-yellow-500 text-white",
  danger: "bg-red-500 text-white",
  primary: "bg-blue-500 text-white",
};

type FavoriteItemCardProps = {
  item: FavoriteItem;
  type: FavoriteType;
  onToggle: (id: number) => void;
  isFavorite?: boolean;
};

function getDetailPath(type: FavoriteType, id: number): string {
  switch (type) {
    case "product":
      return paths.client.productDetails(id);
    case "recipe":
      return paths.client.recipeDetails(id);
    case "basket":
      return paths.client.basketDetails(id);
    case "brand":
      return paths.client.brandDetails(id);
    case "shop":
      return paths.client.shopDetails(id);
    default:
      return "#";
  }
}

export default function FavoriteItemCard({
  item,
  type,
  onToggle,
  isFavorite = true,
}: FavoriteItemCardProps) {
  const { t } = useTranslation();
  const detailPath = getDetailPath(type, item.id);
  const priceDisplay =
    item.price_after_discount != null
      ? String(item.price_after_discount)
      : item.price != null
        ? String(item.price)
        : "";
  const originalPrice =
    item.price_after_discount != null && item.price != null
      ? String(item.price)
      : undefined;
  const topBadge = item.budges?.[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow group">
      <Link to={detailPath} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={item.image ?? "https://via.placeholder.com/400?text=No+Image"}
            alt={item.name ?? item.title ?? ""}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {topBadge && (
            <div className="absolute left-3 top-3 z-10">
              <Badge
                label={topBadge.name}
                className={
                  badgeColorMap[topBadge.color] || "bg-blue-500 text-white"
                }
              />
            </div>
          )}
          {item.discount && parseFloat(item.discount) > 0 && (
            <div className="absolute left-3 top-3 z-10">
              <Badge
                label={`-${item.discount}%`}
                className="bg-red-500 text-white"
              />
            </div>
          )}
          <div className="absolute bottom-3 left-3 z-10 bg-blue-off rounded-sm">
            <Rating
              rating={item.rating ?? 0}
              size="sm"
              className="px-2 py-1"
            />
          </div>
          <div className="absolute right-3 top-3 z-10">
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggle(item.id);
              }}
              size="md"
              ariaLabel={t("wishlist.removeFromWishlist")}
            />
          </div>
        </div>
      </Link>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-0.5 line-clamp-1">
          {item.name ?? item.title ?? ""}
        </h3>
        {item.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-2">
          {priceDisplay && (
            <span className="text-base font-bold text-gray-900 dark:text-gray-100">
              {priceDisplay}
            </span>
          )}
          {originalPrice && (
            <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
              {originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
