import { useState } from"react";
import { HiChevronDown } from"react-icons/hi";
import { useTranslation } from"react-i18next";
import { useLanguage } from"@/context/LanguageContext";
import { cn } from"@/shared/lib/utils";
import type { OrderStatus } from"../types";

type Props = {
 activeFilter: OrderStatus |"all";
 onFilterChange: (filter: OrderStatus |"all") => void;
 sortBy?: string;
 onSortChange?: (sort: string) => void;
 sortOptions?: { value: string; label: string }[];
};

export default function OrderFilters({
 activeFilter,
 onFilterChange,
 sortBy ="Newest",
 onSortChange,
 sortOptions = [
 { value:"newest", label:"Newest"},
 { value:"oldest", label:"Oldest"},
 { value:"amount_high", label:"Amount: High to Low"},
 { value:"amount_low", label:"Amount: Low to High"},
 ],
}: Props) {
 const { t } = useTranslation();
 const { isRTL } = useLanguage();
 const [isSortOpen, setIsSortOpen] = useState(false);

 const filters: { key: OrderStatus |"all"; label: string }[] = [
 { key:"all", label: t("orders.all") },
 { key:"pending", label: t("orders.pending") },
 { key:"preparing", label: t("orders.preparing") },
 { key:"out_for_delivery", label: t("orders.out_for_delivery") },
 { key:"delivered", label: t("orders.delivered") },
 { key:"cancelled", label: t("orders.cancelled") },
 ];

 return (
 <div
 className="flex items-center gap-3 flex-wrap"
 dir={isRTL ?"rtl":"ltr"}
 >
 {filters.map((filter) => (
 <button
 key={filter.key}
 type="button"
 onClick={() => onFilterChange(filter.key)}
 className={cn(
"px-4 py-2 text-sm font-medium rounded-lg border transition-colors",
 activeFilter === filter.key
 ?"bg-custom-accent text-custom-inverse border-custom-accent"
 :"bg-custom-primary text-custom-primary border-custom-secondary hover:bg-custom-hover"
 )}
 >
 {filter.label}
 </button>
 ))}

 {/* Sort Dropdown */}
 <div className="relative">
 <button
 type="button"
 onClick={() => setIsSortOpen(!isSortOpen)}
 className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-custom-primary border border-custom-secondary rounded-lg hover:bg-custom-hover transition-colors bg-custom-primary"
 >
 <span>
 {t("orders.sortBy")}: {sortBy}
 </span>
 <HiChevronDown
 className={cn(
"w-4 h-4 transition-transform text-custom-secondary",
 isSortOpen &&"rotate-180"
 )}
 />
 </button>

 {isSortOpen && (
 <>
 <div
 className="fixed inset-0 z-10"
 onClick={() => setIsSortOpen(false)}
 />
 <div
 className={cn(
"absolute mt-2 w-48 bg-custom-primary border border-custom-secondary rounded-lg shadow-lg z-20",
 isRTL ?"left-0":"right-0"
 )}
 >
 {sortOptions.map((option) => (
 <button
 key={option.value}
 type="button"
 onClick={() => {
 onSortChange?.(option.label);
 setIsSortOpen(false);
 }}
 className={cn(
"w-full px-4 py-2 text-sm hover:bg-custom-hover transition-colors text-custom-primary",
 isRTL ?"text-right":"text-left",
 sortBy === option.label &&"bg-custom-hover"
 )}
 >
 {option.label}
 </button>
 ))}
 </div>
 </>
 )}
 </div>
 </div>
 );
}
