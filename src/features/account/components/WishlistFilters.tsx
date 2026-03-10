import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { HiChevronDown } from "react-icons/hi";
import { useInfiniteList } from "@/shared/hooks/useInfiniteList";
import { _ShopApi } from "@/features/store/api/shopApi";
import type { ShopListItem } from "@/features/store/types/shop";
import type { FavoriteType } from "../types";

export type WishlistTypeFilter = "all" | FavoriteType;

const WISHLIST_TYPE_OPTIONS: { value: WishlistTypeFilter; labelKey: string }[] = [
  { value: "all", labelKey: "wishlist.all" },
  { value: "product", labelKey: "wishlist.products" },
  { value: "recipe", labelKey: "wishlist.recipes" },
  { value: "brand", labelKey: "wishlist.brands" },
  { value: "shop", labelKey: "wishlist.shops" },
  { value: "vendor", labelKey: "wishlist.vendors" },
  { value: "basket", labelKey: "wishlist.baskets" },
];

const SELECT_CLASS =
  "appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 pe-10 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer";

type WishlistFiltersProps = {
  selectedType: WishlistTypeFilter;
  onTypeChange: (type: WishlistTypeFilter) => void;
  /** shop id from /user/shops, or "all" */
  selectedShopId: number | "all";
  onShopChange: (shopId: number | "all") => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onClearFilters: () => void;
  showTypeFilter?: boolean;
};

export default function WishlistFilters({
  selectedType,
  onTypeChange,
  selectedShopId,
  onShopChange,
  categories,
  selectedCategory,
  onCategoryChange,
  onClearFilters,
  showTypeFilter = true,
}: WishlistFiltersProps) {
  const { t } = useTranslation();

  const hasActiveFilters =
    (showTypeFilter && selectedType !== "all") ||
    selectedShopId !== "all" ||
    selectedCategory !== "all";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {showTypeFilter && (
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value as WishlistTypeFilter)}
              className={SELECT_CLASS}
            >
              {WISHLIST_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
            <HiChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        )}

        <ShopsFilterDropdown
          selectedShopId={selectedShopId}
          onShopChange={onShopChange}
        />

        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="all">{t("wishlist.allCategories")}</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <HiChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors shrink-0"
        >
          {t("wishlist.clearFilters")}
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ShopsFilterDropdown — custom dropdown backed by useInfiniteList
// ---------------------------------------------------------------------------

type ShopsFilterDropdownProps = {
  selectedShopId: number | "all";
  onShopChange: (shopId: number | "all") => void;
};

function ShopsFilterDropdown({ selectedShopId, onShopChange }: ShopsFilterDropdownProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { items: shops, observerTarget, isLoading, isFetchingNextPage } =
    useInfiniteList<ShopListItem>({
      queryKey: ["shops", "wishlist-filter"],
      fetchFn: async (page) => {
        const res = await _ShopApi.getShops({ page });
        return {
          items: res.data.items,
          pagination: res.data.pagination,
        };
      },
      enabled: true,
      staleTime: 1000 * 60 * 5,
    });

  const selectedShop = shops.find((s) => s.id === selectedShopId);

  const handleSelect = useCallback(
    (shopId: number | "all") => {
      onShopChange(shopId);
      setOpen(false);
    },
    [onShopChange]
  );

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const displayLabel =
    selectedShopId === "all"
      ? t("wishlist.allStores")
      : (selectedShop?.name ?? t("wishlist.allStores"));

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger — matches the same look as native <select> */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors min-w-[140px] cursor-pointer"
      >
        <span className="flex-1 text-start truncate">{displayLabel}</span>
        <HiChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown list */}
      {open && (
        <div className="absolute top-full mt-1 start-0 z-50 min-w-[180px] max-h-56 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1">
          {/* "All stores" option */}
          <button
            type="button"
            onClick={() => handleSelect("all")}
            className={`w-full text-start px-4 py-2 text-sm transition-colors hover:bg-primary/10 ${
              selectedShopId === "all"
                ? "text-primary font-semibold"
                : "text-gray-700 dark:text-gray-200"
            }`}
          >
            {t("wishlist.allStores")}
          </button>

          {/* Shop options */}
          {shops.map((shop) => (
            <button
              key={shop.id}
              type="button"
              onClick={() => handleSelect(shop.id)}
              className={`w-full text-start px-4 py-2 text-sm transition-colors hover:bg-primary/10 ${
                selectedShopId === shop.id
                  ? "text-primary font-semibold"
                  : "text-gray-700 dark:text-gray-200"
              }`}
            >
              {shop.name}
            </button>
          ))}

          {/* Loading skeletons */}
          {(isLoading || isFetchingNextPage) && (
            <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 animate-pulse">
              {t("common.loading", "Loading…")}
            </div>
          )}

          {/* IntersectionObserver sentinel */}
          <div ref={observerTarget} className="h-1" />
        </div>
      )}
    </div>
  );
}
