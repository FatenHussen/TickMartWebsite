import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import type { MyBasketFilterType } from "../../../hooks/useMyBaskets";
import { TYPE_FILTER_OPTIONS } from "../constants";

type MyBasketsTypeFiltersProps = {
    selectedFilter: MyBasketFilterType;
    onSelectFilter: (filter: MyBasketFilterType) => void;
};

export default function MyBasketsTypeFilters({
    selectedFilter,
    onSelectFilter,
}: MyBasketsTypeFiltersProps) {
    const { t } = useTranslation();

    return (
        <div className="mb-4 flex flex-wrap gap-2">
            {TYPE_FILTER_OPTIONS.map((filterOption) => {
                const isActive = selectedFilter === filterOption.value;

                return (
                    <button
                        key={filterOption.value}
                        type="button"
                        onClick={() => onSelectFilter(filterOption.value)}
                        className={cn(
                            "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                            isActive
                                ? "bg-primary text-white shadow-md dark:bg-[var(--color-api-second)] dark:text-white dark:shadow-[0_8px_28px_-12px_color-mix(in_srgb,var(--color-api-second)_40%,transparent)] dark:ring-1 dark:ring-white/[0.08]"
                                : "border border-custom-primary bg-custom-card text-custom-secondary hover:border-primary dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(255,255,255,0.04)] dark:text-[#A1A1AA] dark:hover:border-[color-mix(in_srgb,var(--color-main)_22%,transparent)] dark:hover:bg-[color-mix(in_srgb,var(--color-main)_6%,transparent)] dark:hover:text-[#FFFFFF]",
                        )}
                    >
                        {t(filterOption.labelKey)}
                    </button>
                );
            })}
        </div>
    );
}

