import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useSearchParams } from "react-router-dom";
import StoreLayout from "../layout/StoreLayout";
import SearchFilters, {
    type SearchFilterState,
} from "../components/SearchFilters";
import ProductsGrid from "@/shared/component/ProductsGrid";
import { categoryProducts } from "@/features/categories/data/mockData";
import { cn } from "@/shared/lib/utils";

export default function SearchResults() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "women dress";

    const [, setFilters] = useState<SearchFilterState>({
        category: "women",
        subcategories: [],
        sizes: [],
        colors: [],
        minPrice: "",
        maxPrice: "",
        ratings: [],
        offers: [],
    });
    const [activeFilterTab, setActiveFilterTab] = useState<string>("onSale");
    const [sortBy, setSortBy] = useState<string>("bestMatch");

    // Mock products - replace with actual filtered data
    const products = categoryProducts[1] || [];

    const filterTabs = [
        { id: "onSale", label: "On Sale" },
        { id: "newArrivals", label: t("store.newArrivals") || "New Arrivals" },
        { id: "bestRated", label: "Best Rated" },
        { id: "freeDelivery", label: t("home.freeDelivery") || "Free Delivery" },
    ];

    const sortOptions = [
        { id: "bestMatch", label: "Best Match" },
        { id: "priceLow", label: t("categories.sortPriceLow") },
        { id: "priceHigh", label: t("categories.sortPriceHigh") },
        { id: "rating", label: t("categories.sortRating") },
        { id: "newest", label: t("categories.sortNewest") },
    ];

    const handleFiltersChange = (newFilters: SearchFilterState) => {
        setFilters(newFilters);
        // Apply filters logic here
        console.log("Filters changed:", newFilters);
    };

    return (
        <div className="bg-custom-primary" dir={isRTL ? "rtl" : "ltr"}>
            <StoreLayout
                sidebar={<SearchFilters onFiltersChange={handleFiltersChange} />}
                sidebarPosition="left"
            >
                <div className="space-y-6">
                    {/* Results Header */}
                    <div className="text-sm text-text-secondary">
                        1-20 of 1,250 results for"{query}"
                    </div>

                    {/* Filter Tabs and Sort */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {/* Filter Tabs */}
                        <div className="flex flex-wrap gap-2">
                            {filterTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveFilterTab(tab.id)}
                                    className={cn(
                                        "store-tab-pill px-4 py-2 rounded-full text-sm font-medium",
                                        activeFilterTab === tab.id && "is-active"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Sort Option */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-text-secondary">
                                {t("categories.sortBy") || "Sort by"}:
                            </span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="store-input px-3 py-2 rounded-lg text-sm"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="store-results-card p-6 sm:p-8 rounded-2xl">
                        <ProductsGrid
                            products={products}
                            onProductClick={(id) => console.log("Product clicked:", id)}
                            onLoadMore={() => console.log("Load more products")}
                            hasMore={true}
                            displayCount={20}
                            showHeader={false}
                        />
                    </div>
                </div>
            </StoreLayout>
        </div>
    );
}
