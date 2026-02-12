import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { _ProductsApi, type ProductsFilters } from "../api/products.service";
import { queryKeys } from "@/utils/queryKeys";
import type { ProductItem } from "../types";

export function useProducts(filters?: {
  category_id?: number;
  brand_id?: number;
  shop_id?: number;
}) {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const isLoadingMoreRef = useRef(false);

  const queryFilters: ProductsFilters = {
    ...filters,
    page: currentPage,
  };

  const {
    data: productsData,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: [
      "products",
      "list",
      filters?.category_id,
      filters?.brand_id,
      filters?.shop_id,
      currentPage,
    ],
    queryFn: () => _ProductsApi.getProducts(queryFilters),
    enabled: true,
  });

  // Reset products when filters change
  useEffect(() => {
    setAllProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    
    // Invalidate queries to ensure fresh data is fetched
    queryClient.invalidateQueries({
      queryKey: [
        "products",
        "list",
        filters?.category_id,
        filters?.brand_id,
        filters?.shop_id,
      ],
    });
  }, [filters?.category_id, filters?.brand_id, filters?.shop_id, queryClient]);

  // Accumulate products from all pages
  useEffect(() => {
    if (productsData?.data?.items) {
      setAllProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newProducts = productsData.data.items.filter(
          (p) => !existingIds.has(p.id)
        );
        return [...prev, ...newProducts];
      });

      const pagination = productsData.data.pagination;
      const hasMoreItems = pagination.current_page < pagination.last_page;
      console.log("[useProducts] Pagination:", {
        currentPage: pagination.current_page,
        lastPage: pagination.last_page,
        hasMore: hasMoreItems,
        totalProducts: allProducts.length + productsData.data.items.length,
      });
      setHasMore(hasMoreItems);
    }
  }, [productsData, allProducts.length]);

  const loadMore = useCallback(() => {
    console.log("[useProducts] loadMore called:", {
      hasMore,
      isFetching,
      currentPage,
      isLoadingMore: isLoadingMoreRef.current,
    });
    
    // Prevent multiple simultaneous loads
    if (isLoadingMoreRef.current) {
      console.log("[useProducts] Already loading, skipping");
      return;
    }
    
    if (hasMore && !isFetching) {
      console.log("[useProducts] Loading page:", currentPage + 1);
      isLoadingMoreRef.current = true;
      setCurrentPage((prev) => prev + 1);
      
      // Reset flag after a short delay
      setTimeout(() => {
        isLoadingMoreRef.current = false;
      }, 1000);
    }
  }, [hasMore, isFetching, currentPage]);

  return {
    products: allProducts,
    isLoading: isLoading && allProducts.length === 0,
    isFetching,
    error,
    hasMore,
    loadMore,
    currentPage,
  };
}
