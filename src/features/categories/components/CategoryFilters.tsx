import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/shared/lib/utils";
import { useCategoryAttributes } from "@/features/home/hooks/useCategoryAttributes";
import CategoryAttributeFilters from "@/features/product/components/CategoryAttributeFilters";
import { _LocationApi } from "@/features/auth/api/location.service";
import type { CategoriesApiDarkSurface } from "../lib/categoriesApiDarkSurface";

export type CategoryTypeFilter = "new" | "most_popular" | "top_rated" | undefined;

type CategoryFiltersProps = {
    typeFilter?: CategoryTypeFilter;
    onTypeFilterChange?: (type: CategoryTypeFilter) => void;
    minPrice?: number;
    maxPrice?: number;
    onPriceChange?: (price: { minPrice?: number; maxPrice?: number }) => void;
    country?: string;
    onCountryChange?: (country: string | undefined) => void;
    search?: string;
    onSearchChange?: (search: string | undefined) => void;
    /** The category being browsed — attribute filters are fetched for any level. */
    categoryId?: number;
    /** Root of the trail — used as the attributes cache key. */
    rootCategoryId?: number;
    /** Selected attribute *value* ids, the shape `attribute_values` is sent in. */
    attributeValues?: number[];
    onAttributeValuesChange?: (values: number[]) => void;
    apiSurface?: CategoriesApiDarkSurface | null;
};

const TYPE_OPTIONS: { value: CategoryTypeFilter; labelKey: string }[] = [
    { value: undefined, labelKey: "categories.typeAll" },
    { value: "new", labelKey: "categories.typeNew" },
    { value: "most_popular", labelKey: "categories.typeMostPopular" },
    { value: "top_rated", labelKey: "categories.typeTopRated" },
];

export default function CategoryFilters({
    typeFilter,
    onTypeFilterChange,
    minPrice,
    maxPrice,
    onPriceChange,
    country,
    onCountryChange,
    search,
    onSearchChange,
    categoryId,
    rootCategoryId,
    attributeValues,
    onAttributeValuesChange,
    apiSurface,
}: CategoryFiltersProps) {
    const { t } = useTranslation();
    const [localType, setLocalType] = useState<CategoryTypeFilter>(typeFilter ?? undefined);
    const [localMinPrice, setLocalMinPrice] = useState<string>(minPrice?.toString() ?? "");
    const [localMaxPrice, setLocalMaxPrice] = useState<string>(maxPrice?.toString() ?? "");
    const [localSearch, setLocalSearch] = useState<string>(search ?? "");
    const [localCountry, setLocalCountry] = useState<string>(country ?? "");

    useEffect(() => {
        setLocalType(typeFilter ?? undefined);
    }, [typeFilter]);
    useEffect(() => {
        setLocalMinPrice(minPrice?.toString() ?? "");
    }, [minPrice]);
    useEffect(() => {
        setLocalMaxPrice(maxPrice?.toString() ?? "");
    }, [maxPrice]);
    useEffect(() => {
        setLocalSearch(search ?? "");
    }, [search]);
    useEffect(() => {
        setLocalCountry(country ?? "");
    }, [country]);

    const {
        data: attributes = [],
        isLoading: attributesLoading,
        error: attributesError,
    } = useCategoryAttributes(categoryId, rootCategoryId ?? categoryId);

    const { data: countries = [] } = useQuery({
        queryKey: ["location", "countries", "category-filter"],
        queryFn: async () => {
            const res = await _LocationApi.getCountries();
            return res.data?.items ?? [];
        },
        staleTime: 1000 * 60 * 30,
    });

    const showAttributes =
        categoryId != null && (attributesLoading || Boolean(attributesError) || attributes.length > 0);

    const handleToggleAttributeValue = (valueId: number) => {
        const next = new Set(attributeValues ?? []);
        if (next.has(valueId)) next.delete(valueId);
        else next.add(valueId);
        onAttributeValuesChange?.([...next]);
    };

    const priceDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(
        () => () => {
            if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
            if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        },
        [],
    );

    const handleTypeChange = (value: CategoryTypeFilter) => {
        setLocalType(value);
        onTypeFilterChange?.(value);
    };

    const commitPrice = (nextMin: string, nextMax: string) => {
        if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
        priceDebounceRef.current = setTimeout(() => {
            onPriceChange?.({
                minPrice: nextMin.trim() === "" ? undefined : Number(nextMin),
                maxPrice: nextMax.trim() === "" ? undefined : Number(nextMax),
            });
        }, 400);
    };

    const handleMinPriceChange = (value: string) => {
        setLocalMinPrice(value);
        commitPrice(value, localMaxPrice);
    };

    const handleMaxPriceChange = (value: string) => {
        setLocalMaxPrice(value);
        commitPrice(localMinPrice, value);
    };

    const handleSearchChange = (value: string) => {
        setLocalSearch(value);
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => {
            const trimmed = value.trim();
            onSearchChange?.(trimmed || undefined);
        }, 400);
    };

    const handleCountryChange = (value: string) => {
        setLocalCountry(value);
        onCountryChange?.(value.trim() || undefined);
    };

    const handleReset = () => {
        if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        setLocalType(undefined);
        setLocalMinPrice("");
        setLocalMaxPrice("");
        setLocalSearch("");
        setLocalCountry("");
        onTypeFilterChange?.(undefined);
        onPriceChange?.({ minPrice: undefined, maxPrice: undefined });
        onSearchChange?.(undefined);
        onCountryChange?.(undefined);
        onAttributeValuesChange?.([]);
    };

    const inputCls = cn(
        "h-11 w-full rounded-xl border px-3 text-sm outline-none transition-all duration-200 focus:ring-2",
        !apiSurface &&
            "border-slate-200/80 bg-white text-custom-primary placeholder:text-slate-400 focus:border-primary-light/60 focus:ring-primary-light/15",
    );

    const inputStyle = apiSurface
        ? {
              borderColor: apiSurface.cardBorder,
              backgroundColor: `color-mix(in srgb, ${apiSurface.cardBackground} 55%, #020617)`,
              color: apiSurface.pageColor,
          }
        : undefined;

    const sectionLabelCls = cn(
        "text-[11px] font-semibold uppercase tracking-[0.07em]",
        !apiSurface && "text-custom-secondary",
    );

    return (
        <div
            className={cn(
                "space-y-5 p-4 sm:p-5",
                !apiSurface &&
                    "rounded-2xl border border-primary-light/15 bg-gradient-to-b from-white via-blue-50/35 to-blue-100/20",
            )}
            style={apiSurface ? { color: apiSurface.mutedColor } : undefined}
        >
            <h3
                className={cn("text-[15px] font-bold tracking-tight", !apiSurface && "text-custom-primary")}
                style={apiSurface ? { color: apiSurface.pageColor } : undefined}
            >
                {t("categories.filters", "Filters")}
            </h3>

            <section className="space-y-3">
                <p className={sectionLabelCls} style={apiSurface ? { color: apiSurface.pageColor } : undefined}>
                    {t("productsListing.searchLabel", "Search")}
                </p>
                <input
                    type="search"
                    value={localSearch}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    maxLength={255}
                    placeholder={t("productsListing.searchLabel", "Search")}
                    className={inputCls}
                    style={inputStyle}
                />
            </section>

            <section className="space-y-3">
                <p className={sectionLabelCls} style={apiSurface ? { color: apiSurface.pageColor } : undefined}>
                    {t("categories.typeFilter", "Category Type")}
                </p>
                <div className="space-y-2">
                    {TYPE_OPTIONS.map((opt) => (
                        <label
                            key={opt.value ?? "all"}
                            className={cn(
                                "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-all duration-200 active:scale-[0.99]",
                                !apiSurface &&
                                    (localType === opt.value
                                        ? "border-primary-light/40 bg-primary-light/[0.07] shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                                        : "border-slate-200/80 bg-white hover:border-primary-light/30 hover:bg-slate-50"),
                            )}
                            style={
                                apiSurface
                                    ? {
                                          borderColor: apiSurface.cardBorder,
                                          backgroundColor: `color-mix(in srgb, ${apiSurface.cardBackground} 70%, #020617)`,
                                      }
                                    : undefined
                            }
                        >
                            <input
                                type="radio"
                                name="categoryType"
                                checked={localType === opt.value}
                                onChange={() => handleTypeChange(opt.value)}
                                className="h-[18px] w-[18px] accent-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/30"
                            />
                            <span
                                className={cn(!apiSurface && "text-custom-secondary")}
                                style={apiSurface ? { color: apiSurface.mutedColor } : undefined}
                            >
                                {t(
                                    opt.labelKey,
                                    opt.value === undefined
                                        ? "All"
                                        : opt.value === "new"
                                          ? "New"
                                          : opt.value === "most_popular"
                                            ? "Most popular"
                                            : "Top rated",
                                )}
                            </span>
                        </label>
                    ))}
                </div>
            </section>

            <section
                className={cn("space-y-3 border-t pt-4", !apiSurface && "border-primary-light/10")}
                style={apiSurface ? { borderColor: apiSurface.cardBorder } : undefined}
            >
                <p className={sectionLabelCls} style={apiSurface ? { color: apiSurface.pageColor } : undefined}>
                    {t("categories.priceRange", "Price range")}
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                    <input
                        type="number"
                        min={0}
                        value={localMinPrice}
                        onChange={(e) => handleMinPriceChange(e.target.value)}
                        placeholder={t("baskets.min", "Min")}
                        className={inputCls}
                        style={inputStyle}
                    />
                    <input
                        type="number"
                        min={0}
                        value={localMaxPrice}
                        onChange={(e) => handleMaxPriceChange(e.target.value)}
                        placeholder={t("baskets.max", "Max")}
                        className={inputCls}
                        style={inputStyle}
                    />
                </div>
            </section>

            <section className="space-y-3">
                <p className={sectionLabelCls} style={apiSurface ? { color: apiSurface.pageColor } : undefined}>
                    {t("productsListing.countryLabel", "Country")}
                </p>
                <select
                    value={localCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className={cn(inputCls, "cursor-pointer")}
                    style={inputStyle}
                >
                    <option value="">{t("productsListing.allCountries", "All countries")}</option>
                    {countries.map((c) => (
                        <option key={c.id} value={c.name}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </section>

            {showAttributes && (
                <section className="space-y-3">
                    <p className={sectionLabelCls} style={apiSurface ? { color: apiSurface.pageColor } : undefined}>
                        {t("categories.attributesFilter", "Attributes")}
                    </p>
                    <CategoryAttributeFilters
                        attributes={attributes}
                        selectedIds={attributeValues ?? []}
                        onToggleValue={handleToggleAttributeValue}
                        isLoading={attributesLoading}
                        error={attributesError}
                        hideEmptyMessage
                    />
                </section>
            )}

            <div className="space-y-2.5 pt-1">
                <button
                    type="button"
                    onClick={handleReset}
                    className={cn(
                        "h-11 w-full rounded-xl border text-sm font-semibold transition-all duration-200 active:scale-[0.99]",
                        !apiSurface &&
                            "border-slate-200/90 bg-white text-custom-primary hover:border-primary-light/40 hover:bg-slate-50",
                    )}
                    style={
                        apiSurface
                            ? {
                                  borderColor: apiSurface.cardBorder,
                                  backgroundColor: `color-mix(in srgb, ${apiSurface.cardBackground} 50%, transparent)`,
                                  color: apiSurface.pageColor,
                              }
                            : undefined
                    }
                >
                    {t("categories.reset", "Reset")}
                </button>
            </div>
        </div>
    );
}
