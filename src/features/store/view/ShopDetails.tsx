import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useShopDetails } from "../hooks/useShopDetails";
import { useShopProducts } from "../hooks/useShopProducts";
import { useSectionsByPosition } from "@/features/home/hooks/useSections";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import FullBleedSection from "@/shared/component/FullBleedSection";
import StoreDetailsCard from "../components/StoreDetailsCard";
import CategoryStore from "../components/CategoryStore";
import ProductCard from "@/shared/component/card/ProductCard";
import { convertShopDataToStoreMeta } from "../utils/shopDataConverter";
import { mapActionPageSlugToRoute } from "@/utils/routeMapper";

const badgeColorMap: Record<string, string> = {
  success: "bg-green-500 text-white",
  warning: "bg-yellow-500 text-white",
  danger: "bg-red-500 text-white",
  primary: "bg-blue-500 text-white",
};

export default function ShopDetails() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { shopId } = useParams<{ shopId: string }>();
  const shopIdNum = parseInt(shopId || "0", 10);

  const {
    data: shop,
    isLoading: isShopLoading,
    error: shopError,
  } = useShopDetails(shopIdNum);

  const { data: productsData, isLoading: isProductsLoading } =
    useShopProducts(shopIdNum);

  const { beforeSections, afterSections } =
    useSectionsByPosition("shop_details");

  // Separate banner sections (display_type_id: 1) from other sections
  const bannerSections = beforeSections.filter((s) => s.display_type_id === 1);
  const otherBeforeSections = beforeSections.filter(
    (s) => s.display_type_id !== 1
  );

  // Loading state
  if (isShopLoading) {
    return (
      <div
        className="min-h-screen bg-custom-primary flex items-center justify-center"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  // Error state
  if (shopError || !shop) {
    return (
      <div
        className="min-h-screen bg-custom-primary flex items-center justify-center"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="text-center">
          <p className="text-custom-primary text-lg">Shop not found</p>
        </div>
      </div>
    );
  }

  const storeMeta = convertShopDataToStoreMeta(shop);

  return (
    <div className="min-h-screen bg-custom-primary" dir={isRTL ? "rtl" : "ltr"}>
      {/* Banner Sections - Full Width (display_type_id: 1) - BEFORE main content */}
      {bannerSections.length > 0 && (
        <div className="w-full">
          <ApiSectionsRenderer sections={bannerSections} />
        </div>
      )}

      <div className="page-container py-6">
        <StoreDetailsCard store={storeMeta} />

        {/* Shop Description */}
        {shop.description && (
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-custom-primary">
            <h2 className="text-xl font-bold text-custom-primary mb-3">
              About
            </h2>
            <p className="text-custom-secondary text-base leading-relaxed">
              {shop.description}
            </p>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ratings Count */}
          {shop.ratings_count > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-custom-primary">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-custom-primary text-lg">
                  {shop.average_rating.toFixed(1)}
                </span>
                <span className="text-amber-400">★</span>
                <span className="text-custom-secondary">
                  from {shop.ratings_count}{" "}
                  {shop.ratings_count === 1 ? "review" : "reviews"}
                </span>
              </div>
            </div>
          )}

          {/* Area */}
          {shop.area && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-custom-primary">
              <div className="text-sm">
                <span className="text-custom-secondary">Area: </span>
                <span className="font-semibold text-custom-primary">
                  {shop.area}
                </span>
              </div>
            </div>
          )}

          {/* Services */}
          {shop.services && shop.services.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-custom-primary md:col-span-2">
              <h3 className="text-sm font-semibold text-custom-primary mb-2">
                Services
              </h3>
              <div className="flex flex-wrap gap-2">
                {shop.services.map((service: unknown, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-primary-light/20 text-primary-light text-xs font-medium"
                  >
                    {typeof service === "string" ? service : String(service)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <CategoryStore />

        {/* Other Sections before products */}
        {otherBeforeSections.length > 0 && (
          <FullBleedSection>
            <ApiSectionsRenderer sections={otherBeforeSections} />
          </FullBleedSection>
        )}

        {/* Products Grid */}
        {isProductsLoading ? (
          <div className="mt-8 flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-light" />
          </div>
        ) : productsData && productsData.items.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-custom-primary mb-6">
              {t("store.products", "Products")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {productsData.items.map((product) => {
                const hasDiscount =
                  product.price > product.price_after_discount;
                const topBadge = product.budges?.find(
                  (b) => b.postion === "top" || b.position === "top"
                );

                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={`£${product.price_after_discount.toFixed(2)}`}
                    originalPrice={
                      hasDiscount ? `£${product.price.toFixed(2)}` : undefined
                    }
                    rating={product.rating || 0}
                    image={product.image}
                    category={product.category}
                    savings={
                      product.amount_saved > 0
                        ? `${t(
                            "product.youSaved",
                            "You saved"
                          )} £${product.amount_saved.toFixed(2)}`
                        : undefined
                    }
                    badge={
                      topBadge
                        ? {
                            label: topBadge.name,
                            className:
                              badgeColorMap[topBadge.color] ||
                              "bg-blue-500 text-white",
                          }
                        : hasDiscount
                        ? {
                            label: `-${Math.round(
                              ((product.price - product.price_after_discount) /
                                product.price) *
                                100
                            )}%`,
                            className: "bg-red-500 text-white",
                          }
                        : undefined
                    }
                    deliveryInfo={t("home.freeDelivery", "Free Delivery")}
                    onClick={(id) => {
                      const route = mapActionPageSlugToRoute(
                        "product_details",
                        id
                      );
                      navigate(route);
                    }}
                  />
                );
              })}
            </div>
          </div>
        ) : productsData && productsData.items.length === 0 ? (
          <div className="mt-8 flex items-center justify-center h-64 bg-white rounded-2xl">
            <p className="text-gray-500">
              {t("store.noProducts", "No products found in this shop")}
            </p>
          </div>
        ) : null}

        {/* Sections after products */}
        {afterSections.length > 0 && (
          <FullBleedSection>
            <ApiSectionsRenderer sections={afterSections} />
          </FullBleedSection>
        )}
      </div>
    </div>
  );
}
