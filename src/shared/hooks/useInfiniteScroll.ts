import { useEffect, useRef, useCallback } from "react";

/**
 * Options for useInfiniteScroll hook
 */
export interface UseInfiniteScrollOptions {
  /** Callback to load more data */
  onLoadMore: () => void;

  /** Whether there are more items to load */
  hasMore: boolean;

  /** Whether data is currently loading */
  isLoading: boolean;

  /** Distance from bottom to trigger load (in pixels) */
  threshold?: number;

  /** Root element for intersection observer (defaults to viewport) */
  root?: Element | null;

  /** Whether the hook is enabled */
  enabled?: boolean;
}

/**
 * Custom hook for infinite scroll functionality
 *
 * Triggers onLoadMore callback when user scrolls near the bottom of the page
 *
 * @example
 * ```tsx
 * const observerTarget = useInfiniteScroll({
 *   onLoadMore: () => setPage(page + 1),
 *   hasMore: currentPage < totalPages,
 *   isLoading: isLoading,
 *   threshold: 300,
 * });
 *
 * return (
 *   <div>
 *     {items.map(item => <ItemCard key={item.id} {...item} />)}
 *     <div ref={observerTarget} />
 *   </div>
 * );
 * ```
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 300,
  root = null,
  enabled = true,
}: UseInfiniteScrollOptions) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;

      console.log("[useInfiniteScroll] Observer triggered:", {
        isIntersecting: target.isIntersecting,
        hasMore,
        isLoading,
        enabled,
      });

      if (target.isIntersecting && hasMore && !isLoading && enabled) {
        console.log("[useInfiniteScroll] Calling onLoadMore");
        onLoadMore();
      }
    },
    [onLoadMore, hasMore, isLoading, enabled]
  );

  useEffect(() => {
    if (!enabled || !hasMore) return;

    const element = observerTarget.current;
    if (!element) return;

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const options: IntersectionObserverInit = {
      root,
      rootMargin: `${threshold}px`,
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    observerRef.current = observer;
    observer.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [handleObserver, threshold, root, enabled, hasMore]);

  return observerTarget;
}

/**
 * Alternative hook using scroll event (fallback for older browsers)
 *
 * @deprecated Use useInfiniteScroll instead (supports Intersection Observer)
 */
export function useInfiniteScrollLegacy({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 300,
  enabled = true,
}: Omit<UseInfiniteScrollOptions, "root">) {
  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      if (isLoading || !hasMore) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceFromBottom < threshold) {
        onLoadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onLoadMore, hasMore, isLoading, threshold, enabled]);
}
