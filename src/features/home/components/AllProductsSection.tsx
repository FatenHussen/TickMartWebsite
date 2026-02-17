import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useBrands } from "@/features/product/hooks/useBrands";
import { useShops } from "@/features/store/hooks/useShops";
import { useAuthStore } from "@/store/auth";
import { useFavorites, useToggleFavorite } from "@/features/account/hooks/useFavorites";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import ProductCard from "@/shared/component/card/ProductCard";
import ProductCardSkeleton from "@/shared/component/skeleton/ProductCardSkeleton";
import { paths } from "@/app/routes/path/paths";
import type { ProductItem } from "../types";

// Badge color mapping
const badgeColorMap: Record<string, string> = {
  success: "bg-green-500 text-white",
  warning: "bg-yellow-500 text-white",
  danger: "bg-red-500 text-white",
  info: "bg-blue-500 text-white",
};

export default function AllProductsSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState<number | undefined>();
  const [brandFilter, setBrandFilter] = useState<number | undefined>();
  const [shopFilter, setShopFilter] = useState<number | undefined>();

  // Fetch filters data
  const { data: categories = [] } = useCategories();
  const { data: brandsData } = useBrands(1);
  const { data: shops = [] } = useShops();
  
  const brands = brandsData?.items || [];

  // Fetch products with filters
  const { products, isLoading, isFetching, hasMore, loadMore, currentPage } = useProducts({
    category_id: categoryFilter,
    brand_id: brandFilter,
    shop_id: shopFilter,
  });

  console.log("[AllProductsSection] State:", {
    productsCount: products.length,
    isLoading,
    isFetching,
    hasMore,
    currentPage,
  });

  // Infinite scroll
  const observerTarget = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading: isFetching,
    threshold: 500,
  });

  const { authenticated } = useAuthStore();
  const { data: favoriteProducts = [] } = useFavorites("product", !!authenticated);
  const toggleFavorite = useToggleFavorite();
  const favoriteIds = favoriteProducts.map((f) => f.id);

  const handleProductClick = (id: number) => {
    navigate(paths.client.productDetails(id));
  };

  const handleToggleFavorite = (id: number) => {
    toggleFavorite.mutate({ type: "product", id });
  };

  // Convert product to ProductCard props
  const convertProductToCardProps = (product: ProductItem) => {
    const badges = product.budges?.map((b) => ({
      label: b.name,
      className: badgeColorMap[b.color || "info"] || "bg-blue-500 text-white",
    }));

    return {
      id: product.id,
      name: product.name,
      price: `£${product.price_after_discount.toFixed(2)}`,
      originalPrice:
        product.price > product.price_after_discount
          ? `£${product.price.toFixed(2)}`
          : undefined,
      rating: product.rating || 0,
      image: product.image,
      badge: badges && badges.length > 0 ? badges : undefined,
      category: product.category,
      sold: product.sold_number,
      savings:
        product.amount_saved > 0
          ? `${t("product.youSaved", "You saved")} £${product.amount_saved.toFixed(2)}`
          : undefined,
      deliveryInfo: t("home.freeDelivery", "Free Delivery"),
      isFavorite: favoriteIds.includes(product.id),
      onClick: handleProductClick,
      onToggleFavorite: handleToggleFavorite,
      t,
    };
  };

  return (
    <section className="py-8 bg-white dark:bg-gray-900">
      <div className="page-container">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t("home.allProducts", "All Products")}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t(
              "home.allProductsDescription",
              "Browse all products from different stores and brands in one place."
            )}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 items-end">
          {/* Category Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("categories.categories", "Category")}
            </label>
            <select
              value={categoryFilter || ""}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="">{t("categories.allCategories", "All Categories")}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("brands.title", "Brand")}
            </label>
            <select
              value={brandFilter || ""}
              onChange={(e) =>
                setBrandFilter(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="">{t("brands.allBrands", "All Brands")}</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Shop Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("store.store", "Store")}
            </label>
            <select
              value={shopFilter || ""}
              onChange={(e) =>
                setShopFilter(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="">{t("store.allStores", "All Stores")}</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading && products.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  {...convertProductToCardProps(product)}
                />
              ))}
            </div>

            {/* Loading more skeleton */}
            {isFetching && products.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <ProductCardSkeleton key={`loading-${index}`} />
                ))}
              </div>
            )}

            {/* Infinite scroll trigger */}
            {hasMore && (
              <div 
                ref={observerTarget} 
                className="h-20 w-full flex items-center justify-center"
                style={{ minHeight: '80px' }}
              >
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {/* Invisible trigger element */}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <p className="text-gray-500 dark:text-gray-400">
              {t("home.noProductsFound", "No products found")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
