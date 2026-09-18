import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { _OrdersApi } from "../api/ordersApi";
import { queryKeys } from "@/utils/queryKeys";
import type { OrderListItem, OrdersListPagination } from "../types/order";
import type { OrdersListPage } from "../utils/parseOrdersResponse";

export interface UseOrdersResult {
 data: OrderListItem[];
 pagination: OrdersListPagination | null;
 isLoading: boolean;
 error: Error | null;
 refetch: () => void;
}

function toApiStatus(status?: string): string | undefined {
 return status === "all" || !status
  ? undefined
  : status === "out_for_delivery"
    ? "out_delivery"
    : status;
}

export function useOrders(page = 1, status?: string): UseOrdersResult {
 const apiStatus = toApiStatus(status);

 const { data, isLoading, error, refetch } = useQuery({
 queryKey: queryKeys.orders.list(page),
 queryFn: () => _OrdersApi.getOrders(page, apiStatus),
 staleTime: 1000 * 60,
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

export function useOrdersInfinite(status?: string): UseOrdersInfiniteResult {
 const apiStatus = toApiStatus(status);

 const {
 data,
 isLoading,
 isFetchingNextPage,
 hasNextPage,
 fetchNextPage,
 error,
 refetch,
 } = useInfiniteQuery({
 queryKey: queryKeys.orders.listInfinite(apiStatus),
 queryFn: async ({ pageParam }) => _OrdersApi.getOrders(pageParam as number, apiStatus),
 initialPageParam: 1,
 getNextPageParam: (lastPage: OrdersListPage) => {
 const pagination = lastPage.pagination;
 if (!pagination) return undefined;
 const { current_page, last_page } = pagination;
 if (current_page == null || last_page == null) return undefined;
 return current_page < last_page ? current_page + 1 : undefined;
 },
 staleTime: 1000 * 60,
 });

 const items = Array.isArray(data?.pages)
  ? data.pages.flatMap((page) => (Array.isArray(page?.items) ? page.items : []))
  : [];

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
