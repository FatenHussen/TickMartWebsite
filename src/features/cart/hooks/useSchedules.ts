import { useQuery } from "@tanstack/react-query";
import { schedulesApi } from "../api/schedulesApi";
import { queryKeys } from "@/utils/queryKeys";

export function useSchedules(page?: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.schedules.list(page),
    queryFn: () => schedulesApi.getSchedules(page),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const items = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;

  return {
    data,
    items,
    pagination,
    isLoading,
    error,
  };
}
