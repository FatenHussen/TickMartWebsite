import { HiPhone, HiQuestionMarkCircle } from "react-icons/hi";
import { HiTruck } from "react-icons/hi2";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
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
    <div
      className="bg-blue-off rounded-2xl border border-custom-secondary shadow-sm"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Order Summary Section */}
      <div className="p-5 border-b border-custom-secondary">
        <h3 className="text-base font-bold text-custom-primary mb-4">
          {t("trackOrder.orderSummary")}
        </h3>

        <div className="space-y-3">
          {/* Order Number & Status */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-custom-secondary mb-0.5">
                {t("orders.order")} Number
              </div>
              <div className="text-sm font-medium text-custom-primary">
                #{order.orderNumber}
              </div>
            </div>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded"
              style={{
                backgroundColor: "rgba(249, 115, 22, 0.1)",
                color: "#f97316",
              }}
            >
              {t(`orders.${order.status}`)}
            </span>
          </div>

          {/* Store */}
          <div>
            <div className="text-xs text-custom-secondary mb-0.5">
              {t("trackOrder.store")}
            </div>
            <div className="text-sm font-medium text-custom-accent">
              {order.store}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-4 pt-4 border-t border-custom-secondary">
          <div className="text-xs text-custom-secondary mb-2">
            {t("trackOrder.items")}
          </div>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-custom-secondary">
                  {item.name} x{item.quantity}
                </span>
                <span className="font-medium text-custom-primary">
                  {item.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment & Summary */}
        <div className="mt-4 pt-4 border-t border-custom-secondary space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-custom-secondary">
              {t("checkout.paymentMethod")}
            </span>
            <span className="font-medium text-custom-primary">
              {order.paymentMethod === "cash_on_delivery"
                ? t("trackOrder.cashOnDelivery")
                : order.paymentMethod}
            </span>
          </div>
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
                order.deliveryIsFree ? { color: "#22c55e" } : undefined
              }
            >
              {order.deliveryFee}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="mt-3 pt-3 border-t border-custom-secondary">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-custom-primary">
              {t("orders.total")}
            </span>
            <span className="text-base font-bold text-custom-primary">
              {order.totalAmount}
            </span>
          </div>
        </div>
      </div>

      {/* Driver Details Section */}
      <div className="p-5 border-b border-custom-secondary">
        <h3 className="text-base font-bold text-custom-primary mb-4">
          {t("trackOrder.driverDetails")}
        </h3>

        {/* Driver Profile */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={order.driver.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.driver.name)}&background=3b82f6&color=fff&size=128`}
            alt={order.driver.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="text-sm font-semibold text-custom-primary">
              {order.driver.name}
            </div>
            <div className="text-xs text-custom-secondary">
              {order.driver.vehicleType}
            </div>
          </div>
        </div>

        {/* Driver Info Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-custom-secondary">
              {t("trackOrder.phoneNumber")}
            </span>
            <button
              type="button"
              onClick={onCallDriver}
              className="flex items-center gap-1.5 text-sm font-medium text-custom-accent hover:underline"
            >
              <HiPhone className="w-3.5 h-3.5" />
              {order.driver.phoneNumber}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-custom-secondary">
              {t("trackOrder.vehicle")}
            </span>
            <span className="text-sm font-medium text-custom-primary">
              {order.driver.vehicle}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-custom-secondary">
              {t("trackOrder.plateNumber")}
            </span>
            <span className="text-sm font-medium text-custom-primary">
              {order.driver.plateNumber}
            </span>
          </div>
        </div>

        {/* Status Banner */}
        <div
          className="mt-4 p-3 rounded-lg flex items-center justify-center gap-2"
          style={{ backgroundColor: "#1f2937" }}
        >
          <HiTruck className="w-4 h-4 text-white" />
          <span className="text-sm text-white">
            {t("trackOrder.driverOnWay")}
          </span>
        </div>
      </div>

      {/* Delivery Status Section */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-custom-primary">
            {t("trackOrder.deliveryStatus")}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-sm text-custom-secondary">
              {t("trackOrder.eta")}:
            </span>
            <span className="text-sm font-semibold" style={{ color: "#22c55e" }}>
              {order.eta}
            </span>
          </div>
        </div>

        {/* OTP Instructions */}
        <div className="flex items-start gap-2 mb-4">
          <div
            className="w-2 h-2 rounded-full shrink-0 mt-1.5"
            style={{ backgroundColor: "#22c55e" }}
          />
          <p className="text-xs text-custom-secondary flex-1">
            {t("trackOrder.otpInstructions")}
          </p>
        </div>

        {/* Help Link */}
        <button
          type="button"
          onClick={onNeedHelp}
          className="flex items-center gap-2 text-sm text-custom-secondary hover:text-custom-accent transition-colors"
        >
          <HiQuestionMarkCircle className="w-4 h-4" />
          {t("trackOrder.needHelp")}
        </button>
      </div>
    </div>
  );
}
