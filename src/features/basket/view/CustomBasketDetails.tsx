import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import ProductItemsTable, { type ProductItemData } from "@/shared/component/table/ProductItemsTable";
import Button from "@/shared/ui/Button";
import { HiClock, HiHome, HiChevronRight } from "react-icons/hi2";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { paths } from "@/app/routes/path/paths";
import { useBasketRatings } from "../hooks/useBaskets";
import ProductReviews from "@/shared/component/ProductReviews";
import { RatingFormModal } from "@/features/account/components";
import type { BasketDetailsData } from "../types/basket";

interface CustomBasketDetailsProps {
  basket: BasketDetailsData;
}

export default function CustomBasketDetails({
  basket,
}: CustomBasketDetailsProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const addBasket = useCartStore((s) => s.addBasket);

  const [itemQuantities, setItemQuantities] = useState<Record<number, number>>(
    {}
  );
  const [selectedAlternatives, setSelectedAlternatives] = useState<
    Record<number, number>
  >({});
  const [ratingModalOpen, setRatingModalOpen] = useState(false);

  const token = useAuthStore((s) => s.token);
  const {
    reviews: basketReviews,
    averageRating: reviewsAverage,
    totalReviews: reviewsTotal,
    ratingDistribution: reviewsDistribution,
    isLoading: isRatingsLoading,
  } = useBasketRatings(basket.id, "basket");

  // Convert basket items to ProductItemData format
  const productItems = useMemo<ProductItemData[]>(() => {
    return basket.items.map((item) => {
      const selectedAltId = selectedAlternatives[item.id];
      const selectedAlt = selectedAltId
        ? item.alternatives.find((a) => a.shop_product_variant_id === selectedAltId)
        : null;

      const effectivePrice = selectedAlt?.price ?? item.unit_price;
      const quantity = itemQuantities[item.id] ?? item.quantity;
      const subtotal = effectivePrice * quantity;

      return {
        id: item.id,
        name: item.product.name,
        image: item.product.image,
        quantity: quantity,
        unit_price: effectivePrice,
        subtotal: subtotal,
        min_quantity: item.min_quantity,
        max_quantity: item.max_quantity,
        can_adjust: item.can_adjust,
        is_required: item.is_required,
        companies: item.alternatives.map((alt) => ({
          id: alt.shop_product_variant_id,
          name: alt.name,
          is_default: false,
          has_custom_price: true,
          effective_price: alt.price,
        })),
        selectedCompanyId: selectedAltId,
        variant: item.variant,
      };
    });
  }, [basket.items, itemQuantities, selectedAlternatives]);

  // Calculate totals
  const currentTotal = basket.final_price;
  const totalQuantity = useMemo(() => {
    return productItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [productItems]);

  // Handle quantity change
  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    setItemQuantities((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));
  };

  // Handle alternative change
  const handleCompanyChange = (itemId: number, altId: number) => {
    setSelectedAlternatives((prev) => ({
      ...prev,
      [itemId]: altId,
    }));
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!basket.items?.length) {
      toast.error(t("baskets.emptyBasket", "This basket has no items to add."));
      return;
    }

    const items = basket.items.map((item) => {
      const selectedAltId = selectedAlternatives[item.id];
      const shop_product_variant_id =
        selectedAltId ?? item.shop_product_variant_id;
      const quantity = itemQuantities[item.id] ?? item.quantity;
      const selectedAlt = selectedAltId
        ? item.alternatives.find((a) => a.shop_product_variant_id === selectedAltId)
        : null;
      const priceNumeric = selectedAlt?.price ?? item.unit_price;
      return {
        shop_product_variant_id,
        quantity,
        name: item.product.name,
        image: item.product.image,
        priceNumeric,
        storeId: 0,
      };
    });

    if (items.some((i) => !i.shop_product_variant_id || Number.isNaN(i.shop_product_variant_id))) {
      toast.error(t("baskets.invalidBasketItems", "Some items in this basket are invalid."));
      return;
    }

    addBasket({ admin_basket_id: basket.id, items });
    toast.success(t("cart.addedToCart", "Added to cart"));
    navigate(paths.client.cart);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    } catch {
      return dateString;
    }
  };

  const savingsPercentage = basket.original_price > 0
    ? Math.round(((basket.original_price - basket.final_price) / basket.original_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <HiHome className="w-4 h-4" />
          <span className="hover:text-cyan-600 cursor-pointer">Home</span>
          <HiChevronRight className="w-4 h-4" />
          <span className="hover:text-cyan-600 cursor-pointer">Custom baskets</span>
          <HiChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{basket.name}</span>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Basket details</h1>

        {/* Basket Header */}
        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden shrink-0 bg-white">
              <img
                src={basket.image}
                alt={basket.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  {basket.name}
                </h2>
                {basket.is_on_offer && (
                  <span className="px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-semibold rounded">
                    Special offer today
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-700 mb-4">
                A carefully curated selection of the freshest seasonal vegetables and fruits perfect for spring cooking.
              </p>

              <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">{productItems.length}</span>
                  <span>items •</span>
                  <span className="font-semibold text-gray-900">{basket.num_varieties}</span>
                  <span>Fresh & organic</span>
                </div>
                {basket.is_on_offer && (
                  <div className="flex items-center gap-2">
                    <HiClock className="w-4 h-4 text-gray-400" />
                    <span>Ends on: {formatDate(basket.offer_ends_at ?? "")}</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">
                    ${basket.final_price.toFixed(2)}
                  </span>
                  {basket.original_price > basket.final_price && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ${basket.original_price.toFixed(2)}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        You saved ${(basket.saving || 0).toFixed(2)} ({savingsPercentage}%)
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Total and Add Button */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 mb-6">
          <span className="text-lg font-semibold text-gray-900">
            Current total: ${currentTotal.toFixed(2)}
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={!basket.items?.length}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            Add basket to cart
          </Button>
        </div>

        {/* What's inside this basket */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            What's inside this basket
          </h2>
          <ProductItemsTable
            items={productItems}
            onQuantityChange={handleQuantityChange}
            onCompanyChange={handleCompanyChange}
            showCompanyColumn={false}
            showVariantColumn={true}
            showActionColumn={false}
            currencySymbol="$"
            readonly={true}
          />
        </div>

        {/* Footer Summary */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="px-4 py-2 bg-cyan-100 text-cyan-700 font-semibold rounded">
                Total items: {totalQuantity}
              </div>
              <div className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded">
                Different products: {productItems.length}
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-600 mb-1">Price per basket</div>
              <div className="text-2xl font-bold text-gray-900">
                ${currentTotal.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Rate this basket + Reviews */}
        {token && (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setRatingModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium text-sm"
            >
              {t("baskets.rateBasket", "قيم هذه السلة")}
            </button>
          </div>
        )}
        <div className="mt-6">
          {isRatingsLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500" />
            </div>
          ) : (
            <ProductReviews
              averageRating={
                reviewsTotal > 0
                  ? reviewsAverage
                  : Number(basket.rating) || 0
              }
              totalReviews={reviewsTotal}
              ratingDistribution={reviewsDistribution}
              reviews={basketReviews}
              sectionTitle={t("baskets.basketReviews", "تقييمات السلة")}
            />
          )}
        </div>
      </div>

      <RatingFormModal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        onSuccess={() => setRatingModalOpen(false)}
        mode="create"
        rateableType="basket"
        rateableId={basket.id}
      />
    </div>
  );
}
