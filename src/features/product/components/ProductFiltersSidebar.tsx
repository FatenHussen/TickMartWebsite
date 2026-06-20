import type { ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/shared/lib/utils";
import { _CategoriesApi } from "@/features/home/api/categories.service";
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
    { value: "recommended", labelKey: "productsListing.typeRecommended" },
    { value: "for_you", labelKey: "productsListing.typeForYou" },
    { value: "search_based", labelKey: "productsListing.typeSearchBased" },
    { value: "most_popular", labelKey: "productsListing.typeMostPopular" },
];

const SORT_OPTIONS: { value: ProductSortBy; labelKey: string }[] = [
    { value: "price_desc", labelKey: "productsListing.sortPriceDesc" },
    { value: "price_asc", labelKey: "productsListing.sortPriceAsc" },
    { value: "newest", labelKey: "productsListing.sortNewest" },
    { value: "oldest", labelKey: "productsListing.sortOldest" },
    { value: "rating_desc", labelKey: "productsListing.sortRatingDesc" },
    { value: "rating_asc", labelKey: "productsListing.sortRatingAsc" },
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
        <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-[color-mix(in_srgb,var(--color-text)_82%,transparent)]">{children}</span>
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

    const {
        data: categoryAttributes = [],
        isLoading: isAttributesLoading,
        error: attributesError,
    } = useQuery({
        queryKey: ["categories", "attributes", categoryId],
        queryFn: async () => {
            const res = await _CategoriesApi.getCategoryAttributes(categoryId!);
            return res.data;
        },
        enabled: categoryId != null && categoryId > 0,
    });

    const toggleAttributeValue = (valueId: number) => {
        const cur = new Set(draft.attribute_values ?? []);
        if (cur.has(valueId)) cur.delete(valueId);
        else cur.add(valueId);
        apply({ attribute_values: cur.size ? [...cur] : undefined });
    };

    // Parents with children must filter by a child id in the products/sections APIs.
    useEffect(() => {
        if (!selectedParentCategory?.children?.length || categoryId == null) return;
        if (categoryId !== selectedParentCategory.id) return;
        onApplyDraft({
            ...draftRef.current,
            category_id: selectedParentCategory.children[0].id,
        });
    }, [selectedParentCategory, categoryId, onApplyDraft]);

    const inputCls = cn(
        "w-full rounded-lg border border-sky-200/90 bg-white/80 px-3 py-2.5 text-sm text-slate-800",
        "dark:border-[color-mix(in_srgb,var(--color-main)_22%,#1f2230)] dark:bg-[color-mix(in_srgb,var(--color-main)_18%,#13151c)] dark:text-[var(--color-text)]",
        "placeholder:text-slate-400 dark:placeholder:text-[color-mix(in_srgb,var(--color-text)_55%,transparent)] outline-none transition-colors",
        "focus:border-[#00ACC1] focus:ring-2 focus:ring-[#00ACC1]/20 dark:focus:border-[var(--color-main)] dark:focus:ring-[color-mix(in_srgb,var(--color-main)_45%,transparent)]"
    );

    const selectCls = cn(inputCls, "cursor-pointer");

    const checkboxCls =
        "mt-0.5 h-4 w-4 shrink-0 rounded border-sky-300 text-[#00ACC1] focus:ring-[#00ACC1]/30 dark:border-[color-mix(in_srgb,var(--color-main)_30%,#1f2230)] dark:text-[var(--color-main)] dark:focus:ring-[color-mix(in_srgb,var(--color-main)_45%,transparent)]";

    const row = "flex cursor-pointer items-start gap-3 text-sm text-slate-800 dark:text-[var(--color-text)]";

    return (
        <div
            className={cn(
                "w-full min-w-0 max-w-full rounded-[12px] p-4 sm:p-6",
                "lg:max-w-[320px]",
                "bg-gradient-to-b from-[#E4F0FB] to-[#E5F3FF]",
                "dark:from-[color-mix(in_srgb,var(--color-main)_18%,#13151c)] dark:to-[color-mix(in_srgb,var(--color-api-second)_18%,#10121a)]",
                "shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
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
                        value={selectedParentCategory?.id ?? ""}
                        onChange={(e) => {
                            const v = e.target.value;
                            if (!v) {
                                apply({
                                    category_id: undefined,
                                    attribute_values: undefined,
                                });
                                return;
                            }
                            const parent = categoryItems.find(
                                (c) => c.id === Number(v)
                            );
                            const nextCategoryId = parent?.children?.length
                                ? parent.children[0].id
                                : Number(v);
                            apply({
                                category_id: nextCategoryId,
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

                {subcategoryOptions.length > 0 && selectedParentCategory && (
                    <div>
                        <FieldLabel>
                            {t("categories.subcategories", "Subcategory")}
                        </FieldLabel>
                        <select
                            value={
                                subcategoryOptions.some((sub) => sub.id === categoryId)
                                    ? categoryId
                                    : subcategoryOptions[0]?.id ?? ""
                            }
                            onChange={(e) => {
                                const v = e.target.value;
                                apply({
                                    category_id: Number(v),
                                    attribute_values: undefined,
                                });
                            }}
                            className={selectCls}
                        >
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
                    />
                ) : (
                    <p className="text-xs text-slate-500 dark:text-[color-mix(in_srgb,var(--color-text)_70%,transparent)]">
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

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <FieldLabel>{t("baskets.min", "Min")}</FieldLabel>
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
                        <FieldLabel>{t("baskets.max", "Max")}</FieldLabel>
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
                    <FieldLabel>{t("productsListing.countryLabel", "Country")}</FieldLabel>
                    <input
                        type="text"
                        value={draft.country ?? ""}
                        onChange={(e) =>
                            applyDebounced({ country: e.target.value.trim() || undefined })
                        }
                        maxLength={100}
                        className={inputCls}
                    />
                </div>

                <div>
                    <FieldLabel>{t("productsListing.nameLabel", "Name")}</FieldLabel>
                    <input
                        type="text"
                        value={draft.name ?? ""}
                        onChange={(e) =>
                            applyDebounced({ name: e.target.value.trim() || undefined })
                        }
                        maxLength={100}
                        className={inputCls}
                    />
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

                <div className="space-y-2.5 border-t border-sky-200/60 dark:border-[color-mix(in_srgb,var(--color-main)_22%,#1f2230)] pt-2">
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

                <div className="flex flex-col gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onApply}
                        className="w-full rounded-xl bg-[#00ACC1] dark:bg-[var(--color-main)] py-3 text-sm font-semibold text-white dark:text-[var(--color-text)] shadow-sm transition-opacity hover:opacity-[0.96]"
                    >
                        {t("productsListing.applyFilters", "Apply filters")}
                    </button>
                    <button
                        type="button"
                        onClick={onClear}
                        className="w-full py-2 text-center text-sm font-semibold text-[#00838F] dark:text-[var(--color-api-second)] hover:underline"
                    >
                        {t("productsListing.clearAll", "Clear all")}
                    </button>
                </div>
            </div>
        </div>
    );
}
