import { useTranslation } from "react-i18next";
import { HiAdjustments } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import type { BasketType, BasketSortType, BasketFilters } from "../types";

type BasketFiltersSidebarProps = {
    filters: BasketFilters;
    onFiltersChange: (filters: BasketFilters) => void;
};

const basketTypes: { value: BasketType; labelKey: string; icon: string }[] = [
    { value: "all", labelKey: "baskets.allBaskets", icon: "🧺" },
    { value: "custom", labelKey: "baskets.customBaskets", icon: "🛍️" },
    { value: "subscription", labelKey: "baskets.subscriptionBaskets", icon: "🔁" },
];

const sortTypes: { value: BasketSortType; labelKey: string; icon: string }[] = [
    { value: "new", labelKey: "baskets.sortNew", icon: "✨" },
    { value: "best_selling", labelKey: "baskets.sortBestSelling", icon: "🔥" },
    { value: "top_rated", labelKey: "baskets.sortTopRated", icon: "⭐" },
];

export default function BasketFiltersSidebar({
    filters,
    onFiltersChange,
}: BasketFiltersSidebarProps) {
    const { t } = useTranslation();

    const update = (patch: Partial<BasketFilters>) =>
        onFiltersChange({ ...filters, ...patch });

    return (
        <div className="space-y-6">
            {/* Basket Type */}
            <div className="basket-sidebar-card rounded-2xl p-5">
                <h3 className="basket-sidebar-title text-base font-bold mb-4">
                    {t("baskets.basketType")}
                </h3>
                <div className="space-y-2">
                    {basketTypes.map(({ value, labelKey, icon }) => (
                        <button
                            key={value}
                            onClick={() => update({ basketType: value })}
                            className={cn(
                                "basket-sidebar-pill w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium",
                                filters.basketType === value && "is-active"
                            )}
                        >
                            <span className="w-6 h-6 flex items-center justify-center text-lg">
                                {icon}
                            </span>
                            <span className="flex-1">{t(labelKey)}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Sort */}
            <div className="basket-sidebar-card rounded-2xl p-5">
                <h3 className="basket-sidebar-title text-base font-bold mb-4">
                    {t("baskets.sortBy", "Sort By")}
                </h3>
                <div className="space-y-2">
                    {sortTypes.map(({ value, labelKey, icon }) => (
                        <button
                            key={value}
                            onClick={() =>
                                update({ sortType: filters.sortType === value ? undefined : value })
                            }
                            className={cn(
                                "basket-sidebar-pill w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium",
                                filters.sortType === value && "is-active"
                            )}
                        >
                            <span className="w-6 h-6 flex items-center justify-center text-lg">
                                {icon}
                            </span>
                            <span className="flex-1">
                                {t(
                                    labelKey,
                                    value === "new"
                                        ? "Newest"
                                        : value === "best_selling"
                                          ? "Best Selling"
                                          : "Top Rated"
                                )}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="basket-sidebar-card rounded-2xl p-5">
                <h3 className="basket-sidebar-title text-base font-bold mb-4">
                    {t("baskets.priceRange", "Price Range")}
                </h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min={0}
                        placeholder={t("baskets.min", "Min")}
                        value={filters.priceMin ?? ""}
                        onChange={(e) =>
                            update({ priceMin: e.target.value ? Number(e.target.value) : undefined })
                        }
                        className="basket-sidebar-input w-full rounded-xl px-3 py-2 text-sm"
                    />
                    <span className="text-custom-tertiary shrink-0">–</span>
                    <input
                        type="number"
                        min={0}
                        placeholder={t("baskets.max", "Max")}
                        value={filters.priceMax ?? ""}
                        onChange={(e) =>
                            update({ priceMax: e.target.value ? Number(e.target.value) : undefined })
                        }
                        className="basket-sidebar-input w-full rounded-xl px-3 py-2 text-sm"
                    />
                </div>
            </div>

            {/* Minimum Rating */}
            <div className="basket-sidebar-card rounded-2xl p-5">
                <h3 className="basket-sidebar-title text-base font-bold mb-4">
                    {t("baskets.minRating", "Min Rating")}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() =>
                                update({ ratingMin: filters.ratingMin === star ? undefined : star })
                            }
                            className={cn(
                                "basket-sidebar-pill inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium",
                                filters.ratingMin === star && "is-active"
                            )}
                        >
                            <span aria-hidden>★</span>
                            <span>{star}+</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Items Count Range */}
            <div className="basket-sidebar-card rounded-2xl p-5">
                <h3 className="basket-sidebar-title text-base font-bold mb-4">
                    {t("baskets.itemsCount", "Items Count")}
                </h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min={0}
                        placeholder={t("baskets.min", "Min")}
                        value={filters.itemsCountMin ?? ""}
                        onChange={(e) =>
                            update({ itemsCountMin: e.target.value ? Number(e.target.value) : undefined })
                        }
                        className="basket-sidebar-input w-full rounded-xl px-3 py-2 text-sm"
                    />
                    <span className="text-custom-tertiary shrink-0">–</span>
                    <input
                        type="number"
                        min={0}
                        placeholder={t("baskets.max", "Max")}
                        value={filters.itemsCountMax ?? ""}
                        onChange={(e) =>
                            update({ itemsCountMax: e.target.value ? Number(e.target.value) : undefined })
                        }
                        className="basket-sidebar-input w-full rounded-xl px-3 py-2 text-sm"
                    />
                </div>
            </div>

            {/* Info hint */}
            <div className="basket-sidebar-info flex items-start gap-3 rounded-2xl p-5">
                <HiAdjustments className="h-5 w-5 shrink-0 text-[var(--color-main)]" aria-hidden />
                <p className="text-sm leading-relaxed">
                    {filters.basketType === "custom" &&
                        t("baskets.customBasketsInfo", "Browse all ready-made and custom baskets.")}
                    {filters.basketType === "subscription" &&
                        t("baskets.subscriptionBasketsInfo", "Browse all subscription baskets.")}
                    {filters.basketType === "all" &&
                        t("baskets.allBasketsInfo", "Browse all ready-made and subscription baskets. Use filters to find the perfect one.")}
                </p>
            </div>
        </div>
    );
}
