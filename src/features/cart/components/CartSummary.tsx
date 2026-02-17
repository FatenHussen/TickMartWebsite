import { useState, useEffect } from "react";
import { HiArrowRight, HiGift, HiTruck } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import type { OrderSummary } from "../types";

type CartSummaryStatus = "loading" | "no-address" | "ready";

type CartSummaryProps = {
  summary: OrderSummary;
  onCheckout: () => void;
  coupon?: string;
  onCouponChange?: (code: string) => void;
  isLoading?: boolean;
  status?: CartSummaryStatus;
  onAddAddress?: () => void;
};

export default function CartSummary({
  summary,
  onCheckout,
  coupon = "",
  onCouponChange,
  isLoading = false,
  status = "ready",
  onAddAddress,
}: CartSummaryProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [localCoupon, setLocalCoupon] = useState(coupon);
  useEffect(() => {
    setLocalCoupon(coupon);
  }, [coupon]);

  const handleApplyCoupon = () => {
    const code = localCoupon.trim().toUpperCase();
    if (onCouponChange && code) {
      onCouponChange(code);
    }
  };

  const totalNum = parseFloat(summary.total.replace(/[^0-9.]/g, "")) || 0;
  const freeDeliveryThreshold = 50;
  const remainingForFreeDelivery = Math.max(
    0,
    freeDeliveryThreshold - totalNum
  );
  const progressPercentage = Math.min(
    100,
    ((freeDeliveryThreshold - remainingForFreeDelivery) / freeDeliveryThreshold) * 100
  );

  if (status === "loading") {
    return (
      <div className="bg-cart-summary rounded-xl border border-custom-secondary shadow-sm p-6 sticky top-4 space-y-6 animate-pulse" dir={isRTL ? "rtl" : "ltr"}>
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-4 border-t border-custom-secondary">
          <div className="h-6 bg-gray-200 rounded w-20" />
          <div className="h-6 bg-gray-200 rounded w-24" />
        </div>
        <div className="h-12 bg-gray-200 rounded" />
        <p className="text-sm text-custom-secondary text-center">
          {t("cart.loadingPreview", "Loading order summary...")}
        </p>
      </div>
    );
  }

  if (status === "no-address") {
    return (
      <div className="bg-cart-summary rounded-xl border border-custom-secondary shadow-sm p-6 sticky top-4" dir={isRTL ? "rtl" : "ltr"}>
        <h2 className="text-lg font-bold text-custom-primary mb-4">
          {t("checkout.orderSummary")}
        </h2>
        <p className="text-custom-secondary mb-4">
          {t("cart.addAddressForPreview", "Add a delivery address to see pricing and delivery details.")}
        </p>
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          onClick={onAddAddress}
          className="bg-primary-light hover:opacity-90 text-white"
        >
          {t("cart.addAddress", "Add Address")}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-cart-summary rounded-xl border border-custom-secondary shadow-sm p-6 sticky top-4 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Order Summary Header */}
      <h2 className="text-lg font-bold text-custom-primary">
        {t("checkout.orderSummary")}
      </h2>

      {/* Coupon Code */}
      <div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={t("cart.enterCode")}
            value={localCoupon}
            onChange={(e) => setLocalCoupon(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="primary"
            onClick={handleApplyCoupon}
            disabled={isLoading}
            className="bg-primary-light hover:opacity-90 text-white whitespace-nowrap"
          >
            {isLoading ? "..." : "Apply"}
          </Button>
        </div>
      </div>

      {/* Coupon feedback when invalid */}
      {summary.couponFeedback &&
        summary.couponFeedback.fail_reasons?.length > 0 &&
        !summary.couponFeedback.applied && (
          <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
            {summary.couponFeedback.fail_reasons
              .filter((r) => r !== "No coupon provided")
              .map((r, i) => (
                <p key={i}>{r}</p>
              ))}
          </div>
        )}

      {/* Price Breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-custom-secondary">{t("cart.numOfItems")}:</span>
          <span className="font-medium text-custom-primary">
            {summary.numOfItems}
          </span>
        </div>
        {summary.subtotalBeforeDiscount != null && (
          <div className="flex items-center justify-between">
            <span className="text-custom-secondary">
              {t("cart.subtotalBeforeDiscount", "Subtotal before discount")}:
            </span>
            <span className="font-medium text-custom-secondary line-through">
              {summary.subtotalBeforeDiscount}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-custom-secondary">
            {t("cart.itemsSubtotal", "Items subtotal")}:
          </span>
          <span className="font-medium text-custom-primary">
            {summary.subtotal}
          </span>
        </div>
        {summary.productDiscount != null && (
          <div className="flex items-center justify-between">
            <span className="text-custom-secondary">
              {t("cart.productDiscount", "Product discount")}:
            </span>
            <span className="font-medium" style={{ color: "var(--color-green)" }}>
              {summary.productDiscount}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-custom-secondary">
            {t("cart.basketDiscount", "Basket discount")}:
          </span>
          <span className="font-medium" style={{ color: "var(--color-green)" }}>
            {summary.storeDiscounts}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-custom-secondary">Delivery fee:</span>
          <span className="font-medium text-custom-primary">
            {summary.shipping}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-custom-secondary">{t("cart.tax")}:</span>
          <span className="font-medium text-custom-primary">{summary.tax}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-custom-secondary">
            {t("checkout.couponDiscount")}:
          </span>
          <span className="font-medium" style={{ color: "var(--color-green)" }}>
            {summary.couponDiscount}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between pt-4 border-t border-custom-secondary">
        <span className="text-lg font-bold text-custom-primary">
          {t("orders.total")}:
        </span>
        <span className="text-lg font-bold text-custom-primary">
          {summary.total}
        </span>
      </div>

      {/* Free Delivery Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-custom-primary">
            Free delivery progress
          </span>
        </div>
        <div className="relative h-2 bg-white rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-primary-light rounded-full transition-all relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <HiTruck className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
          </div>
        </div>
        <p className="text-xs text-custom-secondary">
          You're £{remainingForFreeDelivery.toFixed(2)} away from free delivery.
        </p>
      </div>

      {/* Points Earned */}
      <div className="bg-purple-100 rounded-lg p-4 flex items-center gap-3">
        <HiGift className="w-6 h-6 text-purple-600 shrink-0" />
        <p className="text-sm font-medium text-purple-900">
          You'll earn 145 points from this order.
        </p>
      </div>

      {/* Proceed to checkout */}
      <Button
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        onClick={onCheckout}
        className="bg-gradient-to-r from-primary-light to-primary hover:opacity-90 text-white flex items-center justify-center gap-2"
      >
        {t("cart.proceedToCheckout")}
        <HiArrowRight className="w-5 h-5" />
      </Button>

      {/* Estimated Delivery */}
      <div className="flex items-center gap-2 text-sm">
        <div className="w-2 h-2 bg-secondary rounded-full"></div>
        <span className="text-custom-secondary">
          Estimated delivery: <span className="font-medium text-custom-primary">Today, 2-4 PM</span>
        </span>
      </div>
    </div>
  );
}
