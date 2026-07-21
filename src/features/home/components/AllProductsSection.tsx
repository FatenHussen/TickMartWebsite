import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { SlidersHorizontal, Tag, Bookmark, Store, ChevronDown, X } from "lucide-react";
import { _ProductsApi } from "../api/products.service";
import { _CategoriesApi } from "../api/categories.service";
import { _BrandApi } from "@/features/product/api/brandApi";
import { _ShopApi } from "@/features/store/api/shopApi";
import { useInfiniteSelect } from "@/shared/hooks/useInfiniteSelect";
import { useInfiniteList } from "@/shared/hooks/useInfiniteList";
import type { Category, ProductItem } from "../types";
import { useSections } from "../hooks/useSections";
import { mapPageSlugToRoute } from "@/utils/routeMapper";
import { useTheme } from "@/context/ThemeContext";
import type { BrandListItem } from "@/features/product/types/brand";
import type { ShopListItem } from "@/features/store/types/shop";
import { useToggleFavorite } from "@/features/account/hooks/useFavorites";
import ProductCard from "@/shared/component/card/ProductCard";
import { getDarkCardSurfaceGradient } from "@/shared/component/sections/sectionCardVariant";
import ProductCardSkeleton from "@/shared/component/skeleton/ProductCardSkeleton";
import { paths } from "@/app/routes/path/paths";
import {
    mapApiBottomBadgesToProductCard,
    mapApiTopBadgesToProductCard,
} from "@/shared/lib/mapProductBadges";
import {
    homeStaticSectionRowSurface,
    pickHomeSectionBySeeMorePageSlug,
} from "../lib/homeStaticSectionSurface";

type AllProductsSectionProps = {
    disablePageContainer?: boolean;
};

const darkSelectClass =
    "w-full cursor-pointer appearance-none rounded-xl border border-white/[0.07] bg-[rgba(16,17,20,0.7)] py-2.5 pl-10 pr-9 text-[#E4E4E7] text-sm backdrop-blur-sm transition-colors duration-200 focus:border-white/[0.14] focus:outline-none focus:ring-1 focus:ring-white/[0.10] hover:border-white/[0.10]";

const lightSelectClass =
    "w-full cursor-pointer appearance-none rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-9 text-stone-800 text-sm transition-colors focus:border-stone-300 focus:outline-none focus:ring-2 focus:ring-black/5";

export default function AllProductsSection({
    disablePageContainer = false,
}: AllProductsSectionProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";
    const { data: homeSections } = useSections("home");
    const headlineSection = useMemo(
        () => pickHomeSectionBySeeMorePageSlug(homeSections, "products"),
        [homeSections]
    );

    const titleText =
        headlineSection?.name?.trim() || t("home.allProducts", "All Products");
    const descriptionText =
        headlineSection?.description?.trim() ||
        t(
            "home.allProductsDescription",
            "Browse all products from different stores and brands in one place."
        );

    const subtitleStyle =
        headlineSection?.text_color && !isDarkTheme
            ? { color: headlineSection.text_color }
            : headlineSection?.text_color && isDarkTheme
              ? { color: `color-mix(in srgb, ${headlineSection.text_color} 55%, var(--color-text-primary))` }
              : undefined;

    const viewAllTo =
        headlineSection?.see_more?.page_slug != null
            ? mapPageSlugToRoute(headlineSection.see_more.page_slug, headlineSection.see_more.params)
            : paths.client.products;

    const [categoryFilter, setCategoryFilter] = useState<number | undefined>();
    const [brandFilter, setBrandFilter] = useState<number | undefined>();
    const [shopFilter, setShopFilter] = useState<number | undefined>();

    const { options: categoryOptions, handleScroll: handleCatScroll, isFetchingNextPage: isFetchingMoreCats } =
        useInfiniteSelect<Category>({
            queryKey: ["categories", "select"],
            fetchFn: async (page) => (await _CategoriesApi.getCategories(page)).data,
            mapToOption: (cat) => ({ value: cat.id, label: cat.name }),
        });

    const { options: brandOptions, handleScroll: handleBrandScroll, isFetchingNextPage: isFetchingMoreBrands } =
        useInfiniteSelect<BrandListItem>({
            queryKey: ["brands", "select"],
            fetchFn: async (page) => (await _BrandApi.getBrands({ page })).data,
            mapToOption: (brand) => ({ value: brand.id, label: brand.name }),
        });

    const { options: shopOptions, handleScroll: handleShopScroll, isFetchingNextPage: isFetchingMoreShops } =
        useInfiniteSelect<ShopListItem>({
            queryKey: ["shops", "select"],
            fetchFn: async (page) => (await _ShopApi.getShops({ page })).data,
            mapToOption: (shop) => ({ value: shop.id, label: shop.name }),
        });

    const filters = {
        ...(categoryFilter ? { category_id: categoryFilter } : {}),
        ...(brandFilter ? { brand_id: brandFilter } : {}),
        ...(shopFilter ? { shop_id: shopFilter } : {}),
    };

    const { items: products, observerTarget, isLoading, isFetchingNextPage, hasNextPage } =
        useInfiniteList<ProductItem>({
            queryKey: ["products", "list", "infinite", filters],
            fetchFn: (page) => _ProductsApi.getProducts({ ...filters, page }).then((r) => r.data),
            threshold: 500,
        });

    const toggleFavorite = useToggleFavorite();

    const handleProductClick = (id: number) => navigate(paths.client.productDetails(id));
    const handleToggleFavorite = (id: number) => toggleFavorite.mutate({ type: "product", id });

    const convertProductToCardProps = (product: ProductItem) => {
        const parseMoney = (value: unknown) => {
            const numericValue = typeof value === "number" ? value : Number(value);
            return Number.isFinite(numericValue) ? numericValue : 0;
        };

        const discountedPrice = parseMoney(product.price_after_discount);
        const originalPrice = parseMoney(product.price);
        const savedAmount = parseMoney(product.amount_saved);
        const topBadges = mapApiTopBadgesToProductCard(product.top_badges ?? product.budges) ?? undefined;
        const bottomBadges = mapApiBottomBadgesToProductCard(product.bottom_badges) ?? undefined;
        return {
            id: product.id,
            name: product.name,
            price: `£${discountedPrice.toFixed(2)}`,
            originalPrice: originalPrice > discountedPrice ? `£${originalPrice.toFixed(2)}` : undefined,
            rating: product.rating || 0,
            image: product.image,
            badge: topBadges,
            bottomBadges,
            category: product.category,
            sold: product.sold_number,
            savings: savedAmount > 0 ? `${t("product.youSaved", "You saved")} £${savedAmount.toFixed(2)}` : undefined,
            deliveryInfo: t("home.freeDelivery", "Free Delivery"),
            isFavorite: product.is_favorite ?? false,
            onClick: handleProductClick,
            onToggleFavorite: handleToggleFavorite,
            surfaceGradient: isDarkTheme ? getDarkCardSurfaceGradient() : undefined,
            t,
        };
    };

    const { className: sectionClassName, style: sectionSurfaceStyle } = useMemo(
        () =>
            homeStaticSectionRowSurface(isDarkTheme, headlineSection?.background_color, {
                paddingClass: "py-10",
                breakout: disablePageContainer,
            }),
        [isDarkTheme, headlineSection?.background_color, disablePageContainer]
    );

    const contentClassName = disablePageContainer ? "page-container min-w-0" : "page-container";
    const selectClass = isDarkTheme ? darkSelectClass : lightSelectClass;
    const labelClass = isDarkTheme
        ? "block text-xs font-medium uppercase tracking-wider text-[#71717A] mb-2"
        : "block text-xs font-medium uppercase tracking-wider text-stone-500 mb-2";

    const activeFilterCount = [categoryFilter, brandFilter, shopFilter].filter(Boolean).length;
    const clearFilters = () => {
        setCategoryFilter(undefined);
        setBrandFilter(undefined);
        setShopFilter(undefined);
    };

    const filterControls = [
        {
            key: "category",
            label: t("categories.categories", "Category"),
            Icon: Tag,
            value: categoryFilter,
            setValue: setCategoryFilter,
            options: categoryOptions,
            onScroll: handleCatScroll,
            loadingMore: isFetchingMoreCats,
            allLabel: t("categories.allCategories", "All Categories"),
        },
        {
            key: "brand",
            label: t("brands.title", "Brand"),
            Icon: Bookmark,
            value: brandFilter,
            setValue: setBrandFilter,
            options: brandOptions,
            onScroll: handleBrandScroll,
            loadingMore: isFetchingMoreBrands,
            allLabel: t("brands.allBrands", "All Brands"),
        },
        {
            key: "store",
            label: t("store.store", "Store"),
            Icon: Store,
            value: shopFilter,
            setValue: setShopFilter,
            options: shopOptions,
            onScroll: handleShopScroll,
            loadingMore: isFetchingMoreShops,
            allLabel: t("store.allStores", "All Stores"),
        },
    ];

    return (
        <section className={`${sectionClassName} -mt-4 sm:-mt-5`} style={sectionSurfaceStyle}>
            <div className={contentClassName}>
                {/* Section header */}
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2.5 sm:gap-3">
                            <span
                                aria-hidden="true"
                                className="h-7 w-1.5 shrink-0 rounded-full sm:h-8"
                                style={{
                                    background:
                                        "linear-gradient(180deg, var(--color-gradient-from), var(--color-gradient-to))",
                                }}
                            />
                            <h2
                                className="text-2xl font-bold tracking-tight sm:text-3xl"
                                style={
                                    isDarkTheme
                                        ? { color: "#FFFFFF" }
                                        : {
                                              backgroundImage:
                                                  "linear-gradient(105deg, var(--color-gradient-from, var(--color-main)), var(--color-gradient-to, var(--color-main)))",
                                              WebkitBackgroundClip: "text",
                                              backgroundClip: "text",
                                              color: "transparent",
                                          }
                                }
                            >
                                {titleText}
                            </h2>
                        </div>
                        <p
                            className="max-w-2xl text-sm leading-relaxed"
                            style={
                                subtitleStyle ?? {
                                    color: isDarkTheme ? "#A1A1AA" : undefined,
                                }
                            }
                        >
                            {descriptionText}
                        </p>
                    </div>
                    <Link
                        to={viewAllTo}
                        className="shrink-0 self-start rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 sm:self-center dark:text-[#A1A1AA] dark:hover:bg-white/[0.06] dark:hover:text-white"
                        style={!isDarkTheme ? { color: "var(--color-main)" } : undefined}
                    >
                        {t("home.viewAll", "View all")}
                    </Link>
                </div>

                {/* Filters */}
                <div
                    className={`mb-8 rounded-2xl border p-4 sm:p-5 ${
                        isDarkTheme
                            ? "border-white/[0.06] bg-[rgba(16,17,20,0.5)]"
                            : "border-stone-200/70 bg-white/70 shadow-sm backdrop-blur-sm"
                    }`}
                >
                    {/* Panel header */}
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <span
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                                style={{
                                    background:
                                        "linear-gradient(135deg, var(--color-gradient-from), var(--color-gradient-to))",
                                }}
                            >
                                <SlidersHorizontal className="h-4 w-4" strokeWidth={2.2} aria-hidden />
                            </span>
                            <span
                                className={`text-sm font-semibold ${isDarkTheme ? "text-white" : "text-stone-800"}`}
                            >
                                {t("home.refineResults", "Refine results")}
                            </span>
                            {activeFilterCount > 0 && (
                                <span
                                    className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold text-white tabular-nums"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, var(--color-gradient-from), var(--color-gradient-to))",
                                    }}
                                >
                                    {activeFilterCount}
                                </span>
                            )}
                        </div>

                        {activeFilterCount > 0 && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    isDarkTheme
                                        ? "text-[#A1A1AA] hover:bg-white/[0.06] hover:text-white"
                                        : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                                }`}
                            >
                                <X className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden />
                                {t("common.clear", "Clear")}
                            </button>
                        )}
                    </div>

                    {/* Filter selects */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {filterControls.map(
                            ({ key, label, Icon, value, setValue, options, onScroll, loadingMore, allLabel }) => {
                                const isActive = Boolean(value);
                                return (
                                    <div key={key}>
                                        <label className={labelClass}>{label}</label>
                                        <div className="relative">
                                            <Icon
                                                className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                                                    isActive
                                                        ? "text-[var(--color-main)] dark:text-white"
                                                        : isDarkTheme
                                                          ? "text-[#71717A]"
                                                          : "text-stone-400"
                                                }`}
                                                strokeWidth={2}
                                                aria-hidden
                                            />
                                            <select
                                                value={value || ""}
                                                onChange={(e) =>
                                                    setValue(e.target.value ? Number(e.target.value) : undefined)
                                                }
                                                onScroll={onScroll}
                                                className={selectClass}
                                            >
                                                <option value="">{allLabel}</option>
                                                {options.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                                {loadingMore && (
                                                    <option value="" disabled>
                                                        {t("common.loading")}
                                                    </option>
                                                )}
                                            </select>
                                            <ChevronDown
                                                className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                                                    isDarkTheme ? "text-[#71717A]" : "text-stone-400"
                                                }`}
                                                strokeWidth={2.2}
                                                aria-hidden
                                            />
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>

                {/* Products grid */}
                {isLoading && products.length === 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <ProductCardSkeleton key={`sk-${i}`} />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {products.map((product) => (
                                <ProductCard key={product.id} {...convertProductToCardProps(product)} />
                            ))}
                        </div>

                        {isFetchingNextPage && (
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <ProductCardSkeleton key={`ld-${i}`} />
                                ))}
                            </div>
                        )}

                        {hasNextPage && <div ref={observerTarget} className="h-20 w-full" />}
                    </>
                ) : (
                    <div className="flex h-64 items-center justify-center rounded-2xl border border-stone-100 dark:border-white/[0.05] dark:bg-[rgba(16,17,20,0.5)]">
                        <p className="text-sm text-stone-500 dark:text-[#71717A]">
                            {t("home.noProductsFound", "No products found")}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
