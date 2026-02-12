import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useBrandDetails, useBrandProducts } from "../hooks/useBrands";
import { useSectionsByPosition } from "@/features/home/hooks/useSections";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import FullBleedSection from "@/shared/component/FullBleedSection";
import BrandHeader from "../components/BrandHeader";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import ProductCardSkeleton from "@/shared/component/skeleton/ProductCardSkeleton";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import type { Product } from "../types";
import type { BrandProduct } from "../types/brand";

export default function BrandProducts() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { brandId } = useParams<{ brandId: string }>();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [selectedStore, setSelectedStore] = useState("All stores");
  const [freeDeliveryOnly, setFreeDeliveryOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("Best match");
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<BrandProduct[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Fetch brand details and products
  const {
    data: brandData,
    isLoading: isBrandLoading,
    error: brandError,
  } = useBrandDetails(Number(brandId));

  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError,
  } = useBrandProducts(Number(brandId), currentPage);

  // Accumulate products from all pages
  useEffect(() => {
    if (productsData?.items) {
      setAllProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newProducts = productsData.items.filter(
          (p) => !existingIds.has(p.id)
        );
        return [...prev, ...newProducts];
      });

      setHasMore(
        productsData.pagination.current_page < productsData.pagination.last_page
      );
    }
  }, [productsData]);

  // Infinite scroll
  const observerTarget = useInfiniteScroll({
    onLoadMore: () => setCurrentPage((prev) => prev + 1),
    hasMore,
    isLoading: isProductsLoading,
    threshold: 300,
  });

  // Fetch sections for brand_details page
  const { beforeSections, afterSections } =
    useSectionsByPosition("brand_details");

  // Separate banner sections (display_type_id: 1) from other sections
  const bannerSections = beforeSections.filter((s) => s.display_type_id === 1);
  const otherBeforeSections = beforeSections.filter(
    (s) => s.display_type_id !== 1
  );

  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
  };

  const handleToggleFavorite = (id: number) => {
    // TODO: Toggle favorite
    console.log("Toggle favorite:", id);
  };

  // Convert BrandProduct to Product type for ProductGrid
  const convertToProducts = (items: any[] = []): Product[] => {
    return items.map((item) => ({
      id: item.id,
      name: item.name,
      price: `$${item.price_after_discount}`,
      originalPrice:
        item.price > item.price_after_discount ? `$${item.price}` : undefined,
      rating: item.rating || 0,
      image: item.image,
      badge: item.budges?.map((badge: any) => ({
        label: badge.name,
        className: badge.color,
      })),
      category: item.category,
      sold: item.sold_number,
      savings: item.amount_saved > 0 ? `$${item.amount_saved}` : undefined,
    }));
  };

  const products = convertToProducts(allProducts);

  // Show initial loading state (only for first load)
  if (isBrandLoading && !brandData) {
    return (
      <div className="min-h-screen bg-custom-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-light" />
      </div>
    );
  }

  // Show error state
  if (brandError || productsError) {
    return (
      <div className="min-h-screen bg-custom-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-custom-secondary text-lg">
            {t("brands.failedToLoad")}
          </p>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!brandData) {
    return (
      <div className="min-h-screen bg-custom-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-custom-secondary text-lg">
            {t("brands.notFound")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom-primary" dir={isRTL ? "rtl" : "ltr"}>
      {/* Banner Sections - Full Width (display_type_id: 1) - BEFORE main content */}
      {bannerSections.length > 0 && (
        <div className="w-full">
          <ApiSectionsRenderer sections={bannerSections} />
        </div>
      )}

      <div className="page-container py-6">
        {/* Other Sections before brand content */}
        {otherBeforeSections.length > 0 && (
          <FullBleedSection>
            <ApiSectionsRenderer sections={otherBeforeSections} />
          </FullBleedSection>
        )}

        {/* Brand Header */}
        <div className="mb-6">
          <BrandHeader brand={brandData} />
        </div>

        {/* Product Filters */}
        <div className="mb-6">
          <ProductFilters
            location="Downtown, Cairo"
            categories={["All categories"]}
            stores={["All stores"]}
            selectedCategory={selectedCategory}
            selectedStore={selectedStore}
            onCategoryChange={setSelectedCategory}
            onStoreChange={setSelectedStore}
            freeDeliveryOnly={freeDeliveryOnly}
            inStockOnly={inStockOnly}
            onFreeDeliveryToggle={setFreeDeliveryOnly}
            onInStockToggle={setInStockOnly}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Product Grid */}
        <div className="mb-6">
          {products.length > 0 && (
            <ProductGrid
              products={products}
              onProductClick={handleProductClick}
              onToggleFavorite={handleToggleFavorite}
              columns={5}
            />
          )}

          {/* Show skeleton loaders while loading more */}
          {isProductsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <ProductCardSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isProductsLoading && products.length === 0 && (
            <div className="flex items-center justify-center h-64 bg-custom-secondary rounded-2xl">
              <p className="text-custom-secondary">
                {t("brands.noProductsFound")}
              </p>
            </div>
          )}

          {/* Infinite scroll trigger */}
          <div ref={observerTarget} className="h-10" />
        </div>

        {/* Sections after brand content */}
        {afterSections.length > 0 && (
          <FullBleedSection>
            <ApiSectionsRenderer sections={afterSections} />
          </FullBleedSection>
        )}
      </div>
    </div>
  );
}
