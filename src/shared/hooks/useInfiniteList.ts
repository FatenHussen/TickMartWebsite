import { useMemo } from "react";
import {
  useInfiniteQuery,
  type QueryKey,
} from "@tanstack/react-query";
import { useInfiniteScroll } from "./useInfiniteScroll";
import type { PaginatedData } from "./useInfiniteSelect";

export interface UseInfiniteListOptions<T> {
  queryKey: QueryKey;
  fetchFn: (page: number) => Promise<PaginatedData<T>>;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  threshold?: number;
}

export function useInfiniteList<T>({
  queryKey,
  fetchFn,
  enabled = true,
  staleTime,
  gcTime,
  threshold = 300,
}: UseInfiniteListOptions<T>) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchFn(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination) return undefined;
      const { current_page, last_page } = lastPage.pagination;
      if (current_page == null || last_page == null) return undefined;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    enabled,
    staleTime,
    gcTime,
  });

  const items: T[] = useMemo(
    () => data?.pages.flatMap((p) => p.items ?? []) ?? [],
    [data?.pages]
  );

  const observerTarget = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoading: isLoading || isFetchingNextPage,
    threshold,
    enabled: items.length > 0,
  });

  return {
    items,
    observerTarget,
    isLoading,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    fetchNextPage,
    error,
  };
}
