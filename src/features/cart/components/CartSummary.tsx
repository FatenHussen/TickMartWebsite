import { useState } from "react";
import { HiArrowRight, HiGift, HiTruck } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import type { OrderSummary } from "../types";

type CartSummaryProps = {
  summary: OrderSummary;
  onCheckout: () => void;
};

export default function CartSummary({ summary, onCheckout }: CartSummaryProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = () => {
    // TODO: Implement coupon logic
    console.log("Apply coupon:", couponCode);
  };

  // Calculate free delivery progress (example: $0.75 away from free delivery)
  const freeDeliveryThreshold = 23.50;
  const currentTotal = parseFloat(summary.total.replace("$", ""));
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - currentTotal);
  const progressPercentage = Math.min(100, ((freeDeliveryThreshold - remainingForFreeDelivery) / freeDeliveryThreshold) * 100);

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
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="primary"
            onClick={handleApplyCoupon}
            className="bg-primary-light hover:opacity-90 text-white whitespace-nowrap"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-custom-secondary">{t("cart.numOfItems")}:</span>
          <span className="font-medium text-custom-primary">
            {summary.numOfItems}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-custom-secondary">Items subtotal:</span>
          <span className="font-medium text-custom-primary">
            $19.81
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-custom-secondary">Discounts:</span>
          <span className="font-medium" style={{ color: "var(--color-green)" }}>
            -$1.67
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-custom-secondary">Delivery fee:</span>
          <span className="font-medium text-custom-primary">
            $2.99
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-custom-secondary">{t("cart.tax")}:</span>
          <span className="font-medium text-custom-primary">
            $1.62
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-custom-secondary">{t("checkout.couponDiscount")}:</span>
          <span className="font-medium" style={{ color: "var(--color-green)" }}>
            -$1.62
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between pt-4 border-t border-custom-secondary">
        <span className="text-lg font-bold text-custom-primary">{t("orders.total")}:</span>
        <span className="text-lg font-bold text-custom-primary">
          $22.75
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
          You're ${remainingForFreeDelivery.toFixed(2)} away from free delivery.
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
