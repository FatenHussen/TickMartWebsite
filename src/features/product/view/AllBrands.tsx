import { useEffect, useMemo, useState } from "react";
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
import { useTheme } from "@/context/ThemeContext";
import { getDarkCardSurfaceGradient } from "@/shared/component/sections/sectionCardVariant";
import Input from "@/shared/ui/Input";
import { useInfiniteList } from "@/shared/hooks/useInfiniteList";
import { queryKeys } from "@/utils/queryKeys";
import type { BrandListItem } from "../types/brand";

type BrandFilterType = "new" | "top_rated" | "most_popular" | undefined;

/** All-brands page: use theme white instead of `--color-api-second` when API omits colors */
const brandsPageSectionDefaults = {
    sectionBackground: "var(--color-bg-primary)",
    cardSurface: "var(--color-bg-card)",
} as const;

export default function AllBrands() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";
    const [searchInput, setSearchInput] = useState("");
    const [filterType, setFilterType] = useState<BrandFilterType>(undefined);

    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedSearch(searchInput.trim());
        }, 350);

        return () => window.clearTimeout(timeoutId);
    }, [searchInput]);

    const filters = useMemo(
        () => ({
            ...(debouncedSearch ? { search: debouncedSearch } : {}),
            ...(filterType ? { type: filterType } : {}),
        }),
        [debouncedSearch, filterType]
    );
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

    const { beforeSections, afterSections } = useSectionsByPosition("brands");

    const bannerSections = beforeSections.filter((s) => s.display_type_id === 1);
    const otherBeforeSections = beforeSections.filter(
        (s) => s.display_type_id !== 1
    );

    const handleBrandClick = (brandId: number) => {
        navigate(`/brand/${brandId}/products`);
    };

    return (
        <div className=" min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
            {bannerSections.length > 0 && (
                <div className="w-full">
                    <ApiSectionsRenderer
                        sections={bannerSections}
                        brandDefaultsWhenApiMissing={brandsPageSectionDefaults}
                    />
                </div>
            )}

            {otherBeforeSections.length > 0 && (
                <FullBleedSection contain={false}>
                    <ApiSectionsRenderer
                        sections={otherBeforeSections}
                        edgeToEdgeSectionBackgrounds
                        brandDefaultsWhenApiMissing={brandsPageSectionDefaults}
                    />
                </FullBleedSection>
            )}

            <div className="page-container py-6">
                {brandsError ? (
                    <div className="mt-8 flex items-center justify-center h-64 bg-custom-secondary rounded-2xl">
                        <p className="text-custom-secondary">{t("brands.failedToLoad")}</p>
                    </div>
                ) : (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-custom-primary mb-5">
                            {t("brands.allBrands")}
                        </h2>

                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                            <div className="w-full sm:w-auto sm:min-w-[280px] sm:max-w-sm">
                                <Input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder={t("brands.searchPlaceholder", "Search brands...")}
                                    rightIcon={<HiSearch className="w-5 h-5" />}
                                    className="w-full py-2 rounded-lg border-custom-primary placeholder-gray-400 dark:border-[color-mix(in_srgb,var(--color-text)_26%,transparent)] dark:focus:border-[color-mix(in_srgb,var(--color-main)_42%,var(--color-text))]"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setFilterType(undefined)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!filterType
                                            ? "bg-primary-light text-white"
                                            : "bg-custom-tertiary text-custom-primary hover:bg-custom-muted"
                                        }`}
                                >
                                    {t("brands.all", "All")}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFilterType("top_rated")}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === "top_rated"
                                            ? "bg-primary-light text-white"
                                            : "bg-custom-tertiary text-custom-primary hover:bg-custom-muted"
                                        }`}
                                >
                                    {t("brands.typeTopRated", "Top rated")}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFilterType("most_popular")}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === "most_popular"
                                            ? "bg-primary-light text-white"
                                            : "bg-custom-tertiary text-custom-primary hover:bg-custom-muted"
                                        }`}
                                >
                                    {t("brands.typeMostPopular", "Most popular")}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFilterType("new")}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === "new"
                                            ? "bg-primary-light text-white"
                                            : "bg-custom-tertiary text-custom-primary hover:bg-custom-muted"
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
                                    rating={brand.rating ?? 0}
                                    ordersCount={brand.orders_count}
                                    surfaceGradient={isDarkTheme ? getDarkCardSurfaceGradient() : undefined}
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
            </div>

            {afterSections.length > 0 && (
                <FullBleedSection contain={false}>
                    <ApiSectionsRenderer
                        sections={afterSections}
                        edgeToEdgeSectionBackgrounds
                        brandDefaultsWhenApiMissing={brandsPageSectionDefaults}
                    />
                </FullBleedSection>
            )}
        </div>
    );
}
