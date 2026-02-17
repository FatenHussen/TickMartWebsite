import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useBrands } from "../hooks/useBrands";
import { useSectionsByPosition } from "@/features/home/hooks/useSections";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import FullBleedSection from "@/shared/component/FullBleedSection";
import BrandCard from "@/shared/component/card/BrandCard";
import BrandCardSkeleton from "@/shared/component/skeleton/BrandCardSkeleton";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import type { BrandListItem } from "../types/brand";

export default function AllBrands() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [allBrands, setAllBrands] = useState<BrandListItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: brandsData,
    isLoading: isBrandsLoading,
    error: brandsError,
  } = useBrands(currentPage);

  // Accumulate brands from all pages
  useEffect(() => {
    if (brandsData?.items) {
      setAllBrands((prev) => {
        // Avoid duplicates
        const existingIds = new Set(prev.map((b) => b.id));
        const newBrands = brandsData.items.filter(
          (b) => !existingIds.has(b.id)
        );
        return [...prev, ...newBrands];
      });

      // Check if we have more pages
      setHasMore(
        brandsData.pagination.current_page < brandsData.pagination.last_page
      );
    }
  }, [brandsData]);

  // Infinite scroll
  const observerTarget = useInfiniteScroll({
    onLoadMore: () => setCurrentPage((prev) => prev + 1),
    hasMore,
    isLoading: isBrandsLoading,
    threshold: 300,
  });

  const { beforeSections, afterSections } = useSectionsByPosition("brands");

  // Separate banner sections (display_type_id: 1) from other sections
  const bannerSections = beforeSections.filter((s) => s.display_type_id === 1);
  const otherBeforeSections = beforeSections.filter(
    (s) => s.display_type_id !== 1
  );

  const handleBrandClick = (brandId: number) => {
    navigate(`/brand/${brandId}/products`);
  };

  return (
    <div className="min-h-screen bg-custom-primary" dir={isRTL ? "rtl" : "ltr"}>
      {/* Banner Sections - Full Width (display_type_id: 1) - BEFORE main content */}
      {bannerSections.length > 0 && (
        <div className="w-full">
          <ApiSectionsRenderer sections={bannerSections} />
        </div>
      )}

      <div className="page-container py-6">
        {/* Other Sections before brands */}
        {otherBeforeSections.length > 0 && (
          <FullBleedSection>
            <ApiSectionsRenderer sections={otherBeforeSections} />
          </FullBleedSection>
        )}

        {/* Brands Grid */}
        {brandsError ? (
          <div className="mt-8 flex items-center justify-center h-64 bg-custom-secondary rounded-2xl">
            <p className="text-custom-secondary">{t("brands.failedToLoad")}</p>
          </div>
        ) : (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-custom-primary mb-6">
              {t("brands.allBrands")}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {/* Render actual brands */}
              {allBrands.map((brand) => (
                <BrandCard
                  key={brand.id}
                  name={brand.name}
                  image={brand.image}
                  rating={0}
                  onClick={() => handleBrandClick(brand.id)}
                />
              ))}

              {/* Show skeleton loaders while loading more */}
              {isBrandsLoading &&
                Array.from({
                  length: 10,
                }).map((_, index) => (
                  <BrandCardSkeleton key={`skeleton-${index}`} />
                ))}
            </div>

            {/* Empty state */}
            {!isBrandsLoading && allBrands.length === 0 && (
              <div className="mt-8 flex items-center justify-center h-64 bg-custom-secondary rounded-2xl">
                <p className="text-custom-secondary">
                  {t("brands.noBrandsFound")}
                </p>
              </div>
            )}

            {/* Infinite scroll trigger */}
            <div ref={observerTarget} className="h-10" />
          </div>
        )}

        {/* Sections after brands */}
        {afterSections.length > 0 && (
          <FullBleedSection>
            <ApiSectionsRenderer sections={afterSections} />
          </FullBleedSection>
        )}
      </div>
    </div>
  );
}
