import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import {
    LuShoppingBasket,
    LuShoppingBag,
    LuRepeat,
    LuSparkles,
    LuFlame,
    LuStar,
    LuTag,
    LuLayers,
    LuSlidersHorizontal,
    LuRotateCcw,
    LuCheck,
} from "react-icons/lu";
import { cn } from "@/shared/lib/utils";
import type { BasketType, BasketSortType, BasketFilters } from "../types";

type IconType = ComponentType<{ className?: string }>;

type BasketFiltersSidebarProps = {
    filters: BasketFilters;
    onFiltersChange: (filters: BasketFilters) => void;
};

const basketTypes: { value: BasketType; labelKey: string; Icon: IconType }[] = [
    { value: "all", labelKey: "baskets.allBaskets", Icon: LuShoppingBasket },
    { value: "custom", labelKey: "baskets.customBaskets", Icon: LuShoppingBag },
    { value: "subscription", labelKey: "baskets.subscriptionBaskets", Icon: LuRepeat },
];

const sortTypes: {
    value: BasketSortType;
    labelKey: string;
    fallback: string;
    Icon: IconType;
}[] = [
    { value: "new", labelKey: "baskets.sortNew", fallback: "Newest", Icon: LuSparkles },
    { value: "best_selling", labelKey: "baskets.sortBestSelling", fallback: "Best Selling", Icon: LuFlame },
    { value: "top_rated", labelKey: "baskets.sortTopRated", fallback: "Top Rated", Icon: LuStar },
];

/** Section heading with an icon chip — the ::before accent bar is suppressed in favor of the icon. */
function SectionTitle({ Icon, children }: { Icon: IconType; children: React.ReactNode }) {
    return (
        <h3 className="basket-sidebar-title mb-4 flex items-center gap-2.5 text-base font-bold [&::before]:hidden">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--color-main)_14%,transparent)] text-[var(--color-main)] dark:bg-white/10 dark:text-white">
                <Icon className="h-4 w-4" />
            </span>
            {children}
        </h3>
    );
}

/** Icon chip used inside selectable pills; turns translucent-white when its pill is active. */
function PillIcon({ Icon }: { Icon: IconType }) {
    return (
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--color-main)_10%,transparent)] text-[var(--color-main)] transition-colors group-[.is-active]:bg-white/20 group-[.is-active]:text-white dark:bg-white/10 dark:text-white">
            <Icon className="h-4 w-4" />
        </span>
    );
}

export default function BasketFiltersSidebar({
    filters,
    onFiltersChange,
}: BasketFiltersSidebarProps) {
    const { t } = useTranslation();

    const update = (patch: Partial<BasketFilters>) =>
        onFiltersChange({ ...filters, ...patch });

    const activeCount =
        (filters.basketType !== "all" ? 1 : 0) +
        (filters.sortType ? 1 : 0) +
        (filters.priceMin != null || filters.priceMax != null ? 1 : 0) +
        (filters.ratingMin ? 1 : 0) +
        (filters.itemsCountMin != null || filters.itemsCountMax != null ? 1 : 0);

    const clearAll = () => onFiltersChange({ basketType: "all" });

    return (
        <div className="space-y-6">
            {/* Header — title, active count, clear all */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-main)] to-[var(--color-api-second)] text-white shadow-sm">
                        <LuSlidersHorizontal className="h-5 w-5" />
                    </span>
                    <div className="flex flex-col leading-tight">
                        <span className="text-base font-bold text-custom-primary dark:text-white">
                            {t("baskets.filtersHeading", "Filters")}
                        </span>
                        <span className="text-xs text-custom-tertiary">
                            {activeCount > 0
                                ? t("baskets.activeFiltersCount", "{{count}} active").replace(
                                      "{{count}}",
                                      String(activeCount),
                                  )
                                : t("baskets.noActiveFilters", "Find your perfect basket")}
                        </span>
                    </div>
                </div>
                {activeCount > 0 && (
                    <button
                        type="button"
                        onClick={clearAll}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[var(--color-main)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-main)_12%,transparent)]"
                    >
                        <LuRotateCcw className="h-3.5 w-3.5" />
                        {t("baskets.clearAll", "Clear all")}
                    </button>
                )}
            </div>

            {/* Basket Type */}
            <div className="basket-sidebar-card rounded-2xl p-5">
                <SectionTitle Icon={LuShoppingBasket}>{t("baskets.basketType")}</SectionTitle>
                <div className="space-y-2">
                    {basketTypes.map(({ value, labelKey, Icon }) => (
                        <button
                            key={value}
                            onClick={() => update({ basketType: value })}
                            className={cn(
                                "basket-sidebar-pill group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium",
                                filters.basketType === value && "is-active",
                            )}
                        >
                            <PillIcon Icon={Icon} />
                            <span className="flex-1">{t(labelKey)}</span>
                            {filters.basketType === value && (
                                <LuCheck className="h-4 w-4 text-white" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sort */}
            <div className="basket-sidebar-card rounded-2xl p-5">
                <SectionTitle Icon={LuSparkles}>{t("baskets.sortBy", "Sort By")}</SectionTitle>
                <div className="space-y-2">
                    {sortTypes.map(({ value, labelKey, fallback, Icon }) => {
                        const isActive = filters.sortType === value;
                        return (
                            <button
                                key={value}
                                onClick={() =>
                                    update({ sortType: isActive ? undefined : value })
                                }
                                className={cn(
                                    "basket-sidebar-pill group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium",
                                    isActive && "is-active",
                                )}
                            >
                                <PillIcon Icon={Icon} />
                                <span className="flex-1">{t(labelKey, fallback)}</span>
                                {isActive && <LuCheck className="h-4 w-4 text-white" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Price Range */}
            <div className="basket-sidebar-card rounded-2xl p-5">
                <SectionTitle Icon={LuTag}>{t("baskets.priceRange", "Price Range")}</SectionTitle>
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
                <SectionTitle Icon={LuStar}>{t("baskets.minRating", "Min Rating")}</SectionTitle>
                <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                        const isActive = filters.ratingMin === star;
                        return (
                            <button
                                key={star}
                                onClick={() =>
                                    update({ ratingMin: isActive ? undefined : star })
                                }
                                className={cn(
                                    "basket-sidebar-pill inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold",
                                    isActive && "is-active",
                                )}
                            >
                                <LuStar
                                    className={cn(
                                        "h-4 w-4",
                                        isActive
                                            ? "fill-white text-white"
                                            : "fill-amber-400 text-amber-400",
                                    )}
                                />
                                <span>{star}+</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Items Count Range */}
            <div className="basket-sidebar-card rounded-2xl p-5">
                <SectionTitle Icon={LuLayers}>{t("baskets.itemsCount", "Items Count")}</SectionTitle>
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
                <LuSlidersHorizontal className="h-5 w-5 shrink-0 text-[var(--color-main)]" aria-hidden />
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
