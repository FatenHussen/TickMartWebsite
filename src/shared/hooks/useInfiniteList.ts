import { useMemo } from"react";
import {
 useInfiniteQuery,
 type QueryKey,
} from"@tanstack/react-query";
import { useInfiniteScroll } from"./useInfiniteScroll";
import type { PaginatedData } from"./useInfiniteSelect";

export interface UseInfiniteListOptions<T> {
 queryKey: QueryKey;
 fetchFn: (page: number) => Promise<PaginatedData<T>>;
 enabled?: boolean;
 staleTime?: number;
 gcTime?: number;
 threshold?: number;
 /** IntersectionObserver root (e.g. scrollable container). Defaults to viewport. */
 root?: Element | null;
}

export function useInfiniteList<T>({
 queryKey,
 fetchFn,
 enabled = true,
 staleTime,
 gcTime,
 threshold = 300,
 root = null,
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

 const totalCount = data?.pages[0]?.pagination?.total ?? items.length;

 const observerTarget = useInfiniteScroll({
 onLoadMore: fetchNextPage,
 hasMore: !!hasNextPage,
 isLoading: isLoading || isFetchingNextPage,
 threshold,
 enabled: items.length > 0,
 root,
 });

 return {
 items,
 observerTarget,
 isLoading,
 isFetchingNextPage,
 hasNextPage: !!hasNextPage,
 totalCount,
 fetchNextPage,
 error,
 };
}
