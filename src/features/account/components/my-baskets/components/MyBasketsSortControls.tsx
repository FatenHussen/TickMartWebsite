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
        <div className="mb-6 rounded-3xl border border-border-accent-light bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-api-second)_12%,var(--color-bg-primary))_0%,var(--color-bg-primary)_55%,color-mix(in_srgb,var(--color-main)_10%,var(--color-bg-primary))_100%)] p-4 shadow-sm transition-shadow duration-300 dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(16,17,20,0.75)] dark:shadow-[0_16px_48px_-24px_rgba(0,0,0,0.65),inset_0_1px_0_0_rgba(255,255,255,0.04)] dark:backdrop-blur-xl">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary dark:text-[#71717A]">
                {t("baskets.myBaskets")}
            </div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-sm text-text-secondary dark:text-[#A1A1AA]">
                    {t("baskets.myBasketsDescription")}
                </p>
                <select
                    value={selectedSortBy}
                    onChange={handleSortChange}
                    className="rounded-xl border border-custom-primary bg-custom-card px-3 py-2 text-sm text-custom-primary transition-colors duration-200 focus:border-transparent focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-api-second)_45%,transparent)] lg:min-w-[220px] dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(255,255,255,0.04)] dark:text-[#FFFFFF] dark:focus:ring-[color-mix(in_srgb,var(--color-main)_35%,transparent)]"
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
