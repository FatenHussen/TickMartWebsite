import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiChevronDown } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";

type ProductFiltersProps = {
    location?: string;
    onLocationChange?: () => void;
    categories?: string[];
    stores?: string[];
    selectedCategory?: string;
    selectedStore?: string;
    onCategoryChange?: (category: string) => void;
    onStoreChange?: (store: string) => void;
    freeDeliveryOnly?: boolean;
    inStockOnly?: boolean;
    onFreeDeliveryToggle?: (checked: boolean) => void;
    onInStockToggle?: (checked: boolean) => void;
    sortBy?: string;
    onSortChange?: (sort: string) => void;
    sortOptions?: { value: string; label: string }[];
};

export default function ProductFilters({
    location = "Downtown, Cairo",
    onLocationChange,
    categories = ["All categories"],
    stores = ["All stores"],
    selectedCategory = "All categories",
    selectedStore = "All stores",
    onCategoryChange,
    onStoreChange,
    freeDeliveryOnly = false,
    inStockOnly = false,
    onFreeDeliveryToggle,
    onInStockToggle,
    sortBy = "Best match",
    onSortChange,
    sortOptions = [
        { value: "best_match", label: "Best match" },
        { value: "price_low", label: "Price: Low to High" },
        { value: "price_high", label: "Price: High to Low" },
        { value: "rating", label: "Rating" },
        { value: "newest", label: "Newest" },
    ],
}: ProductFiltersProps) {
    const { t } = useTranslation();
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isStoreOpen, setIsStoreOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    return (
        <div className="space-y-4">
            {/* Location Row */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-custom-secondary">
                    {t("product.filters.showingNearby")}{""}
                    <span className="font-medium text-custom-primary">{location}</span>
                </p>
                {onLocationChange && (
                    <button
                        type="button"
                        onClick={onLocationChange}
                        className="text-sm font-medium text-custom-accent hover:underline"
                    >
                        {t("product.filters.changeLocation")}
                    </button>
                )}
            </div>

            {/* Filter Buttons Row */}
            <div className="flex items-center gap-3 flex-wrap">
                {/* Category Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            setIsCategoryOpen(!isCategoryOpen);
                            setIsStoreOpen(false);
                            setIsSortOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-custom-primary border rounded-lg transition-colors"
                        style={{ borderColor: "var(--color-primary-light)" }}
                    >
                        <span>{selectedCategory}</span>
                        <HiChevronDown
                            className={cn(
                                "w-4 h-4 transition-transform",
                                isCategoryOpen && "rotate-180"
                            )}
                        />
                    </button>

                    {isCategoryOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsCategoryOpen(false)}
                            />
                            <div className="absolute left-0 mt-2 w-48 bg-custom-primary border border-custom-secondary rounded-lg shadow-lg z-20">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() => {
                                            onCategoryChange?.(category);
                                            setIsCategoryOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-2 text-sm hover:bg-custom-hover transition-colors",
                                            selectedCategory === category && "bg-custom-hover"
                                        )}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Store Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            setIsStoreOpen(!isStoreOpen);
                            setIsCategoryOpen(false);
                            setIsSortOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-custom-primary border rounded-lg transition-colors"
                        style={{ borderColor: "var(--color-primary-light)" }}
                    >
                        <span>{selectedStore}</span>
                        <HiChevronDown
                            className={cn(
                                "w-4 h-4 transition-transform",
                                isStoreOpen && "rotate-180"
                            )}
                        />
                    </button>

                    {isStoreOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsStoreOpen(false)}
                            />
                            <div className="absolute left-0 mt-2 w-48 bg-custom-primary border border-custom-secondary rounded-lg shadow-lg z-20">
                                {stores.map((store) => (
                                    <button
                                        key={store}
                                        type="button"
                                        onClick={() => {
                                            onStoreChange?.(store);
                                            setIsStoreOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-2 text-sm hover:bg-custom-hover transition-colors",
                                            selectedStore === store && "bg-custom-hover"
                                        )}
                                    >
                                        {store}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Free Delivery Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={freeDeliveryOnly}
                        onChange={(e) => onFreeDeliveryToggle?.(e.target.checked)}
                        className="w-4 h-4 text-custom-accent border-custom-secondary rounded focus:ring-custom-accent"
                    />
                    <span className="text-sm text-custom-secondary">
                        {t("product.filters.freeDeliveryOnly")}
                    </span>
                </label>

                {/* In Stock Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => onInStockToggle?.(e.target.checked)}
                        className="w-4 h-4 text-custom-accent border-custom-secondary rounded focus:ring-custom-accent"
                    />
                    <span className="text-sm text-custom-secondary">{t("product.filters.inStockOnly")}</span>
                </label>

                {/* Sort Dropdown */}
                <div className="relative ml-auto">
                    <button
                        type="button"
                        onClick={() => {
                            setIsSortOpen(!isSortOpen);
                            setIsCategoryOpen(false);
                            setIsStoreOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-custom-primary border rounded-lg transition-colors"
                        style={{ borderColor: "var(--color-primary-light)" }}
                    >
                        <span>{t("product.filters.sortBy")} {sortBy}</span>
                        <HiChevronDown
                            className={cn(
                                "w-4 h-4 transition-transform",
                                isSortOpen && "rotate-180"
                            )}
                        />
                    </button>

                    {isSortOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsSortOpen(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-custom-primary border border-custom-secondary rounded-lg shadow-lg z-20">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onSortChange?.(option.label);
                                            setIsSortOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-2 text-sm hover:bg-custom-hover transition-colors",
                                            sortBy === option.label && "bg-custom-hover"
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
