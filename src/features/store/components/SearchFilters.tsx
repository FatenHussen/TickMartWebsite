import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiStar } from "react-icons/hi";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Label from "@/shared/ui/Label";
import { cn } from "@/shared/lib/utils";

export type SearchFilterState = {
  category: string;
  subcategories: string[];
  sizes: string[];
  colors: string[];
  minPrice: string;
  maxPrice: string;
  ratings: number[];
  offers: string[];
};

type SearchFiltersProps = {
  onFiltersChange?: (filters: SearchFilterState) => void;
  className?: string;
};

export default function SearchFilters({
  onFiltersChange,
  className,
}: SearchFiltersProps) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<SearchFilterState>({
    category: "women",
    subcategories: ["Sneakers", "Tops"],
    sizes: ["S"],
    colors: ["black"],
    minPrice: "",
    maxPrice: "",
    ratings: [5, 4],
    offers: ["On Sale", "New Arrivals"],
  });

  const handleCategoryChange = (category: string) => {
    const newFilters = { ...filters, category };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleSubcategoryChange = (subcategory: string) => {
    const newSubcategories = filters.subcategories.includes(subcategory)
      ? filters.subcategories.filter((s) => s !== subcategory)
      : [...filters.subcategories, subcategory];
    const newFilters = { ...filters, subcategories: newSubcategories };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleSizeChange = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    const newFilters = { ...filters, sizes: newSizes };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleColorChange = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    const newFilters = { ...filters, colors: newColors };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handlePriceChange = (field: "minPrice" | "maxPrice", value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newRatings = filters.ratings.includes(rating)
      ? filters.ratings.filter((r) => r !== rating)
      : [...filters.ratings, rating];
    const newFilters = { ...filters, ratings: newRatings };
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

  const handleClearAll = () => {
    const resetFilters: SearchFilterState = {
      category: "",
      subcategories: [],
      sizes: [],
      colors: [],
      minPrice: "",
      maxPrice: "",
      ratings: [],
      offers: [],
    };
    setFilters(resetFilters);
    onFiltersChange?.(resetFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange?.(filters);
  };

  const categories = ["Women", "Men", "Kids"];
  const subcategories = ["Sneakers", "Tops", "T-shirts"];
  const sizes = ["XS", "S", "M", "L", "XL", "2XL"];
  const colors = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Red", value: "#FF0000" },
    { name: "Blue", value: "#0000FF" },
  ];
  const ratings = [5, 4, 3];
  const offers = ["On Sale", "Free Delivery", "New Arrivals"];

  return (
    <div
      className={cn(
        "bg-custom-primary rounded-2xl p-6 shadow-sm border border-custom-primary",
        className
      )}
    >
      <h2 className="text-xl font-bold text-text-primary mb-6">Filters</h2>

      <div className="space-y-6">
        {/* Category */}
        <div>
          <Label className="mb-3 text-text-primary font-semibold">Category</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <Label
                key={category}
                className="flex items-center gap-2 cursor-pointer font-normal"
              >
                <input
                  type="radio"
                  name="category"
                  checked={filters.category.toLowerCase() === category.toLowerCase()}
                  onChange={() => handleCategoryChange(category.toLowerCase())}
                  className="w-4 h-4 text-primary border-custom-secondary focus:ring-primary"
                />
                <span className="text-sm text-text-secondary">{category}</span>
              </Label>
            ))}
          </div>

          {/* Subcategories */}
          <div className="mt-3 ml-6 space-y-2">
            {subcategories.map((subcategory) => (
              <Label
                key={subcategory}
                className="flex items-center gap-2 cursor-pointer font-normal"
              >
                <input
                  type="checkbox"
                  checked={filters.subcategories.includes(subcategory)}
                  onChange={() => handleSubcategoryChange(subcategory)}
                  className="w-4 h-4 text-primary rounded border-custom-secondary focus:ring-primary"
                />
                <span className="text-sm text-text-secondary">{subcategory}</span>
              </Label>
            ))}
          </div>
        </div>

        {/* Size */}
        <div>
          <Label className="mb-3 text-text-primary font-semibold">
            {t("product.size") || "Size"}
          </Label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = filters.sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeChange(size)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-custom-primary border border-custom-secondary text-text-primary hover:border-primary"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color */}
        <div>
          <Label className="mb-3 text-text-primary font-semibold">
            {t("product.color") || "Color"}
          </Label>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => {
              const isSelected = filters.colors.includes(color.name.toLowerCase());
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => handleColorChange(color.name.toLowerCase())}
                  className={cn(
                    "h-10 w-10 rounded-full border-2 transition-all",
                    isSelected
                      ? "border-text-primary ring-2 ring-offset-2 ring-primary"
                      : "border-custom-secondary hover:border-primary"
                  )}
                  style={{ backgroundColor: color.value }}
                  aria-label={color.name}
                  title={color.name}
                />
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <Label className="mb-3 text-text-primary font-semibold">Price Range</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder={t("categories.minPrice") || "Min"}
              value={filters.minPrice}
              onChange={(e) => handlePriceChange("minPrice", e.target.value)}
              className="text-sm"
            />
            <span className="text-text-secondary">-</span>
            <Input
              type="number"
              placeholder={t("categories.maxPrice") || "Max"}
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

        {/* Rating */}
        <div>
          <Label className="mb-3 text-text-primary font-semibold">
            {t("product.rating") || "Rating"}
          </Label>
          <div className="space-y-2">
            {ratings.map((rating) => (
              <Label
                key={rating}
                className="flex items-center gap-2 cursor-pointer font-normal"
              >
                <input
                  type="checkbox"
                  checked={filters.ratings.includes(rating)}
                  onChange={() => handleRatingChange(rating)}
                  className="w-4 h-4 text-primary rounded border-custom-secondary focus:ring-primary"
                />
                <HiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-text-secondary">{rating} ★ & up</span>
              </Label>
            ))}
          </div>
        </div>

        {/* Offers */}
        <div>
          <Label className="mb-3 text-text-primary font-semibold">Offers</Label>
          <div className="space-y-2">
            {offers.map((offer) => (
              <Label
                key={offer}
                className="flex items-center gap-2 cursor-pointer font-normal"
              >
                <input
                  type="checkbox"
                  checked={filters.offers.includes(offer)}
                  onChange={() => handleOfferChange(offer)}
                  className="w-4 h-4 text-primary rounded border-custom-secondary focus:ring-primary"
                />
                <span className="text-sm text-text-secondary">{offer}</span>
              </Label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button variant="primary" onClick={handleApplyFilters} className="w-full">
            Apply Filters
          </Button>
          <button
            type="button"
            onClick={handleClearAll}
            className="w-full text-sm text-text-secondary hover:text-primary text-center"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

