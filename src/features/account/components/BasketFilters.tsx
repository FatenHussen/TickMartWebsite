import { useTranslation } from"react-i18next";
import { cn } from"@/shared/lib/utils";
import type { BasketFilter } from"../types";

type BasketFiltersProps = {
 activeFilter: BasketFilter;
 onFilterChange: (filter: BasketFilter) => void;
 sortBy: string;
 onSortChange: (sort: string) => void;
};

const filters: BasketFilter[] = [
"all",
"active",
"paused",
"expired",
"suggested",
"scheduled",
"occasion",
];

export default function BasketFilters({
 activeFilter,
 onFilterChange,
 sortBy,
 onSortChange,
}: BasketFiltersProps) {
 const { t } = useTranslation();

 const getFilterLabel = (filter: BasketFilter) => {
 switch (filter) {
 case"all":
 return t("baskets.filters.all");
 case"active":
 return t("baskets.filters.active");
 case"paused":
 return t("baskets.filters.paused");
 case"expired":
 return t("baskets.filters.expired");
 case"suggested":
 return t("baskets.filters.suggested");
 case"scheduled":
 return t("baskets.filters.scheduled");
 case"occasion":
 return t("baskets.filters.occasion");
 default:
 return filter;
 }
 };

 return (
 <div className="flex items-center justify-between gap-4 flex-wrap">
 {/* Filter Tabs */}
 <div className="flex items-center gap-1 flex-wrap">
 {filters.map((filter) => (
 <button
 key={filter}
 type="button"
 onClick={() => onFilterChange(filter)}
 className={cn(
"px-4 py-2 rounded-full text-sm font-medium transition-colors",
 activeFilter === filter
 ?"bg-primary text-white"
 :"bg-custom-tertiary text-custom-secondary hover:bg-custom-muted",
 )}
 >
 {getFilterLabel(filter)}
 </button>
 ))}
 </div>

 {/* Sort Dropdown */}
 <div className="flex items-center gap-2">
 <select
 value={sortBy}
 onChange={(e) => onSortChange(e.target.value)}
 className="px-4 py-2 border border-custom-primary rounded-lg text-sm text-custom-primary bg-custom-card focus:outline-none focus:ring-2 focus:ring-teal-500"
 >
 <option value="next_delivery">
 {t("baskets.sort.nextDelivery")}
 </option>
 <option value="created">{t("baskets.sort.created")}</option>
 <option value="name">{t("baskets.sort.name")}</option>
 <option value="price">{t("baskets.sort.price")}</option>
 </select>
 </div>
 </div>
 );
}
