import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useBaskets } from "../hooks/useBaskets";
import { useSectionsByPosition } from "@/features/home/hooks/useSections";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import FullBleedSection from "@/shared/component/FullBleedSection";
import BasketCard from "@/shared/component/card/BasketCard";
import BasketCardSkeleton from "@/shared/component/skeleton/BasketCardSkeleton";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import SideContentLayout from "@/layout/SideContentLayout";
import BasketFiltersSidebar from "../components/BasketFiltersSidebar";
import type { BasketItem, BasketType } from "../types/basket";

export default function AllBaskets() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const [basketType, setBasketType] = useState<BasketType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [allBaskets, setAllBaskets] = useState<BasketItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Determine is_schedule parameter based on basket type
  const isSchedule =
    basketType === "all" ? undefined : basketType === "subscription" ? 1 : 0;

  const {
    data: basketsData,
    isLoading: isBasketsLoading,
    error: basketsError,
  } = useBaskets(isSchedule, currentPage);

  const { beforeSections, afterSections } = useSectionsByPosition("baskets");

  // Separate banner sections (display_type_id: 1) from other sections
  const bannerSections = beforeSections.filter((s) => s.display_type_id === 1);
  const otherBeforeSections = beforeSections.filter(
    (s) => s.display_type_id !== 1
  );

  // Reset when filter changes
  useEffect(() => {
    setAllBaskets([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [basketType]);

  // Accumulate baskets from all pages
  useEffect(() => {
    if (basketsData?.items) {
      setAllBaskets((prev) => {
        const existingIds = new Set(prev.map((b) => b.id));
        const newBaskets = basketsData.items.filter(
          (b) => !existingIds.has(b.id)
        );
        return [...prev, ...newBaskets];
      });

      setHasMore(
        basketsData.pagination.current_page < basketsData.pagination.last_page
      );
    }
  }, [basketsData]);

  // Infinite scroll
  const observerTarget = useInfiniteScroll({
    onLoadMore: () => setCurrentPage((prev) => prev + 1),
    hasMore,
    isLoading: isBasketsLoading,
    threshold: 300,
  });

  const handleBasketClick = (basketId: number, nextDeliveryDate?: string) => {
    navigate(`/basket/${basketId}`, {
      state: { next_delivery_date: nextDeliveryDate }
    });
  };

  const handleAddToCart = (basketId: number) => {
    // TODO: Add to cart logic
    console.log("Add to cart:", basketId);
  };

  const handleToggleFavorite = (basketId: number) => {
    // TODO: Toggle favorite logic
    console.log("Toggle favorite:", basketId);
  };

  // Sidebar with filters
  const sidebar = (
    <BasketFiltersSidebar
      selectedType={basketType}
      onTypeChange={setBasketType}
    />
  );

  return (
    <div className="min-h-screen bg-custom-primary" dir={isRTL ? "rtl" : "ltr"}>
      {/* Banner Sections - Full Width (display_type_id: 1) - BEFORE main content */}
      {bannerSections.length > 0 && (
        <div className="w-full">
          <ApiSectionsRenderer sections={bannerSections} />
        </div>
      )}

      <div className="page-container py-8">
        {/* Other Sections before baskets */}
        {otherBeforeSections.length > 0 && (
          <FullBleedSection>
            <ApiSectionsRenderer sections={otherBeforeSections} />
          </FullBleedSection>
        )}

        {/* Main Layout with Sidebar */}
        <SideContentLayout
          sidebar={sidebar}
          sidebarPosition="left"
          sidebarClassName="lg:w-[280px]"
          gapClassName="gap-6"
        >
          {/* Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-custom-primary">
              {t("baskets.allBaskets")}
            </h2>
            <p className="text-sm text-custom-secondary mt-2">
              {t("baskets.browseDescription")}
            </p>
          </div>

          {/* Baskets Grid */}
          {basketsError ? (
            <div className="mt-8 flex items-center justify-center h-64 bg-custom-secondary rounded-2xl">
              <p className="text-custom-secondary">
                {t("baskets.failedToLoad")}
              </p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Render actual baskets */}
                {allBaskets.map((basket) => (
                  <BasketCard
                    key={basket.id}
                    id={basket.id}
                    name={basket.name}
                    description={basket.desc || ""}
                    image={basket.image}
                    price={`$${basket.final_price}`}
                    originalPrice={
                      basket.original_price > basket.final_price
                        ? `$${basket.original_price}`
                        : undefined
                    }
                    saveAmount={
                      basket.saving > 0
                        ? `${t("baskets.save")} $${basket.saving}`
                        : undefined
                    }
                    offerEndingDate={
                      basket.is_on_offer
                        ? `${t("baskets.offerEnding")}: ${basket.offer_ends_at}`
                        : undefined
                    }
                    onClick={() => handleBasketClick(basket.id, basket.next_delivery_date)}
                    onAddToCart={() => handleAddToCart(basket.id)}
                    onToggleFavorite={() => handleToggleFavorite(basket.id)}
                    t={t}
                  />
                ))}

                {/* Show skeleton loaders while loading more */}
                {isBasketsLoading &&
                  Array.from({ length: 10 }).map((_, index) => (
                    <BasketCardSkeleton key={`skeleton-${index}`} />
                  ))}
              </div>

              {/* Empty state */}
              {!isBasketsLoading && allBaskets.length === 0 && (
                <div className="mt-8 flex items-center justify-center h-64 bg-custom-secondary rounded-2xl">
                  <p className="text-custom-secondary">
                    {t("baskets.noBasketsFound")}
                  </p>
                </div>
              )}

              {/* Infinite scroll trigger */}
              <div ref={observerTarget} className="h-10" />
            </div>
          )}
        </SideContentLayout>

        {/* Sections after baskets */}
        {afterSections.length > 0 && (
          <FullBleedSection>
            <ApiSectionsRenderer sections={afterSections} />
          </FullBleedSection>
        )}
      </div>
    </div>
  );
}
