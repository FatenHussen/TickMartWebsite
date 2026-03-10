import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { _ScheduledBasketApi } from "../api/scheduledBasketApi";
import type { UpdateScheduledBasketPayload } from "../types/scheduledBasket";
import { queryKeys } from "@/utils/queryKeys";

// Query keys defined locally to avoid stale module cache issues
const scheduledBasketsKeys = {
  all: () => ["scheduledBaskets"] as const,
  list: (page?: number) =>
    page !== undefined
      ? (["scheduledBaskets", "list", page] as const)
      : (["scheduledBaskets", "list"] as const),
  details: (id?: number | string) =>
    id !== undefined
      ? (["scheduledBaskets", "details", id] as const)
      : (["scheduledBaskets", "details"] as const),
};

export function useScheduledBaskets(page?: number) {
  return useQuery({
    queryKey: scheduledBasketsKeys.list(page),
    queryFn: () => _ScheduledBasketApi.getScheduledBaskets(page),
    select: (response) => response.data,
  });
}

export function useScheduledBasketDetails(id: number | string) {
  return useQuery({
    queryKey: scheduledBasketsKeys.details(id),
    queryFn: () => _ScheduledBasketApi.getScheduledBasketDetails(id),
    select: (response) => response.data,
    enabled: !!id,
  });
}

export function useUpdateScheduledBasket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: UpdateScheduledBasketPayload;
    }) => _ScheduledBasketApi.updateScheduledBasket(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: scheduledBasketsKeys.details(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: scheduledBasketsKeys.list(),
      });
    },
  });
}

export function useDeleteScheduledBasket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) =>
      _ScheduledBasketApi.deleteScheduledBasket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scheduledBasketsKeys.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.myBaskets.all(),
      });
    },
  });
}
