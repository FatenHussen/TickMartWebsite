import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useShops } from "../hooks/useShops";
import { useSectionsByPosition } from "@/features/home/hooks/useSections";
import { useAddresses } from "@/features/account/hooks/useAddress";
import { useFavorites, useToggleFavorite } from "@/features/account/hooks/useFavorites";
import { useCheckoutStore } from "@/store/checkout";
import { useAuthStore } from "@/store/auth";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import FullBleedSection from "@/shared/component/FullBleedSection";
import ShopCard from "@/shared/component/card/ShopCard";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { paths } from "@/app/routes/path/paths";
import type { ShopListItem } from "../types/shop";

const DEFAULT_LAT = 33.5138;
const DEFAULT_LNG = 36.2765;

type ShopFilterType = "top_rated" | "offers" | "nearby" | undefined;

export default function StoreDetails() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [allShops, setAllShops] = useState<ShopListItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [filterType, setFilterType] = useState<ShopFilterType>(undefined);

  const { addressId } = useCheckoutStore();
  const { data: addresses = [] } = useAddresses();
  const selectedAddress = addressId != null
    ? addresses.find((a) => a.id === addressId || a.id === Number(addressId))
    : addresses.find((a) => a.is_default) ?? addresses[0];

  const lat = selectedAddress?.lat ?? DEFAULT_LAT;
  const lng = selectedAddress?.lng ?? DEFAULT_LNG;

  const {
    data: shopsData,
    isLoading: isShopsLoading,
    error: shopsError,
  } = useShops({
    page: currentPage,
    type: filterType,
    lat,
    lng,
  });

  useEffect(() => {
    if (shopsData?.items) {
      setAllShops((prev) => {
        const existingIds = new Set(prev.map((s) => s.id));
        const newShops = shopsData.items.filter(
          (s) => !existingIds.has(s.id)
        );
        return [...prev, ...newShops];
      });
      setHasMore(
        shopsData.pagination.current_page < shopsData.pagination.last_page
      );
    }
  }, [shopsData]);

  useEffect(() => {
    setCurrentPage(1);
    setAllShops([]);
    setHasMore(true);
  }, [filterType]);

  const observerTarget = useInfiniteScroll({
    onLoadMore: () => setCurrentPage((p) => p + 1),
    hasMore,
    isLoading: isShopsLoading,
    threshold: 300,
  });

  const { beforeSections, afterSections } = useSectionsByPosition("shops");
  const { authenticated } = useAuthStore();
  const { data: favoriteShops = [] } = useFavorites("shop", !!authenticated);
  const toggleFavorite = useToggleFavorite();
  const favoriteShopIds = favoriteShops.map((s) => s.id);
  const bannerSections = beforeSections.filter((s) => s.display_type_id === 1);
  const otherBeforeSections = beforeSections.filter(
    (s) => s.display_type_id !== 1
  );

  const handleShopClick = (shopId: number) => {
    navigate(paths.client.shopDetails(shopId));
  };

  const handleToggleFavorite = (shopId: number | string) => {
    const id = typeof shopId === "string" ? parseInt(shopId, 10) : shopId;
    if (!Number.isNaN(id)) {
      toggleFavorite.mutate({ type: "shop", id });
    }
  };

  return (
    <div
      className="min-h-screen bg-custom-primary"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Banner Sections - Full Width */}
      {bannerSections.length > 0 && (
        <div className="w-full">
          <ApiSectionsRenderer sections={bannerSections} />
        </div>
      )}

      <div className="page-container py-6">
        {/* Other Sections before shops */}
        {otherBeforeSections.length > 0 && (
          <FullBleedSection>
            <ApiSectionsRenderer sections={otherBeforeSections} />
          </FullBleedSection>
        )}

        {/* All Shops - Main Section */}
        {shopsError ? (
          <div className="mt-8 flex items-center justify-center h-64 bg-custom-secondary rounded-2xl">
            <p className="text-custom-secondary">
              {t("store.failedToLoad", "Failed to load stores")}
            </p>
          </div>
        ) : (
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-custom-primary">
                {t("store.allStores", "All stores")}
              </h2>
              {/* Type Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFilterType(undefined)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !filterType
                      ? "bg-primary-light text-white"
                      : "bg-blue-off text-custom-primary hover:bg-primary-light/20"
                  }`}
                >
                  {t("store.all", "All")}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("top_rated")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === "top_rated"
                      ? "bg-primary-light text-white"
                      : "bg-blue-off text-custom-primary hover:bg-primary-light/20"
                  }`}
                >
                  {t("store.topRated", "Top rated")}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("offers")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === "offers"
                      ? "bg-primary-light text-white"
                      : "bg-blue-off text-custom-primary hover:bg-primary-light/20"
                  }`}
                >
                  {t("store.offers", "Offers")}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("nearby")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === "nearby"
                      ? "bg-primary-light text-white"
                      : "bg-blue-off text-custom-primary hover:bg-primary-light/20"
                  }`}
                >
                  {t("store.nearby", "Nearby")}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {allShops.map((shop) => (
                <ShopCard
                  key={shop.id}
                  id={shop.id}
                  name={shop.name}
                  description={shop.description}
                  image={shop.logo_url}
                  isOpenNow={shop.is_open_now}
                  rating={shop.average_rating}
                  isFavorite={favoriteShopIds.includes(shop.id)}
                  onFavorite={handleToggleFavorite}
                  onClick={() => handleShopClick(shop.id)}
                />
              ))}

              {isShopsLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="aspect-[4/3] bg-gray-200 animate-pulse rounded-xl"
                  />
                ))}
            </div>

            {!isShopsLoading && allShops.length === 0 && (
              <div className="mt-8 flex items-center justify-center h-64 bg-custom-secondary rounded-2xl">
                <p className="text-custom-secondary">
                  {t("store.noStoresFound", "No stores found")}
                </p>
              </div>
            )}

            <div ref={observerTarget} className="h-10" />
          </div>
        )}

        {/* Sections after shops */}
        {afterSections.length > 0 && (
          <FullBleedSection>
            <ApiSectionsRenderer sections={afterSections} />
          </FullBleedSection>
        )}
      </div>
    </div>
  );
}
