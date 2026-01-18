import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductInfo from "../components/ProductInfo";
import ProductColorSelector, {
  type ColorOption,
} from "../components/ProductColorSelector";
import ProductSizeSelector, {
  type SizeOption,
} from "../components/ProductSizeSelector";
import ProductQuantitySelector from "../components/ProductQuantitySelector";
import ProductActions from "../components/ProductActions";
import ProductDescription from "../components/ProductDescription";
import {
  SoldWithThisProduct,
  SimilarProducts,
  ProductsFromSameSeller,
} from "@/shared/component/slider/presets";
import ProductReviews from "@/shared/component/ProductReviews";
import FullBleedSection from "@/shared/component/FullBleedSection";

// Mock data - Replace with actual API call
const mockProductData = {
  id: "1",
  name: "Long Sleeve Overshirt, Khaki, 6",
  category: "Clothes",
  brand: "John Lewis ANYDAY",
  sku: "ADIADI-11228-Vbd68",
  origin: "Syria",
  price: "£28.00",
  originalPrice: "£40.00",
  savings: "You saved $180",
  sold: 1238,
  rating: 4.5,
  images: [
    "https://images.unsplash.com/photo-1594938291221-94f313afa0e8?w=800",
    "https://images.unsplash.com/photo-1594938291221-94f313afa0e8?w=800",
    "https://images.unsplash.com/photo-1594938291221-94f313afa0e8?w=800",
    "https://images.unsplash.com/photo-1594938291221-94f313afa0e8?w=800",
  ],
  colors: [
    { id: "royal-brown", name: "Royal Brown", value: "#8B4513" },
    { id: "white", name: "White", value: "#FFFFFF" },
    { id: "blue", name: "Blue", value: "#3B82F6" },
    { id: "black", name: "Black", value: "#000000" },
  ] as ColorOption[],
  sizes: [
    { id: "6", label: "6", available: true },
    { id: "8", label: "8", available: true },
    { id: "10", label: "10", available: true },
    { id: "14", label: "14", available: true },
    { id: "18", label: "18", available: true },
    { id: "20", label: "20", available: true },
  ] as SizeOption[],
  description:
    "Boba etiam ut bulla tea est potus dilectus singulari compositione saporum et textuum. Hic potus oritur ex Asia Orientali, praecipue ex Taiwan, et nunc per totum orbem terrarum diffunditur. Boba tea constat ex thea basi (saepe thea nigra vel viridis), lacte vel crema, et perlis tapiocae quae sunt sphaerulae glutinosae ex amylo cassavae factae. Hae perlis, quae etiam 'bubbles' vel 'pearls' appellantur, dant potui texturam unam et saporis experientiam singularem.",
  badges: [
    { label: "15% OFF", className: "bg-blue-500" },
    { label: "Most Ordered", className: "bg-yellow-400 text-black" },
  ],
};

function ProductDetails() {
  const { t } = useTranslation();
  const { productId } = useParams<{ productId: string }>();
  const [selectedColor, setSelectedColor] = useState<string>(
    mockProductData.colors[0]?.id || ""
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    mockProductData.sizes[1]?.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    console.log("Add to cart:", {
      productId,
      color: selectedColor,
      size: selectedSize,
      quantity,
    });
    // Implement add to cart logic
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Implement favorite logic
  };

  const handleShare = () => {
    // Implement share logic
    if (navigator.share) {
      navigator.share({
        title: mockProductData.name,
        text: mockProductData.description,
        url: window.location.href,
      });
    }
  };

  const { isRTL } = useLanguage();

  return (
    <div className="bg-custom-primary">
      <div className="page-container py-8 " dir={isRTL ? "rtl" : "ltr"}>
        <div className="grid grid-cols-1 gap-24 lg:grid-cols-2">
          {/* Left Section - Product Images */}
          <div>
            <ProductImageGallery
              images={mockProductData.images}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
              onShare={handleShare}
            />
          </div>

          {/* Right Section - Product Details */}
          <div className="flex flex-col gap-6">
            <ProductInfo
              category={mockProductData.category}
              brand={mockProductData.brand}
              name={mockProductData.name}
              sku={mockProductData.sku}
              origin={mockProductData.origin}
              price={mockProductData.price}
              originalPrice={mockProductData.originalPrice}
              savings={mockProductData.savings}
              sold={mockProductData.sold}
              rating={mockProductData.rating}
              badges={mockProductData.badges}
            />

            <ProductColorSelector
              colors={mockProductData.colors}
              selectedColorId={selectedColor}
              onColorChange={setSelectedColor}
            />

            <ProductSizeSelector
              sizes={mockProductData.sizes}
              selectedSizeId={selectedSize}
              onSizeChange={setSelectedSize}
            />

            <ProductQuantitySelector
              quantity={quantity}
              min={1}
              max={10}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
              addToCartText={t("product.addToCart")}
            />

            <ProductActions />

            <ProductDescription description={mockProductData.description} />
          </div>
        </div>

        {/* Sold with this product also */}
        <FullBleedSection>
          <SoldWithThisProduct />
        </FullBleedSection>

        {/* Similar Products */}
        <FullBleedSection>
          <SimilarProducts />
        </FullBleedSection>

        {/* Products from the same seller */}
        <FullBleedSection>
          <ProductsFromSameSeller />
        </FullBleedSection>

        {/* Product Reviews */}
        <div className="page-container">
          <ProductReviews
            averageRating={mockProductData.rating}
            totalReviews={mockProductData.sold || 0}
            ratingDistribution={{
              "5": 2823,
              "4": 38,
              "3": 4,
              "2": 0,
              "1": 0,
            }}
            reviews={[
              {
                id: "1",
                rating: 5,
                text: "This is amazing product I have.",
                date: "July 2, 2020 03:29 PM",
                reviewerName: "Darrell Steward",
              },
              {
                id: "2",
                rating: 5,
                text: "This is amazing product I have.",
                date: "July 2, 2020 1:04 PM",
                reviewerName: "Darlene Robertson",
              },
              {
                id: "3",
                rating: 5,
                text: "This is amazing product I have.",
                date: "June 26, 2020 10:03 PM",
                reviewerName: "Kathryn Murphy",
              },
              {
                id: "4",
                rating: 5,
                text: "This is amazing product I have.",
                date: "July 7, 2020 10:14 AM",
                reviewerName: "Ronald Richards",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
