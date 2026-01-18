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
};

export default function CheckoutOrderSummary({
  summary,
  onPlaceOrder,
}: CheckoutOrderSummaryProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const totalItems = summary.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="bg-blue-off rounded-xl border border-custom-secondary shadow-sm p-6 sticky top-4" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <h2 className="text-lg font-bold text-custom-primary mb-6">
        {t("checkout.orderSummary")}
      </h2>

      {/* Products Table */}
      <div className="mb-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-custom-secondary">
              <th className={cn(isRTL ? "text-right" : "text-left", "py-3 px-2 text-xs font-semibold text-custom-primary uppercase")}>
                {t("checkout.product")}
              </th>
              <th className={cn(isRTL ? "text-left" : "text-right", "py-3 px-2 text-xs font-semibold text-custom-primary uppercase")}>
                {t("checkout.price")}
              </th>
              <th className="text-center py-3 px-2 text-xs font-semibold text-custom-primary uppercase">
                {t("orders.qty")}
              </th>
              <th className={cn(isRTL ? "text-left" : "text-right", "py-3 px-2 text-xs font-semibold text-custom-primary uppercase")}>
                {t("orders.total")}
              </th>
            </tr>
          </thead>
          <tbody>
            {summary.items.map((item) => (
              <tr key={item.id} className="border-b border-custom-secondary">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-custom-tertiary">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-custom-primary mb-0.5">
                        {item.name}
                      </div>
                      <div className="text-xs text-custom-secondary mb-1">
                        {item.store} {item.size ? `${item.size},` : ""}{" "}
                        {item.type || ""}
                      </div>
                      {item.originalPrice && (
                        <div className="text-xs mb-0.5">
                          <div>
                            <span className="line-through text-custom-secondary">
                              {item.originalPrice}
                            </span>
                          </div>
                          <div className="font-medium text-custom-primary">
                            {item.price}
                          </div>
                        </div>
                      )}
                      {item.savingsText && (
                        <div
                          className="text-xs font-medium"
                          style={{ color: "var(--color-green)" }}
                        >
                          {item.savingsText}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className={cn("py-3 px-2", isRTL ? "text-left" : "text-right")}>
                  <div className="text-sm font-medium text-custom-primary">
                    {item.price}
                  </div>
                </td>
                <td className="py-3 px-2 text-center">
                  <div className="text-sm text-custom-primary">
                    {item.quantity}
                  </div>
                </td>
                <td className={cn("py-3 px-2", isRTL ? "text-left" : "text-right")}>
                  <div className="text-sm font-medium text-custom-primary">
                    {item.subtotal}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary of Charges */}
      <div className="mb-6 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-custom-secondary">
            {t("checkout.itemsTotal")} ({totalItems} {t("checkout.items")})
          </span>
          <span className="font-medium text-custom-primary">
            {summary.itemsTotal}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-custom-secondary">{t("checkout.subtotal")}</span>
          <span className="font-medium text-custom-primary">
            {summary.subtotal}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-custom-secondary">{t("checkout.deliveryFees")}</span>
          <span className="font-medium text-custom-primary">
            {summary.deliveryFees}
          </span>
        </div>
        {summary.storeDiscounts && (
          <div className="flex items-center justify-between">
            <span className="text-custom-secondary">{t("checkout.storeDiscounts")}</span>
            <span
              className="font-medium"
              style={{ color: "var(--color-green)" }}
            >
              {summary.storeDiscounts}
            </span>
          </div>
        )}
        {summary.couponDiscount && (
          <div className="flex items-center justify-between">
            <span className="text-custom-secondary">{t("checkout.couponDiscount")}</span>
            <span
              className="font-medium"
              style={{ color: "var(--color-green)" }}
            >
              {summary.couponDiscount}
            </span>
          </div>
        )}
      </div>

      {/* Final Total */}
      <div className="flex items-center justify-between py-4 border-t border-custom-secondary mb-6">
        <span className="text-lg font-bold text-custom-primary">{t("orders.total")}</span>
        <span className="text-lg font-bold text-custom-primary">
          {summary.total}
        </span>
      </div>

      {/* Estimated Delivery */}
      {summary.estimatedDelivery && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <HiTruck
              className="w-5 h-5"
              style={{ color: "var(--color-green)" }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: "var(--color-green)" }}
            >
              {summary.estimatedDelivery}
            </span>
          </div>
          {summary.deliveryNote && (
            <p className={cn("text-xs text-custom-secondary", isRTL ? "mr-7" : "ml-7")}>
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
          className="bg-custom-accent hover:opacity-90 text-custom-inverse"
        >
          {t("checkout.placeOrder")}
        </Button>
        <Link
          to="/cart"
          className="block text-center text-sm text-custom-secondary hover:text-custom-primary hover:underline"
        >
          {t("checkout.backToCart")}
        </Link>
      </div>
    </div>
  );
}
