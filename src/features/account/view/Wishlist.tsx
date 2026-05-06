import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useAuthStore } from "@/store/auth";
import { useAllFavorites, useToggleFavorite } from "../hooks/useFavorites";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { PremiumInlineLoader } from "@/shared/component/loading";
import WishlistFilters from "../components/WishlistFilters";
import type { WishlistTypeFilter } from "../components/WishlistFilters";
import WishlistProductCard from "../components/WishlistProductCard";
import type { FavoriteType } from "../types";

export default function Wishlist() {
 const { t } = useTranslation();
 const { isRTL } = useLanguage();
 const { authenticated } = useAuthStore();
 const queryClient = useQueryClient();
 const toggleFavorite = useToggleFavorite();

 const [selectedType, setSelectedType] = useState<WishlistTypeFilter>("all");
 const [selectedShopId, setSelectedShopId] = useState<number |"all">("all");
 const [selectedCategory, setSelectedCategory] = useState("all");

 const favoriteType = selectedType !=="all"? (selectedType as FavoriteType) : undefined;
 const shopIdParam = selectedShopId !=="all"? selectedShopId : undefined;

 const { data: allItems = [], isLoading } = useAllFavorites(
 { type: favoriteType, shopId: shopIdParam },
 !!authenticated
 );

 const categories = useMemo(() => {
 const set = new Set<string>();
 allItems.forEach((item) => {
 if (item.category) set.add(item.category);
 });
 return Array.from(set);
 }, [allItems]);

 const filteredItems = useMemo(() => {
 return allItems.filter((item) => {
 if (selectedCategory !=="all"&& item.category !== selectedCategory) return false;
 return true;
 });
 }, [allItems, selectedCategory]);

 const handleClearFilters = () => {
 setSelectedType("all");
 setSelectedShopId("all");
 setSelectedCategory("all");
 };

 const handleToggle = (id: number, type?: FavoriteType) => {
 const resolvedType: FavoriteType = type ??"product";
 toggleFavorite.mutate(
 { type: resolvedType, id },
 {
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all() });
 },
 }
 );
 };

 if (!authenticated) {
 return (
 <div dir={isRTL ?"rtl":"ltr"}>
 <WishlistHeader />
 <div className="py-14 text-center text-custom-secondary dark:text-[#A1A1AA]">
 {t("wishlist.loginRequired")}
 </div>
 </div>
 );
 }

 return (
 <div dir={isRTL ?"rtl":"ltr"}>
 <WishlistHeader />

 <div className="mb-6">
 <WishlistFilters
 selectedType={selectedType}
 onTypeChange={setSelectedType}
 selectedShopId={selectedShopId}
 onShopChange={setSelectedShopId}
 categories={categories}
 selectedCategory={selectedCategory}
 onCategoryChange={setSelectedCategory}
 onClearFilters={handleClearFilters}
 />
 </div>

 {isLoading ? (
 <div className="flex justify-center py-16">
 <PremiumInlineLoader size="md" />
 </div>
 ) : filteredItems.length === 0 ? (
 <div className="py-14 text-center text-custom-secondary dark:text-[#A1A1AA]">
 {t("wishlist.noItemsFound")}
 </div>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {filteredItems.map((item) => (
 <WishlistProductCard
 key={`${item.type ??"item"}-${item.id}`}
 item={item}
 type={item.type}
 onToggle={(id) => handleToggle(id, item.type)}
 />
 ))}
 </div>
 )}
 </div>
 );
}

function WishlistHeader() {
 const { t } = useTranslation();
 return (
 <div className="mb-6">
 <h1 className="mb-1 text-2xl font-bold text-custom-primary dark:text-[#FFFFFF]">
 {t("wishlist.title")}
 </h1>
 <p className="text-sm text-custom-secondary dark:text-[#A1A1AA]">
 {t("wishlist.description")}
 </p>
 </div>
 );
}
