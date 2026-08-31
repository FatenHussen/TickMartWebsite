import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
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
    categoryId?: number;
    rootCategoryId?: number;
    attributeValues?: number[];
    onAttributeValuesChange?: (values: number[]) => void;
    freeDeliveryOnly?: boolean;
    onFreeDeliveryToggle?: (checked: boolean) => void;
    instantDeliveryOnly?: boolean;
    onInstantDeliveryToggle?: (checked: boolean) => void;
    onSaleOnly?: boolean;
    onOnSaleToggle?: (checked: boolean) => void;
    inStockOnly?: boolean;
    onInStockToggle?: (checked: boolean) => void;
    apiSurface?: CategoriesApiDarkSurface | null;
};

const TYPE_OPTIONS: { value: CategoryTypeFilter; labelKey: string }[] = [
    { value: undefined, labelKey: "categories.typeAll" },
    { value: "new", labelKey: "categories.typeNew" },
    { value: "most_popular", labelKey: "categories.typeMostPopular" },
    { value: "top_rated", labelKey: "categories.typeTopRated" },
];

function FilterSection({
    title,
    children,
    titleStyle,
    className,
}: {
    title?: string;
    children: ReactNode;
    titleStyle?: CSSProperties;
    className?: string;
}) {
    return (
        <section className={cn("space-y-2.5 py-4 first:pt-0 last:pb-0", className)}>
            {title ? (
                <p className="text-xs font-semibold text-custom-secondary" style={titleStyle}>
                    {title}
                </p>
            ) : null}
            {children}
        </section>
    );
}

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
    freeDeliveryOnly = false,
    onFreeDeliveryToggle,
    instantDeliveryOnly = false,
    onInstantDeliveryToggle,
    onSaleOnly = false,
    onOnSaleToggle,
    inStockOnly = false,
    onInStockToggle,
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
        onFreeDeliveryToggle?.(false);
        onInstantDeliveryToggle?.(false);
        onOnSaleToggle?.(false);
        onInStockToggle?.(false);
    };

    const hasActive =
        localType != null ||
        localMinPrice.trim() !== "" ||
        localMaxPrice.trim() !== "" ||
        localSearch.trim() !== "" ||
        localCountry.trim() !== "" ||
        (attributeValues?.length ?? 0) > 0 ||
        freeDeliveryOnly ||
        instantDeliveryOnly ||
        onSaleOnly ||
        inStockOnly;

    const inputCls = cn(
        "h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors duration-200 focus:ring-2",
        !apiSurface &&
            "border-slate-200 bg-white text-custom-primary placeholder:text-slate-400 focus:border-primary-light/60 focus:ring-primary-light/15",
    );

    const inputStyle = apiSurface
        ? {
              borderColor: apiSurface.cardBorder,
              backgroundColor: `color-mix(in srgb, ${apiSurface.cardBackground} 55%, #020617)`,
              color: apiSurface.pageColor,
          }
        : undefined;

    const divideCls = !apiSurface ? "divide-y divide-slate-200/80" : "divide-y";
    const divideStyle = apiSurface ? { borderColor: apiSurface.cardBorder } : undefined;
    const labelColor = apiSurface ? { color: apiSurface.pageColor } : undefined;
    const mutedColor = apiSurface ? { color: apiSurface.mutedColor } : undefined;

    const checkboxRow = cn(
        "flex cursor-pointer items-center gap-2.5 text-sm",
        !apiSurface && "text-custom-primary",
    );

    return (
        <div className="flex flex-col" style={apiSurface ? { color: apiSurface.mutedColor } : undefined}>
            <div className="mb-1 flex items-center justify-between gap-3">
                <h3
                    className={cn("text-[15px] font-bold tracking-tight", !apiSurface && "text-custom-primary")}
                    style={apiSurface ? { color: apiSurface.pageColor } : undefined}
                >
                    {t("categories.filters", "Filters")}
                </h3>
                {hasActive && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className={cn(
                            "shrink-0 text-xs font-semibold transition-opacity hover:opacity-80",
                            !apiSurface && "text-primary-light",
                        )}
                        style={apiSurface ? { color: apiSurface.pageColor } : undefined}
                    >
                        {t("categories.reset", "Reset")}
                    </button>
                )}
            </div>

            <div className={divideCls} style={divideStyle}>
                <FilterSection>
                    <div className="relative">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-40"
                            aria-hidden
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-3-3" />
                        </svg>
                        <input
                            type="search"
                            value={localSearch}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            maxLength={255}
                            placeholder={t("productsListing.searchLabel", "Search")}
                            aria-label={t("productsListing.searchLabel", "Search")}
                            className={cn(inputCls, "ps-10")}
                            style={inputStyle}
                        />
                    </div>
                </FilterSection>

                <FilterSection title={t("categories.typeFilter", "Category Type")}>
                    <div className="flex flex-wrap gap-1.5">
                        {TYPE_OPTIONS.map((opt) => {
                            const active = localType === opt.value;
                            return (
                                <button
                                    key={opt.value ?? "all"}
                                    type="button"
                                    onClick={() => handleTypeChange(opt.value)}
                                    className={cn(
                                        "inline-flex min-h-8 items-center rounded-full border px-3 text-[13px] font-medium transition-colors",
                                        !apiSurface &&
                                            (active
                                                ? "border-primary-light/50 bg-primary-light/10 text-custom-primary"
                                                : "border-slate-200 bg-white text-custom-secondary hover:border-primary-light/35 hover:bg-slate-50"),
                                    )}
                                    style={
                                        apiSurface
                                            ? {
                                                  borderColor: apiSurface.cardBorder,
                                                  backgroundColor: active
                                                      ? `color-mix(in srgb, ${apiSurface.cardBackground} 40%, #020617)`
                                                      : `color-mix(in srgb, ${apiSurface.cardBackground} 70%, #020617)`,
                                                  color: apiSurface.pageColor,
                                              }
                                            : undefined
                                    }
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
                                </button>
                            );
                        })}
                    </div>
                </FilterSection>

                <FilterSection title={t("categories.priceRange", "Price range")}>
                    <div className="grid grid-cols-2 gap-2">
                        <label className="min-w-0">
                            <span className="mb-1 block text-[11px] text-custom-secondary" style={mutedColor}>
                                {t("baskets.min", "Min")}
                            </span>
                            <input
                                type="number"
                                min={0}
                                value={localMinPrice}
                                onChange={(e) => handleMinPriceChange(e.target.value)}
                                placeholder="0"
                                className={inputCls}
                                style={inputStyle}
                            />
                        </label>
                        <label className="min-w-0">
                            <span className="mb-1 block text-[11px] text-custom-secondary" style={mutedColor}>
                                {t("baskets.max", "Max")}
                            </span>
                            <input
                                type="number"
                                min={0}
                                value={localMaxPrice}
                                onChange={(e) => handleMaxPriceChange(e.target.value)}
                                placeholder="0"
                                className={inputCls}
                                style={inputStyle}
                            />
                        </label>
                    </div>
                </FilterSection>

                <FilterSection title={t("productsListing.countryLabel", "Country")}>
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
                </FilterSection>

                <FilterSection title={t("productsListing.flags", "Options")}>
                    <div className="space-y-2.5" style={labelColor}>
                        <label className={checkboxRow} style={labelColor}>
                            <input
                                type="checkbox"
                                checked={freeDeliveryOnly}
                                onChange={(e) => onFreeDeliveryToggle?.(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 accent-primary-light"
                            />
                            <span>{t("product.filters.freeDeliveryOnly", "Free delivery")}</span>
                        </label>
                        <label className={checkboxRow} style={labelColor}>
                            <input
                                type="checkbox"
                                checked={instantDeliveryOnly}
                                onChange={(e) => onInstantDeliveryToggle?.(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 accent-primary-light"
                            />
                            <span>{t("productsListing.instantDelivery", "Instant delivery")}</span>
                        </label>
                        <label className={checkboxRow} style={labelColor}>
                            <input
                                type="checkbox"
                                checked={onSaleOnly}
                                onChange={(e) => onOnSaleToggle?.(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 accent-primary-light"
                            />
                            <span>{t("productsListing.onSale", "On sale")}</span>
                        </label>
                        <label className={checkboxRow} style={labelColor}>
                            <input
                                type="checkbox"
                                checked={inStockOnly}
                                onChange={(e) => onInStockToggle?.(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 accent-primary-light"
                            />
                            <span>{t("product.filters.inStockOnly", "In stock")}</span>
                        </label>
                    </div>
                </FilterSection>

                {showAttributes && (
                    <FilterSection>
                        <CategoryAttributeFilters
                            attributes={attributes}
                            selectedIds={attributeValues ?? []}
                            onToggleValue={handleToggleAttributeValue}
                            isLoading={attributesLoading}
                            error={attributesError}
                            hideEmptyMessage
                            embedded
                        />
                    </FilterSection>
                )}
            </div>
        </div>
    );
}
