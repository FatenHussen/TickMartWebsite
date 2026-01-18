import { HiViewGrid, HiViewList } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/Button";
import Select from "@/shared/ui/Select";

type ProductsHeaderProps = {
  categoryName: string;
  subcategoryName?: string;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
};

export default function ProductsHeader({
  categoryName,
  subcategoryName,
  viewMode,
  onViewModeChange,
  sortBy = "recommended",
  onSortChange,
}: ProductsHeaderProps) {
  const { t } = useTranslation();
  const displayName = subcategoryName || categoryName;

  const sortOptions = [
    { value: "recommended", label: t("categories.sortMostOrdered") },
    { value: "priceLow", label: t("categories.sortPriceLow") },
    { value: "priceHigh", label: t("categories.sortPriceHigh") },
    { value: "rating", label: t("categories.sortRating") },
    { value: "newest", label: t("categories.sortNewest") },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shadow-sm rounded-lg p-4 border border-custom-primary rtl:flex-row-reverse">
      {/* Category Info */}
      <div className="flex items-center gap-2 rtl:flex-row-reverse">
        <div className="w-1 h-6 bg-primary-light rounded-full" />
        <div>
          <p className="text-xs text-custom-tertiary uppercase tracking-wide">
            {t("categories.showingProductsIn")}
          </p>
          <h2 className="text-lg font-bold text-custom-primary mt-0.5">
            {displayName}
          </h2>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap rtl:flex-row-reverse">
        {/* Sort Dropdown */}
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={onSortChange}
          className="min-w-[180px]"
        />

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 border border-custom-primary rounded-lg p-1 bg-custom-primary">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className={`p-2! min-w-0! ${
              viewMode === "grid"
                ? "bg-primary-light! text-white! shadow-sm"
                : "text-custom-secondary hover:bg-custom-hover!"
            }`}
            aria-label="Grid view"
            title="Grid view"
          >
            <HiViewGrid className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange("list")}
            className={`p-2! min-w-0! ${
              viewMode === "list"
                ? "bg-primary-light! text-white! shadow-sm"
                : "text-custom-secondary hover:bg-custom-hover!"
            }`}
            aria-label="List view"
            title="List view"
          >
            <HiViewList className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
