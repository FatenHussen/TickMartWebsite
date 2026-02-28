import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useAuthStore } from "@/store/auth";
import { useFavorites, useToggleFavorite } from "../hooks/useFavorites";
import FavoriteItemCard from "../components/FavoriteItemCard";
import type { FavoriteType } from "../types";

const FAVORITE_TYPES: FavoriteType[] = [
  "product",
  "recipe",
  "basket",
  "brand",
  "shop",
];

const sectionTitleKeys: Record<FavoriteType, string> = {
  product: "wishlist.products",
  recipe: "wishlist.recipes",
  basket: "wishlist.baskets",
  brand: "wishlist.brands",
  shop: "wishlist.shops",
};

export default function Wishlist() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { authenticated } = useAuthStore();
  const toggleFavorite = useToggleFavorite();

  const handleToggle = (type: FavoriteType) => (id: number) => {
    toggleFavorite.mutate({ type, id });
  };

  const product = useFavorites("product", !!authenticated);
  const recipe = useFavorites("recipe", !!authenticated);
  const basket = useFavorites("basket", !!authenticated);
  const brand = useFavorites("brand", !!authenticated);
  const hasAnyFavorites =
    (product.data?.length ?? 0) +
      (recipe.data?.length ?? 0) +
      (basket.data?.length ?? 0) +
      (brand.data?.length ?? 0) >
    0;

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {t("wishlist.title")}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("wishlist.description")}
        </p>
      </div>

      {FAVORITE_TYPES.map((type) => (
        <FavoritesSection
          key={type}
          type={type}
          enabled={!!authenticated}
          onToggle={handleToggle(type)}
        />
      ))}

      {authenticated && !hasAnyFavorites && <EmptyState />}
    </div>
  );
}

function FavoritesSection({
  type,
  enabled,
  onToggle,
}: {
  type: FavoriteType;
  enabled: boolean;
  onToggle: (id: number) => void;
}) {
  const { t } = useTranslation();
  const { data = [], isLoading } = useFavorites(type, enabled);

  if (!enabled) return null;
  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {t(sectionTitleKeys[type])}
        </h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }
  if (data.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {t(sectionTitleKeys[type])}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => (
          <FavoriteItemCard
            key={`${type}-${item.id}`}
            item={item}
            type={type}
            onToggle={onToggle}
            isFavorite
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  const { t } = useTranslation();
  return (
    <div className="py-14 text-center text-gray-500 dark:text-gray-400">
      {t("wishlist.noItemsFound")}
    </div>
  );
}
