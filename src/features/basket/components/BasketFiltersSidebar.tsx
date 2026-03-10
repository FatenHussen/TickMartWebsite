import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import type { BasketType, BasketSortType, BasketFilters } from "../types";

type BasketFiltersSidebarProps = {
  filters: BasketFilters;
  onFiltersChange: (filters: BasketFilters) => void;
};

const basketTypes: { value: BasketType; labelKey: string }[] = [
  { value: "all", labelKey: "baskets.allBaskets" },
  { value: "custom", labelKey: "baskets.customBaskets" },
  { value: "subscription", labelKey: "baskets.subscriptionBaskets" },
];

const sortTypes: { value: BasketSortType; labelKey: string }[] = [
  { value: "new", labelKey: "baskets.sortNew" },
  { value: "best_selling", labelKey: "baskets.sortBestSelling" },
  { value: "top_rated", labelKey: "baskets.sortTopRated" },
];

export default function BasketFiltersSidebar({
  filters,
  onFiltersChange,
}: BasketFiltersSidebarProps) {
  const { t } = useTranslation();

  const update = (patch: Partial<BasketFilters>) =>
    onFiltersChange({ ...filters, ...patch });

  return (
    <div className="space-y-6">
      {/* Basket Type */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4">
          {t("baskets.basketType")}
        </h3>
        <div className="space-y-2">
          {basketTypes.map(({ value, labelKey }) => (
            <button
              key={value}
              onClick={() => update({ basketType: value })}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg transition-all text-sm font-medium",
                filters.basketType === value
                  ? "bg-primary-light text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              )}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4">
          {t("baskets.sortBy", "Sort By")}
        </h3>
        <div className="space-y-2">
          {sortTypes.map(({ value, labelKey }) => (
            <button
              key={value}
              onClick={() =>
                update({ sortType: filters.sortType === value ? undefined : value })
              }
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg transition-all text-sm font-medium",
                filters.sortType === value
                  ? "bg-primary-light text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              )}
            >
              {t(labelKey, value === "new" ? "Newest" : value === "best_selling" ? "Best Selling" : "Top Rated")}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4">
          {t("baskets.priceRange", "Price Range")}
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder={t("baskets.min", "Min")}
            value={filters.priceMin ?? ""}
            onChange={(e) =>
              update({ priceMin: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-light"
          />
          <span className="text-gray-400 shrink-0">–</span>
          <input
            type="number"
            min={0}
            placeholder={t("baskets.max", "Max")}
            value={filters.priceMax ?? ""}
            onChange={(e) =>
              update({ priceMax: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-light"
          />
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4">
          {t("baskets.minRating", "Min Rating")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() =>
                update({ ratingMin: filters.ratingMin === star ? undefined : star })
              }
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all",
                filters.ratingMin === star
                  ? "bg-primary-light text-white border-primary-light"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary-light"
              )}
            >
              ★ {star}+
            </button>
          ))}
        </div>
      </div>

      {/* Items Count Range */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4">
          {t("baskets.itemsCount", "Items Count")}
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder={t("baskets.min", "Min")}
            value={filters.itemsCountMin ?? ""}
            onChange={(e) =>
              update({ itemsCountMin: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-light"
          />
          <span className="text-gray-400 shrink-0">–</span>
          <input
            type="number"
            min={0}
            placeholder={t("baskets.max", "Max")}
            value={filters.itemsCountMax ?? ""}
            onChange={(e) =>
              update({ itemsCountMax: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-light"
          />
        </div>
      </div>

      {/* Info hint */}
      <div className="bg-blue-50 rounded-xl p-5">
        <p className="text-sm text-gray-600">
          {filters.basketType === "custom" &&
            t("baskets.customBasketsInfo", "Browse all ready-made and custom baskets.")}
          {filters.basketType === "subscription" &&
            t("baskets.subscriptionBasketsInfo", "Browse all subscription baskets.")}
          {filters.basketType === "all" &&
            t("baskets.allBasketsInfo", "Browse all ready-made and subscription baskets. Use filters to find the perfect one.")}
        </p>
      </div>
    </div>
  );
}
