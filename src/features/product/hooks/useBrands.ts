import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { _BrandApi } from "../api/brandApi";

/**
 * Hook to fetch all brands with pagination
 */
export function useBrands(page?: number) {
  return useQuery({
    queryKey: queryKeys.brands.list(page),
    queryFn: () => _BrandApi.getBrands(page),
    select: (response) => response.data,
  });
}

/**
 * Hook to fetch brand details by ID
 */
export function useBrandDetails(brandId: number | string) {
  return useQuery({
    queryKey: queryKeys.brands.details(brandId),
    queryFn: () => _BrandApi.getBrandDetails(brandId),
    select: (response) => response.data,
    enabled: !!brandId,
  });
}

/**
 * Hook to fetch products for a specific brand
 */
export function useBrandProducts(brandId: number, page?: number) {
  return useQuery({
    queryKey: queryKeys.brands.products(brandId, page),
    queryFn: () => _BrandApi.getBrandProducts(brandId, page),
    select: (response) => response.data,
    enabled: !!brandId,
  });
}
