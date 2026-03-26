import { useState, useEffect } from"react";
import { useTranslation } from"react-i18next";

export type CategoryTypeFilter ="new"|"most_popular"|"top_rated"| undefined;

type CategoryFiltersProps = {
 typeFilter?: CategoryTypeFilter;
 onTypeFilterChange?: (type: CategoryTypeFilter) => void;
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
}: CategoryFiltersProps) {
 const { t } = useTranslation();
 const [localType, setLocalType] = useState<CategoryTypeFilter>(typeFilter ?? undefined);

 useEffect(() => {
 setLocalType(typeFilter ?? undefined);
 }, [typeFilter]);

 const handleApply = () => {
 onTypeFilterChange?.(localType);
 };

 const handleReset = () => {
 setLocalType(undefined);
 onTypeFilterChange?.(undefined);
 };

 return (
 <div className="space-y-5">
 <h3 className="text-base font-bold text-custom-primary">
 {t("categories.filters","Filters")}
 </h3>

 {/* Category Type - من وثائق Categories API */}
 <div>
 <p className="text-sm font-semibold text-custom-primary mb-2">
 {t("categories.typeFilter","Category Type")}
 </p>
 <div className="space-y-2">
 {TYPE_OPTIONS.map((opt) => (
 <label
 key={opt.value ??"all"}
 className="flex items-center gap-2 cursor-pointer"
 >
 <input
 type="radio"
 name="categoryType"
 checked={localType === opt.value}
 onChange={() => setLocalType(opt.value)}
 className="w-4 h-4 border-custom-secondary text-primary-light focus:ring-primary-light"
 />
 <span className="text-sm text-custom-secondary">
 {t(opt.labelKey, opt.value === undefined ?"All": opt.value ==="new"?"New": opt.value ==="most_popular"?"Most popular":"Top rated")}
 </span>
 </label>
 ))}
 </div>
 </div>

 {/* Action Buttons */}
 <div className="space-y-2 pt-2">
 <button
 onClick={handleApply}
 className="w-full py-2.5 bg-primary-light text-white text-sm font-semibold rounded-lg hover:bg-primary-light/90 transition-colors"
 >
 {t("categories.applyFilters","Apply filters")}
 </button>
 <button
 type="button"
 onClick={handleReset}
 className="w-full py-2 text-sm text-primary-light hover:underline"
 >
 {t("categories.reset","Reset")}
 </button>
 </div>
 </div>
 );
}
