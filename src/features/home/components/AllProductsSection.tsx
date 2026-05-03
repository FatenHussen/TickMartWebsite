import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
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
    /** When home already wraps this block in `.page-container`, avoid nesting a second one. */
    disablePageContainer?: boolean;
};

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
        headlineSection?.name?.trim() ||
        t("home.allProducts", "All Products");
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
              ? {
                    color: `color-mix(in srgb, ${headlineSection.text_color} 55%, var(--color-text-primary))`,
                }
              : undefined;

    const viewAllTo =
        headlineSection?.see_more?.page_slug != null
            ? mapPageSlugToRoute(
                  headlineSection.see_more.page_slug,
                  headlineSection.see_more.params
              )
            : paths.client.products;

    const [categoryFilter, setCategoryFilter] = useState<number | undefined>();
    const [brandFilter, setBrandFilter] = useState<number | undefined>();
    const [shopFilter, setShopFilter] = useState<number | undefined>();

    const {
        options: categoryOptions,
        handleScroll: handleCatScroll,
        isFetchingNextPage: isFetchingMoreCats,
    } = useInfiniteSelect<Category>({
        queryKey: ["categories", "select"],
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
        queryKey: ["brands", "select"],
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
        queryKey: ["shops", "select"],
        fetchFn: async (page) => {
            const res = await _ShopApi.getShops({ page });
            return res.data;
        },
        mapToOption: (shop) => ({ value: shop.id, label: shop.name }),
    });

    const filters = {
        ...(categoryFilter ? { category_id: categoryFilter } : {}),
        ...(brandFilter ? { brand_id: brandFilter } : {}),
        ...(shopFilter ? { shop_id: shopFilter } : {}),
    };

    const {
        items: products,
        observerTarget,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
    } = useInfiniteList<ProductItem>({
        queryKey: ["products", "list", "infinite", filters],
        fetchFn: (page) =>
            _ProductsApi.getProducts({ ...filters, page }).then((r) => r.data),
        threshold: 500,
    });

    const toggleFavorite = useToggleFavorite();

    const handleProductClick = (id: number) => {
        navigate(paths.client.productDetails(id));
    };

    const handleToggleFavorite = (id: number) => {
        toggleFavorite.mutate({ type: "product", id });
    };

    const convertProductToCardProps = (product: ProductItem) => {
        const topBadges =
            mapApiTopBadgesToProductCard(product.top_badges ?? product.budges) ??
            undefined;
        const bottomBadges =
            mapApiBottomBadgesToProductCard(product.bottom_badges) ?? undefined;

        return {
            id: product.id,
            name: product.name,
            price: `£${product.price_after_discount.toFixed(2)}`,
            originalPrice:
                product.price > product.price_after_discount
                    ? `£${product.price.toFixed(2)}`
                    : undefined,
            rating: product.rating || 0,
            image: product.image,
            badge: topBadges,
            bottomBadges,
            category: product.category,
            sold: product.sold_number,
            savings:
                product.amount_saved > 0
                    ? `${t("product.youSaved", "You saved")} £${product.amount_saved.toFixed(2)}`
                    : undefined,
            deliveryInfo: t("home.freeDelivery", "Free Delivery"),
            isFavorite: product.is_favorite ?? false,
            onClick: handleProductClick,
            onToggleFavorite: handleToggleFavorite,
            t,
        };
    };

    const { className: sectionClassName, style: sectionSurfaceStyle } = useMemo(
        () =>
            homeStaticSectionRowSurface(
                isDarkTheme,
                headlineSection?.background_color,
                {
                    paddingClass: "py-8",
                    breakout: disablePageContainer,
                }
            ),
        [
            isDarkTheme,
            headlineSection?.background_color,
            disablePageContainer,
        ]
    );

    const contentClassName = disablePageContainer
        ? "page-container min-w-0"
        : "page-container";

    return (
        <section className={sectionClassName} style={sectionSurfaceStyle}>
            <div
                className={contentClassName}
            >
                {/* Header */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2
                            className={`text-2xl font-bold tracking-tight mb-2 ${
                                isDarkTheme
                                    ? "text-[color:var(--color-text,var(--color-text-primary))]"
                                    : "text-custom-primary"
                            }`}
                        >
                            {titleText}
                        </h2>
                        <p
                            className={`text-sm max-w-2xl leading-relaxed ${
                                subtitleStyle ? "" : "text-custom-secondary"
                            }`}
                            style={subtitleStyle}
                        >
                            {descriptionText}
                        </p>
                    </div>
                    <Link
                        to={viewAllTo}
                        className="shrink-0 self-start sm:self-center text-sm font-semibold text-primary-light hover:underline"
                    >
                        {t("home.viewAll", "View all")}
                    </Link>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-custom-primary mb-2">
                            {t("categories.categories", "Category")}
                        </label>
                        <select
                            value={categoryFilter || ""}
                            onChange={(e) =>
                                setCategoryFilter(
                                    e.target.value ? Number(e.target.value) : undefined
                                )
                            }
                            onScroll={handleCatScroll}
                            className="w-full px-4 py-2.5 rounded-lg border border-custom-primary bg-custom-card text-custom-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        >
                            <option value="">{t("categories.allCategories", "All Categories")}</option>
                            {categoryOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                            {isFetchingMoreCats && (
                                <option value="" disabled>{t("common.loading")}</option>
                            )}
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-custom-primary mb-2">
                            {t("brands.title", "Brand")}
                        </label>
                        <select
                            value={brandFilter || ""}
                            onChange={(e) =>
                                setBrandFilter(
                                    e.target.value ? Number(e.target.value) : undefined
                                )
                            }
                            onScroll={handleBrandScroll}
                            className="w-full px-4 py-2.5 rounded-lg border border-custom-primary bg-custom-card text-custom-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        >
                            <option value="">{t("brands.allBrands", "All Brands")}</option>
                            {brandOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                            {isFetchingMoreBrands && (
                                <option value="" disabled>{t("common.loading")}</option>
                            )}
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-custom-primary mb-2">
                            {t("store.store", "Store")}
                        </label>
                        <select
                            value={shopFilter || ""}
                            onChange={(e) =>
                                setShopFilter(
                                    e.target.value ? Number(e.target.value) : undefined
                                )
                            }
                            onScroll={handleShopScroll}
                            className="w-full px-4 py-2.5 rounded-lg border border-custom-primary bg-custom-card text-custom-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        >
                            <option value="">{t("store.allStores", "All Stores")}</option>
                            {shopOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                            {isFetchingMoreShops && (
                                <option value="" disabled>{t("common.loading")}</option>
                            )}
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                {isLoading && products.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <ProductCardSkeleton key={`skeleton-${index}`} />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    {...convertProductToCardProps(product)}
                                />
                            ))}
                        </div>

                        {isFetchingNextPage && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <ProductCardSkeleton key={`loading-${index}`} />
                                ))}
                            </div>
                        )}

                        {hasNextPage && (
                            <div
                                ref={observerTarget}
                                className="h-20 w-full"
                            />
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-64 bg-custom-light rounded-2xl">
                        <p className="text-custom-secondary">
                            {t("home.noProductsFound", "No products found")}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
