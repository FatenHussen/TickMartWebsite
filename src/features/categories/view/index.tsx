import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { useAppSettings } from "@/features/account/hooks/useAppSettings";
import type { SectionsFilters } from "@/features/home/api/sections.service";
import { useSections, useSectionsByPosition } from "@/features/home/hooks/useSections";
import { pickHomeSectionBySeeMorePageSlug } from "@/features/home/lib/homeStaticSectionSurface";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import FullBleedSection from "@/shared/component/FullBleedSection";
import { getSectionCardSurfaceColor } from "@/shared/component/sections/sectionCardVariant";
import { cn } from "@/shared/lib/utils";
import { resolveApiPaletteForTheme } from "@/shared/lib/themeColors";
import {
    buildCategoriesLuxuryDarkSurface,
    categoriesPageRootStyle,
    resolveCategoriesDarkAccents,
} from "../lib/categoriesApiDarkSurface";
import CategoriesLayout from "../layout/CategoriesLayout";
import CategoriesSidebar from "../components/CategoriesSidebar";
import ProductsHeader from "../components/ProductsHeader";
import ProductCard from "@/shared/component/card/ProductCard";
import ProductCardSkeleton from "@/shared/component/skeleton/ProductCardSkeleton";
import CategoryTopNav from "@/shared/component/CategoryTopNav";
import { useCategories } from "../hooks/useCategories";
import { _CategoriesApi } from "../api/categoriesApi";
import { useInfiniteList } from "@/shared/hooks/useInfiniteList";
import { useToggleFavorite } from "@/features/account/hooks/useFavorites";
import { paths } from "@/app/routes/path/paths";
import type { ApiCategory, ApiProduct, CategoryChild, ProductBadge } from "../types";
import type { CategoryTypeFilter } from "../components/CategoryFilters";
import {
    mapApiBottomBadgesToProductCard,
    mapApiTopBadgesToProductCard,
} from "@/shared/lib/mapProductBadges";

// Map UI sortBy value → API sortField / sortOrder
function mapSortToApi(sortBy: string): {
    sortField?: string;
    sortOrder?: "asc" | "desc";
} {
    switch (sortBy) {
        case "priceLow":
            return { sortField: "price", sortOrder: "asc" };
        case "priceHigh":
            return { sortField: "price", sortOrder: "desc" };
        case "rating":
            return { sortField: "rating", sortOrder: "desc" };
        case "newest":
            return { sortField: "created_at", sortOrder: "desc" };
        default:
            return {};
    }
}

export default function CategoriesView() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";
    const { data: settings } = useAppSettings();
    const { data: homeSections } = useSections("home");
    const headlineSection = useMemo(
        () => pickHomeSectionBySeeMorePageSlug(homeSections, "categories"),
        [homeSections],
    );
    const settingsPaletteForCategories = useMemo(
        () =>
            isDarkTheme
                ? resolveApiPaletteForTheme("dark", settings?.color, settings?.dark_color)
                : undefined,
        [isDarkTheme, settings?.color, settings?.dark_color],
    );
    /** Fixed luxury dark foundation + API accents (never raw API on large surfaces). */
    const categoriesDarkSurface = useMemo(() => {
        if (!isDarkTheme) return null;
        const { main, second } = resolveCategoriesDarkAccents(
            headlineSection,
            settingsPaletteForCategories,
            true,
        );
        return buildCategoriesLuxuryDarkSurface(main, second);
    }, [isDarkTheme, headlineSection, settingsPaletteForCategories]);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedCategoryId = searchParams.get("category");

    const [showAllCategories, setShowAllCategories] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ApiCategory | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<CategoryChild | null>(null);
    const [sortBy, setSortBy] = useState<string>("recommended");
    const [freeDeliveryOnly, setFreeDeliveryOnly] = useState(false);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [categoryTypeFilter, setCategoryTypeFilter] = useState<CategoryTypeFilter>(undefined);
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [favoriteStates, setFavoriteStates] = useState<Record<number, boolean>>({});
    const themeGradientColors = useMemo(() => {
        if (typeof window === "undefined") return undefined;
        const styles = getComputedStyle(document.documentElement);
        const primary = styles.getPropertyValue("--color-primary").trim();
        const primaryLight = styles.getPropertyValue("--color-primary-light").trim();
        const main = primaryLight || primary;
        const second = primary || primaryLight;
        if (!main && !second) return undefined;
        return { main, second };
    }, []);
    const readCategoryColor = (
        category: ApiCategory | null | undefined,
        key: "main" | "second",
    ) => {
        if (!category) return undefined;
        const source = category as ApiCategory & Record<string, unknown>;
        const keys =
            key === "main"
                ? ["main_color", "mainColor", "color_main"]
                : ["second_color", "secondColor", "color_second", "secondary_color"];

        for (const candidate of keys) {
            const value = source[candidate];
            if (typeof value === "string" && value.trim()) return value.trim();
        }

        return undefined;
    };
    const readProductColor = (
        product: ApiProduct,
        key: "main" | "second",
    ) => {
        const source = product as ApiProduct & Record<string, unknown>;
        const keys =
            key === "main"
                ? ["main_color", "mainColor", "color_main"]
                : ["second_color", "secondColor", "color_second", "secondary_color"];

        for (const candidate of keys) {
            const value = source[candidate];
            if (typeof value === "string" && value.trim()) return value.trim();
        }

        return undefined;
    };
    const buildProductSurfaceGradient = (product: ApiProduct) => {
        const main =
            readProductColor(product, "main") ??
            readCategoryColor(selectedCategory, "main") ??
            themeGradientColors?.main;
        const second =
            readProductColor(product, "second") ??
            readCategoryColor(selectedCategory, "second") ??
            themeGradientColors?.second;

        if (isDarkTheme) {
            const start = main ?? second ?? "var(--color-main)";
            const end = second ?? main ?? "var(--color-api-second)";
            return `linear-gradient(168deg, color-mix(in srgb, ${start} 6%, #121316) 0%, #0e0e10 42%, color-mix(in srgb, ${end} 5%, #111114) 100%)`;
        }

        if (!main && !second) return undefined;
        const start = main ?? second;
        const end = second ?? main;
        return `linear-gradient(145deg, color-mix(in srgb, ${start} 24%, #ffffff) 0%, color-mix(in srgb, ${start} 14%, #ffffff) 38%, color-mix(in srgb, ${end} 16%, #ffffff) 72%, color-mix(in srgb, ${end} 28%, #ffffff) 100%)`;
    };

    const { data: categories = [], isLoading: categoriesLoading } = useCategories();

    const toggleFavorite = useToggleFavorite();

    const categoryIdForProducts = showAllCategories
        ? undefined
        : (selectedSubcategory?.id || selectedCategory?.id);

    const sectionsFilters = useMemo((): SectionsFilters | undefined => {
        if (categoryIdForProducts == null) return undefined;
        return { category_id: categoryIdForProducts };
    }, [categoryIdForProducts]);

    const { beforeSections, afterSections } = useSectionsByPosition(
        "categories",
        sectionsFilters,
    );
    const bannerSections = beforeSections.filter((s) => s.display_type_id === 1);
    const otherBeforeSections = beforeSections.filter((s) => s.display_type_id !== 1);

    const { sortField, sortOrder } = useMemo(() => mapSortToApi(sortBy), [sortBy]);

    const productFilters = useMemo(
        () => ({
            sortField,
            sortOrder,
            is_free_delivery: freeDeliveryOnly ? (1 as const) : undefined,
            in_stock_only: inStockOnly ? (1 as const) : undefined,
            type: categoryTypeFilter,
            price_min: minPrice,
            price_max: maxPrice,
        }),
        [sortField, sortOrder, freeDeliveryOnly, inStockOnly, categoryTypeFilter, minPrice, maxPrice],
    );

    const {
        items: products,
        observerTarget,
        isLoading: productsLoading,
        isFetchingNextPage,
        hasNextPage,
    } = useInfiniteList<ApiProduct>({
        queryKey: [
            "products",
            "listByCategory",
            "infinite",
            categoryIdForProducts,
            productFilters,
        ],
        fetchFn: (page) =>
            categoryIdForProducts
                ? _CategoriesApi
                    .getProductsByCategory(categoryIdForProducts, page, productFilters)
                    .then((r) => r.data)
                : _CategoriesApi.getProducts({ ...productFilters, page }).then((r) => r.data),
        enabled: true,
    });

    const handleShowAllCategories = () => {
        setShowAllCategories(true);
        setSelectedCategory(null);
        setSelectedSubcategory(null);
    };

    const handleCategorySelect = (category: ApiCategory) => {
        setShowAllCategories(false);
        setSelectedCategory(category);
        if (category.children.length > 0) {
            setSelectedSubcategory(category.children[0]);
        } else {
            setSelectedSubcategory(null);
        }
    };

    const handleSubcategorySelect = (subcategory: CategoryChild) => {
        setSelectedSubcategory(subcategory);
    };

    const handleProductClick = (productId: number) => {
        navigate(paths.client.productDetails(productId));
    };

    const handleToggleFavorite = (productId: number) => {
        const product = products.find((p) => p.id === productId);
        const currentFavorite =
            productId in favoriteStates
                ? favoriteStates[productId]
                : (product?.is_favorite ?? false);

        setFavoriteStates((prev) => ({ ...prev, [productId]: !currentFavorite }));

        toggleFavorite.mutate(
            { type: "product", id: productId },
            {
                onSuccess: (res) => {
                    const isFavorite = res?.data?.is_favorite ?? !currentFavorite;
                    setFavoriteStates((prev) => ({ ...prev, [productId]: isFavorite }));
                },
                onError: () => {
                    setFavoriteStates((prev) => ({ ...prev, [productId]: currentFavorite }));
                },
            }
        );
    };

    useEffect(() => {
        if (categories.length === 0 || selectedCategory || showAllCategories) return;
        const target = preselectedCategoryId
            ? categories.find((c) => String(c.id) === preselectedCategoryId)
            : null;
        handleCategorySelect(target ?? categories[0]);
    }, [categories]);

    const subcategories = selectedCategory?.children ?? [];

    const sidebarTitleColors = useMemo(() => {
        if (!headlineSection || isDarkTheme) {
            return { main: null as string | null, second: null as string | null };
        }
        const main =
            headlineSection.main_color?.trim() ||
            headlineSection.background_color?.trim() ||
            null;
        const second =
            headlineSection.second_color?.trim() ||
            getSectionCardSurfaceColor(headlineSection)?.trim() ||
            null;
        return { main, second };
    }, [headlineSection, isDarkTheme]);

    const sidebarTitleGradientColors = useMemo(() => {
        if (categoriesDarkSurface) {
            return { main: categoriesDarkSurface.main, second: categoriesDarkSurface.second };
        }
        return sidebarTitleColors;
    }, [categoriesDarkSurface, sidebarTitleColors]);

    const productsHighlightColors = useMemo(() => {
        if (isDarkTheme && categoriesDarkSurface) {
            return { main: categoriesDarkSurface.main, second: categoriesDarkSurface.second };
        }
        if (isDarkTheme) {
            return {
                main: "var(--color-main)" as const,
                second: "var(--color-api-second)" as const,
            };
        }
        if (showAllCategories) {
            if (!headlineSection) {
                return { main: null as string | null, second: null as string | null };
            }
            const main =
                headlineSection.main_color?.trim() ||
                headlineSection.background_color?.trim() ||
                null;
            const second =
                headlineSection.second_color?.trim() ||
                getSectionCardSurfaceColor(headlineSection)?.trim() ||
                null;
            if (main || second) {
                return { main: main ?? second, second: second ?? main };
            }
            return { main: null as string | null, second: null as string | null };
        }
        const main = readCategoryColor(selectedCategory, "main");
        const second = readCategoryColor(selectedCategory, "second");
        if (main || second) {
            return { main: main ?? second ?? null, second: second ?? main ?? null };
        }
        return { main: null as string | null, second: null as string | null };
    }, [
        isDarkTheme,
        showAllCategories,
        headlineSection,
        selectedCategory,
        categoriesDarkSurface,
    ]);

    const subcategoryNavItems = [
        {
            id: 0,
            name: t("common.all", "All"),
            selected: !showAllCategories && selectedCategory != null && selectedSubcategory == null,
        },
        ...subcategories.map((subcategory) => ({
            id: subcategory.id,
            name: subcategory.name,
            selected: selectedSubcategory?.id === subcategory.id,
        })),
    ];

    const sidebar = (
        <CategoriesSidebar
            categories={categories}
            selectedCategoryId={selectedCategory?.id}
            selectedSubcategoryId={selectedSubcategory?.id}
            onCategorySelect={handleCategorySelect}
            onSubcategorySelect={handleSubcategorySelect}
            onShowAllCategories={handleShowAllCategories}
            isLoading={categoriesLoading}
            title={headlineSection?.name?.trim() || undefined}
            titleMainColor={sidebarTitleGradientColors.main}
            titleSecondColor={sidebarTitleGradientColors.second}
            apiSurface={categoriesDarkSurface}
            categoryTypeFilter={categoryTypeFilter}
            onCategoryTypeFilterChange={setCategoryTypeFilter}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceFilterChange={({ minPrice: nextMin, maxPrice: nextMax }) => {
                setMinPrice(nextMin);
                setMaxPrice(nextMax);
            }}
        />
    );

    const pageRootStyle =
        isDarkTheme && categoriesDarkSurface
            ? categoriesPageRootStyle(categoriesDarkSurface)
            : undefined;

    return (
        <div
            className={cn(
                "min-h-screen",
                !isDarkTheme && "bg-custom-light",
                isDarkTheme && !categoriesDarkSurface && "text-custom-primary",
            )}
            style={pageRootStyle}
        >
            {bannerSections.length > 0 && (
                <div className="w-full">
                    <ApiSectionsRenderer sections={bannerSections} />
                </div>
            )}

            <CategoriesLayout
                sidebar={sidebar}
                sidebarPosition="left"
                gapClassName={categoriesDarkSurface ? "gap-8 lg:gap-10" : undefined}
                header={
                    otherBeforeSections.length > 0 ? (
                        <FullBleedSection>
                            <ApiSectionsRenderer sections={otherBeforeSections} />
                        </FullBleedSection>
                    ) : undefined
                }
                footer={
                    afterSections.length > 0 ? (
                        <FullBleedSection>
                            <ApiSectionsRenderer sections={afterSections} />
                        </FullBleedSection>
                    ) : undefined
                }
            >
                <div className={cn("space-y-6", categoriesDarkSurface && "lg:space-y-8")}>
                    {/* <HeroBanner
                        title={t("categories.springCollection", "Spring Collection 2024")}
                        subtitle={t(
                            "categories.discoverTrends",
                            "Discover the latest trends in fashion. Up to 40% off on selected items.",
                        )}
                        buttonText={t("categories.shopNow", "Shop Now")}
                        onButtonClick={() => console.log("Shop now clicked")}
                    /> */}

                    {subcategoryNavItems.length > 0 && (
                        <div
                            className={cn(
                                "flex justify-start rounded-3xl border p-5 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.55)] backdrop-blur-xl",
                                categoriesDarkSurface
                                    ? "border-solid"
                                    : "border-primary-light/15 bg-gradient-to-r from-blue-off via-blue-50/50 to-custom-card shadow-sm",
                            )}
                            style={
                                categoriesDarkSurface
                                    ? {
                                          backgroundColor: categoriesDarkSurface.cardBackground,
                                          borderColor: categoriesDarkSurface.cardBorder,
                                          color: categoriesDarkSurface.mutedColor,
                                          backdropFilter: "blur(20px)",
                                          WebkitBackdropFilter: "blur(20px)",
                                      }
                                    : undefined
                            }
                        >
                            <CategoryTopNav
                                categories={subcategoryNavItems}
                                apiSurface={categoriesDarkSurface}
                                onCategoryClick={(subcategoryId) => {
                                    if (subcategoryId === 0) {
                                        setShowAllCategories(false);
                                        setSelectedSubcategory(null);
                                        return;
                                    }

                                    const subcategory = subcategories.find(
                                        (item) => item.id === subcategoryId,
                                    );
                                    if (subcategory) {
                                        handleSubcategorySelect(subcategory);
                                    }
                                }}
                            />
                        </div>
                    )}

                    <ProductsHeader
                        categoryName={
                            showAllCategories
                                ? t("categories.showAllCategories", "Show all categories")
                                : selectedCategory?.name || ""
                        }
                        subcategoryName={showAllCategories ? undefined : selectedSubcategory?.name}
                        highlightMainColor={productsHighlightColors.main}
                        highlightSecondColor={productsHighlightColors.second}
                        apiSurface={categoriesDarkSurface}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        freeDeliveryOnly={freeDeliveryOnly}
                        onFreeDeliveryToggle={(v) => setFreeDeliveryOnly(v)}
                        inStockOnly={inStockOnly}
                        onInStockToggle={(v) => setInStockOnly(v)}
                    />

                    {productsLoading && products.length === 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <ProductCardSkeleton key={`skeleton-${i}`} />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        description={product.description}
                                        price={product.price_after_discount_formatted ?? `${product.currency_symbol ?? ""}${product.price_after_discount}`}
                                        originalPrice={
                                            product.price > product.price_after_discount
                                                ? (product.price_formatted ?? `${product.currency_symbol ?? ""}${product.price}`)
                                                : undefined
                                        }
                                        rating={product.rating ?? 0}
                                        image={product.image}
                                        category={product.category}
                                        sold={product.sold_number ?? 0}
                                        isFavorite={
                                            product.id in favoriteStates
                                                ? favoriteStates[product.id]
                                                : (product.is_favorite ?? false)
                                        }
                                        onToggleFavorite={handleToggleFavorite}
                                        savings={`${t("product.youSaved", "You saved")} ${product.amount_saved_formatted ?? `${product.currency_symbol ?? ""}${product.amount_saved}`}`}
                                        badge={mapApiTopBadgesToProductCard(
                                            product.top_badges?.length
                                                ? product.top_badges
                                                : (product as { budges?: ProductBadge[] }).budges
                                        )}
                                        bottomBadges={mapApiBottomBadgesToProductCard(
                                            product.bottom_badges
                                        )}
                                        deliveryInfo={t("home.freeDelivery", "Free Delivery")}
                                        surfaceGradient={buildProductSurfaceGradient(product)}
                                        categoriesLuxuryListing={Boolean(categoriesDarkSurface)}
                                        t={t}
                                        onClick={handleProductClick}
                                    />
                                ))}
                            </div>

                            {isFetchingNextPage && (
                                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <ProductCardSkeleton key={`loading-${i}`} />
                                    ))}
                                </div>
                            )}

                            {hasNextPage && <div ref={observerTarget} className="h-10" />}
                        </>
                    ) : (
                        <div
                            className={cn(
                                "flex h-64 items-center justify-center rounded-3xl border backdrop-blur-xl",
                                !categoriesDarkSurface &&
                                    "border-primary-light/15 bg-gradient-to-br from-custom-card to-blue-50/35",
                            )}
                            style={
                                categoriesDarkSurface
                                    ? {
                                          backgroundColor: categoriesDarkSurface.cardBackground,
                                          borderColor: categoriesDarkSurface.cardBorder,
                                          color: categoriesDarkSurface.mutedColor,
                                      }
                                    : undefined
                            }
                        >
                            <p
                                className={cn(!categoriesDarkSurface && "text-custom-secondary")}
                                style={
                                    categoriesDarkSurface
                                        ? { color: categoriesDarkSurface.mutedColor }
                                        : undefined
                                }
                            >
                                {t(
                                    "categories.noProducts",
                                    "No products found in this category",
                                )}
                            </p>
                        </div>
                    )}

                    {/* <PromotionalBanners
                        onBannerClick={(id) => console.log("Banner clicked:", id)}
                    /> */}
                </div>
            </CategoriesLayout>
        </div>
    );
}
