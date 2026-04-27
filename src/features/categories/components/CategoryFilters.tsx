import { useState, useEffect } from"react";
import { useTranslation } from"react-i18next";

export type CategoryTypeFilter ="new"|"most_popular"|"top_rated"| undefined;

type CategoryFiltersProps = {
 typeFilter?: CategoryTypeFilter;
 onTypeFilterChange?: (type: CategoryTypeFilter) => void;
 minPrice?: number;
 maxPrice?: number;
 onPriceChange?: (price: { minPrice?: number; maxPrice?: number }) => void;
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
 <div className="space-y-5 rounded-2xl border border-primary-light/15 bg-gradient-to-b from-white via-blue-50/35 to-blue-100/20 p-4 sm:p-5">
 <h3 className="text-base font-bold text-custom-primary">
 {t("categories.filters","Filters")}
 </h3>

 {/* Category Type */}
 <section className="space-y-3">
 <p className="text-sm font-semibold text-custom-primary">
 {t("categories.typeFilter","Category Type")}
 </p>
 <div className="space-y-2">
 {TYPE_OPTIONS.map((opt) => (
 <label
 key={opt.value ??"all"}
 className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border border-primary-light/10 bg-white px-3 py-2.5 text-sm transition hover:border-primary-light/25 hover:bg-blue-50/40"
 >
 <input
 type="radio"
 name="categoryType"
 checked={localType === opt.value}
 onChange={() => setLocalType(opt.value)}
 className="h-4 w-4 border-custom-secondary text-primary-light focus:ring-primary-light"
 />
 <span className="text-custom-secondary">
 {t(opt.labelKey, opt.value === undefined ?"All": opt.value ==="new"?"New": opt.value ==="most_popular"?"Most popular":"Top rated")}
 </span>
 </label>
 ))}
 </div>
 </section>

 {/* Price Range */}
 <section className="space-y-3 border-t border-primary-light/10 pt-4">
 <p className="text-sm font-semibold text-custom-primary">
 {t("categories.priceRange","Price range")}
 </p>
 <div className="grid grid-cols-2 gap-2.5">
 <input
 type="number"
 min={0}
 value={localMinPrice}
 onChange={(e) => setLocalMinPrice(e.target.value)}
 placeholder={t("baskets.min","Min")}
 className="h-11 w-full rounded-xl border border-primary-light/20 bg-white px-3 text-sm text-custom-primary outline-none transition focus:border-primary-light/50 focus:ring-2 focus:ring-primary-light/20"
 />
 <input
 type="number"
 min={0}
 value={localMaxPrice}
 onChange={(e) => setLocalMaxPrice(e.target.value)}
 placeholder={t("baskets.max","Max")}
 className="h-11 w-full rounded-xl border border-primary-light/20 bg-white px-3 text-sm text-custom-primary outline-none transition focus:border-primary-light/50 focus:ring-2 focus:ring-primary-light/20"
 />
 </div>
 </section>

 {/* Action Buttons */}
 <div className="space-y-2.5 pt-1">
 <button
 onClick={handleApply}
 className="h-11 w-full rounded-xl bg-gradient-to-r from-amber-400 via-primary-light to-blue-500 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
 >
 {t("categories.applyFilters","Apply filters")}
 </button>
 <button
 type="button"
 onClick={handleReset}
 className="h-11 w-full rounded-xl border border-primary-light/20 bg-white/80 text-sm font-semibold text-primary-light transition hover:bg-blue-50"
 >
 {t("categories.reset","Reset")}
 </button>
 </div>
 </div>
 );
}
