import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiStar } from "react-icons/hi";

type CategoryFiltersProps = {
  onFiltersChange?: (filters: FilterState) => void;
};

export type FilterState = {
  minPrice: string;
  maxPrice: string;
  brands: string[];
  ratings: string[];
  delivery: string[];
  offers: string[];
};

export default function CategoryFilters({
  onFiltersChange,
}: CategoryFiltersProps) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FilterState>({
    minPrice: "",
    maxPrice: "",
    brands: [],
    ratings: [],
    delivery: [],
    offers: [],
  });

  const handleCheckboxChange = (
    field: "brands" | "ratings" | "delivery" | "offers",
    value: string
  ) => {
    const currentValues = filters[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    const newFilters = { ...filters, [field]: newValues };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handlePriceChange = (field: "minPrice" | "maxPrice", value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      minPrice: "",
      maxPrice: "",
      brands: [],
      ratings: [],
      delivery: [],
      offers: [],
    };
    setFilters(resetFilters);
    onFiltersChange?.(resetFilters);
  };

  const brands = ["Organic Valley", "Fresh Farms", "Nature's Best"];
  const ratings = ["4.5", "4.0"];
  const deliveryOptions = ["Free delivery", "Express delivery"];
  const offerOptions = ["On sale", "Subscription available"];

  return (
    <div className="space-y-5">
      <h3 className="text-base font-bold text-gray-900">
        {t("categories.filters", "Filters")}
      </h3>

      {/* Price Range */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">
          {t("categories.priceRange", "Price Range")}
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={t("categories.min", "Min")}
            value={filters.minPrice}
            onChange={(e) => handlePriceChange("minPrice", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-light"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder={t("categories.max", "Max")}
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-light"
          />
        </div>
      </div>

      {/* Brand */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">
          {t("categories.brand", "Brand")}
        </p>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => handleCheckboxChange("brands", brand)}
                className="w-4 h-4 rounded border-gray-300 text-primary-light focus:ring-primary-light"
              />
              <span className="text-sm text-gray-600">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">
          {t("categories.rating", "Rating")}
        </p>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.ratings.includes(rating)}
                onChange={() => handleCheckboxChange("ratings", rating)}
                className="w-4 h-4 rounded border-gray-300 text-primary-light focus:ring-primary-light"
              />
              <HiStar className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-600">{rating} & up</span>
            </label>
          ))}
        </div>
      </div>

      {/* Delivery */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">
          {t("categories.delivery", "Delivery")}
        </p>
        <div className="space-y-2">
          {deliveryOptions.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.delivery.includes(option)}
                onChange={() => handleCheckboxChange("delivery", option)}
                className="w-4 h-4 rounded border-gray-300 text-primary-light focus:ring-primary-light"
              />
              <span className="text-sm text-gray-600">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Offers */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">
          {t("categories.offers", "Offers")}
        </p>
        <div className="space-y-2">
          {offerOptions.map((offer) => (
            <label
              key={offer}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.offers.includes(offer)}
                onChange={() => handleCheckboxChange("offers", offer)}
                className="w-4 h-4 rounded border-gray-300 text-primary-light focus:ring-primary-light"
              />
              <span className="text-sm text-gray-600">{offer}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => onFiltersChange?.(filters)}
          className="w-full py-2.5 bg-primary-light text-white text-sm font-semibold rounded-lg hover:bg-primary-light/90 transition-colors"
        >
          {t("categories.applyFilters", "Apply filters")}
        </button>
        <button
          onClick={handleReset}
          className="w-full py-2 text-sm text-primary-light hover:underline"
        >
          {t("categories.reset", "Reset")}
        </button>
      </div>
    </div>
  );
}
