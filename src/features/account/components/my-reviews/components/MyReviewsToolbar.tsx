import { useTranslation } from "react-i18next";
import { HiFilter, HiSortDescending } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import type { MyReviewsRatingFilter, MyReviewsSortBy } from "../constants";
import OverlaySelectButton from "./OverlaySelectButton";

type Option<T extends string> = { value: T; label: string };

type MyReviewsToolbarProps = {
    isRTL: boolean;
    sortOptions: Option<MyReviewsSortBy>[];
    sortBy: MyReviewsSortBy;
    onSortChange: (value: MyReviewsSortBy) => void;
    selectedSortLabel: string;
    ratingOptions: Option<MyReviewsRatingFilter>[];
    ratingFilter: MyReviewsRatingFilter;
    onRatingFilterChange: (value: MyReviewsRatingFilter) => void;
    selectedRatingLabel: string;
    showClearFilters: boolean;
    onClearFilters: () => void;
};

export default function MyReviewsToolbar({
    isRTL,
    sortOptions,
    sortBy,
    onSortChange,
    selectedSortLabel,
    ratingOptions,
    ratingFilter,
    onRatingFilterChange,
    selectedRatingLabel,
    showClearFilters,
    onClearFilters,
}: MyReviewsToolbarProps) {
    const { t } = useTranslation();

    const sortOptionsForSelect = sortOptions.map((o) => ({
        value: o.value,
        label: o.label,
    }));
    const ratingOptionsForSelect = ratingOptions.map((o) => ({
        value: o.value,
        label: o.label,
    }));

    return (
        <div
            className={cn(
                "mb-2 rounded-2xl p-4 shadow-md shadow-black/5 dark:shadow-black/25",
                "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-api-second)_12%,var(--color-bg-primary))_0%,var(--color-bg-primary)_55%,color-mix(in_srgb,var(--color-main)_10%,var(--color-bg-primary))_100%)]",
                "dark:bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-api-second)_20%,var(--color-bg-primary))_0%,var(--color-bg-primary)_70%,color-mix(in_srgb,var(--color-main)_16%,var(--color-bg-primary))_100%)]",
            )}
        >
            <div
                className={cn(
                    "flex flex-wrap items-center gap-3",
                    isRTL && "flex-row-reverse",
                )}
            >
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:flex-[unset]">
                    <OverlaySelectButton
                        value={sortBy}
                        onChange={(value) =>
                            onSortChange(value as MyReviewsSortBy)
                        }
                        options={sortOptionsForSelect}
                        trigger={
                            <span className="flex min-w-0 items-center gap-2 text-sm">
                                <HiSortDescending
                                    className="h-4 w-4 shrink-0 text-[var(--color-api-second)]"
                                    aria-hidden
                                />
                                <span className="truncate">
                                    <span className="text-custom-tertiary">
                                        {t("account.myReviews.sortBy")}:
                                    </span>{" "}
                                    <span className="font-medium text-custom-primary">
                                        {selectedSortLabel}
                                    </span>
                                </span>
                            </span>
                        }
                    />

                    <OverlaySelectButton
                        value={ratingFilter}
                        onChange={(value) =>
                            onRatingFilterChange(value as MyReviewsRatingFilter)
                        }
                        options={ratingOptionsForSelect}
                        trigger={
                            <span className="flex min-w-0 items-center gap-2 text-sm">
                                <HiFilter
                                    className="h-4 w-4 shrink-0 text-[var(--color-api-second)]"
                                    aria-hidden
                                />
                                <span className="truncate font-medium text-custom-primary">
                                    {selectedRatingLabel}
                                </span>
                            </span>
                        }
                    />
                </div>

                {showClearFilters ? (
                    <button
                        type="button"
                        onClick={onClearFilters}
                        className="text-sm font-medium text-[var(--color-api-second)] underline decoration-[color-mix(in_srgb,var(--color-api-second)_45%,transparent)] underline-offset-4 transition-colors hover:text-[var(--color-api-second-hover)] hover:decoration-[var(--color-api-second-hover)]"
                    >
                        {t("account.myReviews.clearFilters")}
                    </button>
                ) : null}
            </div>
        </div>
    );
}
