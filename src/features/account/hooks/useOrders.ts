import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
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

export interface UseOrdersInfiniteResult {
  data: OrderListItem[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  error: Error | null;
  refetch: () => void;
}

export function useOrdersInfinite(): UseOrdersInfiniteResult {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: queryKeys.orders.listInfinite(),
    queryFn: async ({ pageParam }) => {
      const res = await _OrdersApi.getOrders(pageParam as number);
      return res;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination =
        lastPage.data?.pagination ??
        (lastPage as { pagination?: OrdersListPagination }).pagination;
      if (!pagination) return undefined;
      const { current_page, last_page } = pagination;
      if (current_page == null || last_page == null) return undefined;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    staleTime: 1000 * 60,
  });

  const items =
    data?.pages.flatMap(
      (p) => (p as { data?: { items?: OrderListItem[] }; items?: OrderListItem[] }).data?.items ?? (p as { items?: OrderListItem[] }).items ?? [],
    ) ?? [];

  return {
    data: items,
    isLoading,
    isFetchingNextPage: !!isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    fetchNextPage,
    error: error as Error | null,
    refetch,
  };
}
