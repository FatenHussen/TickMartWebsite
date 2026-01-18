import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiStar } from "react-icons/hi";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Label from "@/shared/ui/Label";

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

  const handleBrandChange = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    const newFilters = { ...filters, brands: newBrands };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleRatingChange = (rating: string) => {
    const newRatings = filters.ratings.includes(rating)
      ? filters.ratings.filter((r) => r !== rating)
      : [...filters.ratings, rating];
    const newFilters = { ...filters, ratings: newRatings };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleDeliveryChange = (option: string) => {
    const newDelivery = filters.delivery.includes(option)
      ? filters.delivery.filter((d) => d !== option)
      : [...filters.delivery, option];
    const newFilters = { ...filters, delivery: newDelivery };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleOfferChange = (offer: string) => {
    const newOffers = filters.offers.includes(offer)
      ? filters.offers.filter((o) => o !== offer)
      : [...filters.offers, offer];
    const newFilters = { ...filters, offers: newOffers };
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
  const ratings = ["4.5 & up", "4.0 & up"];
  const deliveryOptions = ["Free delivery", "Express delivery"];
  const offerOptions = ["On sale", "Subscription available"];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-custom-primary">Filters</h3>

      {/* Price Range */}
      <div>
        <Label className="mb-3">
          Price Range
        </Label>
        <div className="flex items-center gap-2 rtl:flex-row-reverse">
          <Input
            type="number"
            placeholder={t("categories.minPrice") || "Min"}
            value={filters.minPrice}
            onChange={(e) => handlePriceChange("minPrice", e.target.value)}
            className="text-sm"
          />
          <span className="text-custom-secondary">-</span>
          <Input
            type="number"
            placeholder={t("categories.maxPrice") || "Max"}
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      {/* Brand */}
      <div>
        <Label className="mb-3">
          Brand
        </Label>
        <div className="space-y-2">
          {brands.map((brand) => (
            <Label
              key={brand}
              className="flex items-center gap-2 cursor-pointer rtl:flex-row-reverse font-normal"
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="w-4 h-4 text-primary-light rounded border-custom-primary focus:ring-primary-light"
              />
              <span className="text-sm text-custom-secondary">{brand}</span>
            </Label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <Label className="mb-3">
          Rating
        </Label>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <Label
              key={rating}
              className="flex items-center gap-2 cursor-pointer rtl:flex-row-reverse font-normal"
            >
              <input
                type="checkbox"
                checked={filters.ratings.includes(rating)}
                onChange={() => handleRatingChange(rating)}
                className="w-4 h-4 text-primary-light rounded border-custom-primary focus:ring-primary-light"
              />
              <HiStar className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-custom-secondary">{rating}</span>
            </Label>
          ))}
        </div>
      </div>

      {/* Delivery */}
      <div>
        <Label className="mb-3">
          Delivery
        </Label>
        <div className="space-y-2">
          {deliveryOptions.map((option) => (
            <Label
              key={option}
              className="flex items-center gap-2 cursor-pointer rtl:flex-row-reverse font-normal"
            >
              <input
                type="checkbox"
                checked={filters.delivery.includes(option)}
                onChange={() => handleDeliveryChange(option)}
                className="w-4 h-4 text-primary-light rounded border-custom-primary focus:ring-primary-light"
              />
              <span className="text-sm text-custom-secondary">{option}</span>
            </Label>
          ))}
        </div>
      </div>

      {/* Offers */}
      <div>
        <Label className="mb-3">
          Offers
        </Label>
        <div className="space-y-2">
          {offerOptions.map((offer) => (
            <Label
              key={offer}
              className="flex items-center gap-2 cursor-pointer rtl:flex-row-reverse font-normal"
            >
              <input
                type="checkbox"
                checked={filters.offers.includes(offer)}
                onChange={() => handleOfferChange(offer)}
                className="w-4 h-4 text-primary-light rounded border-custom-primary focus:ring-primary-light"
              />
              <span className="text-sm text-custom-secondary">{offer}</span>
            </Label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <Button
          variant="primary"
          onClick={() => onFiltersChange?.(filters)}
          className="w-full"
        >
          Apply filters
        </Button>
        <button
          onClick={handleReset}
          className="w-full text-sm text-custom-secondary hover:text-custom-accent text-center"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
