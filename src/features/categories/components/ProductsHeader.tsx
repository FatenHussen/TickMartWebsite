import { useTranslation } from "react-i18next";

type ProductsHeaderProps = {
  categoryName: string;
  subcategoryName?: string;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
};

export default function ProductsHeader({
  categoryName,
  subcategoryName,
  sortBy = "recommended",
  onSortChange,
}: ProductsHeaderProps) {
  const { t } = useTranslation();
  const displayName = subcategoryName || categoryName;

  const sortOptions = [
    { value: "recommended", label: t("categories.sortRecommended", "Recommended") },
    { value: "priceLow", label: t("categories.sortPriceLow", "Price: Low to High") },
    { value: "priceHigh", label: t("categories.sortPriceHigh", "Price: High to Low") },
    { value: "rating", label: t("categories.sortRating", "Rating") },
    { value: "newest", label: t("categories.sortNewest", "Newest") },
  ];

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Left: Showing products in X */}
      <p className="text-sm text-gray-600">
        {t("categories.showingProductsIn", "Showing products in")}{" "}
        <span className="font-semibold text-primary-light">{displayName}</span>
      </p>

      {/* Right: Sort by dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          {t("categories.sortBy", "Sort by:")}
        </span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
