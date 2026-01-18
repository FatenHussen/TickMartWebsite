import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import CategoriesLayout from "../layout/CategoriesLayout";
import Breadcrumbs from "../components/Breadcrumbs";
import NestedSubcategoriesSidebar from "../components/NestedSubcategoriesSidebar";
import CategoryHeader from "../components/CategoryHeader";
import ProductsGrid from "@/shared/component/ProductsGrid";
import {
  categories,
  nestedSubcategories,
  categoryProducts,
} from "../data/mockData";

export default function CategoryDetails() {
  const { isRTL } = useLanguage();
  const { categoryId } = useParams<{ categoryId: string }>();
  const categoryIdNum = categoryId ? parseInt(categoryId, 10) : 1;

  const category = useMemo(
    () => categories.find((c) => c.id === categoryIdNum) || categories[0],
    [categoryIdNum]
  );

  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    number | undefined
  >(undefined);

  const currentSubcategories = useMemo(
    () => nestedSubcategories[category.id] || [],
    [category.id]
  );

  const currentProducts = useMemo(
    () => categoryProducts[category.id] || [],
    [category.id]
  );

  const breadcrumbs = [
    { label: "Home", path: "/home" },
    { label: "Categories", path: "/categories" },
    { label: category.name },
  ];

  const sidebar = (
    <NestedSubcategoriesSidebar
      subcategories={currentSubcategories}
      selectedSubcategoryId={selectedSubcategoryId}
      onSubcategorySelect={setSelectedSubcategoryId}
    />
  );

  return (
    <div className="bg-custom-primary" dir={isRTL ? "rtl" : "ltr"}>
      <CategoryHeader
        category={category}
        onViewAllProducts={() => console.log("View all products")}
        onViewAllStores={() => console.log("View all stores")}
      />
      <CategoriesLayout sidebar={sidebar} sidebarPosition="left">
        <div className="space-y-8">
          <Breadcrumbs items={breadcrumbs} />

          <div className="bg-custom-primary rounded-2xl border border-custom-primary shadow-sm p-6 sm:p-8 space-y-10">
            {/* <PopularStoresSection
              stores={currentStores}
              onStoreClick={(id) => console.log("Store clicked:", id)}
            /> */}

            <ProductsGrid
              products={currentProducts}
              onProductClick={(id) => console.log("Product clicked:", id)}
              onLoadMore={() => console.log("Load more products")}
              hasMore={true}
            />
          </div>
        </div>
      </CategoriesLayout>
    </div>
  );
}
