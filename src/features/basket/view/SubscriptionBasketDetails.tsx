import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import ProductItemsTable, { type ProductItemData } from "@/shared/component/table/ProductItemsTable";
import BasePopup from "@/shared/component/BasePopup";
import { Button, Select } from "@/shared/ui";
import { HiMapPin, HiCalendar, HiCreditCard, HiClock, HiPlus } from "react-icons/hi2";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { paths } from "@/app/routes/path/paths";
import { useBasketRatings } from "../hooks/useBaskets";
import ProductReviews from "@/shared/component/ProductReviews";
import { RatingFormModal } from "@/features/account/components";
import type { BasketDetailsData, BasketDetailItem } from "../types/basket";

interface SubscriptionBasketDetailsProps {
  basket: BasketDetailsData;
}

export default function SubscriptionBasketDetails({
  basket,
}: SubscriptionBasketDetailsProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const addBasket = useCartStore((s) => s.addBasket);

  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    basket.schedules?.[0]?.id ?? null
  );
  const [repeatOption, setRepeatOption] = useState<"automatic" | "once">(
    "automatic"
  );
  const [itemQuantities, setItemQuantities] = useState<Record<number, number>>(
    {}
  );
  const [selectedAlternatives, setSelectedAlternatives] = useState<
    Record<number, number>
  >({});

  // Extras popup state
  const [showExtrasPopup, setShowExtrasPopup] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);

  // Track which extras have been added to the table
  const [addedExtras, setAddedExtras] = useState<BasketDetailItem[]>([]);

  const token = useAuthStore((s) => s.token);
  const {
    reviews: basketReviews,
    averageRating: reviewsAverage,
    totalReviews: reviewsTotal,
    ratingDistribution: reviewsDistribution,
    isLoading: isRatingsLoading,
  } = useBasketRatings(basket.id, "schedule_basket");

  // Get selected schedule
  const selectedSchedule = useMemo(() => {
    return basket.schedules?.find((s) => s.id === selectedScheduleId) ?? null;
  }, [basket.schedules, selectedScheduleId]);

  // Schedule options for Select (from API)
  const scheduleOptions = useMemo(() => {
    if (!basket.schedules?.length) return [];
    return basket.schedules.map((schedule) => ({
      value: schedule.id,
      label:
        schedule.discount_value > 0
          ? `${schedule.title} (${schedule.discount_value}${schedule.discount_type === "percentage" ? "%" : ""} ${t("baskets.discountExtra")})`
          : schedule.title,
    }));
  }, [basket.schedules, t]);

  // Helper: convert a BasketDetailItem to ProductItemData
  const mapItemToProductData = (item: BasketDetailItem): ProductItemData => {
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
  };

  // Combine basket items + added extras into ProductItemData
  const productItems = useMemo<ProductItemData[]>(() => {
    const allItems = [...basket.items, ...addedExtras];
    return allItems.map(mapItemToProductData);
  }, [basket.items, addedExtras, itemQuantities, selectedAlternatives]);

  // Available extras to show in popup (exclude already added ones)
  const availableExtras = useMemo(() => {
    const addedIds = new Set(addedExtras.map((e) => e.id));
    return (basket.extras ?? []).filter((e) => !addedIds.has(e.id));
  }, [basket.extras, addedExtras]);

  // Calculate totals
  const subtotal = useMemo(() => {
    return productItems.reduce((sum, item) => sum + item.subtotal, 0);
  }, [productItems]);

  const totalQuantity = useMemo(() => {
    return productItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [productItems]);

  const scheduleDiscount = useMemo(() => {
    if (!selectedSchedule || repeatOption === "once") return 0;

    if (selectedSchedule.discount_type === "percentage") {
      return (subtotal * selectedSchedule.discount_value) / 100;
    } else {
      return selectedSchedule.discount_value;
    }
  }, [selectedSchedule, subtotal, repeatOption]);

  const discount = basket.discount_amount || 0;
  const totalDiscount = discount + scheduleDiscount;
  const total = subtotal - totalDiscount;
  const savings = totalDiscount;

  // Handle quantity change
  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    setItemQuantities((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));
  };

  // Handle alternative change (mapped to company change)
  const handleAlternativeChange = (itemId: number, altId: number) => {
    setSelectedAlternatives((prev) => ({
      ...prev,
      [itemId]: altId,
    }));
  };

  // Handle removing an extra from table
  const handleRemoveItem = (itemId: number) => {
    setAddedExtras((prev) => prev.filter((e) => e.id !== itemId));
    // Clean up quantities and alternatives for removed item
    setItemQuantities((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setSelectedAlternatives((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  // Handle adding an extra from popup
  const handleAddExtra = (extra: BasketDetailItem) => {
    setAddedExtras((prev) => [...prev, extra]);
  };

  // Handle confirm order - add basket to cart
  const handleConfirmOrder = () => {
    const allItems = [...basket.items, ...addedExtras];
    const items = allItems.map((item) => {
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

    addBasket({ admin_basket_id: basket.id, items });
    toast.success(t("cart.addedToCart", "Added to cart"));
    navigate(paths.client.cart);
  };

  const handleAddMoreItems = () => {
    setShowExtrasPopup(true);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selected Basket Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <h2 className="text-lg font-bold text-gray-900">
                {t("baskets.selectedBasket")}: {basket.name}
              </h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                {t("baskets.scheduled")}
              </span>
              {selectedSchedule && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                  {selectedSchedule.title}
                </span>
              )}
            </div>
            {basket.schedules && basket.schedules.length > 0 && (
              <div className="w-full md:w-64 shrink-0">
                <Select
                  label={t("baskets.selectSchedule")}
                  options={scheduleOptions}
                  value={selectedScheduleId ?? ""}
                  onChange={(e) =>
                    setSelectedScheduleId(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="!mb-0"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-cyan-600">{productItems.length}</span>
              <span>{t("checkout.items")}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiClock className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{t("baskets.nextDelivery")}:</span>
              <span className="text-gray-900">{basket.next_delivery_date ?? "-"}</span>
            </div>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-gray-600">{t("baskets.subtotal")}:</span>
                <span className="font-bold text-gray-900 ml-2">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div>
                  <span className="text-gray-600">{t("baskets.discount")}:</span>
                  <span className="font-bold text-red-600 ml-2">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div>
                <span className="text-gray-600">{t("baskets.total")}:</span>
                <span className="font-bold text-cyan-600 text-lg ml-2">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          {savings > 0 && (
            <div className="mt-2 p-3 border border-dashed border-green-300 rounded-lg bg-green-50/50">
              <p className="text-sm text-green-700 font-medium">
                {t("baskets.youSave")} ${savings.toFixed(2)}
                {scheduleDiscount > 0 && selectedSchedule && (
                  <>
                    {" "}
                    ({selectedSchedule.discount_type === "percentage"
                      ? `${selectedSchedule.discount_value}%`
                      : ""})
                    {repeatOption === "automatic" && (
                      <> {selectedSchedule.title} {t("baskets.subscriptionDiscountApplied")}</>
                    )}
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="mb-4">
          <ProductItemsTable
            items={productItems}
            onQuantityChange={handleQuantityChange}
            onCompanyChange={handleAlternativeChange}
            onRemoveItem={handleRemoveItem}
            showCompanyColumn={true}
            showVariantColumn={true}
            showActionColumn={true}
            currencySymbol="$"
          />
        </div>

        {/* Summary Section */}
        <div className="bg-cyan-50 border-2 border-cyan-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="font-bold text-gray-900">{t("baskets.orderSummary")}</span>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">{productItems.length} {t("baskets.totalItems")}</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">{t("recipes.quantity")}: {totalQuantity}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className={isRTL ? "text-left" : "text-right"}>
                <div className="text-sm text-gray-600">{t("baskets.subtotal")}: ${subtotal.toFixed(2)}</div>
                <div className="text-lg font-bold text-cyan-600">{t("baskets.total")}: ${total.toFixed(2)}</div>
              </div>
              {availableExtras.length > 0 && (
                <Button
                  onClick={handleAddMoreItems}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  + {t("baskets.addMoreItems")}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Repeat Option */}
        <div className="bg-cyan-50 border-2 border-cyan-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center shrink-0">
              <span className="text-white text-lg">🔄</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {t("baskets.repeatBasketOption")}
            </h3>
          </div>

          <div className="space-y-3 ml-11">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="repeatOption"
                value="automatic"
                checked={repeatOption === "automatic"}
                onChange={(e) =>
                  setRepeatOption(e.target.value as "automatic")
                }
                className="w-5 h-5 text-cyan-500 mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {t("baskets.repeatAutomatically")}
                  </span>
                  <span className="px-2 py-0.5 bg-cyan-500 text-white text-xs font-medium rounded">
                    {t("home.recommended")}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {t("baskets.repeatAutomaticallyDescription")}
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="repeatOption"
                value="once"
                checked={repeatOption === "once"}
                onChange={(e) =>
                  setRepeatOption(e.target.value as "once")
                }
                className="w-5 h-5 text-cyan-500 mt-0.5"
              />
              <div>
                <p className="font-semibold text-gray-900">{t("baskets.oneTimeOnly")}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {t("baskets.oneTimeOnlyDescription")}
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Delivery Summary */}
        <div className="bg-cyan-50 border-2 border-cyan-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t("baskets.deliverySummary")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Delivery Address */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center shrink-0">
                  <HiMapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t("baskets.deliveryAddress")}</h4>
                </div>
              </div>
              <div className="ml-11">
                <p className="text-sm text-gray-600 mb-1">
                  {t("baskets.selectAddressAtCheckout")}
                </p>
                <button className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                  {t("checkout.changeAddress")}
                </button>
              </div>
            </div>

            {/* Next Delivery */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center shrink-0">
                  <HiCalendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t("baskets.nextDelivery")}</h4>
                </div>
              </div>
              <div className="ml-11">
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold text-gray-900">{basket.next_delivery_date ?? "-"}</span>
                </p>
                <button className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                  {t("baskets.reschedule")}
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center shrink-0">
                  <HiCreditCard className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t("baskets.paymentMethod")}</h4>
                </div>
              </div>
              <div className="ml-11">
                <p className="text-sm text-gray-600 mb-1">
                  {t("baskets.selectPaymentAtCheckout")}
                </p>
                <button className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                  {t("common.change")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleConfirmOrder}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-12 py-3 text-lg font-semibold rounded-lg w-full md:w-auto"
            size="lg"
          >
            ✓ {t("baskets.confirmSubscriptionOrder")}
          </Button>
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
        rateableType="schedule_basket"
        rateableId={basket.id}
      />

      {/* Extras Popup */}
      <BasePopup
        isOpen={showExtrasPopup}
        onClose={() => setShowExtrasPopup(false)}
        title={t("baskets.addMoreItems")}
        maxWidth="lg"
        contentClassName="!text-start p-6"
        actions={
          <Button
            onClick={() => setShowExtrasPopup(false)}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            size="lg"
          >
            {t("common.close")}
          </Button>
        }
      >
        <div className="max-h-[50vh] overflow-y-auto">
          {availableExtras.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {t("baskets.noExtrasAvailable")}
            </p>
          ) : (
            <div className="space-y-3">
              {availableExtras.map((extra) => (
                <div
                  key={extra.id}
                  className="flex items-center gap-4 p-3 border border-gray-200 rounded-xl hover:border-cyan-300 hover:bg-cyan-50/50 transition cursor-pointer group"
                  onClick={() => handleAddExtra(extra)}
                >
                  {/* Product Image */}
                  <img
                    src={extra.product.image}
                    alt={extra.product.name}
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                  />

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">
                      {extra.product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {extra.variant && extra.variant.length > 0 && (
                        <span className="text-xs text-gray-500">
                          {extra.variant
                            .filter((v) => !(typeof v === "string" && v.startsWith("#")))
                            .join(", ")}
                        </span>
                      )}
                      {extra.variant?.some(
                        (v) => typeof v === "string" && v.startsWith("#")
                      ) && (
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300 inline-block"
                          style={{
                            backgroundColor: extra.variant.find(
                              (v) => typeof v === "string" && v.startsWith("#")
                            ) as string,
                          }}
                        />
                      )}
                    </div>
                    <p className="text-sm font-bold text-cyan-600 mt-1">
                      ${extra.unit_price.toFixed(2)}
                    </p>
                  </div>

                  {/* Add Button */}
                  <button
                    className="w-9 h-9 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddExtra(extra);
                    }}
                  >
                    <HiPlus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </BasePopup>
    </div>
  );
}
