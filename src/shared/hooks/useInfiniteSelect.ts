import { useCallback, useMemo } from "react";
import {
  useInfiniteQuery,
  type QueryKey,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;
}

export interface UseInfiniteSelectOptions<T> {
  queryKey: QueryKey;
  fetchFn: (page: number) => Promise<PaginatedData<T>>;
  mapToOption: (item: T) => SelectOption;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export interface UseInfiniteSelectReturn<T = unknown> {
  options: SelectOption[];
  items: T[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  handleScroll: (event: React.UIEvent<HTMLElement>) => void;
}

const SCROLL_THRESHOLD = 50;

/**
 * Generic hook for infinite-scroll inside Select / dropdown components.
 *
 * Uses `useInfiniteQuery` under the hood. Pages are merged automatically,
 * duplicate requests are prevented by React Query, and a `handleScroll`
 * handler is provided to attach to the scrollable container.
 */
export function useInfiniteSelect<T>({
  queryKey,
  fetchFn,
  mapToOption,
  enabled = true,
  staleTime,
  gcTime,
}: UseInfiniteSelectOptions<T>): UseInfiniteSelectReturn<T> {
  const infiniteQueryOptions: UseInfiniteQueryOptions<
    PaginatedData<T>,
    Error,
    { pages: PaginatedData<T>[]; pageParams: unknown[] },
    QueryKey,
    number
  > = {
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
  };

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(infiniteQueryOptions);

  const items = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.items ?? []);
  }, [data?.pages]);

  const options = useMemo(() => {
    return items.map(mapToOption);
  }, [items, mapToOption]);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const isNearBottom =
        scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD;

      if (isNearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  return {
    options,
    items,
    isLoading,
    isFetchingNextPage: !!isFetchingNextPage,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    handleScroll,
  };
}
