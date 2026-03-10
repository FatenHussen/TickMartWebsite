import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import { useLanguage } from "@/context/LanguageContext";
import { _BrandApi } from "../api/brandApi";
import { useSectionsByPosition } from "@/features/home/hooks/useSections";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import FullBleedSection from "@/shared/component/FullBleedSection";
import BrandCard from "@/shared/component/card/BrandCard";
import BrandCardSkeleton from "@/shared/component/skeleton/BrandCardSkeleton";
import Input from "@/shared/ui/Input";
import { useInfiniteList } from "@/shared/hooks/useInfiniteList";
import { queryKeys } from "@/utils/queryKeys";
import type { BrandListItem } from "../types/brand";

type BrandFilterType = "new" | "top_rated" | "most_popular" | undefined;

export default function AllBrands() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filterType, setFilterType] = useState<BrandFilterType>(undefined);

  const filters = {
    ...(search ? { search } : {}),
    ...(filterType ? { type: filterType } : {}),
  };
  const hasFilters = Object.keys(filters).length > 0;

  const {
    items: allBrands,
    observerTarget,
    isLoading,
    isFetchingNextPage,
    error: brandsError,
  } = useInfiniteList<BrandListItem>({
    queryKey: queryKeys.brands.listInfinite(hasFilters ? filters : undefined),
    fetchFn: (page) =>
      _BrandApi.getBrands({ ...filters, page }).then((r) => r.data),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const { beforeSections, afterSections } = useSectionsByPosition("brands");

  const bannerSections = beforeSections.filter((s) => s.display_type_id === 1);
  const otherBeforeSections = beforeSections.filter(
    (s) => s.display_type_id !== 1
  );

  const handleBrandClick = (brandId: number) => {
    navigate(`/brand/${brandId}/products`);
  };

  return (
    <div className="min-h-screen bg-custom-primary" dir={isRTL ? "rtl" : "ltr"}>
      {bannerSections.length > 0 && (
        <div className="w-full">
          <ApiSectionsRenderer sections={bannerSections} />
        </div>
      )}

      <div className="page-container py-6">
        {otherBeforeSections.length > 0 && (
          <FullBleedSection>
            <ApiSectionsRenderer sections={otherBeforeSections} />
          </FullBleedSection>
        )}

        {brandsError ? (
          <div className="mt-8 flex items-center justify-center h-64 bg-custom-secondary rounded-2xl">
            <p className="text-custom-secondary">{t("brands.failedToLoad")}</p>
          </div>
        ) : (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-custom-primary mb-5">
              {t("brands.allBrands")}
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:items-center">
              <form
                onSubmit={handleSearchSubmit}
                className="flex-1 min-w-0"
              >
                <Input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t("brands.searchPlaceholder", "Search brands...")}
                  rightIcon={<HiSearch className="w-5 h-5" />}
                  className="w-full py-2.5 rounded-lg border-gray-200 dark:border-gray-700 placeholder-gray-400"
                />
              </form>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setFilterType(undefined)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !filterType
                      ? "bg-primary-light text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {t("brands.all", "All")}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("top_rated")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === "top_rated"
                      ? "bg-primary-light text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {t("brands.typeTopRated", "Top rated")}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("most_popular")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === "most_popular"
                      ? "bg-primary-light text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {t("brands.typeMostPopular", "Most popular")}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("new")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === "new"
                      ? "bg-primary-light text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {t("brands.typeNew", "New")}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {allBrands.map((brand) => (
                <BrandCard
                  key={brand.id}
                  name={brand.name}
                  image={brand.image}
                  rating={0}
                  onClick={() => handleBrandClick(brand.id)}
                />
              ))}

              {(isLoading || isFetchingNextPage) &&
                Array.from({
                  length: 10,
                }).map((_, index) => (
                  <BrandCardSkeleton key={`skeleton-${index}`} />
                ))}
            </div>

            {!isLoading && allBrands.length === 0 && (
              <div className="mt-8 flex items-center justify-center h-64 bg-custom-secondary rounded-2xl">
                <p className="text-custom-secondary">
                  {t("brands.noBrandsFound")}
                </p>
              </div>
            )}

            <div ref={observerTarget} className="h-10" />
          </div>
        )}

        {afterSections.length > 0 && (
          <FullBleedSection>
            <ApiSectionsRenderer sections={afterSections} />
          </FullBleedSection>
        )}
      </div>
    </div>
  );
}
