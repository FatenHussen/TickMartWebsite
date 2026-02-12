import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { _BasketApi } from "../api/basketApi";

/**
 * Hook to fetch baskets with optional schedule filter
 * @param isSchedule - 0 for custom baskets, 1 for subscription baskets, undefined for all
 * @param page - Page number (optional)
 */
export function useBaskets(isSchedule?: 0 | 1, page?: number) {
  return useQuery({
    queryKey: queryKeys.baskets.list(isSchedule, page),
    queryFn: () => _BasketApi.getBaskets(isSchedule, page),
    select: (response) => response.data,
  });
}

/**
 * Hook to fetch basket details by ID
 */
export function useBasketDetails(basketId: number | string) {
  return useQuery({
    queryKey: queryKeys.baskets.details(basketId),
    queryFn: () => _BasketApi.getBasketDetails(basketId),
    select: (response) => response.data,
    enabled: !!basketId,
  });
}
