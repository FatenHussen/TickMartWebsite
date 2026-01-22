import { HiTruck } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import Button from "@/shared/ui/Button";
import type { CheckoutOrderSummary } from "../types";

type CheckoutOrderSummaryProps = {
  summary: CheckoutOrderSummary;
  onPlaceOrder?: () => void;
  buttonText?: string;
};

export default function CheckoutOrderSummary({
  summary,
  onPlaceOrder,
  buttonText,
}: CheckoutOrderSummaryProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const totalItems = summary.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <div
      className="rounded-2xl border border-custom-secondary shadow-sm  sticky top-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header - Yellow pill shape with background image */}
      <div className="flex justify-center pt-4 pb-2 bg-white relative">
        <div
          className="px-2 py-2 rounded-full bg-cover bg-center bg-no-repeat absolute left-1/2 -top-1/2 -translate-x-1/2"
          style={{ backgroundImage: "url('/images/backOrder.png')" }}
        >
          <h2 className="text-custom-primary text-sm font-bold">
            {t("checkout.orderSummary")}
          </h2>
        </div>
      </div>

      {/* White content area */}
      <div className="bg-white px-4 pb-4">
        {/* Products Table */}
        <div className="mb-4">
          <table className="w-full mt-4 ">
            <thead>
              <tr className="bg-secondary rounded-2xl">
                <th
                  className={cn(
                    isRTL ? "text-right" : "text-left",
                    "py-2 px-1 text-xs font-bold text-primary-light uppercase",
                  )}
                >
                  {t("checkout.product")}
                </th>
                <th className="py-2 px-1 text-xs font-bold text-primary-light uppercase text-center">
                  {t("checkout.price")}
                </th>
                <th className="py-2 px-1 text-xs font-bold text-primary-light uppercase text-center">
                  {t("orders.qty")}
                </th>
                <th
                  className={cn(
                    isRTL ? "text-left" : "text-right",
                    "py-2 px-1 text-xs font-bold text-primary-light uppercase",
                  )}
                >
                  {t("orders.total")}
                </th>
              </tr>
            </thead>
            <tbody>
              {summary.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <td className="py-3">
                    <div className="flex items-start gap-2">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-50">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-custom-primary leading-tight">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-custom-secondary leading-tight">
                          {item.store}
                        </div>
                        <div className="text-[10px] text-custom-secondary leading-tight">
                          {item.size}
                          {item.size && item.type ? ", " : ""}
                          {item.type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center align-top">
                    <div className="text-xs font-semibold text-custom-primary">
                      {item.price}
                    </div>
                    {item.originalPrice && (
                      <div className="text-[10px] line-through text-custom-secondary">
                        {item.originalPrice}
                      </div>
                    )}
                    {item.savingsText && (
                      <div
                        className="text-[10px] font-medium"
                        style={{ color: "var(--color-green)" }}
                      >
                        {item.savingsText}
                      </div>
                    )}
                  </td>
                  <td className="py-3 text-center align-top">
                    <div className="text-xs text-custom-primary">
                      {item.quantity}
                    </div>
                  </td>
                  <td
                    className={cn(
                      "py-3 align-top",
                      isRTL ? "text-left" : "text-right",
                    )}
                  >
                    <div className="text-xs font-semibold text-custom-primary">
                      {item.subtotal}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dotted separator */}
        <div className="border-t border-dashed border-gray-300 my-4"></div>

        {/* Summary of Charges */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-custom-secondary text-xs">
              Items total ({totalItems} items)
            </span>
            <span className="font-medium text-custom-primary text-xs">
              {summary.itemsTotal}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-custom-secondary text-xs">
              {t("checkout.subtotal")}
            </span>
            <span className="font-medium text-custom-primary text-xs">
              {summary.subtotal}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-custom-secondary text-xs">Delivery fees</span>
            <span className="font-medium text-custom-primary text-xs">
              {summary.deliveryFees}
            </span>
          </div>
          {summary.storeDiscounts && (
            <div className="flex items-center justify-between">
              <span className="text-custom-secondary text-xs">Discounts</span>
              <span
                className="font-medium text-xs"
                style={{ color: "var(--color-green)" }}
              >
                {summary.storeDiscounts}
              </span>
            </div>
          )}
          {summary.couponDiscount && (
            <div className="flex items-center justify-between">
              <span className="text-custom-secondary text-xs">
                Coupon discount
              </span>
              <span
                className="font-medium text-xs"
                style={{ color: "var(--color-green)" }}
              >
                {summary.couponDiscount}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom section with gradient background */}
      <div className="bg-gradient-to-b from-secondary/10 to-secondary/30 px-4 py-4">
        {/* QuickPoints Section */}
        <div className="bg-white rounded-xl p-3 mb-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-light rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-custom-primary">
                Use your QuickPoints
              </p>
              <p className="text-xs text-custom-secondary">
                Available: 1,450 pts = $14.50
              </p>
            </div>
          </div>
          {/* Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-light"></div>
          </label>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-base font-bold text-custom-primary">
            {t("orders.total")}
          </span>
          <span className="text-xl font-bold text-custom-primary">
            {summary.total}
          </span>
        </div>

        {/* Estimated Delivery */}
        {summary.estimatedDelivery && (
          <div className="mb-4 bg-white/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <HiTruck
                className="w-4 h-4"
                style={{ color: "var(--color-green)" }}
              />
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--color-green)" }}
              >
                {summary.estimatedDelivery}
              </span>
            </div>
            {summary.deliveryNote && (
              <p
                className={cn(
                  "text-[10px] text-custom-secondary",
                  isRTL ? "mr-6" : "ml-6",
                )}
              >
                {summary.deliveryNote}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={onPlaceOrder}
            className="bg-primary-light hover:bg-primary-light/90 text-white rounded-xl"
          >
            {buttonText || t("checkout.placeOrder")}
          </Button>
          <Link
            to="/cart"
            className="block text-center text-xs text-custom-secondary hover:text-custom-primary hover:underline py-2"
          >
            {t("checkout.backToCart")}
          </Link>
        </div>
      </div>
    </div>
  );
}
