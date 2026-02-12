import { useState, useCallback, useMemo } from "react";
import type {
  UsePaginationOptions,
  UsePaginationReturn,
} from "../types/pagination";

/**
 * Custom hook for managing pagination state
 *
 * @example
 * ```tsx
 * const { currentPage, setCurrentPage, pageSize, nextPage, previousPage } = usePagination({
 *   initialPage: 1,
 *   initialPageSize: 10,
 *   totalPages: 5,
 * });
 * ```
 */
export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const {
    initialPage = 1,
    initialPageSize = 10,
    totalPages = 1,
    onPageChange,
    onPageSizeChange,
  } = options;

  const [currentPage, setCurrentPageState] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  // Memoized values
  const canGoPrevious = useMemo(() => currentPage > 1, [currentPage]);
  const canGoNext = useMemo(
    () => currentPage < totalPages,
    [currentPage, totalPages]
  );

  // Set current page with validation and callback
  const setCurrentPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPageState(validPage);
      onPageChange?.(validPage);
    },
    [totalPages, onPageChange]
  );

  // Set page size with callback
  const setPageSize = useCallback(
    (size: number) => {
      setPageSizeState(size);
      setCurrentPageState(1); // Reset to first page when page size changes
      onPageSizeChange?.(size);
      onPageChange?.(1);
    },
    [onPageSizeChange, onPageChange]
  );

  // Go to next page
  const nextPage = useCallback(() => {
    if (canGoNext) {
      setCurrentPage(currentPage + 1);
    }
  }, [canGoNext, currentPage, setCurrentPage]);

  // Go to previous page
  const previousPage = useCallback(() => {
    if (canGoPrevious) {
      setCurrentPage(currentPage - 1);
    }
  }, [canGoPrevious, currentPage, setCurrentPage]);

  // Jump to specific page
  const jumpToPage = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  // Reset to first page
  const reset = useCallback(() => {
    setCurrentPage(1);
  }, [setCurrentPage]);

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    nextPage,
    previousPage,
    jumpToPage,
    canGoNext,
    canGoPrevious,
    reset,
  };
}

/**
 * Utility function to generate page numbers for pagination display
 *
 * @example
 * ```tsx
 * generatePageNumbers(10, 5) // Returns: [1, "...", 4, 5, 6, "...", 10]
 * generatePageNumbers(5, 3)  // Returns: [1, 2, 3, 4, 5]
 * ```
 */
export function generatePageNumbers(
  totalPages: number,
  currentPage: number
): (number | string)[] {
  if (totalPages <= 7) {
    // Show all pages if total is 7 or less
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];

  // Always show first page
  pages.push(1);

  // Calculate range around current page
  const showEllipsisStart = currentPage > 3;
  const showEllipsisEnd = currentPage < totalPages - 2;

  if (showEllipsisStart) {
    pages.push("...");
  }

  // Show pages around current page
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }

  if (showEllipsisEnd) {
    pages.push("...");
  }

  // Always show last page
  if (!pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
}

/**
 * Calculate the range of items being displayed
 *
 * @example
 * ```tsx
 * getItemsRange(2, 10, 100) // Returns: { start: 11, end: 20 }
 * ```
 */
export function getItemsRange(
  currentPage: number,
  pageSize: number,
  totalItems: number
): { start: number; end: number } {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return { start, end };
}
