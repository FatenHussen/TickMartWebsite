/**
 * Shared Pagination Types
 *
 * These types are used across the application for consistent pagination handling.
 */

/**
 * Standard pagination data structure from API responses
 */
export interface PaginationData {
 current_page: number;
 last_page: number;
 per_page: number;
 total: number;
}

/**
 * Pagination component mode
 */
export type PaginationMode ="simple"|"numbered";

/**
 * Props for the Pagination component
 */
export interface PaginationProps {
 /** Pagination data from API response */
 pagination: PaginationData;

 /** Callback when page changes */
 onPageChange: (page: number) => void;

 /** Display mode: simple (prev/next only) or numbered (with page numbers) */
 mode?: PaginationMode;

 /** Show page size selector dropdown */
 showPageSize?: boolean;

 /** Show jump to page input */
 showJumpTo?: boolean;

 /** Show total items display (Showing X-Y of Z) */
 showTotalItems?: boolean;

 /** Available page size options */
 pageSizeOptions?: number[];

 /** Callback when page size changes */
 onPageSizeChange?: (size: number) => void;

 /** Additional CSS classes */
 className?: string;

 /** Disable pagination controls */
 disabled?: boolean;
}

/**
 * Hook return type for usePagination
 */
export interface UsePaginationReturn {
 /** Current page number */
 currentPage: number;

 /** Set current page */
 setCurrentPage: (page: number) => void;

 /** Current page size */
 pageSize: number;

 /** Set page size */
 setPageSize: (size: number) => void;

 /** Go to next page */
 nextPage: () => void;

 /** Go to previous page */
 previousPage: () => void;

 /** Jump to specific page */
 jumpToPage: (page: number) => void;

 /** Check if can go to next page */
 canGoNext: boolean;

 /** Check if can go to previous page */
 canGoPrevious: boolean;

 /** Reset to first page */
 reset: () => void;
}

/**
 * Options for usePagination hook
 */
export interface UsePaginationOptions {
 /** Initial page number */
 initialPage?: number;

 /** Initial page size */
 initialPageSize?: number;

 /** Total number of pages */
 totalPages?: number;

 /** Callback when page changes */
 onPageChange?: (page: number) => void;

 /** Callback when page size changes */
 onPageSizeChange?: (size: number) => void;
}
