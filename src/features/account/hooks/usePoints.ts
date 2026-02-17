import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { pointsApi } from "../api/pointsApi";

export function usePointsSummary(enabled = true) {
  return useQuery({
    queryKey: queryKeys.points.summary(),
    enabled,
    queryFn: () => pointsApi.getSummary(),
    staleTime: 1000 * 60 * 2,
  });
}

export function usePointsTransactions(page = 1, enabled = true) {
  return useQuery({
    queryKey: queryKeys.points.transactions(page),
    enabled,
    queryFn: () => pointsApi.getTransactions(page),
    staleTime: 1000 * 60 * 2,
  });
}

export function usePointsExchangeOptions(enabled = true) {
  return useQuery({
    queryKey: queryKeys.points.exchangeOptions(),
    enabled,
    queryFn: () => pointsApi.getExchangeOptions(),
    staleTime: 1000 * 60 * 5,
  });
}
