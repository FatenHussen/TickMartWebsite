import { useQuery } from"@tanstack/react-query";
import { _OrdersApi } from"../api/ordersApi";
import { queryKeys } from"@/utils/queryKeys";
import type { OrderDetailData } from"../types/order";

export function useOrderDetail(
 orderId: number | string | null
): {
 data: OrderDetailData | undefined;
 isLoading: boolean;
 error: Error | null;
 refetch: () => void;
} {
 const { data, isLoading, error, refetch } = useQuery({
 queryKey: queryKeys.orders.details(orderId ?? 0),
 queryFn: () => _OrdersApi.getOrderById(orderId!),
 enabled: orderId != null && orderId !=="",
 staleTime: 1000 * 60,
 });

 return {
 data,
 isLoading,
 error: error as Error | null,
 refetch,
 };
}
