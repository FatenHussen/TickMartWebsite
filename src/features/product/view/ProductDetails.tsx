import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductInfo from "../components/ProductInfo";
import AttributeSelector from "../components/AttributeSelector";
import ProductQuantitySelector from "../components/ProductQuantitySelector";
import ProductActions from "../components/ProductActions";
import ProductDescription from "../components/ProductDescription";
import ExtraDetailsTable from "../components/ExtraDetailsTable";
import ShopSelector from "../components/ShopSelector";
import {
  SoldWithThisProduct,
  SimilarProducts,
  ProductsFromSameSeller,
} from "@/shared/component/slider/presets";
import ProductReviews from "@/shared/component/ProductReviews";
import type { RatingDistribution } from "@/shared/component/ProductReviews";
import FullBleedSection from "@/shared/component/FullBleedSection";
import { useProductDetails } from "../hooks/useProductDetails";
import { useProductRatings } from "../hooks/useProductRatings";
import { useVariantSelector } from "../hooks/useVariantSelector";
import { useSimilarProducts } from "../hooks/useSimilarProducts";
import { useProductsFromSameSeller } from "../hooks/useProductsFromSameSeller";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import type { CartItem } from "@/features/cart/types";
import { paths } from "@/app/routes/path/paths";
import { useFavorites, useToggleFavorite } from "@/features/account/hooks/useFavorites";

function ProductDetails() {
  const { t } = useTranslation();
  const { productId } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  // Get query params
  const lat = parseFloat(searchParams.get("lat") || "33.51380000");
  const lng = parseFloat(searchParams.get("lng") || "36.27650000");
  const initialShopId = parseInt(searchParams.get("shop_id") || "0", 10);

  // Stateful shop selection
  const [selectedShopId, setSelectedShopId] = useState(initialShopId);

  const productIdNum = parseInt(productId || "0", 10);

  // Fetch product details
  const {
    data: product,
    isLoading,
    error,
  } = useProductDetails({
    productId: productIdNum,
    lat,
    lng,
    shopId: selectedShopId,
  });

  // Auto-sync: if selected shop is not in available_shops, select the first one
  useEffect(() => {
    if (product?.available_shops?.length) {
      const shopExists = product.available_shops.some(
        (s) => s.id === selectedShopId
      );
      if (!shopExists) {
        setSelectedShopId(product.available_shops[0].id);
      }
    }
  }, [product?.available_shops, selectedShopId]);

  // Ratings - reviews list from API, summary from product response
  const { reviews, isLoading: isRatingsLoading } =
    useProductRatings(productIdNum);

  // Rating summary from product details response
  const ratingDistribution = useMemo((): RatingDistribution => {
    const breakdown = product?.rating_breakdown || [0, 0, 0, 0, 0];
    return {
      "1": breakdown[0] ?? 0,
      "2": breakdown[1] ?? 0,
      "3": breakdown[2] ?? 0,
      "4": breakdown[3] ?? 0,
      "5": breakdown[4] ?? 0,
    };
  }, [product?.rating_breakdown]);

  const totalReviewsCount = useMemo(() => {
    return (product?.rating_breakdown || []).reduce(
      (sum, n) => sum + n,
      0
    );
  }, [product?.rating_breakdown]);

  // Similar products (by category)
  const { data: similarProducts = [] } = useSimilarProducts(
    product?.category?.id
  );

  // Products from same seller (by selected shop)
  const { data: sellerProducts = [] } =
    useProductsFromSameSeller(selectedShopId);

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
  const { authenticated } = useAuthStore();
  const { data: favoriteProducts = [] } = useFavorites("product", !!authenticated);
  const toggleFavorite = useToggleFavorite();
  const isFavorite = favoriteProducts.some((f) => f.id === productIdNum);
  const addItem = useCartStore((s) => s.addItem);

  // Navigate to product details
  const handleProductClick = useCallback(
    (id: number) => {
      navigate(paths.client.productDetails(id));
    },
    [navigate]
  );

  // Map bought_with to slider card format
  const boughtWithItems = useMemo(() => {
    if (!product?.bought_with?.length) return [];
    return product.bought_with.map((item) => ({
      id: item.id,
      name: item.name,
      price: `£${(item.price_after_discount ?? item.price).toFixed(2)}`,
      originalPrice:
        item.price_after_discount && item.price_after_discount < item.price
          ? `£${item.price.toFixed(2)}`
          : undefined,
      rating: 0,
      image: item.image,
    }));
  }, [product?.bought_with]);

  // Map similar products to slider card format
  const similarProductItems = useMemo(() => {
    return similarProducts
      .filter((p) => p.id !== product?.id)
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: `£${p.price_after_discount.toFixed(2)}`,
        originalPrice:
          p.price > p.price_after_discount
            ? `£${p.price.toFixed(2)}`
            : undefined,
        rating: p.rating || 0,
        image: p.image,
        category: p.category,
        sold: p.sold_number,
        savings:
          p.amount_saved > 0
            ? `${t("product.youSaved", "You saved")} £${p.amount_saved.toFixed(2)}`
            : undefined,
      }));
  }, [similarProducts, product?.id, t]);

  // Map seller products to slider card format
  const sellerProductItems = useMemo(() => {
    return sellerProducts
      .filter((p) => p.id !== product?.id)
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: `£${p.price_after_discount.toFixed(2)}`,
        originalPrice:
          p.price > p.price_after_discount
            ? `£${p.price.toFixed(2)}`
            : undefined,
        rating: p.rating || 0,
        image: p.image,
        category: p.category,
        sold: p.sold_number,
        savings:
          p.amount_saved > 0
            ? `${t("product.youSaved", "You saved")} £${p.amount_saved.toFixed(2)}`
            : undefined,
      }));
  }, [sellerProducts, product?.id, t]);

  const handleAddToCart = () => {
    if (!product) return;
    const price = currentPriceAfterDiscount ?? currentPrice ?? 0;
    const lineId = `${product.id}-${selectedVariant?.variant_id ?? "base"}`;
    const imagePath = currentImages?.[0] ?? product?.images?.[0]?.path ?? "";
    const isInstant = !!product.is_instant_delivery;
    const cartItem: CartItem = {
      id: lineId,
      name: product.name,
      description: product.description,
      category: product.category?.name,
      category_id: product.category?.id,
      image: imagePath,
      price: `£${price.toFixed(2)}`,
      priceNumeric: price,
      quantity,
      subtotal: `£${(price * quantity).toFixed(2)}`,
      storeId: selectedShopId,
      hasFreeDelivery: isInstant ? true : undefined,
      is_instant_delivery: isInstant,
      productId: product.id,
      variantId: selectedVariant?.variant_id,
      shop_product_variant_id: selectedVariant?.id,
      shopId: selectedVariant?.shop_id ?? selectedShopId,
      selectedAttributes:
        Object.keys(selectedAttributes).length > 0
          ? { ...selectedAttributes }
          : undefined,
    };
    if (
      currentPriceAfterDiscount != null &&
      currentPrice != null &&
      currentPriceAfterDiscount < currentPrice
    ) {
      cartItem.originalPrice = `£${currentPrice.toFixed(2)}`;
      cartItem.savingsText = `${t("product.youSaved", "You saved")} £${(
        currentPrice - currentPriceAfterDiscount
      ).toFixed(2)}`;
    }
    const result = addItem(cartItem);
    if (result === "success") {
      toast.success(t("cart.addedToCart", "Added to cart"));
    } else if (result === "wrong_cart_type") {
      toast.error(
        t(
          "cart.cartContainsDifferentType",
          "Your cart contains recipes or baskets. Clear it to add products.",
        ),
      );
    } else {
      toast.error(
        t(
          "cart.cannotMixInstantDelivery",
          "Cannot mix instant delivery and scheduled delivery items in the same cart.",
        ),
      );
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite.mutate({ type: "product", id: productIdNum });
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
      ? `${t("product.youSaved", "You saved")} ${
          product.price - product.price_after_discount
        }`
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
              rating={product.rating}
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

            {/* Available Shops Selector */}
            {product.available_shops && product.available_shops.length > 0 && (
              <ShopSelector
                shops={product.available_shops}
                selectedShopId={selectedShopId}
                onShopChange={setSelectedShopId}
              />
            )}

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
        {boughtWithItems.length > 0 && (
          <FullBleedSection>
            <SoldWithThisProduct
              title={t("product.soldWithThisProduct", "Sold with this product also")}
              payload={{
                items: boughtWithItems,
                onProductClick: handleProductClick,
                onToggleFavorite: (id: number) => toggleFavorite.mutate({ type: "product", id }),
                favoriteIds: favoriteProducts.map((f) => f.id),
              }}
            />
          </FullBleedSection>
        )}

        {/* Similar Products */}
        {similarProductItems.length > 0 && (
          <FullBleedSection>
            <SimilarProducts
              title={t("product.similarProducts", "Similar Products")}
              payload={{
                items: similarProductItems,
                onProductClick: handleProductClick,
                onToggleFavorite: (id: number) => toggleFavorite.mutate({ type: "product", id }),
                favoriteIds: favoriteProducts.map((f) => f.id),
              }}
            />
          </FullBleedSection>
        )}

        {/* Products from the same seller */}
        {sellerProductItems.length > 0 && (
          <FullBleedSection>
            <ProductsFromSameSeller
              title={t("product.productsFromSameSeller", "Products from the same seller")}
              payload={{
                items: sellerProductItems,
                onProductClick: handleProductClick,
                onToggleFavorite: (id: number) => toggleFavorite.mutate({ type: "product", id }),
                favoriteIds: favoriteProducts.map((f) => f.id),
              }}
            />
          </FullBleedSection>
        )}

        {/* Product Reviews */}
        <div className="page-container">
          {isRatingsLoading ? (
            <div className="mt-10 flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-light" />
            </div>
          ) : (
            <ProductReviews
              averageRating={product.rating ?? 0}
              totalReviews={totalReviewsCount}
              ratingDistribution={ratingDistribution}
              reviews={reviews}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
