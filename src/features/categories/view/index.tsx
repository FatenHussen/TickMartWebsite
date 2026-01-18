import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CategoriesLayout from "../layout/CategoriesLayout";
import CategoriesSidebar from "../components/CategoriesSidebar";
import ProductsHeader from "../components/ProductsHeader";
import PromotionalBanners from "../components/PromotionalBanners";
import CategoryTopNav, {
  type CategoryNavItem,
} from "@/shared/component/CategoryTopNav";
import {
  categories,
  popularProducts,
  nestedSubcategories,
} from "../data/mockData";
import type { Category } from "../types";
import ProductCard from "@/shared/component/card/ProductCard";

export default function CategoriesView() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    categories[1] || categories[0] // Start with Grocery category (id: 2)
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    number | undefined
  >(1); // Fresh fruits
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("recommended");

  // Top nav categories (static design only) - Only translate static labels
  const topNavCategories: CategoryNavItem[] = [
    { id: 1, name: t("categories.fruits"), selected: true },
    { id: 2, name: t("categories.vegetables"), selected: false },
    { id: 3, name: t("categories.meat"), selected: false },
    { id: 4, name: t("categories.dairy"), selected: false },
    { id: 5, name: t("categories.snacks"), selected: false },
    { id: 6, name: t("categories.drinks"), selected: false },
  ];

  const currentSubcategories = useMemo(
    () => nestedSubcategories[selectedCategory.id] || [],
    [selectedCategory.id]
  );

  const currentProducts = useMemo(
    () => popularProducts[selectedCategory.id] || [],
    [selectedCategory.id]
  );

  const selectedSubcategory = useMemo(
    () => currentSubcategories.find((sc) => sc.id === selectedSubcategoryId),
    [currentSubcategories, selectedSubcategoryId]
  );

  const sidebar = (
    <CategoriesSidebar
      categories={categories}
      selectedCategoryId={selectedCategory.id}
      selectedSubcategoryId={selectedSubcategoryId}
      onCategorySelect={setSelectedCategory}
      onSubcategorySelect={setSelectedSubcategoryId}
    />
  );

  return (
    <div className="bg-custom-primary">
      <CategoriesLayout sidebar={sidebar} sidebarPosition="left">
        <div className="space-y-6">
          {/* Top Navigation - Category Pills (Static Design Only) */}
          <CategoryTopNav categories={topNavCategories} />

          {/* Main Content */}
          <div className="rounded-2xl p-6 sm:p-8">
            {/* Products Header Component */}
            <ProductsHeader
              categoryName={selectedCategory.name}
              subcategoryName={selectedSubcategory?.name}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  category={product.category}
                  sold={1238}
                  savings={
                    product.originalPrice || t("product.youSaved") + " $180"
                  }
                  deliveryInfo={t("home.freeDelivery")}
                  onClick={(id) => console.log("Product clicked:", id)}
                />
              ))}
            </div>

            {/* Promotional Banners */}
            <PromotionalBanners
              onBannerClick={(id) => console.log("Banner clicked:", id)}
            />
          </div>
        </div>
      </CategoriesLayout>
    </div>
  );
}
