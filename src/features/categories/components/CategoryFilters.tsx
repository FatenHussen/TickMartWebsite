import { useState, useEffect } from"react";
import { useTranslation } from"react-i18next";
import { cn } from"@/shared/lib/utils";
import type { CategoriesApiDarkSurface } from"../lib/categoriesApiDarkSurface";

export type CategoryTypeFilter ="new"|"most_popular"|"top_rated"| undefined;

type CategoryFiltersProps = {
 typeFilter?: CategoryTypeFilter;
 onTypeFilterChange?: (type: CategoryTypeFilter) => void;
 minPrice?: number;
 maxPrice?: number;
 onPriceChange?: (price: { minPrice?: number; maxPrice?: number }) => void;
 apiSurface?: CategoriesApiDarkSurface | null;
};

const TYPE_OPTIONS: { value: CategoryTypeFilter; labelKey: string }[] = [
 { value: undefined, labelKey:"categories.typeAll"},
 { value:"new", labelKey:"categories.typeNew"},
 { value:"most_popular", labelKey:"categories.typeMostPopular"},
 { value:"top_rated", labelKey:"categories.typeTopRated"},
];

export default function CategoryFilters({
 typeFilter,
 onTypeFilterChange,
 minPrice,
 maxPrice,
 onPriceChange,
 apiSurface,
}: CategoryFiltersProps) {
 const { t } = useTranslation();
 const [localType, setLocalType] = useState<CategoryTypeFilter>(typeFilter ?? undefined);
 const [localMinPrice, setLocalMinPrice] = useState<string>(minPrice?.toString() ??"");
 const [localMaxPrice, setLocalMaxPrice] = useState<string>(maxPrice?.toString() ??"");

 useEffect(() => {
 setLocalType(typeFilter ?? undefined);
 }, [typeFilter]);
 useEffect(() => {
 setLocalMinPrice(minPrice?.toString() ??"");
 }, [minPrice]);
 useEffect(() => {
 setLocalMaxPrice(maxPrice?.toString() ??"");
 }, [maxPrice]);

 const handleApply = () => {
 onTypeFilterChange?.(localType);
 onPriceChange?.({
 minPrice: localMinPrice.trim() ===""? undefined : Number(localMinPrice),
 maxPrice: localMaxPrice.trim() ===""? undefined : Number(localMaxPrice),
 });
 };

 const handleReset = () => {
 setLocalType(undefined);
 setLocalMinPrice("");
 setLocalMaxPrice("");
 onTypeFilterChange?.(undefined);
 onPriceChange?.({ minPrice: undefined, maxPrice: undefined });
 };

 return (
 <div
 className={cn(
"space-y-5 p-4 sm:p-5",
 !apiSurface &&
 "rounded-2xl border border-primary-light/15 bg-gradient-to-b from-white via-blue-50/35 to-blue-100/20",
 )}
 style={apiSurface ? { color: apiSurface.mutedColor } : undefined}
 >
 <h3
 className={cn("text-base font-bold", !apiSurface && "text-custom-primary")}
 style={apiSurface ? { color: apiSurface.pageColor } : undefined}
 >
 {t("categories.filters","Filters")}
 </h3>

 {/* Category Type */}
 <section className="space-y-3">
 <p
 className={cn("text-sm font-semibold", !apiSurface && "text-custom-primary")}
 style={apiSurface ? { color: apiSurface.pageColor } : undefined}
 >
 {t("categories.typeFilter","Category Type")}
 </p>
 <div className="space-y-2">
 {TYPE_OPTIONS.map((opt) => (
 <label
 key={opt.value ??"all"}
 className={cn(
"flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition",
 !apiSurface &&
 "border-primary-light/10 bg-white hover:border-primary-light/25 hover:bg-blue-50/40",
 )}
 style={
 apiSurface
 ? {
 borderColor: apiSurface.cardBorder,
 backgroundColor: `color-mix(in srgb, ${apiSurface.cardBackground} 70%, #020617)`,
 }
 : undefined
 }
 >
 <input
 type="radio"
 name="categoryType"
 checked={localType === opt.value}
 onChange={() => setLocalType(opt.value)}
 className="h-4 w-4 border-custom-secondary text-primary-light focus:ring-primary-light"
 />
 <span
 className={cn(!apiSurface && "text-custom-secondary")}
 style={apiSurface ? { color: apiSurface.mutedColor } : undefined}
 >
 {t(opt.labelKey, opt.value === undefined ?"All": opt.value ==="new"?"New": opt.value ==="most_popular"?"Most popular":"Top rated")}
 </span>
 </label>
 ))}
 </div>
 </section>

 {/* Price Range */}
 <section
 className={cn("space-y-3 border-t pt-4", !apiSurface && "border-primary-light/10")}
 style={apiSurface ? { borderColor: apiSurface.cardBorder } : undefined}
 >
 <p
 className={cn("text-sm font-semibold", !apiSurface && "text-custom-primary")}
 style={apiSurface ? { color: apiSurface.pageColor } : undefined}
 >
 {t("categories.priceRange","Price range")}
 </p>
 <div className="grid grid-cols-2 gap-2.5">
 <input
 type="number"
 min={0}
 value={localMinPrice}
 onChange={(e) => setLocalMinPrice(e.target.value)}
 placeholder={t("baskets.min","Min")}
 className={cn(
"h-11 w-full rounded-xl border px-3 text-sm outline-none transition focus:ring-2",
 !apiSurface &&
 "border-primary-light/20 bg-white text-custom-primary focus:border-primary-light/50 focus:ring-primary-light/20",
 )}
 style={
 apiSurface
 ? {
 borderColor: apiSurface.cardBorder,
 backgroundColor: `color-mix(in srgb, ${apiSurface.cardBackground} 55%, #020617)`,
 color: apiSurface.pageColor,
 }
 : undefined
 }
 />
 <input
 type="number"
 min={0}
 value={localMaxPrice}
 onChange={(e) => setLocalMaxPrice(e.target.value)}
 placeholder={t("baskets.max","Max")}
 className={cn(
"h-11 w-full rounded-xl border px-3 text-sm outline-none transition focus:ring-2",
 !apiSurface &&
 "border-primary-light/20 bg-white text-custom-primary focus:border-primary-light/50 focus:ring-primary-light/20",
 )}
 style={
 apiSurface
 ? {
 borderColor: apiSurface.cardBorder,
 backgroundColor: `color-mix(in srgb, ${apiSurface.cardBackground} 55%, #020617)`,
 color: apiSurface.pageColor,
 }
 : undefined
 }
 />
 </div>
 </section>

 {/* Action Buttons */}
 <div className="space-y-2.5 pt-1">
 <button
 onClick={handleApply}
 className={cn(
"h-11 w-full rounded-xl text-sm font-semibold shadow-sm transition hover:opacity-90",
 !apiSurface && "bg-gradient-to-r from-amber-400 via-primary-light to-blue-500 text-white",
 )}
 style={
 apiSurface
 ? {
 background: `linear-gradient(90deg, ${apiSurface.main}, ${apiSurface.second})`,
 color: "#fafafa",
 }
 : undefined
 }
 >
 {t("categories.applyFilters","Apply filters")}
 </button>
 <button
 type="button"
 onClick={handleReset}
 className={cn(
"h-11 w-full rounded-xl border text-sm font-semibold transition",
 !apiSurface &&
 "border-primary-light/20 bg-white/80 text-primary-light hover:bg-blue-50",
 )}
 style={
 apiSurface
 ? {
 borderColor: apiSurface.cardBorder,
 backgroundColor: `color-mix(in srgb, ${apiSurface.cardBackground} 50%, transparent)`,
 color: apiSurface.pageColor,
 }
 : undefined
 }
 >
 {t("categories.reset","Reset")}
 </button>
 </div>
 </div>
 );
}
