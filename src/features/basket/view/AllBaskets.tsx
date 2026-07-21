import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useBaskets } from "../hooks/useBaskets";
import { useToggleFavorite } from "@/features/account/hooks/useFavorites";
import { useSectionsByPosition } from "@/features/home/hooks/useSections";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import FullBleedSection from "@/shared/component/FullBleedSection";
import BasketCard from "@/shared/component/card/BasketCard";
import BasketCardSkeleton from "@/shared/component/skeleton/BasketCardSkeleton";
import { useTheme } from "@/context/ThemeContext";
import { getDarkCardSurfaceGradient } from "@/shared/component/sections/sectionCardVariant";
import RevealOnScroll from "@/shared/component/RevealOnScroll";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import SideContentLayout from "@/layout/SideContentLayout";
import BasketFiltersSidebar from "../components/BasketFiltersSidebar";
import type { BasketItem, BasketFilters } from "../types/basket";
import {
    mapApiBottomBadgesToProductCard,
    mapApiTopBadgesToProductCard,
} from "@/shared/lib/mapProductBadges";

const DEFAULT_FILTERS: BasketFilters = { basketType: "all" };

export default function AllBaskets() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";

    const [filters, setFilters] = useState<BasketFilters>(DEFAULT_FILTERS);
    const [currentPage, setCurrentPage] = useState(1);
    const [allBaskets, setAllBaskets] = useState<BasketItem[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [favoriteStates, setFavoriteStates] = useState<Record<number, boolean>>({});

    // Build API filter object from UI filter state
    const isSchedule =
        filters.basketType === "all"
            ? undefined
            : filters.basketType === "subscription"
                ? (1 as const)
                : (0 as const);

    const {
        data: basketsData,
        isLoading: isBasketsLoading,
        error: basketsError,
    } = useBaskets({
        is_schedule: isSchedule,
        price_min: filters.priceMin,
        price_max: filters.priceMax,
        rating_min: filters.ratingMin,
        items_count_min: filters.itemsCountMin,
        items_count_max: filters.itemsCountMax,
        type: filters.sortType,
        page: currentPage,
    });

    const { beforeSections, afterSections } = useSectionsByPosition("baskets");
    const bannerSections = beforeSections.filter((s) => s.display_type_id === 1);
    const otherBeforeSections = beforeSections.filter((s) => s.display_type_id !== 1);

    // Reset when filters change
    useEffect(() => {
        setAllBaskets([]);
        setCurrentPage(1);
        setHasMore(true);
    }, [filters]);

    // Accumulate baskets across pages
    useEffect(() => {
        if (basketsData?.items) {
            setAllBaskets((prev) => {
                const existingIds = new Set(prev.map((b) => b.id));
                const newBaskets = basketsData.items.filter((b) => !existingIds.has(b.id));
                return [...prev, ...newBaskets];
            });
            setHasMore(
                basketsData.pagination.current_page < basketsData.pagination.last_page
            );
        }
    }, [basketsData]);

    const observerTarget = useInfiniteScroll({
        onLoadMore: () => setCurrentPage((prev) => prev + 1),
        hasMore,
        isLoading: isBasketsLoading,
        threshold: 300,
    });

    const handleBasketClick = (basketId: number, nextDeliveryDate?: string) => {
        navigate(`/basket/${basketId}`, {
            state: { next_delivery_date: nextDeliveryDate },
        });
    };

    const handleAddToCart = (basketId: number) => {
        const basket = allBaskets.find((b) => b.id === basketId);
        navigate(`/basket/${basketId}`, {
            state: { next_delivery_date: basket?.next_delivery_date },
        });
    };

    const toggleFavorite = useToggleFavorite();

    const handleToggleFavorite = (basketId: number) => {
        const basket = allBaskets.find((b) => b.id === basketId);
        const currentFavorite =
            basketId in favoriteStates
                ? favoriteStates[basketId]
                : (basket?.is_favorite ?? false);

        setFavoriteStates((prev) => ({ ...prev, [basketId]: !currentFavorite }));

        toggleFavorite.mutate(
            { type: "basket", id: basketId },
            {
                onSuccess: (res) => {
                    const isFavorite = res?.data?.is_favorite ?? !currentFavorite;
                    setFavoriteStates((prev) => ({ ...prev, [basketId]: isFavorite }));
                },
                onError: () => {
                    setFavoriteStates((prev) => ({ ...prev, [basketId]: currentFavorite }));
                },
            }
        );
    };

    const sidebar = (
        <BasketFiltersSidebar filters={filters} onFiltersChange={setFilters} />
    );

    return (
        <div className="min-h-screen " dir={isRTL ? "rtl" : "ltr"}>
            {bannerSections.length > 0 && (
                <div className="w-full">
                    <ApiSectionsRenderer sections={bannerSections} />
                </div>
            )}

            <div className="page-container py-8">
                {otherBeforeSections.length > 0 && (
                    <FullBleedSection>
                        <ApiSectionsRenderer sections={otherBeforeSections} />
                    </FullBleedSection>
                )}

                <SideContentLayout
                    sidebar={sidebar}
                    sidebarPosition="left"
                    sidebarClassName="lg:w-[280px] lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:overflow-x-hidden lg:pe-1 scrollbar-custom"
                    gapClassName="gap-6"
                    stickySidebar
                    stickyTopClassName="top-6"
                >
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-custom-primary">
                            {t("baskets.allBaskets")}
                        </h2>
                        <p className="text-sm text-custom-secondary mt-2">
                            {t("baskets.browseDescription")}
                        </p>
                    </div>

                    {basketsError ? (
                        <div className="basket-sidebar-info mt-8 flex items-center justify-center h-64 rounded-2xl">
                            <p className="text-custom-primary">{t("baskets.failedToLoad")}</p>
                        </div>
                    ) : (
                        <div>
                            <div className="baskets-grid">
                                {allBaskets.map((basket, index) => (
                                    <RevealOnScroll
                                        key={basket.id}
                                        delayMs={(index % 4) * 70}
                                        className="h-full"
                                    >
                                    <BasketCard
                                        id={basket.id}
                                        name={basket.name}
                                        description={basket.desc || ""}
                                        image={basket.image}
                                        rating={basket.rating}
                                        price={basket.final_price_formatted ?? `${basket.currency_symbol ?? "$"}${basket.final_price}`}
                                        originalPrice={
                                            basket.original_price > basket.final_price
                                                ? `$${basket.original_price}`
                                                : undefined
                                        }
                                        saveAmount={
                                            basket.saving > 0
                                                ? `${t("baskets.save")} ${basket.saving_formatted ?? `${basket.currency_symbol ?? "$"}${basket.saving}`}`
                                                : undefined
                                        }
                                        badge={mapApiTopBadgesToProductCard(
                                            basket.top_badges?.length
                                                ? basket.top_badges
                                                : basket.budges
                                        )}
                                        bottomBadges={mapApiBottomBadgesToProductCard(
                                            basket.bottom_badges
                                        )}
                                        itemCount={basket.items_count}
                                        soldCount={basket.num_sold}
                                        offerEndingDate={
                                            basket.is_on_offer
                                                ? `${t("baskets.offerEnding")}: ${basket.offer_ends_at}`
                                                : undefined
                                        }
                                        isFavorite={
                                            basket.id in favoriteStates
                                                ? favoriteStates[basket.id]
                                                : (basket.is_favorite ?? false)
                                        }
                                        onClick={() => handleBasketClick(basket.id, basket.next_delivery_date ?? undefined)}
                                        onAddToCart={() => handleAddToCart(basket.id)}
                                        onToggleFavorite={() => handleToggleFavorite(basket.id)}
                                        surfaceGradient={isDarkTheme ? getDarkCardSurfaceGradient() : undefined}
                                        t={t}
                                    />
                                    </RevealOnScroll>
                                ))}

                                {isBasketsLoading &&
                                    Array.from({ length: 10 }).map((_, index) => (
                                        <BasketCardSkeleton key={`skeleton-${index}`} />
                                    ))}
                            </div>

                            {!isBasketsLoading && allBaskets.length === 0 && (
                                <div className="basket-sidebar-info mt-8 flex items-center justify-center h-64 rounded-2xl">
                                    <p className="text-custom-primary">{t("baskets.noBasketsFound")}</p>
                                </div>
                            )}

                            <div ref={observerTarget} className="h-10" />
                        </div>
                    )}
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
