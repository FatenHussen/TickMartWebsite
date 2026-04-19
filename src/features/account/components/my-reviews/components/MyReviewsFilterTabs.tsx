import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import type { MyReviewsUiFilterValue } from "../constants";

type FilterTab = {
    value: MyReviewsUiFilterValue;
    label: string;
};

type MyReviewsFilterTabsProps = {
    tabs: FilterTab[];
    activeValue: MyReviewsUiFilterValue;
    onSelect: (value: MyReviewsUiFilterValue) => void;
};

export default function MyReviewsFilterTabs({
    tabs,
    activeValue,
    onSelect,
}: MyReviewsFilterTabsProps) {
    const { t } = useTranslation();

    return (
        <div
            className={cn(
                "rounded-2xl bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-bg-card)_94%,var(--color-api-second))_0%,var(--color-bg-card)_100%)] p-3 shadow-md shadow-black/5 dark:shadow-black/20",
            )}
        >
            <div
                className={cn(
                    "flex flex-wrap items-center gap-2",
                    "-mx-0.5 gap-x-2 gap-y-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:overflow-visible",
                    "[&::-webkit-scrollbar]:hidden",
                )}
            >
                <span className="shrink-0 text-sm font-medium text-custom-primary">
                    {t("account.myReviews.reviewType")}:
                </span>
                {tabs.map((tab) => {
                    const isActive = activeValue === tab.value;
                    return (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => onSelect(tab.value)}
                            className={cn(
                                "shrink-0 snap-start rounded-full px-4 py-2 text-sm font-medium transition-all",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-api-second)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]",
                                isActive
                                    ? "bg-[var(--color-api-second)] text-white shadow-md shadow-[color-mix(in_srgb,var(--color-api-second)_35%,transparent)]"
                                    : "bg-custom-card/90 text-custom-primary shadow-sm hover:bg-custom-light hover:shadow-md",
                            )}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
