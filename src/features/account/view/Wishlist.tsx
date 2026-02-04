import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import WishlistCard from "../components/WishlistCard";
import WishlistFilters from "../components/WishlistFilters";
import { mockWishlistItems } from "../data/mockData";

export default function Wishlist() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get unique stores and categories
  const stores = useMemo(() => {
    const uniqueStores = [...new Set(mockWishlistItems.map((item) => item.store))];
    return uniqueStores;
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(mockWishlistItems.map((item) => item.category))];
    return uniqueCategories;
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    return mockWishlistItems.filter((item) => {
      const matchesStore = selectedStore === "all" || item.store === selectedStore;
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      return matchesStore && matchesCategory;
    });
  }, [selectedStore, selectedCategory]);

  const handleRemoveFromWishlist = (itemId: string | number) => {
    console.log("Remove from wishlist:", itemId);
    // TODO: Call API to remove from wishlist
  };

  const handleClearFilters = () => {
    setSelectedStore("all");
    setSelectedCategory("all");
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {t("wishlist.title")}
        </h1>
        <p className="text-sm text-gray-600">
          {t("wishlist.description")}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <WishlistFilters
          stores={stores}
          categories={categories}
          selectedStore={selectedStore}
          selectedCategory={selectedCategory}
          onStoreChange={setSelectedStore}
          onCategoryChange={setSelectedCategory}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Products Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              onRemove={handleRemoveFromWishlist}
            />
          ))}
        </div>
      ) : (
        <div className="py-14 text-center text-gray-500">
          {t("wishlist.noItemsFound")}
        </div>
      )}
    </div>
  );
}
