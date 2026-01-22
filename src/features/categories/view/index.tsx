import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CategoriesLayout from "../layout/CategoriesLayout";
import CategoriesSidebar from "../components/CategoriesSidebar";
import ProductsHeader from "../components/ProductsHeader";
import PromotionalBanners from "../components/PromotionalBanners";
import HeroBanner from "../components/HeroBanner";
import ProductCard from "@/shared/component/card/ProductCard";
import { useCategories } from "../hooks/useCategories";
import { useProductsByCategory } from "../hooks/useProductsByCategory";
import type { ApiCategory, CategoryChild } from "../types";

// Badge color mapping
const badgeColorMap: Record<string, string> = {
  success: "bg-green-500 text-white",
  warning: "bg-yellow-400 text-black",
  danger: "bg-red-500 text-white",
};

export default function CategoriesView() {
  const { t } = useTranslation();

  // Selected state
  const [selectedCategory, setSelectedCategory] = useState<ApiCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<CategoryChild | null>(null);
  const [sortBy, setSortBy] = useState<string>("recommended");

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  // Fetch products by selected subcategory (or category if no subcategory)
  const categoryIdForProducts = selectedSubcategory?.id || selectedCategory?.id;
  const { data: productsData, isLoading: productsLoading } = useProductsByCategory(
    categoryIdForProducts
  );

  // Handle category selection
  const handleCategorySelect = (category: ApiCategory) => {
    setSelectedCategory(category);
    // Auto-select first subcategory if available
    if (category.children.length > 0) {
      setSelectedSubcategory(category.children[0]);
    } else {
      setSelectedSubcategory(null);
    }
  };

  // Handle subcategory selection
  const handleSubcategorySelect = (subcategory: CategoryChild) => {
    setSelectedSubcategory(subcategory);
  };

  // Auto-select first category on load
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      const firstCategoryWithChildren = categories.find((c) => c.children.length > 0) || categories[0];
      handleCategorySelect(firstCategoryWithChildren);
    }
  }, [categories, selectedCategory]);

  const sidebar = (
    <CategoriesSidebar
      categories={categories}
      selectedCategoryId={selectedCategory?.id}
      selectedSubcategoryId={selectedSubcategory?.id}
      onCategorySelect={handleCategorySelect}
      onSubcategorySelect={handleSubcategorySelect}
      isLoading={categoriesLoading}
    />
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <CategoriesLayout sidebar={sidebar} sidebarPosition="left">
        <div className="space-y-6">
          {/* Hero Banner */}
          <HeroBanner
            title={t("categories.springCollection", "Spring Collection 2024")}
            subtitle={t(
              "categories.discoverTrends",
              "Discover the latest trends in fashion. Up to 40% off on selected items."
            )}
            buttonText={t("categories.shopNow", "Shop Now")}
            onButtonClick={() => console.log("Shop now clicked")}
          />

          {/* Products Header */}
          <ProductsHeader
            categoryName={selectedCategory?.name || ""}
            subcategoryName={selectedSubcategory?.name}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Products Grid */}
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-80 animate-pulse"
                />
              ))}
            </div>
          ) : productsData?.items && productsData.items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {productsData.items.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={`£${product.price_after_discount.toFixed(2)}`}
                  originalPrice={
                    product.price > product.price_after_discount
                      ? `£${product.price.toFixed(2)}`
                      : undefined
                  }
                  rating={4.8}
                  image={product.image}
                  category={product.category}
                  savings={
                    product.amount_saved > 0
                      ? `${t("product.youSaved", "You saved")} £${product.amount_saved}`
                      : undefined
                  }
                  badge={
                    product.budges && product.budges.length > 0
                      ? product.budges.map((b) => ({
                          label: b.name,
                          className: badgeColorMap[b.color] || "bg-blue-500 text-white",
                        }))
                      : undefined
                  }
                  deliveryInfo={t("home.freeDelivery", "Free Delivery")}
                  onClick={(id) => console.log("Product clicked:", id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-white rounded-2xl">
              <p className="text-gray-500">
                {t("categories.noProducts", "No products found in this category")}
              </p>
            </div>
          )}

          {/* Promotional Banners */}
          <PromotionalBanners
            onBannerClick={(id) => console.log("Banner clicked:", id)}
          />
        </div>
      </CategoriesLayout>
    </div>
  );
}
