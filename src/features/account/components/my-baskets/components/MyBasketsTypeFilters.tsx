import { useTranslation } from "react-i18next";
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
        <div className="flex flex-wrap gap-2 mb-4">
            {TYPE_FILTER_OPTIONS.map((filterOption) => {
                const isActive = selectedFilter === filterOption.value;
                const buttonClassName = isActive
                    ? "bg-primary text-white"
                    : "bg-custom-card text-custom-secondary border border-custom-primary hover:border-primary";

                return (
                    <button
                        key={filterOption.value}
                        type="button"
                        onClick={() => onSelectFilter(filterOption.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${buttonClassName}`}
                    >
                        {t(filterOption.labelKey)}
                    </button>
                );
            })}
        </div>
    );
}

