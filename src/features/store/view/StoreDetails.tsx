import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { HiAdjustments, HiSearch, HiX } from "react-icons/hi";
import { useLanguage } from "@/context/LanguageContext";
import { _ShopApi } from "../api/shopApi";
import { useSectionsByPosition } from "@/features/home/hooks/useSections";
import { useAddresses } from "@/features/account/hooks/useAddress";
import { _LocationApi } from "@/features/auth/api/location.service";
import { _CategoriesApi } from "@/features/home/api/categories.service";
import { useInfiniteSelect } from "@/shared/hooks/useInfiniteSelect";
import { useInfiniteList } from "@/shared/hooks/useInfiniteList";
import { useToggleFavorite } from "@/features/account/hooks/useFavorites";
import type { Governorate } from "@/features/auth/types";
import type { Category } from "@/features/home/types";
import type { ShopListItem } from "../types/shop";
import { useCheckoutStore } from "@/store/checkout";
import { queryKeys } from "@/utils/queryKeys";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import FullBleedSection from "@/shared/component/FullBleedSection";
import ShopCard from "@/shared/component/card/ShopCard";
import { paths } from "@/app/routes/path/paths";
import {
    mapApiBottomBadgesToProductCard,
    mapApiTopBadgesToProductCard,
} from "@/shared/lib/mapProductBadges";

const DEFAULT_LAT = 33.5138;
const DEFAULT_LNG = 36.2765;

export default function StoreDetails() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [governorateId, setGovernorateId] = useState<number | undefined>();
    const [categoryId, setCategoryId] = useState<number | undefined>();

    const { addressId } = useCheckoutStore();
    const { data: addresses = [] } = useAddresses();
    const selectedAddress = addressId != null
        ? addresses.find((a) => a.id === addressId || a.id === Number(addressId))
        : addresses.find((a) => a.is_default) ?? addresses[0];

    const lat = selectedAddress?.lat ?? DEFAULT_LAT;
    const lng = selectedAddress?.lng ?? DEFAULT_LNG;

    const {
        options: governorateOptions,
        handleScroll: handleGovScroll,
        isFetchingNextPage: isFetchingMoreGov,
    } = useInfiniteSelect<Governorate>({
        queryKey: ["location", "governorates", "select"],
        fetchFn: async (page) => {
            const res = await _LocationApi.getGovernorates(page);
            return res.data;
        },
        mapToOption: (gov) => ({
            value: gov.id,
            label: typeof gov.name === "string" ? gov.name : String(gov.name),
        }),
    });

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

    const filters = {
        lat,
        lng,
        is_service_provider: 1 as const,
        ...(governorateId ? { governorate_id: governorateId } : {}),
        ...(categoryId ? { category_id: categoryId } : {}),
        ...(search ? { search } : {}),
    };

    const {
        items: allShops,
        observerTarget,
        isLoading,
        isFetchingNextPage,
        error: shopsError,
    } = useInfiniteList<ShopListItem>({
        queryKey: queryKeys.shop.listInfinite(filters),
        fetchFn: (page) =>
            _ShopApi.getShops({ ...filters, page }).then((r) => r.data),
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
    });

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput.trim());
    };
    const hasActiveFilters = Boolean(search || governorateId || categoryId);
    const clearFilters = () => {
        setSearch("");
        setSearchInput("");
        setGovernorateId(undefined);
        setCategoryId(undefined);
    };

    const { beforeSections, afterSections } = useSectionsByPosition("shops");
    const toggleFavorite = useToggleFavorite();
    const bannerSections = beforeSections.filter((s) => s.display_type_id === 1);
    const otherBeforeSections = beforeSections.filter(
        (s) => s.display_type_id !== 1
    );

    const handleShopClick = (shopId: number) => {
        navigate(paths.client.shopDetails(shopId));
    };

    const handleToggleFavorite = (shopId: number | string) => {
        const id = typeof shopId === "string" ? parseInt(shopId, 10) : shopId;
        if (Number.isNaN(id)) return;

        toggleFavorite.mutate({ type: "shop", id });
    };

    return (
        <div
            className="min-h-screen bg-custom-primary"
            dir={isRTL ? "rtl" : "ltr"}
        >
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

                {shopsError ? (
                    <div className="mt-8 flex items-center justify-center h-64 bg-custom-secondary rounded-2xl">
                        <p className="text-custom-secondary">
                            {t("store.failedToLoad", "Failed to load stores")}
                        </p>
                    </div>
                ) : (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-custom-primary mb-5">
                            {t("store.allStores", "All stores")}
                        </h2>

                        <div className="store-filters-panel mb-7 rounded-2xl p-3.5 sm:p-4">
                            <div className="mb-3 flex items-center justify-between gap-2">
                                <div className="inline-flex items-center gap-2 text-sm font-semibold text-custom-primary">
                                    <HiAdjustments className="h-4 w-4 text-custom-accent" />
                                    {t("store.filters", "Filters")}
                                </div>
                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="store-clear-btn inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                                    >
                                        <HiX className="h-3.5 w-3.5" />
                                        {t("store.clearFilters", "Clear")}
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <form
                                onSubmit={handleSearchSubmit}
                                className="flex-1 min-w-0"
                            >
                                <div className="relative">
                                    <HiSearch
                                        className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-custom-tertiary ${isRTL ? "right-3" : "left-3"}`}
                                    />
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        placeholder={t("store.searchPlaceholder", "Search by store name...")}
                                        className={`store-input w-full py-2.5 rounded-xl ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
                                            }`}
                                    />
                                </div>
                            </form>
                            <select
                                value={governorateId ?? ""}
                                onChange={(e) =>
                                    setGovernorateId(
                                        e.target.value ? Number(e.target.value) : undefined
                                    )
                                }
                                onScroll={handleGovScroll}
                                className="store-input px-4 py-2.5 rounded-xl min-w-[170px]"
                            >
                                <option value="">{t("store.filterByGovernorate", "All governorates")}</option>
                                {governorateOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                                {isFetchingMoreGov && (
                                    <option value="" disabled>{t("common.loading")}</option>
                                )}
                            </select>
                            <select
                                value={categoryId ?? ""}
                                onChange={(e) =>
                                    setCategoryId(
                                        e.target.value ? Number(e.target.value) : undefined
                                    )
                                }
                                onScroll={handleCatScroll}
                                className="store-input px-4 py-2.5 rounded-xl min-w-[170px]"
                            >
                                <option value="">{t("store.filterByCategory", "All categories")}</option>
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
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                            {allShops.map((shop) => {
                                const topBadgesSource = shop.top_badges?.length
                                    ? shop.top_badges
                                    : shop.vendor?.top_badges;
                                const bottomBadgesSource =
                                    shop.bottom_badges?.length
                                        ? shop.bottom_badges
                                        : shop.vendor?.bottom_badges;
                                const mappedTopBadges =
                                    mapApiTopBadgesToProductCard(topBadgesSource);
                                const mappedBottomBadges =
                                    mapApiBottomBadgesToProductCard(
                                        bottomBadgesSource
                                    );

                                return (
                                <ShopCard
                                    key={shop.id}
                                    id={shop.id}
                                    name={shop.name}
                                    description={shop.description}
                                    image={shop.logo_url}
                                    isOpenNow={shop.is_open_now}
                                    rating={shop.average_rating}
                                    badge={mappedTopBadges}
                                    bottomBadges={mappedBottomBadges}
                                    isFavorite={shop.is_favorite ?? false}
                                    onFavorite={handleToggleFavorite}
                                    onClick={() => handleShopClick(shop.id)}
                                />
                                );
                            })}

                            {(isLoading || isFetchingNextPage) &&
                                Array.from({ length: 6 }).map((_, i) => (
                                    <div
                                        key={`skeleton-${i}`}
                                        className="aspect-[4/3] bg-custom-muted animate-pulse rounded-xl"
                                    />
                                ))}
                        </div>

                        {!isLoading && allShops.length === 0 && (
                            <div className="mt-8 flex items-center justify-center h-64 bg-custom-secondary rounded-2xl">
                                <p className="text-custom-secondary">
                                    {t("store.noStoresFound", "No stores found")}
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
