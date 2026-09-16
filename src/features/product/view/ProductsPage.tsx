import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";
import SideContentLayout from "@/layout/SideContentLayout";
import { _ProductsApi } from "@/features/home/api/products.service";
import type { ProductsFilters } from "@/features/home/api/products.service";
import { _CategoriesApi } from "@/features/home/api/categories.service";
import { _BrandApi } from "@/features/product/api/brandApi";
import { _ShopApi } from "@/features/store/api/shopApi";
import { useInfiniteSelect } from "@/shared/hooks/useInfiniteSelect";
import { useInfiniteList } from "@/shared/hooks/useInfiniteList";
import { useToggleFavorite } from "@/features/account/hooks/useFavorites";
import type { SectionsFilters } from "@/features/home/api/sections.service";
import { useSectionsByPosition } from "@/features/home/hooks/useSections";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import FullBleedSection from "@/shared/component/FullBleedSection";
import ProductCard from "@/shared/component/card/ProductCard";
import ProductCardSkeleton from "@/shared/component/skeleton/ProductCardSkeleton";
import { paths } from "@/app/routes/path/paths";
import type { Category } from "@/features/home/types";
import type { BrandListItem } from "@/features/product/types/brand";
import type { ShopListItem } from "@/features/store/types/shop";
import type { ProductItem } from "@/features/home/types";
import ProductFiltersSidebar from "../components/ProductFiltersSidebar";
import {
    parseProductListingParams,
    serializeProductListingParams,
} from "../lib/productListingParams";
import {
    mapApiBottomBadgesToProductCard,
    mapApiTopBadgesToProductCard,
} from "@/shared/lib/mapProductBadges";
import { resolveListingCardPrices } from "@/shared/lib/formatApiPrice";
import { cn } from "@/shared/lib/utils";

const SORT_CHIP_KEYS: Record<string, string> = {
    price_asc: "productsListing.sortPriceAsc",
    price_desc: "productsListing.sortPriceDesc",
    newest: "productsListing.sortNewest",
    oldest: "productsListing.sortOldest",
    rating: "productsListing.sortRating",
};

export default function ProductsPage() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const { currency } = useCurrency();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const applied = useMemo(
        () => parseProductListingParams(searchParams),
        [searchParams]
    );

    const [draft, setDraft] = useState<ProductsFilters>(() =>
        parseProductListingParams(new URLSearchParams(window.location.search))
    );

    useEffect(() => {
        setDraft(parseProductListingParams(searchParams));
    }, [searchParams]);

    const {
        options: categoryOptions,
        items: categoryItems,
        handleScroll: handleCatScroll,
        isFetchingNextPage: isFetchingMoreCats,
    } = useInfiniteSelect<Category>({
        queryKey: ["categories", "select", "products-page"],
        fetchFn: async (page) => {
            const res = await _CategoriesApi.getCategories(page);
            return res.data;
        },
        mapToOption: (cat) => ({ value: cat.id, label: cat.name }),
    });

    const {
        options: brandOptions,
        handleScroll: handleBrandScroll,
        isFetchingNextPage: isFetchingMoreBrands,
    } = useInfiniteSelect<BrandListItem>({
        queryKey: ["brands", "select", "products-page"],
        fetchFn: async (page) => {
            const res = await _BrandApi.getBrands({ page });
            return res.data;
        },
        mapToOption: (brand) => ({ value: brand.id, label: brand.name }),
    });

    const {
        options: shopOptions,
        handleScroll: handleShopScroll,
        isFetchingNextPage: isFetchingMoreShops,
    } = useInfiniteSelect<ShopListItem>({
        queryKey: ["shops", "select", "products-page"],
        fetchFn: async (page) => {
            const res = await _ShopApi.getShops({ page });
            return res.data;
        },
        mapToOption: (shop) => ({ value: shop.id, label: shop.name }),
    });

    const numericCategoryOptions = useMemo(
        () =>
            categoryOptions
                .filter((opt): opt is { value: number; label: string } => typeof opt.value === "number")
                .map((opt) => ({ value: opt.value, label: opt.label })),
        [categoryOptions]
    );
    const numericBrandOptions = useMemo(
        () =>
            brandOptions
                .filter((opt): opt is { value: number; label: string } => typeof opt.value === "number")
                .map((opt) => ({ value: opt.value, label: opt.label })),
        [brandOptions]
    );
    const numericShopOptions = useMemo(
        () =>
            shopOptions
                .filter((opt): opt is { value: number; label: string } => typeof opt.value === "number")
                .map((opt) => ({ value: opt.value, label: opt.label })),
        [shopOptions]
    );

    const listFilters = useMemo(() => {
        const { page: _p, per_page: _pp, ...rest } = applied;
        return rest;
    }, [applied]);

    const sectionsFilters = useMemo((): SectionsFilters => listFilters, [listFilters]);

    const {
        items: products,
        observerTarget,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        totalCount,
    } = useInfiniteList<ProductItem>({
        queryKey: ["products", "listing", "infinite", listFilters],
        fetchFn: (page) =>
            _ProductsApi.getProducts({ ...applied, page }).then((r) => r.data),
        threshold: 500,
    });

    const toggleFavorite = useToggleFavorite();

    const { beforeSections, afterSections } = useSectionsByPosition(
        "products",
        sectionsFilters,
    );
    const bannerSections = beforeSections.filter((s) => s.display_type_id === 1);
    const otherBeforeSections = beforeSections.filter(
        (s) => s.display_type_id !== 1
    );

    const handleProductClick = (id: number) => {
        navigate(paths.client.productDetails(id));
    };

    const handleToggleFavorite = (id: number) => {
        toggleFavorite.mutate({ type: "product", id });
    };

    const applyDraft = useCallback((next: ProductsFilters) => {
        setDraft(next);
        const qs = serializeProductListingParams(next);
        if (!qs) setSearchParams({});
        else setSearchParams(new URLSearchParams(qs));
    }, [setSearchParams]);

    const applyFilters = () => {
        applyDraft(draft);
    };

    const clearFilters = () => {
        setDraft({});
        setSearchParams({});
    };

    const convertProductToCardProps = (product: ProductItem) => {
        const topBadges =
            mapApiTopBadgesToProductCard(product.top_badges ?? product.budges) ??
            undefined;
        const bottomBadges =
            mapApiBottomBadgesToProductCard(product.bottom_badges) ?? undefined;

        const listing = resolveListingCardPrices(
            product,
            t("product.youSaved", "You saved"),
            currency,
        );
        return {
            id: product.id,
            name: product.name,
            price: listing.price,
            originalPrice: listing.originalPrice,
            rating: product.rating || 0,
            image: product.image,
            badge: topBadges,
            bottomBadges,
            category: product.category,
            sold: product.sold_number,
            savings: listing.savings,
            discountLabel: listing.discountLabel,
            deliveryInfo: t("home.freeDelivery", "Free Delivery"),
            isFavorite: product.is_favorite ?? false,
            onClick: handleProductClick,
            onToggleFavorite: handleToggleFavorite,
            t,
        };
    };

    const resultsLabel = useMemo(() => {
        const total = totalCount ?? products.length;
        if (!total) return t("productsListing.noResultsLine", "No results");
        const showing = products.length;
        return t("productsListing.resultsRange", "{{showing}} of {{total}} results", {
            showing,
            total,
        });
    }, [totalCount, products.length, t]);

    const productGridClass = cn(
        "grid gap-3 sm:gap-4",
        products.length <= 2
            ? "max-w-xl grid-cols-2"
            : products.length <= 6
              ? "max-w-4xl grid-cols-2 sm:grid-cols-3"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    );

    const activeChips = useMemo(() => {
        const chips: { key: string; label: string }[] = [];
        if (applied.category_id != null) {
            const label =
                categoryItems.find((c) => c.id === applied.category_id)?.name ||
                numericCategoryOptions.find((o) => o.value === applied.category_id)?.label;
            if (label) chips.push({ key: "category_id", label });
        }
        if (applied.price_min != null || applied.price_max != null) {
            chips.push({
                key: "price",
                label: `${applied.price_min ?? "—"} – ${applied.price_max ?? "—"}`,
            });
        }
        if (applied.sort_by) {
            chips.push({
                key: "sort_by",
                label: t(SORT_CHIP_KEYS[applied.sort_by] ?? "productsListing.sortBy"),
            });
        }
        if (applied.search) chips.push({ key: "search", label: applied.search });
        if (applied.shop_id != null) {
            const label = numericShopOptions.find((o) => o.value === applied.shop_id)?.label;
            if (label) chips.push({ key: "shop_id", label });
        }
        if (applied.brand_id != null) {
            const label = numericBrandOptions.find((o) => o.value === applied.brand_id)?.label;
            if (label) chips.push({ key: "brand_id", label });
        }
        if (applied.on_sale) chips.push({ key: "on_sale", label: t("productsListing.onSale") });
        if (applied.is_free_delivery)
            chips.push({ key: "is_free_delivery", label: t("productsListing.freeDelivery") });
        if (applied.in_stock_only)
            chips.push({ key: "in_stock_only", label: t("productsListing.inStockOnly") });
        return chips;
    }, [
        applied,
        categoryItems,
        numericBrandOptions,
        numericCategoryOptions,
        numericShopOptions,
        t,
    ]);

    const removeChip = (key: string) => {
        const next = { ...applied };
        if (key === "price") {
            delete next.price_min;
            delete next.price_max;
        } else if (key === "category_id") {
            delete next.category_id;
            delete next.attribute_values;
        } else {
            delete (next as Record<string, unknown>)[key];
        }
        applyDraft(next);
    };

    const sidebar = (
        <ProductFiltersSidebar
            draft={draft}
            onDraftChange={setDraft}
            onApplyDraft={applyDraft}
            onApply={applyFilters}
            onClear={clearFilters}
            categoryOptions={numericCategoryOptions}
            categoryItems={categoryItems}
            brandOptions={numericBrandOptions}
            shopOptions={numericShopOptions}
            onCategoryScroll={handleCatScroll}
            onBrandScroll={handleBrandScroll}
            onShopScroll={handleShopScroll}
            isFetchingMoreCats={isFetchingMoreCats}
            isFetchingMoreBrands={isFetchingMoreBrands}
            isFetchingMoreShops={isFetchingMoreShops}
        />
    );

    return (
        <div
            className="min-h-screen w-full min-w-0 bg-[#F6F3EE] dark:bg-[#171412]"
            dir={isRTL ? "rtl" : "ltr"}
        >
            {bannerSections.length > 0 && (
                <div className="w-full">
                    <ApiSectionsRenderer sections={bannerSections} />
                </div>
            )}

            <div className="page-container w-full min-w-0 py-6 sm:py-8">
                {otherBeforeSections.length > 0 && (
                    <FullBleedSection>
                        <ApiSectionsRenderer sections={otherBeforeSections} />
                    </FullBleedSection>
                )}
                <div className="mb-4 sm:mb-6">
                    <h1 className="text-xl font-bold text-custom-primary dark:text-[var(--color-text)] sm:text-2xl">
                        {t("productsListing.title", "Products")}
                    </h1>
                    <p className="mt-2 text-sm text-custom-secondary dark:text-[color-mix(in_srgb,var(--color-text)_82%,transparent)]">
                        {t(
                            "productsListing.subtitle",
                            "Browse products and refine results with filters."
                        )}
                    </p>
                </div>

                <SideContentLayout
                    sidebar={sidebar}
                    sidebarPosition="left"
                    twoColumnFrom="md"
                    stickySidebar
                    mobileContentFirst
                    sidebarClassName="w-full"
                    gapClassName="gap-4 md:gap-6 lg:gap-8"
                >
                    <div className="w-full min-w-0">
                        <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
                            <p className="text-xs text-stone-500 dark:text-[#E8E4DC]/70 sm:text-sm">
                                {resultsLabel}
                            </p>
                            {activeChips.map((chip) => (
                                <button
                                    key={chip.key}
                                    type="button"
                                    onClick={() => removeChip(chip.key)}
                                    className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[12px] font-medium text-stone-700 dark:border-white/10 dark:bg-white/8 dark:text-[#E8E4DC]"
                                >
                                    {chip.label}
                                    <span aria-hidden>×</span>
                                </button>
                            ))}
                            {activeChips.length > 0 ? (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="text-[12px] font-semibold text-[#ff9f00]"
                                >
                                    {t("productsListing.clearAll")}
                                </button>
                            ) : null}
                        </div>

                        {isLoading && products.length === 0 ? (
                            <div className="grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <ProductCardSkeleton key={`skeleton-${index}`} />
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className={productGridClass}>
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            {...convertProductToCardProps(product)}
                                        />
                                    ))}
                                </div>

                                {isFetchingNextPage && (
                                    <div className={`mt-4 ${productGridClass}`}>
                                        {Array.from({ length: 4 }).map((_, index) => (
                                            <ProductCardSkeleton key={`loading-${index}`} />
                                        ))}
                                    </div>
                                )}

                                {hasNextPage && (
                                    <div ref={observerTarget} className="h-20 w-full" />
                                )}
                            </>
                        ) : (
                            <div className="flex h-64 items-center justify-center rounded-2xl border border-transparent bg-custom-light dark:border-[color-mix(in_srgb,var(--color-main)_22%,#1f2230)] dark:bg-[color-mix(in_srgb,var(--color-api-second)_18%,#10121a)]">
                                <p className="text-custom-secondary dark:text-[color-mix(in_srgb,var(--color-text)_82%,transparent)]">
                                    {t("home.noProductsFound", "No products found")}
                                </p>
                            </div>
                        )}
                    </div>
                </SideContentLayout>

                {afterSections.length > 0 && (
                    <FullBleedSection>
                        <ApiSectionsRenderer sections={afterSections} />
                    </FullBleedSection>
                )}
            </div>
        </div>
    );
}
