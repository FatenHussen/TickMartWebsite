import { useQuery } from "@tanstack/react-query";
import { _ShopApi } from "../api/shopApi";
import { queryKeys } from "@/utils/queryKeys";
import type { ShopListItem } from "../types/shop";

export function useShops(page?: number) {
  return useQuery<ShopListItem[]>({
    queryKey: queryKeys.shop.list(page),
    queryFn: async () => {
      const response = await _ShopApi.getShops(page);
      return response.data.items;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
