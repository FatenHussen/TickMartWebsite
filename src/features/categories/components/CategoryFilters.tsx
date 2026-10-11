import {
    useState,
    useEffect,
    useRef,
    type CSSProperties,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, X } from "lucide-react";
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

function typeOptionLabel(
    t: (key: string, fallback: string) => string,
    value: CategoryTypeFilter,
): string {
    if (value === undefined) return t("categories.typeAll", "All");
    if (value === "new") return t("categories.typeNew", "New");
    if (value === "most_popular") return t("categories.typeMostPopular", "Most popular");
    return t("categories.typeTopRated", "Top rated");
}

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
        <section className={cn("space-y-2 py-3 first:pt-0 last:pb-0", className)}>
            {title ? (
                <p
                    className="text-[11px] font-semibold uppercase tracking-[0.06em] text-custom-secondary"
                    style={titleStyle}
                >
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
    const [mobileOpen, setMobileOpen] = useState(false);
    const sheetRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (!mobileOpen) return;
        const prevBody = document.body.style.overflow;
        const prevHtml = document.documentElement.style.overflow;
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prevBody;
            document.documentElement.style.overflow = prevHtml;
        };
    }, [mobileOpen]);

    useEffect(() => {
        if (!mobileOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMobileOpen(false);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [mobileOpen]);

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

    const activeFilterCount = [
        localType != null,
        localMinPrice.trim() !== "" || localMaxPrice.trim() !== "",
        localCountry.trim() !== "",
        localSearch.trim() !== "",
        freeDeliveryOnly,
        instantDeliveryOnly,
        onSaleOnly,
        inStockOnly,
        (attributeValues?.length ?? 0) > 0,
    ].filter(Boolean).length;

    const inputCls = cn(
        "h-10 w-full rounded-xl border px-3 text-sm outline-none transition-colors duration-200 focus:ring-2",
        !apiSurface &&
            "border-slate-200/90 bg-white text-custom-primary placeholder:text-slate-400 focus:border-primary-light/55 focus:ring-primary-light/12 dark:border-white/10 dark:bg-[#2A2622] dark:text-[#E8E4DC] dark:placeholder:text-[#9A948A] dark:focus:border-white/16 dark:focus:ring-white/10",
    );

    const inputStyle = apiSurface
        ? {
              borderColor: apiSurface.cardBorder,
              backgroundColor: `color-mix(in srgb, ${apiSurface.cardBackground} 55%, #020617)`,
              color: apiSurface.pageColor,
          }
        : undefined;

    const divideCls = !apiSurface ? "divide-y divide-slate-200/70" : "divide-y";
    const divideStyle = apiSurface ? { borderColor: apiSurface.cardBorder } : undefined;
    const labelColor = apiSurface ? { color: apiSurface.pageColor } : undefined;

    const chipCls = (active: boolean) =>
        cn(
            "inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border px-3.5 text-xs font-semibold transition-colors",
            !apiSurface &&
                (active
                    ? "border-transparent text-white shadow-sm"
                    : "border-slate-200 bg-white text-custom-secondary hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-[#2A2622] dark:text-[#C9C2B6] dark:hover:border-white/16 dark:hover:bg-[#322E29] dark:hover:text-[#F3EFE8]"),
        );

    const chipActiveStyle = apiSurface
        ? {
              borderColor: "transparent",
              background: `linear-gradient(135deg, ${apiSurface.pageColor}, color-mix(in srgb, ${apiSurface.pageColor} 70%, #020617))`,
              color: "#0b1220",
          }
        : {
              background:
                  "linear-gradient(135deg, var(--color-gradient-from, var(--color-main)), var(--color-gradient-to, var(--color-api-second, var(--color-main))))",
          };

    const optionChips: {
        key: string;
        checked: boolean;
        onToggle: (next: boolean) => void;
        label: string;
    }[] = [
        {
            key: "free",
            checked: freeDeliveryOnly,
            onToggle: (v) => onFreeDeliveryToggle?.(v),
            label: t("product.filters.freeDeliveryOnly", "Free delivery"),
        },
        {
            key: "instant",
            checked: instantDeliveryOnly,
            onToggle: (v) => onInstantDeliveryToggle?.(v),
            label: t("productsListing.instantDelivery", "Instant delivery"),
        },
        {
            key: "sale",
            checked: onSaleOnly,
            onToggle: (v) => onOnSaleToggle?.(v),
            label: t("productsListing.onSale", "On sale"),
        },
        {
            key: "stock",
            checked: inStockOnly,
            onToggle: (v) => onInStockToggle?.(v),
            label: t("product.filters.inStockOnly", "In stock"),
        },
    ];

    const typeChips = (
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TYPE_OPTIONS.map((opt) => {
                const active = localType === opt.value;
                return (
                    <button
                        key={opt.value ?? "all"}
                        type="button"
                        onClick={() => handleTypeChange(opt.value)}
                        className={chipCls(active)}
                        style={
                            active
                                ? chipActiveStyle
                                : apiSurface
                                  ? {
                                        borderColor: apiSurface.cardBorder,
                                        backgroundColor: `color-mix(in srgb, ${apiSurface.cardBackground} 70%, #020617)`,
                                        color: apiSurface.pageColor,
                                    }
                                  : undefined
                        }
                    >
                        {typeOptionLabel(t, opt.value)}
                    </button>
                );
            })}
        </div>
    );

    const searchField = (
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
    );

    const filterBody = (
        <div className={divideCls} style={divideStyle}>
            <FilterSection>{searchField}</FilterSection>

            <FilterSection title={t("categories.typeFilter", "Category Type")}>
                {typeChips}
            </FilterSection>

            <FilterSection title={t("categories.priceRange", "Price range")}>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <input
                        type="number"
                        min={0}
                        value={localMinPrice}
                        onChange={(e) => handleMinPriceChange(e.target.value)}
                        placeholder={t("baskets.min", "Min")}
                        aria-label={t("baskets.min", "Min")}
                        className={inputCls}
                        style={inputStyle}
                    />
                    <span className="text-sm text-custom-tertiary" aria-hidden>
                        –
                    </span>
                    <input
                        type="number"
                        min={0}
                        value={localMaxPrice}
                        onChange={(e) => handleMaxPriceChange(e.target.value)}
                        placeholder={t("baskets.max", "Max")}
                        aria-label={t("baskets.max", "Max")}
                        className={inputCls}
                        style={inputStyle}
                    />
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
                <div className="flex flex-wrap gap-1.5" style={labelColor}>
                    {optionChips.map((opt) => (
                        <button
                            key={opt.key}
                            type="button"
                            aria-pressed={opt.checked}
                            onClick={() => opt.onToggle(!opt.checked)}
                            className={chipCls(opt.checked)}
                            style={
                                opt.checked
                                    ? chipActiveStyle
                                    : apiSurface
                                      ? {
                                            borderColor: apiSurface.cardBorder,
                                            backgroundColor: `color-mix(in srgb, ${apiSurface.cardBackground} 70%, #020617)`,
                                            color: apiSurface.pageColor,
                                        }
                                      : undefined
                            }
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </FilterSection>

            {showAttributes ? (
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
            ) : null}
        </div>
    );

    const headerIcon = (
        <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
            style={{
                background: apiSurface
                    ? `linear-gradient(135deg, ${apiSurface.pageColor}, color-mix(in srgb, ${apiSurface.pageColor} 65%, #020617))`
                    : "linear-gradient(135deg, var(--color-gradient-from, var(--color-main)), var(--color-gradient-to, var(--color-api-second, var(--color-main))))",
                color: apiSurface ? "#0b1220" : undefined,
            }}
        >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={2.2} aria-hidden />
        </span>
    );

    const clearButton = hasActive ? (
        <button
            type="button"
            onClick={handleReset}
            className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors",
                !apiSurface &&
                    "text-custom-secondary hover:bg-slate-100 hover:text-custom-primary dark:text-[#A1A1AA] dark:hover:bg-white/[0.06] dark:hover:text-white",
            )}
            style={apiSurface ? { color: apiSurface.pageColor } : undefined}
        >
            <X className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden />
            {t("common.clear", "Clear")}
        </button>
    ) : null;

    const mobileSheet =
        mobileOpen && typeof document !== "undefined"
            ? createPortal(
                  <div className="fixed inset-0 z-[99980] lg:hidden" role="presentation">
                      <button
                          type="button"
                          aria-label={t("common.close", "Close")}
                          className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
                          onClick={() => setMobileOpen(false)}
                      />
                      <div
                          ref={sheetRef}
                          role="dialog"
                          aria-modal="true"
                          aria-label={t("categories.filters", "Filters")}
                          className={cn(
                              "animate-slide-up absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[22px] border border-b-0 shadow-[0_-18px_50px_-24px_rgba(0,0,0,0.45)]",
                              !apiSurface &&
                                  "border-slate-200/80 bg-custom-card dark:border-white/10 dark:bg-[#1C1916]",
                          )}
                          style={
                              apiSurface
                                  ? {
                                        backgroundColor: apiSurface.cardBackground,
                                        borderColor: apiSurface.cardBorder,
                                        color: apiSurface.pageColor,
                                    }
                                  : undefined
                          }
                      >
                          <div className="flex flex-col items-center px-4 pt-2.5">
                              <span
                                  className={cn(
                                      "mb-3 h-1 w-10 rounded-full",
                                      !apiSurface && "bg-slate-300 dark:bg-white/20",
                                  )}
                                  style={
                                      apiSurface
                                          ? {
                                                backgroundColor: `color-mix(in srgb, ${apiSurface.pageColor} 35%, transparent)`,
                                            }
                                          : undefined
                                  }
                                  aria-hidden
                              />
                              <div className="mb-1 flex w-full items-center justify-between gap-3">
                                  <div className="flex min-w-0 items-center gap-2.5">
                                      {headerIcon}
                                      <div className="min-w-0 leading-tight">
                                          <p
                                              className={cn(
                                                  "truncate text-sm font-bold",
                                                  !apiSurface && "text-custom-primary dark:text-white",
                                              )}
                                              style={
                                                  apiSurface
                                                      ? { color: apiSurface.pageColor }
                                                      : undefined
                                              }
                                          >
                                              {t("categories.filters", "Filters")}
                                          </p>
                                          <p
                                              className={cn(
                                                  "truncate text-xs",
                                                  !apiSurface && "text-custom-tertiary",
                                              )}
                                              style={
                                                  apiSurface
                                                      ? {
                                                            color: `color-mix(in srgb, ${apiSurface.pageColor} 72%, transparent)`,
                                                        }
                                                      : undefined
                                              }
                                          >
                                              {activeFilterCount > 0
                                                  ? t(
                                                        "categories.activeFiltersCount",
                                                        "{{count}} active",
                                                    ).replace(
                                                        "{{count}}",
                                                        String(activeFilterCount),
                                                    )
                                                  : t(
                                                        "home.refineResults",
                                                        "Refine results",
                                                    )}
                                          </p>
                                      </div>
                                  </div>
                                  <div className="flex shrink-0 items-center gap-1">
                                      {clearButton}
                                      <button
                                          type="button"
                                          onClick={() => setMobileOpen(false)}
                                          className={cn(
                                              "inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                                              !apiSurface &&
                                                  "text-custom-secondary hover:bg-slate-100 hover:text-custom-primary dark:text-[#A1A1AA] dark:hover:bg-white/[0.06] dark:hover:text-white",
                                          )}
                                          style={
                                              apiSurface
                                                  ? { color: apiSurface.pageColor }
                                                  : undefined
                                          }
                                          aria-label={t("common.close", "Close")}
                                      >
                                          <X className="h-4 w-4" strokeWidth={2.2} />
                                      </button>
                                  </div>
                              </div>
                          </div>

                          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3 pt-2">
                              {filterBody}
                          </div>

                          <div
                              className={cn(
                                  "shrink-0 border-t px-4 pb-[max(0.85rem,env(safe-area-inset-bottom))] pt-3",
                                  !apiSurface && "border-slate-200/80 dark:border-white/10",
                              )}
                              style={
                                  apiSurface
                                      ? { borderColor: apiSurface.cardBorder }
                                      : undefined
                              }
                          >
                              <button
                                  type="button"
                                  onClick={() => setMobileOpen(false)}
                                  className="flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-95"
                                  style={{
                                      background: apiSurface
                                          ? `linear-gradient(135deg, ${apiSurface.pageColor}, color-mix(in srgb, ${apiSurface.pageColor} 65%, #020617))`
                                          : "linear-gradient(135deg, var(--color-gradient-from, var(--color-main)), var(--color-gradient-to, var(--color-api-second, var(--color-main))))",
                                      color: apiSurface ? "#0b1220" : undefined,
                                  }}
                              >
                                  {t("categories.applyFilters", "Apply filters")}
                                  {activeFilterCount > 0 ? ` · ${activeFilterCount}` : ""}
                              </button>
                          </div>
                      </div>
                  </div>,
                  document.body,
              )
            : null;

    return (
        <div className="flex flex-col" style={apiSurface ? { color: apiSurface.mutedColor } : undefined}>
            {/* Mobile trigger */}
            <div className="lg:hidden">
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-start shadow-sm transition-colors",
                        !apiSurface &&
                            "border-slate-200/80 bg-white hover:bg-slate-50/80 dark:border-white/10 dark:bg-[#24201C] dark:hover:bg-[#2A2622]",
                    )}
                    style={
                        apiSurface
                            ? {
                                  borderColor: apiSurface.cardBorder,
                                  backgroundColor: apiSurface.cardBackground,
                                  color: apiSurface.pageColor,
                              }
                            : undefined
                    }
                    aria-haspopup="dialog"
                    aria-expanded={mobileOpen}
                >
                    {headerIcon}
                    <span className="min-w-0 flex-1 leading-tight">
                        <span
                            className={cn(
                                "block text-sm font-bold",
                                !apiSurface && "text-custom-primary dark:text-white",
                            )}
                            style={apiSurface ? { color: apiSurface.pageColor } : undefined}
                        >
                            {t("categories.filters", "Filters")}
                        </span>
                        <span
                            className={cn(
                                "mt-0.5 block truncate text-xs",
                                !apiSurface && "text-custom-tertiary",
                            )}
                            style={
                                apiSurface
                                    ? {
                                          color: `color-mix(in srgb, ${apiSurface.pageColor} 72%, transparent)`,
                                      }
                                    : undefined
                            }
                        >
                            {activeFilterCount > 0
                                ? t("categories.activeFiltersCount", "{{count}} active").replace(
                                      "{{count}}",
                                      String(activeFilterCount),
                                  )
                                : t("home.refineResults", "Refine results")}
                        </span>
                    </span>
                    {activeFilterCount > 0 ? (
                        <span
                            className="inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[11px] font-bold text-white tabular-nums"
                            style={{
                                background: apiSurface
                                    ? `linear-gradient(135deg, ${apiSurface.pageColor}, color-mix(in srgb, ${apiSurface.pageColor} 65%, #020617))`
                                    : "linear-gradient(135deg, var(--color-gradient-from, var(--color-main)), var(--color-gradient-to, var(--color-api-second, var(--color-main))))",
                                color: apiSurface ? "#0b1220" : undefined,
                            }}
                        >
                            {activeFilterCount}
                        </span>
                    ) : null}
                    <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4 shrink-0 opacity-50 rtl:rotate-180"
                        aria-hidden
                    >
                        <path
                            fillRule="evenodd"
                            d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.17 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
                {mobileSheet}
            </div>

            {/* Desktop panel */}
            <div className="hidden lg:block">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                        {headerIcon}
                        <div className="min-w-0 leading-tight">
                            <h3
                                className={cn(
                                    "truncate text-sm font-bold tracking-tight",
                                    !apiSurface && "text-custom-primary dark:text-white",
                                )}
                                style={apiSurface ? { color: apiSurface.pageColor } : undefined}
                            >
                                {t("categories.filters", "Filters")}
                            </h3>
                            <p
                                className={cn(
                                    "truncate text-xs",
                                    !apiSurface && "text-custom-tertiary",
                                )}
                                style={
                                    apiSurface
                                        ? {
                                              color: `color-mix(in srgb, ${apiSurface.pageColor} 72%, transparent)`,
                                          }
                                        : undefined
                                }
                            >
                                {activeFilterCount > 0
                                    ? t(
                                          "categories.activeFiltersCount",
                                          "{{count}} active",
                                      ).replace("{{count}}", String(activeFilterCount))
                                    : t("home.refineResults", "Refine results")}
                            </p>
                        </div>
                    </div>
                    {clearButton}
                </div>
                {filterBody}
            </div>
        </div>
    );
}
