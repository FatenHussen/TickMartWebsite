import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import type { MyBasketSortBy } from "../constants";

type MyBasketsSortControlsProps = {
    selectedSortBy: MyBasketSortBy;
    onSortChange: (sortBy: MyBasketSortBy) => void;
};

export default function MyBasketsSortControls({
    selectedSortBy,
    onSortChange,
}: MyBasketsSortControlsProps) {
    const { t } = useTranslation();

    const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
        onSortChange(event.target.value as MyBasketSortBy);
    };

    return (
        <div className="mb-6 rounded-2xl border border-border-accent-light bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-api-second)_12%,var(--color-bg-primary))_0%,var(--color-bg-primary)_55%,color-mix(in_srgb,var(--color-main)_10%,var(--color-bg-primary))_100%)] p-4 shadow-sm dark:border-custom-primary/40 dark:bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-api-second)_20%,var(--color-bg-primary))_0%,var(--color-bg-primary)_70%,color-mix(in_srgb,var(--color-main)_16%,var(--color-bg-primary))_100%)]">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary dark:text-custom-secondary">
                {t("baskets.myBaskets")}
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <p className="text-sm text-text-secondary dark:text-custom-secondary">
                    {t("baskets.myBasketsDescription")}
                </p>
                <select
                    value={selectedSortBy}
                    onChange={handleSortChange}
                    className="lg:min-w-[220px] px-3 py-2 rounded-lg border border-custom-primary bg-custom-card text-custom-primary text-sm focus:ring-2 focus:ring-[var(--color-api-second)] focus:border-transparent"
                >
                    <option value="next_delivery">
                        {t("baskets.sort.nextDelivery")}
                    </option>
                    <option value="created">{t("baskets.sort.created")}</option>
                    <option value="name">{t("baskets.sort.name")}</option>
                </select>
            </div>
        </div>
    );
}
