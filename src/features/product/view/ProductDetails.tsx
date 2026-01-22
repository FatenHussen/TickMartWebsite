import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductInfo from "../components/ProductInfo";
import AttributeSelector from "../components/AttributeSelector";
import ProductQuantitySelector from "../components/ProductQuantitySelector";
import ProductActions from "../components/ProductActions";
import ProductDescription from "../components/ProductDescription";
import ExtraDetailsTable from "../components/ExtraDetailsTable";
import {
  SoldWithThisProduct,
  SimilarProducts,
  ProductsFromSameSeller,
} from "@/shared/component/slider/presets";
import ProductReviews from "@/shared/component/ProductReviews";
import FullBleedSection from "@/shared/component/FullBleedSection";
import { useProductDetails } from "../hooks/useProductDetails";
import { useVariantSelector } from "../hooks/useVariantSelector";

function ProductDetails() {
  const { t } = useTranslation();
  const { productId } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const { isRTL } = useLanguage();

  // Get query params
  const lat = parseFloat(searchParams.get("lat") || "33.51380000");
  const lng = parseFloat(searchParams.get("lng") || "36.27650000");
  const shopId = parseInt(searchParams.get("shop_id") || "2", 10);

  // Fetch product details
  const {
    data: product,
    isLoading,
    error,
  } = useProductDetails({
    productId: parseInt(productId || "0", 10),
    lat,
    lng,
    shopId,
  });

  // Variant selector hook
  const {
    selectedAttributes,
    setAttributeValue,
    currentPrice,
    currentPriceAfterDiscount,
    currentImages,
    currentQuantity,
    selectedVariant,
    availableAttributes,
  } = useVariantSelector({
    attributesMap: product?.attributes_map || [],
    shopVariants: product?.shop_variants || [],
    defaultImages: product?.images || [],
    basePrice: product?.price || 0,
    basePriceAfterDiscount: product?.price_after_discount || 0,
  });

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    console.log("Add to cart:", {
      productId,
      variantId: selectedVariant?.variant_id,
      attributes: selectedAttributes,
      quantity,
    });
    // Implement add to cart logic
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Implement favorite logic
  };

  const handleShare = () => {
    if (navigator.share && product) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-custom-primary min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="bg-custom-primary min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-custom-primary text-lg">
            {t("product.notFound", "Product not found")}
          </p>
        </div>
      </div>
    );
  }

  // Calculate savings
  const savings =
    product.price > product.price_after_discount
      ? `${t("product.youSaved", "You saved")} ${product.price - product.price_after_discount}`
      : undefined;

  // Format price
  const formatPrice = (price: number) => `£${price.toFixed(2)}`;

  return (
    <div className="bg-custom-primary">
      <div className="page-container py-8" dir={isRTL ? "rtl" : "ltr"}>
        <div className="grid grid-cols-1 gap-24 lg:grid-cols-2">
          {/* Left Section - Product Images */}
          <div>
            <ProductImageGallery
              images={currentImages}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
              onShare={handleShare}
            />
          </div>

          {/* Right Section - Product Details */}
          <div className="flex flex-col gap-6">
            <ProductInfo
              category={product.category?.name}
              name={product.name}
              sku={product.sku}
              origin={product.country}
              price={formatPrice(currentPriceAfterDiscount || currentPrice)}
              originalPrice={
                currentPriceAfterDiscount < currentPrice
                  ? formatPrice(currentPrice)
                  : undefined
              }
              savings={savings}
              badges={
                product.is_instant_delivery
                  ? [
                      {
                        label: t("product.freeDelivery", "Instant Delivery"),
                        className: "bg-green-500",
                      },
                    ]
                  : []
              }
            />

            {/* Dynamic Attribute Selectors */}
            {availableAttributes.map((attribute) => (
              <AttributeSelector
                key={attribute.attribute}
                attribute={attribute}
                selectedValue={selectedAttributes[attribute.attribute]}
                onValueChange={(value) =>
                  setAttributeValue(attribute.attribute, value)
                }
              />
            ))}

            {/* Quantity and Add to Cart */}
            <ProductQuantitySelector
              quantity={quantity}
              min={1}
              max={currentQuantity || 10}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
              addToCartText={t("product.addToCart", "Add To Cart")}
            />

            <ProductActions />

            {/* Extra Details Table */}
            {product.extra_details && product.extra_details.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-custom-primary mb-3">
                  {t("product.details", "Details")}
                </h3>
                <ExtraDetailsTable details={product.extra_details} />
              </div>
            )}

            <ProductDescription
              description={product.full_description || product.description}
            />
          </div>
        </div>

        {/* Bought with this product */}
        {product.bought_with && product.bought_with.length > 0 && (
          <FullBleedSection>
            <SoldWithThisProduct />
          </FullBleedSection>
        )}

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
            averageRating={4.5}
            totalReviews={0}
            ratingDistribution={{
              "5": 0,
              "4": 0,
              "3": 0,
              "2": 0,
              "1": 0,
            }}
            reviews={[]}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
