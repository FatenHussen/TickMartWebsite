import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { _ScheduledBasketApi } from "../api/scheduledBasketApi";
import type { UpdateScheduledBasketPayload } from "../types/scheduledBasket";

export function useScheduledBaskets(page?: number) {
  return useQuery({
    queryKey: queryKeys.scheduledBaskets.list(page),
    queryFn: () => _ScheduledBasketApi.getScheduledBaskets(page),
    select: (response) => response.data,
  });
}

export function useScheduledBasketDetails(id: number | string) {
  return useQuery({
    queryKey: queryKeys.scheduledBaskets.details(id),
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
        queryKey: queryKeys.scheduledBaskets.details(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.scheduledBaskets.list(),
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
        queryKey: queryKeys.scheduledBaskets.all(),
      });
    },
  });
}
