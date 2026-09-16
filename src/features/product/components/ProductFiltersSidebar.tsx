import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/shared/lib/utils";
import { useCategoryAttributes } from "@/features/home/hooks/useCategoryAttributes";
import { _LocationApi } from "@/features/auth/api/location.service";
import type { Category } from "@/features/home/types";
import type {
    ProductsFilters,
    ProductListType,
    ProductSortBy,
} from "@/features/home/api/products.service";
import CategoryAttributeFilters from "./CategoryAttributeFilters";

const PRODUCT_TYPE_OPTIONS: { value: ProductListType; labelKey: string }[] = [
    { value: "new", labelKey: "productsListing.typeNew" },
    { value: "trend", labelKey: "productsListing.typeTrend" },
    { value: "top_rated", labelKey: "productsListing.typeTopRated" },
    { value: "offers", labelKey: "productsListing.typeOffers" },
    { value: "most_popular", labelKey: "productsListing.typeMostPopular" },
    { value: "search_based", labelKey: "productsListing.typeSearchBased" },
];

const SORT_OPTIONS: { value: ProductSortBy; labelKey: string }[] = [
    { value: "price_asc", labelKey: "productsListing.sortPriceAsc" },
    { value: "price_desc", labelKey: "productsListing.sortPriceDesc" },
    { value: "newest", labelKey: "productsListing.sortNewest" },
    { value: "oldest", labelKey: "productsListing.sortOldest" },
    { value: "rating", labelKey: "productsListing.sortRating" },
];

type ProductFiltersSidebarProps = {
    draft: ProductsFilters;
    onDraftChange: (next: ProductsFilters) => void;
    onApplyDraft: (next: ProductsFilters) => void;
    onApply: () => void;
    onClear: () => void;
    categoryOptions: { value: number; label: string }[];
    categoryItems: Category[];
    brandOptions: { value: number; label: string }[];
    shopOptions: { value: number; label: string }[];
    onCategoryScroll?: (e: React.UIEvent<HTMLSelectElement>) => void;
    onBrandScroll?: (e: React.UIEvent<HTMLSelectElement>) => void;
    onShopScroll?: (e: React.UIEvent<HTMLSelectElement>) => void;
    isFetchingMoreCats?: boolean;
    isFetchingMoreBrands?: boolean;
    isFetchingMoreShops?: boolean;
};

function FieldLabel({ children }: { children: ReactNode }) {
    return (
        <span className="mb-1.5 block text-xs font-medium text-stone-600 dark:text-[#E8E4DC]/75">{children}</span>
    );
}

export default function ProductFiltersSidebar({
    draft,
    onDraftChange,
    onApplyDraft,
    onApply,
    onClear,
    categoryOptions,
    categoryItems,
    brandOptions,
    shopOptions,
    onCategoryScroll,
    onBrandScroll,
    onShopScroll,
    isFetchingMoreCats,
    isFetchingMoreBrands,
    isFetchingMoreShops,
}: ProductFiltersSidebarProps) {
    const { t } = useTranslation();

    const draftRef = useRef(draft);
    draftRef.current = draft;

    const debouncedApplyRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(
        () => () => {
            if (debouncedApplyRef.current) clearTimeout(debouncedApplyRef.current);
        },
        [],
    );

    const apply = (patch: Partial<ProductsFilters>) => {
        onApplyDraft({ ...draftRef.current, ...patch });
    };

    const applyDebounced = (patch: Partial<ProductsFilters>) => {
        const next = { ...draftRef.current, ...patch };
        draftRef.current = next;
        onDraftChange(next);
        if (debouncedApplyRef.current) clearTimeout(debouncedApplyRef.current);
        debouncedApplyRef.current = setTimeout(() => onApplyDraft(next), 400);
    };

    const categoryId = draft.category_id;

    const selectedParentCategory = useMemo(() => {
        if (categoryId == null) return undefined;
        const asParent = categoryItems.find((c) => c.id === categoryId);
        if (asParent) return asParent;
        return categoryItems.find((c) =>
            c.children?.some((child) => child.id === categoryId)
        );
    }, [categoryItems, categoryId]);

    const subcategoryOptions = selectedParentCategory?.children ?? [];

    /** Root of the selected tree — attributes are identical for the whole subtree. */
    const attributesRootId = selectedParentCategory?.id ?? categoryId;

    const {
        data: categoryAttributes = [],
        isLoading: isAttributesLoading,
        error: attributesError,
    } = useCategoryAttributes(categoryId, attributesRootId);

    const { data: countries = [] } = useQuery({
        queryKey: ["location", "countries", "products-filter"],
        queryFn: async () => {
            const res = await _LocationApi.getCountries();
            return res.data?.items ?? [];
        },
        staleTime: 1000 * 60 * 30,
    });

    const hasExtraFilters = Boolean(
        draft.shop_id ||
            draft.brand_id ||
            draft.country ||
            draft.search ||
            draft.type ||
            draft.is_free_delivery ||
            draft.is_instant_delivery ||
            draft.on_sale ||
            draft.in_stock_only ||
            (draft.attribute_values && draft.attribute_values.length > 0) ||
            subcategoryOptions.length > 0,
    );

    const [showMore, setShowMore] = useState(hasExtraFilters);

    useEffect(() => {
        if (hasExtraFilters) setShowMore(true);
    }, [hasExtraFilters]);

    const toggleAttributeValue = (valueId: number) => {
        const cur = new Set(draft.attribute_values ?? []);
        if (cur.has(valueId)) cur.delete(valueId);
        else cur.add(valueId);
        apply({ attribute_values: cur.size ? [...cur] : undefined });
    };

    // Keep subcategory dropdown optional — parents are valid `category_id`s
    // (backend returns the whole subtree). Do NOT force a leaf.

    const inputCls = cn(
        "w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800",
        "dark:border-white/10 dark:bg-white/5 dark:text-[#E8E4DC]",
        "placeholder:text-stone-400 outline-none transition-colors",
        "focus:border-[#ff9f00] focus:ring-2 focus:ring-[#ff9f00]/20"
    );

    const selectCls = cn(inputCls, "cursor-pointer");

    const checkboxCls =
        "mt-0.5 h-4 w-4 shrink-0 rounded border-stone-300 text-[#ff9f00] focus:ring-[#ff9f00]/30 dark:border-white/20";

    const row = "flex cursor-pointer items-start gap-3 text-sm text-stone-800 dark:text-[#E8E4DC]";

    return (
        <div
            className={cn(
                "w-full min-w-0 max-w-full rounded-2xl border border-stone-200/90 bg-[#FFFcf8] p-4 sm:p-5",
                "lg:max-w-[320px]",
                "dark:border-white/10 dark:bg-[#24201C]",
            )}
        >
            <div
                className={cn(
                    "flex max-h-[min(60vh,640px)] flex-col gap-4 overflow-y-auto sm:max-h-[min(72vh,880px)] sm:gap-6 lg:max-h-[min(85vh,959px)]",
                    "[scrollbar-width:none]",
                    "[-ms-overflow-style:none]",
                    "[&::-webkit-scrollbar]:hidden"
                )}
            >
                <div>
                    <FieldLabel>{t("categories.categories", "Category")}</FieldLabel>
                    <select
                        value={selectedParentCategory?.id ?? categoryId ?? ""}
                        onChange={(e) => {
                            const v = e.target.value;
                            if (!v) {
                                apply({
                                    category_id: undefined,
                                    attribute_values: undefined,
                                });
                                return;
                            }
                            apply({
                                category_id: Number(v),
                                attribute_values: undefined,
                            });
                        }}
                        onScroll={onCategoryScroll}
                        className={selectCls}
                    >
                        <option value="">
                            {t("categories.allCategories", "All categories")}
                        </option>
                        {categoryOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                        {isFetchingMoreCats && (
                            <option value="" disabled>
                                {t("common.loading")}
                            </option>
                        )}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <FieldLabel>{t("productsListing.priceMin")}</FieldLabel>
                        <input
                            type="number"
                            min={0}
                            value={draft.price_min ?? ""}
                            onChange={(e) =>
                                applyDebounced({
                                    price_min: e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                })
                            }
                            className={inputCls}
                        />
                    </div>
                    <div>
                        <FieldLabel>{t("productsListing.priceMax")}</FieldLabel>
                        <input
                            type="number"
                            min={0}
                            value={draft.price_max ?? ""}
                            onChange={(e) =>
                                applyDebounced({
                                    price_max: e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                })
                            }
                            className={inputCls}
                        />
                    </div>
                </div>

                <div>
                    <FieldLabel>{t("productsListing.sortBy", "Sort by")}</FieldLabel>
                    <select
                        value={draft.sort_by ?? ""}
                        onChange={(e) =>
                            apply({
                                sort_by: (e.target.value || undefined) as
                                    | ProductSortBy
                                    | undefined,
                            })
                        }
                        className={selectCls}
                    >
                        <option value="">
                            {t("productsListing.sortDefault", "Default")}
                        </option>
                        {SORT_OPTIONS.map(({ value, labelKey }) => (
                            <option key={value} value={value}>
                                {t(labelKey, value)}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    onClick={() => setShowMore((open) => !open)}
                    className="text-start text-sm font-semibold text-[#ff9f00]"
                >
                    {showMore
                        ? t("productsListing.fewerFilters")
                        : t("productsListing.moreFilters")}
                </button>

                {showMore ? (
                    <>
                {subcategoryOptions.length > 0 && selectedParentCategory && (
                    <div>
                        <FieldLabel>
                            {t("categories.subcategories", "Subcategory")}
                        </FieldLabel>
                        <select
                            value={
                                subcategoryOptions.some((sub) => sub.id === categoryId)
                                    ? categoryId
                                    : ""
                            }
                            onChange={(e) => {
                                const v = e.target.value;
                                apply({
                                    category_id: v
                                        ? Number(v)
                                        : selectedParentCategory.id,
                                    attribute_values: undefined,
                                });
                            }}
                            className={selectCls}
                        >
                            <option value="">
                                {t("categories.allSubcategories", "All subcategories")}
                            </option>
                            {subcategoryOptions.map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {categoryId ? (
                    <CategoryAttributeFilters
                        attributes={categoryAttributes}
                        selectedIds={draft.attribute_values ?? []}
                        onToggleValue={toggleAttributeValue}
                        isLoading={isAttributesLoading}
                        error={attributesError}
                        hideEmptyMessage
                    />
                ) : (
                    <p className="text-xs text-stone-500 dark:text-[#E8E4DC]/70">
                        {t(
                            "productsListing.selectCategoryForAttributes",
                            "Select a category to filter by size, color, and other attributes."
                        )}
                    </p>
                )}

                <div>
                    <FieldLabel>{t("store.store", "Shop")}</FieldLabel>
                    <select
                        value={draft.shop_id ?? ""}
                        onChange={(e) =>
                            apply({
                                shop_id: e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                            })
                        }
                        onScroll={onShopScroll}
                        className={selectCls}
                    >
                        <option value="">{t("store.allStores", "All shops")}</option>
                        {shopOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                        {isFetchingMoreShops && (
                            <option value="" disabled>
                                {t("common.loading")}
                            </option>
                        )}
                    </select>
                </div>

                <div>
                    <FieldLabel>{t("brands.title", "Brand")}</FieldLabel>
                    <select
                        value={draft.brand_id ?? ""}
                        onChange={(e) =>
                            apply({
                                brand_id: e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                            })
                        }
                        onScroll={onBrandScroll}
                        className={selectCls}
                    >
                        <option value="">{t("brands.allBrands", "All brands")}</option>
                        {brandOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                        {isFetchingMoreBrands && (
                            <option value="" disabled>
                                {t("common.loading")}
                            </option>
                        )}
                    </select>
                </div>

                <div>
                    <FieldLabel>{t("productsListing.countryLabel", "Country")}</FieldLabel>
                    <select
                        value={draft.country ?? ""}
                        onChange={(e) =>
                            apply({ country: e.target.value.trim() || undefined })
                        }
                        className={selectCls}
                    >
                        <option value="">
                            {t("productsListing.allCountries", "All countries")}
                        </option>
                        {countries.map((c) => (
                            <option key={c.id} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <FieldLabel>{t("productsListing.searchLabel", "Search")}</FieldLabel>
                    <input
                        type="search"
                        value={draft.search ?? ""}
                        onChange={(e) =>
                            applyDebounced({ search: e.target.value.trim() || undefined })
                        }
                        maxLength={255}
                        className={inputCls}
                    />
                </div>

                <div>
                    <FieldLabel>{t("productsListing.collectionType", "Type")}</FieldLabel>
                    <select
                        value={draft.type ?? ""}
                        onChange={(e) =>
                            apply({
                                type: (e.target.value || undefined) as
                                    | ProductListType
                                    | undefined,
                            })
                        }
                        className={selectCls}
                    >
                        <option value="">{t("productsListing.allTypes", "All")}</option>
                        {PRODUCT_TYPE_OPTIONS.map(({ value, labelKey }) => (
                            <option key={value} value={value}>
                                {t(labelKey, value)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2.5 border-t border-stone-200/80 pt-2 dark:border-white/10">
                    <label className={row}>
                        <input
                            type="checkbox"
                            className={checkboxCls}
                            checked={!!draft.is_free_delivery}
                            onChange={(e) =>
                                apply({
                                    is_free_delivery: e.target.checked ? true : undefined,
                                })
                            }
                        />
                        {t("productsListing.freeDelivery", "Free delivery")}
                    </label>
                    <label className={row}>
                        <input
                            type="checkbox"
                            className={checkboxCls}
                            checked={!!draft.is_instant_delivery}
                            onChange={(e) =>
                                apply({
                                    is_instant_delivery: e.target.checked
                                        ? true
                                        : undefined,
                                })
                            }
                        />
                        {t("productsListing.instantDelivery", "Instant delivery")}
                    </label>
                    <label className={row}>
                        <input
                            type="checkbox"
                            className={checkboxCls}
                            checked={!!draft.on_sale}
                            onChange={(e) =>
                                apply({ on_sale: e.target.checked ? true : undefined })
                            }
                        />
                        {t("productsListing.onSale", "On sale")}
                    </label>
                    <label className={row}>
                        <input
                            type="checkbox"
                            className={checkboxCls}
                            checked={!!draft.in_stock_only}
                            onChange={(e) =>
                                apply({
                                    in_stock_only: e.target.checked ? true : undefined,
                                })
                            }
                        />
                        {t("productsListing.inStockOnly", "In stock only")}
                    </label>
                </div>
                    </>
                ) : null}

                <div className="flex flex-col gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onApply}
                        className="cta-honey w-full rounded-xl py-3 text-sm font-semibold"
                    >
                        {t("productsListing.applyFilters", "Apply filters")}
                    </button>
                    <button
                        type="button"
                        onClick={onClear}
                        className="w-full py-2 text-center text-sm font-semibold text-stone-600 hover:underline dark:text-[#E8E4DC]/80"
                    >
                        {t("productsListing.clearAll", "Clear all")}
                    </button>
                </div>
            </div>
        </div>
    );
}
