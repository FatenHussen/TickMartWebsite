import { useQuery } from "@tanstack/react-query";
import { _OrdersApi } from "../api/ordersApi";
import { queryKeys } from "@/utils/queryKeys";
import type { OrderListItem, OrdersListPagination } from "../types/order";

export interface UseOrdersResult {
  data: OrderListItem[];
  pagination: OrdersListPagination | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useOrders(page = 1): UseOrdersResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.orders.list(page),
    queryFn: async () => {
      const res = await _OrdersApi.getOrders(page);
      return res.data;
    },
    staleTime: 1000 * 60, // 1 minute
  });

  return {
    data: data?.items ?? [],
    pagination: data?.pagination ?? null,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
