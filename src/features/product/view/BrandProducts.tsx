import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useBrandDetails, useBrandProducts } from "../hooks/useBrands";
import { useBrandRatings } from "../hooks/useBrands";
import { useSectionsByPosition } from "@/features/home/hooks/useSections";
import { useAuthStore } from "@/store/auth";
import { useFavorites, useToggleFavorite } from "@/features/account/hooks/useFavorites";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import FullBleedSection from "@/shared/component/FullBleedSection";
import BrandHeader from "../components/BrandHeader";
import ProductGrid from "../components/ProductGrid";
import ProductCardSkeleton from "@/shared/component/skeleton/ProductCardSkeleton";
import ProductReviews from "@/shared/component/ProductReviews";
import { PremiumInlineLoader } from "@/shared/component/loading";
import { RatingFormModal } from "@/features/account/components";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import type { Product } from "../types";
import type { BrandProduct } from "../types/brand";
import { resolveListingCardPrices } from "@/shared/lib/formatApiPrice";

// Map UI sortBy label → API sortField / sortOrder
function mapSortToApi(sortBy: string): {
    sortField?: string;
    sortOrder?: "asc" | "desc";
} {
    switch (sortBy) {
        case "Price: Low to High":
            return { sortField: "price", sortOrder: "asc" };
        case "Price: High to Low":
            return { sortField: "price", sortOrder: "desc" };
        case "Rating":
            return { sortField: "rating", sortOrder: "desc" };
        case "Newest":
            return { sortField: "created_at", sortOrder: "desc" };
        default:
            return {};
    }
}

export default function BrandProducts() {
    const { t } = useTranslation();
    const { currency } = useCurrency();
    const { isRTL } = useLanguage();
    const { brandId } = useParams<{ brandId: string }>();
    const navigate = useNavigate();

    const [freeDeliveryOnly] = useState(false);
    const [inStockOnly] = useState(false);
    const [sortBy] = useState("Best match");
    const [currentPage, setCurrentPage] = useState(1);
    const [allProducts, setAllProducts] = useState<BrandProduct[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [ratingModalOpen, setRatingModalOpen] = useState(false);

    // Build API filter object from UI state
    const { sortField, sortOrder } = useMemo(() => mapSortToApi(sortBy), [sortBy]);

    const apiFilters = useMemo(
        () => ({
            is_free_delivery: freeDeliveryOnly ? (1 as const) : undefined,
            in_stock_only: inStockOnly ? (1 as const) : undefined,
            sortField,
            sortOrder,
            page: currentPage,
        }),
        [freeDeliveryOnly, inStockOnly, sortField, sortOrder, currentPage],
    );

    // Fetch brand details and products
    const {
        data: brandData,
        isLoading: isBrandLoading,
        error: brandError,
    } = useBrandDetails(Number(brandId));

    const {
        data: productsData,
        isLoading: isProductsLoading,
        error: productsError,
    } = useBrandProducts(Number(brandId), apiFilters);

    const brandIdNum = Number(brandId);
    const token = useAuthStore((s) => s.token);
    const {
        reviews: brandReviews,
        averageRating: reviewsAverage,
        totalReviews: reviewsTotal,
        ratingDistribution: reviewsDistribution,
        isLoading: isRatingsLoading,
    } = useBrandRatings(brandIdNum);

    // Reset pagination when filters (not page) change
    useEffect(() => {
        setAllProducts([]);
        setCurrentPage(1);
        setHasMore(true);
    }, [freeDeliveryOnly, inStockOnly, sortBy]);

    // Accumulate products from all pages
    useEffect(() => {
        if (productsData?.items) {
            setAllProducts((prev) => {
                const existingIds = new Set(prev.map((p) => p.id));
                const newProducts = productsData.items.filter(
                    (p) => !existingIds.has(p.id)
                );
                return [...prev, ...newProducts];
            });
            setHasMore(
                productsData.pagination.current_page < productsData.pagination.last_page
            );
        }
    }, [productsData]);

    // Infinite scroll
    const observerTarget = useInfiniteScroll({
        onLoadMore: () => setCurrentPage((prev) => prev + 1),
        hasMore,
        isLoading: isProductsLoading,
        threshold: 300,
    });

    // Fetch sections for brand_details page
    const { beforeSections, afterSections } =
        useSectionsByPosition("brand_details");
    const bannerSections = beforeSections.filter((s) => s.display_type_id === 1);
    const otherBeforeSections = beforeSections.filter(
        (s) => s.display_type_id !== 1
    );

    const { data: favoriteProducts = [] } = useFavorites("product", false);
    const toggleFavorite = useToggleFavorite();
    const favoriteIds = favoriteProducts.map((f) => f.id);

    const handleProductClick = (id: number) => {
        navigate(`/product/${id}`);
    };

    const handleToggleFavorite = (id: number) => {
        toggleFavorite.mutate({ type: "product", id });
    };

    // Convert BrandProduct to Product type for ProductGrid
    const convertToProducts = (items: BrandProduct[] = []): Product[] => {
        return items.map((item) => {
            const listing = resolveListingCardPrices(item, t("product.youSaved"), currency);
            return {
                id: item.id,
                name: item.name,
                price: listing.price,
                originalPrice: listing.originalPrice,
                rating: item.rating || 0,
                image: item.image,
                badge: (item as { budges?: { name: string; color: string }[] }).budges?.map((badge) => ({
                    label: badge.name,
                    className: badge.color,
                })),
                category: item.category,
                sold: item.sold_number,
                savings: listing.savings,
                discountLabel: listing.discountLabel,
                isFavorite: item.is_favorite ?? favoriteIds.includes(item.id),
            };
        });
    };

    const products = convertToProducts(allProducts);

    if (isBrandLoading && !brandData) {
        return (
            <div className="min-h-screen bg-custom-primary flex items-center justify-center">
                <PremiumInlineLoader size="md" />
            </div>
        );
    }

    if (brandError || productsError) {
        return (
            <div className="min-h-screen bg-custom-primary flex items-center justify-center">
                <div className="text-center">
                    <p className="text-custom-secondary text-lg">
                        {t("brands.failedToLoad")}
                    </p>
                </div>
            </div>
        );
    }

    if (!brandData) {
        return (
            <div className="min-h-screen bg-custom-primary flex items-center justify-center">
                <div className="text-center">
                    <p className="text-custom-secondary text-lg">
                        {t("brands.notFound")}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen " dir={isRTL ? "rtl" : "ltr"}>
            {bannerSections.length > 0 && (
                <div className="w-full">
                    <ApiSectionsRenderer sections={bannerSections} />
                </div>
            )}

            {otherBeforeSections.length > 0 && (
                <FullBleedSection contain={false}>
                    <ApiSectionsRenderer
                        sections={otherBeforeSections}
                        edgeToEdgeSectionBackgrounds
                    />
                </FullBleedSection>
            )}

            <div className="page-container py-6">
                {/* Brand Header */}
                <div className="mb-6">
                    <BrandHeader brand={brandData} />
                </div>

                {/* Product Filters – UI state wired to API */}
                <div className="mb-6">
                    {/* <ProductFilters
                        location="Downtown, Cairo"
                        categories={["All categories"]}
                        stores={["All stores"]}
                        selectedCategory={selectedCategory}
                        selectedStore={selectedStore}
                        onCategoryChange={setSelectedCategory}
                        onStoreChange={setSelectedStore}
                        freeDeliveryOnly={freeDeliveryOnly}
                        inStockOnly={inStockOnly}
                        onFreeDeliveryToggle={(v) => setFreeDeliveryOnly(v)}
                        onInStockToggle={(v) => setInStockOnly(v)}
                        sortBy={sortBy}
                        onSortChange={(label) => setSortBy(label)}
                    /> */}
                </div>

                {/* Product Grid */}
                <div className="mb-6">
                    {products.length > 0 && (
                        <ProductGrid
                            products={products}
                            onProductClick={handleProductClick}
                            onToggleFavorite={handleToggleFavorite}
                            columns={5}
                        />
                    )}

                    {isProductsLoading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5">
                            {Array.from({ length: 10 }).map((_, index) => (
                                <ProductCardSkeleton key={`skeleton-${index}`} />
                            ))}
                        </div>
                    )}

                    {!isProductsLoading && products.length === 0 && (
                        <div className="flex items-center justify-center h-64 bg-custom-secondary rounded-2xl">
                            <p className="text-custom-secondary">
                                {t("brands.noProductsFound")}
                            </p>
                        </div>
                    )}

                    <div ref={observerTarget} className="h-10" />
                </div>

                {/* Rate this brand */}
                {token && brandIdNum > 0 && (
                    <div className="mt-10">
                        <button
                            type="button"
                            onClick={() => setRatingModalOpen(true)}
                            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium text-sm"
                        >
                            {t("brands.rateBrand", "قيم هذه العلامة التجارية")}
                        </button>
                    </div>
                )}

                <div className="mt-6">
                    {isRatingsLoading ? (
                        <div className="flex justify-center py-6">
                            <PremiumInlineLoader size="sm" />
                        </div>
                    ) : (
                        <ProductReviews
                            averageRating={
                                reviewsTotal > 0 ? reviewsAverage : (brandData?.rating ?? 0)
                            }
                            totalReviews={reviewsTotal}
                            ratingDistribution={reviewsDistribution}
                            reviews={brandReviews}
                            sectionTitle={t("brands.brandReviews", "تقييمات العلامة التجارية")}
                        />
                    )}
                </div>
            </div>

            {afterSections.length > 0 && (
                <FullBleedSection contain={false}>
                    <ApiSectionsRenderer
                        sections={afterSections}
                        edgeToEdgeSectionBackgrounds
                    />
                </FullBleedSection>
            )}

            <RatingFormModal
                isOpen={ratingModalOpen}
                onClose={() => setRatingModalOpen(false)}
                onSuccess={() => setRatingModalOpen(false)}
                mode="create"
                rateableType="brand"
                rateableId={brandIdNum}
            />
        </div>
    );
}
