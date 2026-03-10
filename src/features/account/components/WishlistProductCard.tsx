import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Rating from "@/shared/component/Rating";
import FavoriteButton from "@/shared/component/FavoriteButton";
import { paths } from "@/app/routes/path/paths";
import type { FavoriteItem, FavoriteType } from "../types";

const badgeColorMap: Record<string, string> = {
  success: "bg-green-500 text-white",
  warning: "bg-yellow-500 text-white",
  danger: "bg-red-500 text-white",
  primary: "bg-primary text-white",
};

type WishlistProductCardProps = {
  item: FavoriteItem;
  type?: FavoriteType;
  onToggle: (id: number) => void;
};

function getDetailPath(type: FavoriteType | undefined, id: number): string {
  switch (type) {
    case "recipe":
      return paths.client.recipeDetails(id);
    case "basket":
      return paths.client.basketDetails(id);
    case "brand":
      return paths.client.brandDetails(id);
    case "shop":
      return paths.client.shopDetails(id);
    default:
      return paths.client.productDetails(id);
  }
}

export default function WishlistProductCard({
  item,
  type,
  onToggle,
}: WishlistProductCardProps) {
  const { t } = useTranslation();

  const detailPath = getDetailPath(type, item.id);

  const priceDisplay =
    item.price_after_discount_formatted ??
    (item.price_after_discount != null
      ? `${item.currency_symbol ?? ""}${item.price_after_discount}`
      : item.price_formatted ??
        (item.price != null ? `${item.currency_symbol ?? ""}${item.price}` : ""));

  const originalPrice =
    item.price_after_discount != null && item.price != null
      ? item.price_formatted ?? `${item.currency_symbol ?? ""}${item.price}`
      : undefined;

  const hasDiscount = item.discount && parseFloat(item.discount) > 0;

  const priceNum =
    typeof item.price === "number" ? item.price : parseFloat(String(item.price ?? 0));
  const priceAfterNum =
    typeof item.price_after_discount === "number"
      ? item.price_after_discount
      : parseFloat(String(item.price_after_discount ?? 0));
  const savedAmount =
    priceNum > 0 && priceAfterNum >= 0 && priceNum > priceAfterNum
      ? (priceNum - priceAfterNum).toFixed(0)
      : null;
  const savingsText =
    savedAmount != null
      ? `${t("wishlist.youSaved")} ${item.currency_symbol ?? "$"}${savedAmount}`
      : undefined;

  const topBadge = item.top_badges?.[0] ?? item.budges?.[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link to={detailPath} className="block h-full">
          <img
            src={item.image ?? "https://via.placeholder.com/400?text=No+Image"}
            alt={item.name ?? item.title ?? ""}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {topBadge && (
          <div className="absolute left-3 top-3 z-10">
            <span
              className={`px-2.5 py-1 rounded text-xs font-semibold ${
                badgeColorMap[topBadge.color] ?? "bg-primary text-white"
              }`}
            >
              {topBadge.name}
            </span>
          </div>
        )}

        <div className="absolute right-3 top-3 z-10">
          <FavoriteButton
            isFavorite={false}
            onToggle={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle(item.id);
            }}
            size="md"
            ariaLabel={t("wishlist.removeFromWishlist")}
          />
        </div>

        <div className="absolute left-3 bottom-3 z-10 bg-blue-off rounded-sm">
          <Rating
            rating={item.rating ?? 0}
            size="sm"
            className="px-2 py-1"
          />
        </div>
      </div>

      <div className="p-4">
        <Link to={detailPath} className="hover:opacity-90">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-0.5 line-clamp-2 min-h-[2.5rem]">
            {item.name ?? item.title ?? ""}
          </h3>
        </Link>

        {item.category && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {item.category}
          </p>
        )}

        {priceDisplay && (
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
            {priceDisplay}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
          {originalPrice && hasDiscount && (
            <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
              {originalPrice}
            </span>
          )}
          {savingsText && (
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {savingsText}
            </span>
          )}
          {item.orders_count != null && item.orders_count > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
              {item.orders_count.toLocaleString()} {t("wishlist.sold")}
            </span>
          )}
        </div>

        {item.has_free_delivery && (
          <button
            type="button"
            className="w-full mt-1 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white text-center"
          >
            {t("wishlist.freeDelivery")}
          </button>
        )}
      </div>
    </div>
  );
}
