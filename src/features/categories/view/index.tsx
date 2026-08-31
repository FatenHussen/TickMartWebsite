import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { useAppSettings } from "@/features/account/hooks/useAppSettings";
import { useSections, useSectionsByPosition } from "@/features/home/hooks/useSections";
import { pickHomeSectionBySeeMorePageSlug } from "@/features/home/lib/homeStaticSectionSurface";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import QuickOrderHomeBanner from "@/features/home/components/QuickOrderHomeBanner";
import FullBleedSection from "@/shared/component/FullBleedSection";
import {
    getSectionCardSurfaceColor,
    getDarkCardSurfaceGradient,
} from "@/shared/component/sections/sectionCardVariant";
import { cn } from "@/shared/lib/utils";
import { resolveApiPaletteForTheme } from "@/shared/lib/themeColors";
import {
    buildCategoriesLuxuryDarkSurface,
    resolveCategoriesDarkAccents,
} from "../lib/categoriesApiDarkSurface";
import { getHomeRootSurfaceStyle } from "@/features/home/lib/homeRootSurface";
import CategoriesLayout from "../layout/CategoriesLayout";
import CategoriesSidebar from "../components/CategoriesSidebar";
import ProductsHeader from "../components/ProductsHeader";
import ProductCard from "@/shared/component/card/ProductCard";
import ProductCardSkeleton from "@/shared/component/skeleton/ProductCardSkeleton";
import CategoryCircleStrip from "@/shared/component/category/CategoryCircleStrip";
import CategoryDrillHeader from "../components/CategoryDrillHeader";
import { useCategoryLevels } from "../hooks/useCategoryLevels";
import { useCategoryPage } from "../hooks/useCategoryPage";
import { parseCategoryTrail, writeCategoryTrail } from "../lib/categoryTrail";
import { selectRenderableCategorySections } from "../lib/categoryPageSections";
import { readCategoryColor } from "@/shared/lib/categoryColors";
import { _CategoriesApi } from "../api/categoriesApi";
import { useInfiniteList } from "@/shared/hooks/useInfiniteList";
import { useToggleFavorite } from "@/features/account/hooks/useFavorites";
import { paths } from "@/app/routes/path/paths";
import type { ApiProduct, ProductBadge } from "../types";
import type { CategoryTypeFilter } from "../components/CategoryFilters";
import {
    mapApiBottomBadgesToProductCard,
    mapApiTopBadgesToProductCard,
} from "@/shared/lib/mapProductBadges";

// Map UI sortBy value → API `sort_by`
function mapSortToApi(sortBy: string): {
    sort_by?: "price_asc" | "price_desc" | "newest" | "oldest" | "rating";
} {
    switch (sortBy) {
        case "priceLow":
            return { sort_by: "price_asc" };
        case "priceHigh":
            return { sort_by: "price_desc" };
        case "rating":
            return { sort_by: "rating" };
        case "newest":
            return { sort_by: "newest" };
        case "oldest":
            return { sort_by: "oldest" };
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
    const [searchParams, setSearchParams] = useSearchParams();

    /** The drill-down path lives in the URL, so Back walks one level up for free. */
    const trail = useMemo(() => parseCategoryTrail(searchParams), [searchParams]);
    const {
        breadcrumb,
        currentNode,
        currentChildren,
        currentLoading,
    } = useCategoryLevels(trail);

    const showAllCategories = trail.length === 0;

    const [sortBy, setSortBy] = useState<string>("recommended");
    const [freeDeliveryOnly, setFreeDeliveryOnly] = useState(false);
    const [instantDeliveryOnly, setInstantDeliveryOnly] = useState(false);
    const [onSaleOnly, setOnSaleOnly] = useState(false);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [categoryTypeFilter, setCategoryTypeFilter] = useState<CategoryTypeFilter>(undefined);
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [countryFilter, setCountryFilter] = useState<string | undefined>(undefined);
    const [searchFilter, setSearchFilter] = useState<string | undefined>(undefined);
    // Attribute *value* ids from the sidebar chips. Attributes are defined per
    // category tree (root), so a value picked one level up still applies — but
    // we clear them when the browsed category changes to avoid stale chips.
    const [attributeValues, setAttributeValues] = useState<number[]>([]);
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
            readCategoryColor(activeCategory, "main") ??
            themeGradientColors?.main;
        const second =
            readProductColor(product, "second") ??
            readCategoryColor(activeCategory, "second") ??
            themeGradientColors?.second;

        if (isDarkTheme) {
            // Match every other card: derive the dark surface from the dashboard
            // "dark second color" (`--color-api-second`) via the shared gradient.
            return getDarkCardSurfaceGradient();
        }

        if (!main && !second) return undefined;
        const start = main ?? second;
        const end = second ?? main;
        return `linear-gradient(145deg, color-mix(in srgb, ${start} 24%, #ffffff) 0%, color-mix(in srgb, ${start} 14%, #ffffff) 38%, color-mix(in srgb, ${end} 16%, #ffffff) 72%, color-mix(in srgb, ${end} 28%, #ffffff) 100%)`;
    };

    const toggleFavorite = useToggleFavorite();

    /** Read straight off the trail: the id is known before the node resolves. */
    const categoryIdForProducts = trail.length > 0 ? trail[trail.length - 1] : undefined;

    const { sort_by } = useMemo(() => mapSortToApi(sortBy), [sortBy]);

    /**
     * One filter set for the whole page. The sections get it too: their
     * `type: "api"` rows resolve items through the same product query, so
     * leaving the filters out of those query keys is what makes a filter change
     * refresh the grid while the sections keep their unfiltered items.
     */
    const productFilters = useMemo(
        () => ({
            sort_by,
            is_free_delivery: freeDeliveryOnly ? true : undefined,
            is_instant_delivery: instantDeliveryOnly ? true : undefined,
            on_sale: onSaleOnly ? true : undefined,
            in_stock_only: inStockOnly ? true : undefined,
            type: categoryTypeFilter,
            price_min: minPrice,
            price_max: maxPrice,
            country: countryFilter,
            search: searchFilter,
            attribute_values: attributeValues.length ? attributeValues : undefined,
        }),
        [
            sort_by,
            freeDeliveryOnly,
            instantDeliveryOnly,
            onSaleOnly,
            inStockOnly,
            categoryTypeFilter,
            minPrice,
            maxPrice,
            countryFilter,
            searchFilter,
            attributeValues,
        ],
    );

    useEffect(() => {
        setAttributeValues([]);
    }, [categoryIdForProducts]);

    // Root view keeps the generic `page_slug=categories` sections; a selected
    // category (any level) gets its own page from /categories/{id}/page, whose
    // sections render through the same ApiSectionsRenderer.
    const { beforeSections: rootBeforeSections, afterSections: rootAfterSections } =
        useSectionsByPosition("categories", productFilters);
    const { data: categoryPage } = useCategoryPage(categoryIdForProducts, productFilters);

    /**
     * The category this page is showing. `/categories/{id}/page` answers for any
     * level, so its own record wins over the root-down `?parent_id=` walk, which
     * cannot resolve an id that was deep-linked from a nav menu or a card. Never
     * an ancestor: labelling the page with the root category while a deeper one
     * is being browsed is worse than waiting a beat for the real name.
     */
    const activeCategory =
        categoryIdForProducts == null
            ? null
            : (categoryPage?.category ?? currentNode);

    const { beforeSections, afterSections } = useMemo(() => {
        if (categoryIdForProducts == null) {
            return {
                beforeSections: rootBeforeSections,
                afterSections: rootAfterSections,
            };
        }
        // Admin-added sections only, in their `order` — the backend's own
        // subcategories and products rows are dropped, since this page already
        // draws both (drill strip, filterable grid). Sections without a
        // `position` render above the listing.
        const sections = selectRenderableCategorySections(
            categoryPage?.sections,
            categoryIdForProducts,
        );
        return {
            beforeSections: sections.filter((s) => s.position !== "after"),
            afterSections: sections.filter((s) => s.position === "after"),
        };
    }, [categoryIdForProducts, categoryPage, rootBeforeSections, rootAfterSections]);

    const bannerSections = beforeSections.filter((s) => s.display_type_id === 1);
    const otherBeforeSections = beforeSections.filter((s) => s.display_type_id !== 1);

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

    const pushTrail = useCallback(
        (next: number[], options?: { replace?: boolean }) => {
            setSearchParams(writeCategoryTrail(searchParams, next), options);
        },
        [searchParams, setSearchParams],
    );

    /** Enter the next level down. */
    const handleDrillInto = (categoryId: number) => pushTrail([...trail, categoryId]);

    /** Breadcrumb jump; `0` is the root level. */
    const handleNavigateToDepth = (depth: number) => pushTrail(trail.slice(0, depth));

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
        const node = categoryPage?.category ?? currentNode;
        const main = readCategoryColor(node, "main");
        const second = readCategoryColor(node, "second");
        if (main || second) {
            return { main: main ?? second ?? null, second: second ?? main ?? null };
        }
        return { main: null as string | null, second: null as string | null };
    }, [
        isDarkTheme,
        showAllCategories,
        headlineSection,
        categoryPage,
        currentNode,
        categoriesDarkSurface,
    ]);

    const circleSize = trail.length === 0 ? "lg" : trail.length === 1 ? "md" : "sm";

    /**
     * Once the category page resolves, its `children` are the authority for the
     * drill strip (the `?parent_id=` levels can degrade to name-only nodes).
     */
    const pageChildren =
        categoryIdForProducts != null ? categoryPage?.category.children : undefined;
    const childrenForStrip = pageChildren?.length ? pageChildren : currentChildren;

    const circleItems = useMemo(
        () =>
            childrenForStrip.map((child) => ({
                id: child.id,
                name: child.name,
                icon: child.icon ?? null,
                mainColor: readCategoryColor(child, "main"),
                secondColor: readCategoryColor(child, "second"),
                hasChildren: (child.children?.length ?? 0) > 0,
            })),
        [childrenForStrip],
    );

    /**
     * One crumb per trail id, so a crumb index is its depth. Ancestors resolve
     * root-down and can come back nameless (the root list is paginated, a
     * `?parent_id=` level degraded, or the link jumped straight to a
     * subcategory); the page endpoint names the deepest one, and anything still
     * unknown keeps a neutral label rather than dropping a level.
     */
    const headerTrail = useMemo(
        () =>
            breadcrumb.map((crumb, index) => {
                const isDeepest = index === breadcrumb.length - 1;
                const page = categoryPage?.category;
                const name =
                    crumb.name || (isDeepest && page?.id === crumb.id ? page.name : "");
                return { id: crumb.id, name: name || t("categories.category", "Category") };
            }),
        [breadcrumb, categoryPage, t],
    );

    const sidebar = (
        <CategoriesSidebar
            apiSurface={categoriesDarkSurface}
            categoryTypeFilter={categoryTypeFilter}
            onCategoryTypeFilterChange={setCategoryTypeFilter}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceFilterChange={({ minPrice: nextMin, maxPrice: nextMax }) => {
                setMinPrice(nextMin);
                setMaxPrice(nextMax);
            }}
            country={countryFilter}
            onCountryChange={setCountryFilter}
            search={searchFilter}
            onSearchChange={setSearchFilter}
            categoryId={categoryIdForProducts}
            rootCategoryId={trail[0]}
            attributeValues={attributeValues}
            onAttributeValuesChange={setAttributeValues}
            freeDeliveryOnly={freeDeliveryOnly}
            onFreeDeliveryToggle={setFreeDeliveryOnly}
            instantDeliveryOnly={instantDeliveryOnly}
            onInstantDeliveryToggle={setInstantDeliveryOnly}
            onSaleOnly={onSaleOnly}
            onOnSaleToggle={setOnSaleOnly}
            inStockOnly={inStockOnly}
            onInStockToggle={setInStockOnly}
        />
    );

    const pageRootStyle =
        isDarkTheme && categoriesDarkSurface
            ? {
                  // Match the home page shell: API `main`/`second` radial glows over near-black.
                  ...getHomeRootSurfaceStyle(true),
                  color: categoriesDarkSurface.pageColor,
              }
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
            <div className="page-container pt-4 sm:pt-6">
                <QuickOrderHomeBanner pageSlug="categories" />
            </div>

            {bannerSections.length > 0 && (
                <div className="w-full">
                    <ApiSectionsRenderer
                        sections={bannerSections}
                        onCategoryItemClick={handleDrillInto}
                    />
                </div>
            )}

            <CategoriesLayout
                sidebar={sidebar}
                sidebarPosition="left"
                gapClassName={categoriesDarkSurface ? "gap-8 lg:gap-10" : undefined}
                header={
                    otherBeforeSections.length > 0 ? (
                        <FullBleedSection>
                            <ApiSectionsRenderer
                                sections={otherBeforeSections}
                                onCategoryItemClick={handleDrillInto}
                            />
                        </FullBleedSection>
                    ) : undefined
                }
                footer={
                    afterSections.length > 0 ? (
                        <FullBleedSection>
                            <ApiSectionsRenderer
                                sections={afterSections}
                                onCategoryItemClick={handleDrillInto}
                            />
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

                    <CategoryDrillHeader
                        trail={headerTrail}
                        rootLabel={t("categories.categoriesTitle", "Categories")}
                        onNavigateToDepth={handleNavigateToDepth}
                        accentColor={productsHighlightColors.main}
                        apiSurface={categoriesDarkSurface}
                    />

                    {(circleItems.length > 0 || currentLoading) && (
                        <div
                            // Keyed on the level so each drill step re-runs the entrance.
                            key={`level-${trail.join("-")}`}
                            className={cn(
                                "animate-card-enter min-w-0 rounded-[20px] border p-5 sm:p-6",
                                categoriesDarkSurface
                                    ? "border-solid shadow-[0_8px_32px_-12px_rgba(0,0,0,0.55)] backdrop-blur-xl"
                                    : "border-slate-200/70 bg-custom-card shadow-[0_1px_3px_rgba(15,23,42,0.04),0_14px_36px_-22px_rgba(15,23,42,0.24)]",
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
                            <CategoryCircleStrip
                                items={circleItems}
                                size={circleSize}
                                isLoading={currentLoading}
                                onSelect={handleDrillInto}
                                apiSurface={categoriesDarkSurface}
                            />
                        </div>
                    )}

                    <ProductsHeader
                        categoryName={
                            showAllCategories
                                ? t("categories.showAllCategories", "Show all categories")
                                : (activeCategory?.name ?? "")
                        }
                        subcategoryName={undefined}
                        highlightMainColor={productsHighlightColors.main}
                        highlightSecondColor={productsHighlightColors.second}
                        apiSurface={categoriesDarkSurface}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
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
                                "flex flex-col items-center justify-center gap-4 rounded-[20px] border px-6 py-14 text-center",
                                !categoriesDarkSurface &&
                                    "border-slate-200/70 bg-custom-card shadow-[0_1px_3px_rgba(15,23,42,0.04),0_14px_36px_-22px_rgba(15,23,42,0.24)]",
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
                            <span
                                aria-hidden
                                className={cn(
                                    "flex h-14 w-14 items-center justify-center rounded-full",
                                    !categoriesDarkSurface &&
                                        "bg-primary-light/10 text-primary-light",
                                )}
                                style={
                                    categoriesDarkSurface
                                        ? {
                                              backgroundColor: `color-mix(in srgb, ${categoriesDarkSurface.main} 16%, transparent)`,
                                              color: categoriesDarkSurface.pageColor,
                                          }
                                        : undefined
                                }
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.8}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                            </span>

                            <div className="space-y-1.5">
                                <p
                                    className={cn(
                                        "text-base font-semibold",
                                        !categoriesDarkSurface && "text-custom-primary",
                                    )}
                                    style={
                                        categoriesDarkSurface
                                            ? { color: categoriesDarkSurface.pageColor }
                                            : undefined
                                    }
                                >
                                    {t(
                                        "categories.noProducts",
                                        "No products found in this category",
                                    )}
                                </p>
                            </div>
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
