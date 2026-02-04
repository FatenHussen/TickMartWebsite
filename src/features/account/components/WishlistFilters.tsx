import { useTranslation } from "react-i18next";
import { HiChevronDown } from "react-icons/hi";

type WishlistFiltersProps = {
  stores: string[];
  categories: string[];
  selectedStore: string;
  selectedCategory: string;
  onStoreChange: (store: string) => void;
  onCategoryChange: (category: string) => void;
  onClearFilters: () => void;
};

export default function WishlistFilters({
  stores,
  categories,
  selectedStore,
  selectedCategory,
  onStoreChange,
  onCategoryChange,
  onClearFilters,
}: WishlistFiltersProps) {
  const { t } = useTranslation();

  const hasActiveFilters = selectedStore !== "all" || selectedCategory !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Store Filter */}
      <div className="relative">
        <select
          value={selectedStore}
          onChange={(e) => onStoreChange(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pe-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
        >
          <option value="all">{t("wishlist.allStores")}</option>
          {stores.map((store) => (
            <option key={store} value={store}>
              {store}
            </option>
          ))}
        </select>
        <HiChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Category Filter */}
      <div className="relative">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pe-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
        >
          <option value="all">{t("wishlist.allCategories")}</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <HiChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors ms-auto"
        >
          {t("wishlist.clearFilters")}
        </button>
      )}
    </div>
  );
}
