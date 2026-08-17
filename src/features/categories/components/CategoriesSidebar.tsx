import { cn } from "@/shared/lib/utils";
import type { CategoriesApiDarkSurface } from "../lib/categoriesApiDarkSurface";
import CategoryFilters from "./CategoryFilters";
import type { CategoryTypeFilter } from "./CategoryFilters";

type CategoriesSidebarProps = {
    apiSurface?: CategoriesApiDarkSurface | null;
    categoryTypeFilter?: CategoryTypeFilter;
    onCategoryTypeFilterChange?: (type: CategoryTypeFilter) => void;
    minPrice?: number;
    maxPrice?: number;
    onPriceFilterChange?: (price: { minPrice?: number; maxPrice?: number }) => void;
};

/**
 * Categories page sidebar. Category navigation itself lives in the circular
 * drill-down strip above the products, so this card holds filters only.
 */
export default function CategoriesSidebar({
    apiSurface,
    categoryTypeFilter,
    onCategoryTypeFilterChange,
    minPrice,
    maxPrice,
    onPriceFilterChange,
}: CategoriesSidebarProps) {
    const cardShell = cn(
        "rounded-[20px] border p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_14px_36px_-22px_rgba(15,23,42,0.24)]",
        apiSurface ? "border-solid" : "border-slate-200/70 bg-custom-card",
    );

    const cardStyle = apiSurface
        ? {
            backgroundColor: apiSurface.cardBackground,
            borderColor: apiSurface.cardBorder,
            color: apiSurface.mutedColor,
        }
        : undefined;

    return (
        // Filters are the only card left here, so pin them instead of letting
        // them float against a long product grid.
        <div className="space-y-6 lg:sticky lg:top-24">
            <div className={cardShell} style={cardStyle}>
                <CategoryFilters
                    typeFilter={categoryTypeFilter}
                    onTypeFilterChange={onCategoryTypeFilterChange}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onPriceChange={onPriceFilterChange}
                    apiSurface={apiSurface}
                />
            </div>
        </div>
    );
}
