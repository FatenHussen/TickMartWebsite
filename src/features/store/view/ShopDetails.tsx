import { useEffect, useMemo, useState } from"react";
import { useParams, useNavigate } from"react-router-dom";
import { useTranslation } from"react-i18next";
import { useLanguage } from"@/context/LanguageContext";
import { useShopDetails } from"../hooks/useShopDetails";
import { _ShopApi } from"../api/shopApi";
import { useSectionsByPosition } from"@/features/home/hooks/useSections";
import { useCategories } from"@/features/home/hooks/useCategories";
import { useToggleFavorite } from"@/features/account/hooks/useFavorites";
import { useInfiniteList } from"@/shared/hooks/useInfiniteList";
import ApiSectionsRenderer from"@/shared/component/sections/ApiSectionsRenderer";
import FullBleedSection from"@/shared/component/FullBleedSection";
import StoreDetailsCard from"../components/StoreDetailsCard";
import CategoryStore from"../components/CategoryStore";
import ProductCard from"@/shared/component/card/ProductCard";
import { convertShopDataToStoreMeta } from"../utils/shopDataConverter";
import { mapActionPageSlugToRoute } from"@/utils/routeMapper";
import type { ApiProduct } from"@/features/categories/types";
import { mapApiTopBadgesToProductCard } from "@/shared/lib/mapProductBadges";

export default function ShopDetails() {
 const { t } = useTranslation();
 const { isRTL } = useLanguage();
 const navigate = useNavigate();
 const { shopId } = useParams<{ shopId: string }>();
 const shopIdNum = parseInt(shopId ||"0", 10);

 const {
 data: shop,
 isLoading: isShopLoading,
 error: shopError,
 } = useShopDetails(shopIdNum);
 const toggleFavorite = useToggleFavorite();
 const [isFavorite, setIsFavorite] = useState(false);
const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

 const { data: categoriesData = [] } = useCategories();
 const {
 items: products,
 observerTarget,
 isLoading: isProductsLoading,
 isFetchingNextPage,
 } = useInfiniteList<ApiProduct>({
 queryKey: [
 "shop",
 "products",
 "infinite",
 shopIdNum,
 selectedCategoryId || undefined,
 ],
 fetchFn: (page) =>
 _ShopApi.getShopProducts({
 shopId: shopIdNum,
 page,
 categoryId: selectedCategoryId || undefined,
 }),
 enabled: shopIdNum > 0,
 threshold: 500,
 });

 const { beforeSections, afterSections } =
 useSectionsByPosition("shop_details");

 // Separate banner sections (display_type_id: 1) from other sections
 const bannerSections = beforeSections.filter((s) => s.display_type_id === 1);
 const otherBeforeSections = beforeSections.filter(
 (s) => s.display_type_id !== 1
 );

 useEffect(() => {
 setIsFavorite(shop?.is_favorite ?? false);
 }, [shop?.is_favorite]);

const categoryItems = useMemo(() => {
return [
{
id: 0,
name: t("store.filterByCategory","All categories"),
selected: selectedCategoryId === 0,
},
...categoriesData.map((category) => ({
id: category.id,
name: category.name,
selected: selectedCategoryId === category.id,
})),
];
}, [categoriesData, selectedCategoryId, t]);

 // Loading state
 if (isShopLoading) {
 return (
 <div
 className="min-h-screen bg-custom-primary flex items-center justify-center"
 dir={isRTL ?"rtl":"ltr"}
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
 dir={isRTL ?"rtl":"ltr"}
 >
 <div className="text-center">
 <p className="text-custom-primary text-lg">Shop not found</p>
 </div>
 </div>
 );
 }

 const storeMeta = convertShopDataToStoreMeta(shop);
 const resolvedStoreMeta = { ...storeMeta, isFavorite };

 const handleToggleFavorite = () => {
 if (!shopIdNum) return;

 setIsFavorite((prev) => !prev);
 toggleFavorite.mutate(
 { type:"shop", id: shopIdNum },
 {
 onError: () => {
 setIsFavorite((prev) => !prev);
 },
 }
 );
 };

 return (
 <div className="min-h-screen bg-custom-primary"dir={isRTL ?"rtl":"ltr"}>
 {/* Banner Sections - Full Width (display_type_id: 1) - BEFORE main content */}
 {bannerSections.length > 0 && (
 <div className="w-full">
 <ApiSectionsRenderer sections={bannerSections} />
 </div>
 )}

 <div className="page-container py-6">
 <StoreDetailsCard
 store={resolvedStoreMeta}
 onFavoriteClick={handleToggleFavorite}
 />

<CategoryStore
categories={categoryItems}
onSelectCategory={setSelectedCategoryId}
/>

 {/* Other Sections before products */}
 {otherBeforeSections.length > 0 && (
 <FullBleedSection>
 <ApiSectionsRenderer sections={otherBeforeSections} />
 </FullBleedSection>
 )}

 {/* Products Grid */}
{isProductsLoading ? (
 <div className="mt-8 flex justify-center py-12">
 <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-light"/>
 </div>
) : products.length > 0 ? (
 <div className="mt-8">
 <h2 className="text-2xl font-bold text-custom-primary mb-6">
 {t("store.products","Products")}
 </h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
{products.map((product) => {
 const hasDiscount =
 product.price > product.price_after_discount;
 const topBadge = mapApiTopBadgesToProductCard(product.top_badges, { max: 1 })?.[0];

 return (
 <ProductCard
 key={product.id}
 id={product.id}
 name={product.name}
 price={`£${product.price_after_discount.toFixed(2)}`}
 originalPrice={
 hasDiscount ? `£${product.price.toFixed(2)}` : undefined
 }
 rating={(product as { rating?: number }).rating || 0}
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
 ? topBadge
 : hasDiscount
 ? {
 label: `-${Math.round(
 ((product.price - product.price_after_discount) /
 product.price) *
 100
 )}%`,
 className:"bg-red-500 text-white",
 }
 : undefined
 }
 deliveryInfo={t("home.freeDelivery","Free Delivery")}
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
{isFetchingNextPage && (
<div className="mt-6 flex justify-center py-4">
<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-light"/>
</div>
)}
<div ref={observerTarget} className="h-10"/>
</div>
) : (
<div className="mt-8 flex items-center justify-center h-64 bg-custom-card rounded-2xl">
<p className="text-custom-secondary">
{t("store.noProducts","No products found in this shop")}
</p>
</div>
 )}

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
