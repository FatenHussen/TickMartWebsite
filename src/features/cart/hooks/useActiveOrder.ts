import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { _OrderApi } from "../api/orderApi";

export function useActiveOrder(enabled = true) {
  return useQuery({
    queryKey: queryKeys.orders.active(),
    enabled,
    queryFn: () => _OrderApi.getActiveOrder(),
    staleTime: 1000 * 60,
  });
}
