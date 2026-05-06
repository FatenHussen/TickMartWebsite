import { useState, useRef, useEffect, useCallback } from"react";
import { useTranslation } from"react-i18next";
import { HiChevronDown } from"react-icons/hi";
import { useInfiniteList } from"@/shared/hooks/useInfiniteList";
import { _ShopApi } from"@/features/store/api/shopApi";
import type { ShopListItem } from"@/features/store/types/shop";
import type { FavoriteType } from"../types";

export type WishlistTypeFilter ="all"| FavoriteType;

const WISHLIST_TYPE_OPTIONS: { value: WishlistTypeFilter; labelKey: string }[] = [
 { value:"all", labelKey:"wishlist.all"},
 { value:"product", labelKey:"wishlist.products"},
 { value:"recipe", labelKey:"wishlist.recipes"},
 { value:"brand", labelKey:"wishlist.brands"},
 { value:"shop", labelKey:"wishlist.shops"},
 { value:"vendor", labelKey:"wishlist.vendors"},
 { value:"basket", labelKey:"wishlist.baskets"},
];

const SELECT_CLASS =
    "appearance-none cursor-pointer rounded-lg border border-custom-primary bg-custom-card px-4 py-2.5 pe-10 text-sm text-custom-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(255,255,255,0.04)] dark:text-[#FFFFFF] dark:focus:border-[color-mix(in_srgb,var(--color-main)_40%,transparent)] dark:focus:ring-[color-mix(in_srgb,var(--color-main)_25%,transparent)]";

type WishlistFiltersProps = {
 selectedType: WishlistTypeFilter;
 onTypeChange: (type: WishlistTypeFilter) => void;
 /** shop id from /user/shops, or"all"*/
 selectedShopId: number |"all";
 onShopChange: (shopId: number |"all") => void;
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
 (showTypeFilter && selectedType !=="all") ||
 selectedShopId !=="all"||
 selectedCategory !=="all";

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
 <HiChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-custom-tertiary dark:text-[#71717A]"/>
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
 <HiChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-custom-tertiary dark:text-[#71717A]"/>
 </div>
 </div>

 {hasActiveFilters && (
 <button
 type="button"
 onClick={onClearFilters}
 className="shrink-0 text-sm font-medium text-primary transition-colors duration-200 hover:text-primary/80 dark:text-[color-mix(in_srgb,var(--color-main)_78%,#FFFFFF)] dark:hover:text-[color-mix(in_srgb,var(--color-main)_92%,#FFFFFF)]"
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
 selectedShopId: number |"all";
 onShopChange: (shopId: number |"all") => void;
};

function ShopsFilterDropdown({ selectedShopId, onShopChange }: ShopsFilterDropdownProps) {
 const { t } = useTranslation();
 const [open, setOpen] = useState(false);
 const containerRef = useRef<HTMLDivElement>(null);

 const { items: shops, observerTarget, isLoading, isFetchingNextPage } =
 useInfiniteList<ShopListItem>({
 queryKey: ["shops","wishlist-filter"],
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
 (shopId: number |"all") => {
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
 selectedShopId ==="all"
 ? t("wishlist.allStores")
 : (selectedShop?.name ?? t("wishlist.allStores"));

 return (
 <div ref={containerRef} className="relative">
 {/* Trigger — matches the same look as native <select> */}
 <button
 type="button"
 onClick={() => setOpen((v) => !v)}
 className="flex min-w-[140px] cursor-pointer items-center gap-2 rounded-lg border border-custom-primary bg-custom-card px-4 py-2.5 text-sm text-custom-primary transition-colors duration-200 hover:border-primary/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(255,255,255,0.04)] dark:text-[#FFFFFF] dark:hover:border-[color-mix(in_srgb,var(--color-main)_28%,transparent)] dark:focus:ring-[color-mix(in_srgb,var(--color-main)_22%,transparent)]"
 >
 <span className="flex-1 text-start truncate">{displayLabel}</span>
 <HiChevronDown
 className={`w-4 h-4 text-custom-tertiary shrink-0 transition-transform duration-200 ${open ?"rotate-180":""}`}
 />
 </button>

 {/* Dropdown list */}
 {open && (
 <div className="absolute start-0 top-full z-50 mt-1 max-h-56 min-w-[180px] overflow-y-auto rounded-lg border border-custom-primary bg-custom-card py-1 shadow-lg dark:border-[rgba(255,255,255,0.08)] dark:bg-[rgba(16,17,20,0.96)] dark:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.65)] dark:backdrop-blur-xl">
 {/*"All stores"option */}
 <button
 type="button"
 onClick={() => handleSelect("all")}
 className={`w-full px-4 py-2 text-start text-sm transition-colors hover:bg-primary/10 dark:hover:bg-[color-mix(in_srgb,var(--color-main)_10%,transparent)] ${
 selectedShopId ==="all"
 ?"font-semibold text-primary dark:text-[color-mix(in_srgb,var(--color-main)_85%,#FFFFFF)]"
 :"text-custom-primary dark:text-[#E4E4E7]"
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
 className={`w-full px-4 py-2 text-start text-sm transition-colors hover:bg-primary/10 dark:hover:bg-[color-mix(in_srgb,var(--color-main)_10%,transparent)] ${
 selectedShopId === shop.id
 ?"font-semibold text-primary dark:text-[color-mix(in_srgb,var(--color-main)_85%,#FFFFFF)]"
 :"text-custom-primary dark:text-[#E4E4E7]"
 }`}
 >
 {shop.name}
 </button>
 ))}

 {/* Loading skeletons */}
 {(isLoading || isFetchingNextPage) && (
 <div className="px-4 py-2 text-xs text-custom-tertiary animate-pulse">
 {t("common.loading","Loading…")}
 </div>
 )}

 {/* IntersectionObserver sentinel */}
 <div ref={observerTarget} className="h-1"/>
 </div>
 )}
 </div>
 );
}
