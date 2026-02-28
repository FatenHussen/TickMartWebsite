import { useQuery } from "@tanstack/react-query";
import { _ShopApi } from "../api/shopApi";
import { queryKeys } from "@/utils/queryKeys";
import type { ShopsListResponse } from "../types/shop";

export type ShopsFilters = {
  page?: number;
  type?: "top_rated" | "offers" | "nearby";
  lat?: number;
  lng?: number;
};

export function useShops(filters?: ShopsFilters) {
  return useQuery<ShopsListResponse["data"]>({
    queryKey: queryKeys.shop.list(filters),
    queryFn: async () => {
      const response = await _ShopApi.getShops(filters);
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
