import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { _ProductsApi } from "../api/products.service";
import { _CategoriesApi } from "../api/categories.service";
import { _BrandApi } from "@/features/product/api/brandApi";
import { _ShopApi } from "@/features/store/api/shopApi";
import { useInfiniteSelect } from "@/shared/hooks/useInfiniteSelect";
import { useInfiniteList } from "@/shared/hooks/useInfiniteList";
import type { Category } from "../types";
import type { ProductItem } from "../types";
import type { BrandListItem } from "@/features/product/types/brand";
import type { ShopListItem } from "@/features/store/types/shop";
import { useToggleFavorite } from "@/features/account/hooks/useFavorites";
import ProductCard from "@/shared/component/card/ProductCard";
import ProductCardSkeleton from "@/shared/component/skeleton/ProductCardSkeleton";
import { paths } from "@/app/routes/path/paths";

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

  const {
    options: categoryOptions,
    handleScroll: handleCatScroll,
    isFetchingNextPage: isFetchingMoreCats,
  } = useInfiniteSelect<Category>({
    queryKey: ["categories", "select"],
    fetchFn: async (page) => {
      const res = await _CategoriesApi.getCategories(page);
      return res.data;
    },
    mapToOption: (cat) => ({ value: cat.id, label: cat.name }),
  });

  const {
    options: brandOptions,
    handleScroll: handleBrandScroll,
    isFetchingNextPage: isFetchingMoreBrands,
  } = useInfiniteSelect<BrandListItem>({
    queryKey: ["brands", "select"],
    fetchFn: async (page) => {
      const res = await _BrandApi.getBrands({ page });
      return res.data;
    },
    mapToOption: (brand) => ({ value: brand.id, label: brand.name }),
  });

  const {
    options: shopOptions,
    handleScroll: handleShopScroll,
    isFetchingNextPage: isFetchingMoreShops,
  } = useInfiniteSelect<ShopListItem>({
    queryKey: ["shops", "select"],
    fetchFn: async (page) => {
      const res = await _ShopApi.getShops({ page });
      return res.data;
    },
    mapToOption: (shop) => ({ value: shop.id, label: shop.name }),
  });

  const filters = {
    ...(categoryFilter ? { category_id: categoryFilter } : {}),
    ...(brandFilter ? { brand_id: brandFilter } : {}),
    ...(shopFilter ? { shop_id: shopFilter } : {}),
  };

  const {
    items: products,
    observerTarget,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteList<ProductItem>({
    queryKey: ["products", "list", "infinite", filters],
    fetchFn: (page) =>
      _ProductsApi.getProducts({ ...filters, page }).then((r) => r.data),
    threshold: 500,
  });

  const toggleFavorite = useToggleFavorite();

  const handleProductClick = (id: number) => {
    navigate(paths.client.productDetails(id));
  };

  const handleToggleFavorite = (id: number) => {
    toggleFavorite.mutate({ type: "product", id });
  };

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
      isFavorite: product.is_favorite ?? false,
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
              onScroll={handleCatScroll}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="">{t("categories.allCategories", "All Categories")}</option>
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
              {isFetchingMoreCats && (
                <option value="" disabled>{t("common.loading")}</option>
              )}
            </select>
          </div>

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
              onScroll={handleBrandScroll}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="">{t("brands.allBrands", "All Brands")}</option>
              {brandOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
              {isFetchingMoreBrands && (
                <option value="" disabled>{t("common.loading")}</option>
              )}
            </select>
          </div>

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
              onScroll={handleShopScroll}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="">{t("store.allStores", "All Stores")}</option>
              {shopOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
              {isFetchingMoreShops && (
                <option value="" disabled>{t("common.loading")}</option>
              )}
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

            {isFetchingNextPage && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <ProductCardSkeleton key={`loading-${index}`} />
                ))}
              </div>
            )}

            {hasNextPage && (
              <div
                ref={observerTarget}
                className="h-20 w-full"
              />
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
