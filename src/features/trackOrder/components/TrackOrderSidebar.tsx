import { HiLocationMarker, HiQuestionMarkCircle, HiCreditCard } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import Button from "@/shared/ui/Button";
import type { TrackOrderData } from "../types";

type TrackOrderSidebarProps = {
  order: TrackOrderData;
  onCallDriver?: () => void;
  onNeedHelp?: () => void;
};

export default function TrackOrderSidebar({
  order,
  onCallDriver,
  onNeedHelp,
}: TrackOrderSidebarProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div className="bg-blue-off rounded-2xl border border-custom-secondary shadow-sm p-6 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Order Summary */}
      <div>
        <h3 className="text-base font-semibold text-custom-primary mb-4">
          {t("trackOrder.orderSummary")}
        </h3>
        <div className="space-y-3">
          <div>
            <div className="text-xs text-custom-secondary mb-1">
              {t("orders.order")} #{order.orderNumber}
            </div>
            <div
              className="text-sm font-semibold"
              style={{ color: "#f97316" }}
            >
              {t(`orders.${order.status}`)}
            </div>
          </div>
          <div>
            <div className="text-xs text-custom-secondary mb-1">
              {t("trackOrder.store")}
            </div>
            <div className="text-sm font-medium text-custom-primary">
              {order.store}
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="text-xs text-custom-secondary mb-2">
              {t("trackOrder.items")}
            </div>
            <div className="space-y-1.5">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-custom-primary">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-medium text-custom-primary">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <div className="text-xs text-custom-secondary mb-1">
              {t("checkout.paymentMethod")}
            </div>
            <div className="text-sm font-medium text-custom-primary">
              {order.paymentMethod === "cash_on_delivery"
                ? t("trackOrder.cashOnDelivery")
                : order.paymentMethod}
            </div>
          </div>

          {/* Summary */}
          <div className="pt-3 border-t border-custom-secondary space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-custom-secondary">
                {t("trackOrder.itemsSubtotal")}
              </span>
              <span className="font-medium text-custom-primary">
                {order.itemsSubtotal}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-custom-secondary">
                {t("checkout.deliveryFees")}
              </span>
              <span
                className="font-medium"
                style={
                  order.deliveryIsFree
                    ? { color: "var(--color-green)" }
                    : undefined
                }
              >
                {order.deliveryFee}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-custom-secondary">
              <span className="text-base font-bold text-custom-primary">
                {t("orders.total")}
              </span>
              <span className="text-lg font-bold text-custom-accent">
                {order.totalAmount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Details */}
      <div>
        <h3 className="text-base font-semibold text-custom-primary mb-4">
          {t("trackOrder.driverDetails")}
        </h3>
        <div className="space-y-3">
          <div>
            <div className="text-xs text-custom-secondary mb-1">
              {t("trackOrder.driverName")}
            </div>
            <div className="text-sm font-medium text-custom-primary">
              {order.driver.name}
            </div>
          </div>
          <div>
            <div className="text-xs text-custom-secondary mb-1">
              {t("trackOrder.vehicleType")}
            </div>
            <div className="text-sm font-medium text-custom-primary">
              {order.driver.vehicleType}
            </div>
          </div>
          <div>
            <div className="text-xs text-custom-secondary mb-1">
              {t("trackOrder.phoneNumber")}
            </div>
            <button
              type="button"
              onClick={onCallDriver}
              className="text-sm font-medium text-custom-accent hover:underline"
            >
              {order.driver.phoneNumber}
            </button>
          </div>
          <div>
            <div className="text-xs text-custom-secondary mb-1">
              {t("trackOrder.vehicle")}
            </div>
            <div className="text-sm font-medium text-custom-primary">
              {order.driver.vehicle}
            </div>
          </div>
          <div>
            <div className="text-xs text-custom-secondary mb-1">
              {t("trackOrder.plateNumber")}
            </div>
            <div className="text-sm font-medium text-custom-primary">
              {order.driver.plateNumber}
            </div>
          </div>

          {/* Status Message */}
          <div
            className="p-3 rounded-lg flex items-center gap-2"
            style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
          >
            <HiLocationMarker
              className="w-5 h-5 shrink-0"
              style={{ color: "var(--color-accent-primary)" }}
            />
            <span className="text-sm text-custom-primary">
              {t("trackOrder.driverOnWay")}
            </span>
          </div>
        </div>
      </div>

      {/* Delivery Status */}
      <div>
        <h3 className="text-base font-semibold text-custom-primary mb-4">
          {t("trackOrder.deliveryStatus")}
        </h3>
        <div className="space-y-3">
          <div>
            <div className="text-xs text-custom-secondary mb-1">
              {t("trackOrder.eta")}
            </div>
            <div className="text-base font-semibold text-custom-primary">
              {t("trackOrder.etaValue", { minutes: order.eta })}
            </div>
          </div>

          {/* Instructions */}
          <div className="flex items-start gap-2">
            <div
              className="w-2 h-2 rounded-full shrink-0 mt-1.5"
              style={{ backgroundColor: "var(--color-accent-primary)" }}
            />
            <p className="text-xs text-custom-secondary flex-1">
              {t("trackOrder.otpInstructions")}
            </p>
          </div>

          {/* Help Link */}
          <button
            type="button"
            onClick={onNeedHelp}
            className="flex items-center gap-2 text-sm text-custom-accent hover:underline"
          >
            <HiQuestionMarkCircle className="w-4 h-4" />
            {t("trackOrder.needHelp")}
          </button>
        </div>
      </div>
    </div>
  );
}

