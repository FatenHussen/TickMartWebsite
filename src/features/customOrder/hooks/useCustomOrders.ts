import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { customOrderApi } from "../api/customOrderApi";
import type { CreateCustomOrderPayload, CustomOrderListParams } from "../types";

export function useCustomOrders(params?: CustomOrderListParams) {
  return useQuery({
    queryKey: queryKeys.customOrderRequests.list(params),
    queryFn: () => customOrderApi.list(params),
  });
}

export function useCustomOrderDetails(id: number | string | undefined) {
  return useQuery({
    queryKey: queryKeys.customOrderRequests.details(id),
    queryFn: () => customOrderApi.details(id!),
    enabled: id != null && id !== "",
  });
}

export function useCreateCustomOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCustomOrderPayload) => customOrderApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customOrderRequests.all() });
    },
  });
}

export function useApproveCustomOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => customOrderApi.approve(id),
    onSuccess: (_res, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customOrderRequests.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.customOrderRequests.details(id),
      });
    },
  });
}

export function useCancelCustomOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => customOrderApi.cancel(id),
    onSuccess: (_res, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customOrderRequests.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.customOrderRequests.details(id),
      });
    },
  });
}
