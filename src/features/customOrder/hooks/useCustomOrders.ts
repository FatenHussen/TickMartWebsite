import { useInfiniteQuery, useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { customOrderApi } from "../api/customOrderApi";
import { CUSTOM_ORDER_LIST_PAGE_SIZE } from "../constants";
import type {
  CreateCustomOrderPayload,
  CustomOrderListMeta,
  CustomOrderListParams,
  CustomOrderRequest,
} from "../types";

const COUNT_STATUSES = [
  "pending_pricing",
  "waiting_approval",
  "approved",
  "cancelled",
  "cancelled_by_admin",
] as const;

async function fetchListPage(
  status: string | undefined,
  page: number
): Promise<{ items: CustomOrderRequest[]; meta?: CustomOrderListMeta }> {
  const perPage = CUSTOM_ORDER_LIST_PAGE_SIZE;

  if (status === "cancelled") {
    const [userCancelled, adminCancelled] = await Promise.all([
      customOrderApi.list({ status: "cancelled", page, per_page: perPage }),
      customOrderApi.list({
        status: "cancelled_by_admin",
        page,
        per_page: perPage,
      }),
    ]);
    const seen = new Set<number>();
    const items = [...userCancelled.items, ...adminCancelled.items].filter(
      (item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      }
    );
    const lastPage = Math.max(
      userCancelled.meta?.last_page ?? 1,
      adminCancelled.meta?.last_page ?? 1
    );
    const total =
      (userCancelled.meta?.total ?? userCancelled.items.length) +
      (adminCancelled.meta?.total ?? adminCancelled.items.length);

    return {
      items,
      meta: {
        current_page: page,
        last_page: lastPage,
        per_page: perPage,
        total,
      },
    };
  }

  return customOrderApi.list({
    ...(status ? { status } : {}),
    page,
    per_page: perPage,
  });
}

export function useCustomOrders(params?: CustomOrderListParams) {
  return useQuery({
    queryKey: queryKeys.customOrderRequests.list(params),
    queryFn: () => customOrderApi.list(params),
  });
}

export function useCustomOrdersInfinite(status?: string) {
  const apiStatus = !status || status === "all" ? undefined : status;

  const query = useInfiniteQuery({
    queryKey: queryKeys.customOrderRequests.listInfinite(apiStatus),
    queryFn: ({ pageParam }) => fetchListPage(apiStatus, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.meta;
      if (meta?.last_page != null && meta.current_page != null) {
        return meta.current_page < meta.last_page
          ? meta.current_page + 1
          : undefined;
      }
      if (lastPage.items.length < CUSTOM_ORDER_LIST_PAGE_SIZE) return undefined;
      return (meta?.current_page ?? 1) + 1;
    },
    staleTime: 30_000,
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    ...query,
    items,
  };
}

export function useCustomOrderStatusCounts() {
  const queries = useQueries({
    queries: COUNT_STATUSES.map((status) => ({
      queryKey: queryKeys.customOrderRequests.list({
        status,
        page: 1,
        per_page: 1,
      }),
      queryFn: () =>
        customOrderApi.list({ status, page: 1, per_page: 1 }),
      staleTime: 60_000,
    })),
  });

  const totals: Partial<Record<(typeof COUNT_STATUSES)[number], number>> = {};
  COUNT_STATUSES.forEach((status, index) => {
    const result = queries[index];
    if (!result.isSuccess) return;
    const total = result.data.meta?.total ?? result.data.items.length;
    totals[status] = total;
  });

  const cancelled =
    totals.cancelled != null || totals.cancelled_by_admin != null
      ? (totals.cancelled ?? 0) + (totals.cancelled_by_admin ?? 0)
      : undefined;

  return {
    pending_pricing: totals.pending_pricing,
    waiting_approval: totals.waiting_approval,
    approved: totals.approved,
    cancelled,
    isPending: queries.some((query) => query.isPending),
  };
}

export function useCustomOrderDetails(id: number | string | undefined) {
  return useQuery({
    queryKey: queryKeys.customOrderRequests.details(id),
    queryFn: () => customOrderApi.details(id!),
    enabled: id != null && id !== "",
    refetchInterval: (query) =>
      query.state.data?.status === "pending_pricing" ? 12_000 : false,
    refetchOnWindowFocus: true,
  });
}

export function useCreateCustomOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCustomOrderPayload) =>
      customOrderApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customOrderRequests.all(),
      });
    },
  });
}

export function useApproveCustomOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => customOrderApi.approve(id),
    onSuccess: (_res, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customOrderRequests.all(),
      });
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.customOrderRequests.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.customOrderRequests.details(id),
      });
    },
  });
}
