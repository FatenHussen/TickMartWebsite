import { useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import type { OrderSummary, RepeatBasketOption } from "../types";

type CartSummaryProps = {
  summary: OrderSummary;
  onCheckout: () => void;
};

export default function CartSummary({ summary, onCheckout }: CartSummaryProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [couponCode, setCouponCode] = useState("");
  const [repeatBasket, setRepeatBasket] =
    useState<RepeatBasketOption>("one_time");
  const [enableScheduledDelivery, setEnableScheduledDelivery] = useState(true);

  const handleApplyCoupon = () => {
    // TODO: Implement coupon logic
    console.log("Apply coupon:", couponCode);
  };

  return (
    <div className="bg-blue-off rounded-2xl border border-custom-secondary shadow-sm p-6 sticky top-4 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Coupon Code */}
      <div>
        <h3 className="text-base font-semibold text-custom-primary mb-3">
          {t("cart.couponCode")}
        </h3>
        <Input
          type="text"
          placeholder={t("cart.enterCode")}
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="mb-2"
        />
        <Button
          type="button"
          variant="primary"
          onClick={handleApplyCoupon}
          fullWidth
          className="bg-primary hover:opacity-90"
        >
          {t("cart.applyCoupon")}
        </Button>
      </div>

      {/* Repeat this basket */}
      <div>
        <h3 className="text-base font-semibold text-custom-primary mb-2">
          {t("cart.repeatBasket")}
        </h3>
        <p className="text-sm text-custom-secondary mb-4">
          {t("cart.repeatBasketDescription")}
        </p>

        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="radio"
              name="repeatBasket"
              value="schedule"
              checked={repeatBasket === "schedule"}
              onChange={(e) =>
                setRepeatBasket(e.target.value as RepeatBasketOption)
              }
              className="mt-1 w-4 h-4 text-custom-accent border-custom-secondary focus:ring-custom-accent"
            />
            <div className="flex-1">
              <div className="font-medium text-custom-primary group-hover:text-custom-accent transition-colors">
                {t("cart.scheduleDelivery")}
              </div>
              <div className="text-sm text-custom-secondary">
                {t("cart.scheduleDeliveryDescription")}
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="radio"
              name="repeatBasket"
              value="one_time"
              checked={repeatBasket === "one_time"}
              onChange={(e) =>
                setRepeatBasket(e.target.value as RepeatBasketOption)
              }
              className="mt-1 w-4 h-4 text-custom-accent border-custom-secondary focus:ring-custom-accent"
            />
            <div className="flex-1">
              <div className="font-medium text-custom-primary group-hover:text-custom-accent transition-colors">
                {t("cart.oneTimeOrder")}
              </div>
              <div className="text-sm text-custom-secondary">
                {t("cart.oneTimeOrderDescription")}
              </div>
            </div>
          </label>
        </div>

        {enableScheduledDelivery && (
          <div className="mt-4 p-3 bg-custom-accent-light rounded-lg flex items-start gap-2">
            <input
              type="checkbox"
              checked={enableScheduledDelivery}
              onChange={(e) => setEnableScheduledDelivery(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-custom-accent border-custom-secondary rounded focus:ring-custom-accent"
            />
            <p className="text-sm text-custom-primary flex-1">
              {t("cart.enableScheduledDelivery")}
            </p>
          </div>
        )}
      </div>

      {/* Cart Total */}
      <div>
        <h3 className="text-base font-semibold text-custom-primary mb-4">
          {t("cart.cartTotal")}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-custom-secondary">{t("cart.numOfItems")}:</span>
            <span className="font-medium text-custom-primary">
              {summary.numOfItems}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-custom-secondary">{t("checkout.subtotal")}:</span>
            <span className="font-medium text-custom-primary">
              {summary.subtotal}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-custom-secondary">{t("cart.shipping")}:</span>
            <span
              className={`font-medium ${
                summary.shippingIsFree ? "" : "text-custom-primary"
              }`}
              style={
                summary.shippingIsFree
                  ? { color: "var(--color-green)" }
                  : undefined
              }
            >
              {summary.shipping}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-custom-secondary">{t("checkout.storeDiscounts")}:</span>
            <span
              className="font-medium"
              style={{ color: "var(--color-green)" }}
            >
              {summary.storeDiscounts}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-custom-secondary">{t("cart.tax")}:</span>
            <span className="font-medium text-custom-primary">
              {summary.tax}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-custom-secondary">{t("checkout.couponDiscount")}:</span>
            <span className="font-medium text-custom-primary">
              {summary.couponDiscount}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-custom-secondary">
          <span className="text-lg font-bold text-custom-primary">{t("orders.total")}:</span>
          <span className="text-2xl font-bold text-custom-accent">
            {summary.total}
          </span>
        </div>
      </div>

      {/* Proceed to checkout */}
      <div>
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          onClick={onCheckout}
          className="bg-primary hover:opacity-90 mb-2"
        >
          {t("cart.proceedToCheckout")}
        </Button>
        <p className="text-xs text-custom-secondary text-center">
          {t("cart.checkoutNote")}
        </p>
      </div>

      {/* Info box */}
      <div className="flex items-start gap-2 p-3 bg-custom-accent-light rounded-lg">
        <HiInformationCircle className="w-5 h-5 text-custom-accent shrink-0 mt-0.5" />
        <p className="text-sm text-custom-primary">
          {t("cart.buyingFromStores", { count: 3 })}
        </p>
      </div>
    </div>
  );
}
