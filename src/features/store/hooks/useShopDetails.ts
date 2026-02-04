import { useQuery } from "@tanstack/react-query";
import { _ShopApi } from "../api/shopApi";
import { queryKeys } from "@/utils/queryKeys";

export function useShopDetails(shopId: number) {
  return useQuery({
    queryKey: ["shop", "details", shopId],
    queryFn: () => _ShopApi.getShopDetails(shopId),
    enabled: shopId > 0,
  });
}
