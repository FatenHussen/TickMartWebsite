import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import HeroBanner from "@/shared/component/hero/HeroBanner";
import BrandHeader from "../components/BrandHeader";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import { mockBrand, mockProducts, mockHeroBanners } from "../data/mockData";
import type { Product } from "../types";

export default function BrandProducts() {
  const { isRTL } = useLanguage();
  const [products] = useState<Product[]>(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [selectedStore, setSelectedStore] = useState("All stores");
  const [freeDeliveryOnly, setFreeDeliveryOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("Best match");

  const handleProductClick = (id: number) => {
    // TODO: Navigate to product details
    console.log("Product clicked:", id);
  };

  const handleToggleFavorite = (id: number) => {
    // TODO: Toggle favorite
    console.log("Toggle favorite:", id);
  };

  const handleShopNow = () => {
    // TODO: Navigate to shop
    console.log("Shop now clicked");
  };

  return (
    <div className="bg-custom-primary">
      <div className="page-container py-6 " dir={isRTL ? "rtl" : "ltr"}>
        {/* Top Hero Banner */}
        <div className="mb-6">
          <HeroBanner
            title={mockHeroBanners[0].title}
            description={mockHeroBanners[0].description}
            buttonText={mockHeroBanners[0].buttonText}
            image={mockHeroBanners[0].image}
            imagePosition="right"
            onButtonClick={handleShopNow}
          />
        </div>

        {/* Brand Header */}
        <div className="mb-6">
          <BrandHeader brand={mockBrand} />
        </div>

        {/* Product Filters */}
        <div className="mb-6">
          <ProductFilters
            location="Downtown, Cairo"
            categories={["All categories"]}
            stores={["All stores"]}
            selectedCategory={selectedCategory}
            selectedStore={selectedStore}
            onCategoryChange={setSelectedCategory}
            onStoreChange={setSelectedStore}
            freeDeliveryOnly={freeDeliveryOnly}
            inStockOnly={inStockOnly}
            onFreeDeliveryToggle={setFreeDeliveryOnly}
            onInStockToggle={setInStockOnly}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Product Grid */}
        <div className="mb-6">
          <ProductGrid
            products={products.slice(0, 10)}
            onProductClick={handleProductClick}
            onToggleFavorite={handleToggleFavorite}
            columns={5}
          />
        </div>

        {/* Mid-Page Hero Banner */}
        <div className="mb-6">
          <HeroBanner
            subtitle={mockHeroBanners[1].subtitle}
            title={mockHeroBanners[1].title}
            description={mockHeroBanners[1].description}
            buttonText={mockHeroBanners[1].buttonText}
            image={mockHeroBanners[1].image}
            imagePosition="right"
            onButtonClick={handleShopNow}
          />
        </div>

        {/* More Product Grid */}
        <div>
          <ProductGrid
            products={products.slice(10)}
            onProductClick={handleProductClick}
            onToggleFavorite={handleToggleFavorite}
            columns={5}
          />
        </div>
      </div>
    </div>
  );
}
