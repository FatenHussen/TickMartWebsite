import type { CSSProperties } from "react";
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
    country?: string;
    onCountryChange?: (country: string | undefined) => void;
    search?: string;
    onSearchChange?: (search: string | undefined) => void;
    categoryId?: number;
    rootCategoryId?: number;
    attributeValues?: number[];
    onAttributeValuesChange?: (values: number[]) => void;
    freeDeliveryOnly?: boolean;
    onFreeDeliveryToggle?: (checked: boolean) => void;
    instantDeliveryOnly?: boolean;
    onInstantDeliveryToggle?: (checked: boolean) => void;
    onSaleOnly?: boolean;
    onOnSaleToggle?: (checked: boolean) => void;
    inStockOnly?: boolean;
    onInStockToggle?: (checked: boolean) => void;
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
    country,
    onCountryChange,
    search,
    onSearchChange,
    categoryId,
    rootCategoryId,
    attributeValues,
    onAttributeValuesChange,
    freeDeliveryOnly,
    onFreeDeliveryToggle,
    instantDeliveryOnly,
    onInstantDeliveryToggle,
    onSaleOnly,
    onOnSaleToggle,
    inStockOnly,
    onInStockToggle,
}: CategoriesSidebarProps) {
    const cardShell = cn(
        // Mobile: bare — CategoryFilters owns the trigger + bottom sheet.
        "border-0 bg-transparent p-0 shadow-none",
        // Desktop: elevated filter card.
        "lg:rounded-[20px] lg:border lg:p-5 lg:shadow-[0_1px_3px_rgba(15,23,42,0.04),0_14px_36px_-22px_rgba(15,23,42,0.24)]",
        apiSurface
            ? "lg:border-solid lg:[background-color:var(--cat-filter-card-bg)] lg:[border-color:var(--cat-filter-card-border)]"
            : "lg:border-slate-200/70 lg:bg-custom-card",
    );

    return (
        <div className="lg:sticky lg:top-24">
            <div
                className={cardShell}
                style={
                    apiSurface
                        ? ({
                              ["--cat-filter-card-bg"]: apiSurface.cardBackground,
                              ["--cat-filter-card-border"]: apiSurface.cardBorder,
                              color: apiSurface.mutedColor,
                          } as CSSProperties)
                        : undefined
                }
            >
                <CategoryFilters
                    typeFilter={categoryTypeFilter}
                    onTypeFilterChange={onCategoryTypeFilterChange}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onPriceChange={onPriceFilterChange}
                    country={country}
                    onCountryChange={onCountryChange}
                    search={search}
                    onSearchChange={onSearchChange}
                    categoryId={categoryId}
                    rootCategoryId={rootCategoryId}
                    attributeValues={attributeValues}
                    onAttributeValuesChange={onAttributeValuesChange}
                    freeDeliveryOnly={freeDeliveryOnly}
                    onFreeDeliveryToggle={onFreeDeliveryToggle}
                    instantDeliveryOnly={instantDeliveryOnly}
                    onInstantDeliveryToggle={onInstantDeliveryToggle}
                    onSaleOnly={onSaleOnly}
                    onOnSaleToggle={onOnSaleToggle}
                    inStockOnly={inStockOnly}
                    onInStockToggle={onInStockToggle}
                    apiSurface={apiSurface}
                />
            </div>
        </div>
    );
}
