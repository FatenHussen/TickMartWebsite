import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "../lib/utils";
import type { PaginationProps } from "../types/pagination";
import { generatePageNumbers, getItemsRange } from "../hooks/usePagination";

/**
 * Shared Pagination Component
 *
 * Supports two modes:
 * - Simple: Previous/Next buttons with "Page X of Y" text
 * - Numbered: Clickable page numbers with Previous/Next buttons
 *
 * @example Simple Mode
 * ```tsx
 * <Pagination
 *   pagination={{ current_page: 1, last_page: 10, per_page: 10, total: 100 }}
 *   onPageChange={(page) => console.log(page)}
 *   mode="simple"
 * />
 * ```
 *
 * @example Numbered Mode with all features
 * ```tsx
 * <Pagination
 *   pagination={data.pagination}
 *   onPageChange={handlePageChange}
 *   mode="numbered"
 *   showPageSize
 *   showJumpTo
 *   showTotalItems
 *   pageSizeOptions={[10, 20, 50]}
 *   onPageSizeChange={handlePageSizeChange}
 * />
 * ```
 */
export default function Pagination({
  pagination,
  onPageChange,
  mode = "simple",
  showPageSize = false,
  showJumpTo = false,
  showTotalItems = false,
  pageSizeOptions = [10, 20, 50],
  onPageSizeChange,
  className,
  disabled = false,
}: PaginationProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [jumpToValue, setJumpToValue] = useState("");

  const { current_page, last_page, per_page, total } = pagination;

  // Don't render if only one page and no additional features
  if (last_page <= 1 && !showPageSize && !showTotalItems) {
    return null;
  }

  const canGoPrevious = current_page > 1;
  const canGoNext = current_page < last_page;

  const handlePrevious = () => {
    if (canGoPrevious && !disabled) {
      onPageChange(current_page - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext && !disabled) {
      onPageChange(current_page + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (!disabled && page !== current_page) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    onPageSizeChange?.(newSize);
  };

  const handleJumpToPage = () => {
    const page = parseInt(jumpToValue);
    if (page >= 1 && page <= last_page && !disabled) {
      onPageChange(page);
      setJumpToValue("");
    }
  };

  const handleJumpToKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleJumpToPage();
    }
  };

  // Calculate items range for "Showing X-Y of Z"
  const { start, end } = getItemsRange(current_page, per_page, total);

  // Generate page numbers for numbered mode
  const pageNumbers =
    mode === "numbered" ? generatePageNumbers(last_page, current_page) : [];

  // Button base styles
  const buttonBaseStyles = cn(
    "flex items-center justify-center px-3 py-2 rounded-lg font-medium transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
  );

  const navigationButtonStyles = cn(
    buttonBaseStyles,
    "border border-custom-secondary bg-custom-primary text-custom-primary",
    !disabled && "hover:bg-blue-50"
  );

  const pageNumberStyles = (isActive: boolean) =>
    cn(
      buttonBaseStyles,
      "min-w-[2.5rem]",
      isActive
        ? "bg-primary text-white"
        : cn(
            "bg-custom-primary text-custom-primary border border-custom-secondary",
            !disabled && "hover:bg-blue-50"
          )
    );

  return (
    <div
      className={cn("flex flex-col gap-4", className)}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Top Row: Page Size Selector & Total Items Display */}
      {(showPageSize || showTotalItems) && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Page Size Selector */}
          {showPageSize && onPageSizeChange && (
            <div className="flex items-center gap-2">
              <label
                htmlFor="pageSize"
                className="text-sm text-custom-secondary"
              >
                {t("pagination.itemsPerPage")}:
              </label>
              <select
                id="pageSize"
                value={per_page}
                onChange={handlePageSizeChange}
                disabled={disabled}
                className={cn(
                  "px-3 py-2 rounded-lg border border-custom-secondary",
                  "bg-custom-primary text-custom-primary text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-primary",
                  disabled && "cursor-not-allowed opacity-50"
                )}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Total Items Display */}
          {showTotalItems && (
            <p className="text-sm text-custom-secondary">
              {t("pagination.showing")} {start}-{end} {t("pagination.of")}{" "}
              {total} {t("pagination.items")}
            </p>
          )}
        </div>
      )}

      {/* Main Pagination Row */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={!canGoPrevious || disabled}
          className={cn(
            navigationButtonStyles,
            (!canGoPrevious || disabled) && "opacity-50 cursor-not-allowed"
          )}
          aria-label={t("pagination.previous")}
        >
          {isRTL ? (
            <>
              <span className="text-sm">{t("pagination.previous")}</span>
              <HiChevronRight className="w-5 h-5" />
            </>
          ) : (
            <>
              <HiChevronLeft className="w-5 h-5" />
              <span className="text-sm">{t("pagination.previous")}</span>
            </>
          )}
        </button>

        {/* Simple Mode: Page X of Y */}
        {mode === "simple" && (
          <p className="text-sm text-custom-secondary px-4">
            {t("pagination.page")} {current_page} {t("pagination.of")}{" "}
            {last_page}
          </p>
        )}

        {/* Numbered Mode: Page Numbers */}
        {mode === "numbered" && (
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-custom-secondary"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageClick(page as number)}
                  disabled={disabled}
                  className={pageNumberStyles(page === current_page)}
                  aria-label={`${t("pagination.page")} ${page}`}
                  aria-current={page === current_page ? "page" : undefined}
                >
                  {page}
                </button>
              )
            )}
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!canGoNext || disabled}
          className={cn(
            navigationButtonStyles,
            (!canGoNext || disabled) && "opacity-50 cursor-not-allowed"
          )}
          aria-label={t("pagination.next")}
        >
          {isRTL ? (
            <>
              <HiChevronLeft className="w-5 h-5" />
              <span className="text-sm">{t("pagination.next")}</span>
            </>
          ) : (
            <>
              <span className="text-sm">{t("pagination.next")}</span>
              <HiChevronRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Jump to Page */}
        {showJumpTo && (
          <div className="flex items-center gap-2 ml-4">
            <label htmlFor="jumpTo" className="text-sm text-custom-secondary">
              {t("pagination.jumpTo")}:
            </label>
            <input
              id="jumpTo"
              type="number"
              min="1"
              max={last_page}
              value={jumpToValue}
              onChange={(e) => setJumpToValue(e.target.value)}
              onKeyPress={handleJumpToKeyPress}
              disabled={disabled}
              className={cn(
                "w-16 px-2 py-2 rounded-lg border border-custom-secondary",
                "bg-custom-primary text-custom-primary text-sm text-center",
                "focus:outline-none focus:ring-2 focus:ring-primary",
                disabled && "cursor-not-allowed opacity-50"
              )}
              placeholder="..."
            />
            <button
              onClick={handleJumpToPage}
              disabled={disabled}
              className={cn(
                buttonBaseStyles,
                "bg-primary text-white text-sm",
                !disabled && "hover:bg-primary/90"
              )}
            >
              {t("pagination.go")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
