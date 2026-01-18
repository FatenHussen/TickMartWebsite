import React from "react";
import { HiTruck, HiCheck, HiX, HiCube, HiShoppingBag } from "react-icons/hi";
import type { IconType } from "react-icons";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";
import type { OrderStatus } from "../types";

type OrderItem = {
  name: string;
  category: string;
  store: string;
  quantity: number;
  price: string;
  image?: string;
};

type OrderCardProps = {
  orderNumber: string;
  status: OrderStatus;
  dateTime: string;
  items: OrderItem[];
  additionalInfo?: string;
  deliveryAddress?: string;
  total: string;
  paymentMethod: string;
  onViewDetails?: () => void;
  onTrackOrder?: () => void;
  onReorder?: () => void;
  onAddComplaint?: () => void;
  refundStatus?: string;
};

// Helper: Get status UI configuration
const getStatusUI = (
  status: OrderStatus,
  t: (key: string) => string
): {
  label: string;
  icon: IconType;
  pillClasses: string;
  iconWrapClasses: string;
  style?: React.CSSProperties;
} => {
  const basePill =
    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium";
  const baseIconWrap = "w-4 h-4";

  switch (status) {
    case "delivered":
      return {
        label: t("orders.delivered"),
        icon: HiCheck,
        pillClasses: cn(basePill),
        iconWrapClasses: cn(baseIconWrap, "text-white"),
        style: {
          backgroundColor: "rgba(22, 163, 74, 0.1)",
          color: "var(--color-green)",
        },
      };
    case "out_for_delivery":
      return {
        label: t("orders.out_for_delivery"),
        icon: HiTruck,
        pillClasses: cn(basePill),
        iconWrapClasses: cn(baseIconWrap),
        style: {
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          color: "var(--color-accent-primary)",
        },
      };
    case "preparing":
      return {
        label: t("orders.preparing"),
        icon: HiCube,
        pillClasses: cn(basePill),
        iconWrapClasses: cn(baseIconWrap),
        style: {
          backgroundColor: "rgba(234, 179, 8, 0.1)",
          color: "#ca8a04",
        },
      };
    case "cancelled":
      return {
        label: t("orders.cancelled"),
        icon: HiX,
        pillClasses: cn(basePill),
        iconWrapClasses: cn(baseIconWrap),
        style: {
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          color: "#dc2626",
        },
      };
    default:
      return {
        label: t("orders.pending"),
        icon: HiCube,
        pillClasses: cn(basePill, "bg-custom-tertiary text-custom-secondary"),
        iconWrapClasses: cn(baseIconWrap, "text-custom-secondary"),
        style: undefined,
      };
  }
};

// Helper: Format more items text with pluralization
// Note: Currently unused as component receives additionalInfo as prop.
// Available for use when component API is refactored to accept count/storeCount.
export const formatMoreItems = (
  remainingCount: number,
  storeCount: number,
  t: (key: string, opts?: { count?: number; storeCount?: number }) => string,
  _isRtl: boolean
): string => {
  return t("orders.moreItemsFromStore", {
    count: remainingCount,
    storeCount,
  });
};

// Helper: Extract last 4 digits from payment method
const extractLast4 = (paymentMethod: string): string => {
  if (paymentMethod.includes("ending")) {
    return paymentMethod.split("ending")[1]?.trim() || "1234";
  }
  // Try to extract last 4 digits from any string
  const digits = paymentMethod.match(/\d{4}/g);
  return digits?.[digits.length - 1] || "1234";
};

export default function OrderCard({
  orderNumber,
  status,
  dateTime,
  items,
  additionalInfo,
  deliveryAddress,
  total,
  paymentMethod,
  onViewDetails,
  onTrackOrder,
  onReorder,
  onAddComplaint,
  refundStatus,
}: OrderCardProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const statusUI = getStatusUI(status, t);
  const StatusIcon = statusUI.icon;
  const last4 = extractLast4(paymentMethod);

  const cardClasses =
    "bg-custom-primary rounded-xl border border-custom-secondary shadow-sm p-6 hover:shadow-md transition-shadow";
  const headerClasses = "flex items-center justify-between mb-2";
  const orderNumberClasses = "font-semibold text-custom-primary text-base";
  const dateTimeClasses = "text-sm text-custom-secondary mt-0.5";
  const storeIconWrapClasses =
    "w-6 h-6 rounded-lg flex items-center justify-center";
  const itemImageClasses =
    "w-16 h-16 rounded-lg shrink-0 overflow-hidden bg-custom-tertiary";
  const itemNameClasses = "text-sm font-medium text-custom-primary mb-0.5";
  const itemMetaClasses = "text-xs text-custom-secondary";
  const qtyClasses = "text-xs text-custom-secondary";
  const priceClasses = "text-sm font-semibold text-custom-primary mt-0.5";
  const totalLabelClasses = "text-sm text-custom-secondary mb-1";
  const totalValueClasses = "font-semibold text-xl text-custom-primary";
  const paymentLabelClasses = "text-sm text-custom-secondary";

  return (
    <div className={cardClasses} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header: Order Number, Store Icon, and Status */}
      <div className={headerClasses}>
        <div className="flex items-center gap-3">
          <div>
            <div className={orderNumberClasses}>
              {t("orders.order")} #{orderNumber}
            </div>
            <div className={dateTimeClasses}>{dateTime}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Store Icon */}
          <div
            className={storeIconWrapClasses}
            style={{ backgroundColor: "rgba(22, 163, 74, 0.1)" }}
          >
            <HiShoppingBag
              className="w-5 h-5"
              style={{ color: "var(--color-green)" }}
            />
          </div>
          {/* Status Badge */}
          <div className={statusUI.pillClasses} style={statusUI.style}>
            <StatusIcon
              className={statusUI.iconWrapClasses}
              style={
                statusUI.style ? { color: statusUI.style.color } : undefined
              }
            />
            <span>{statusUI.label}</span>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3 mb-4 mt-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            {/* Item Image */}
            <div className={itemImageClasses}>
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-custom-tertiary">
                  <HiShoppingBag className="w-6 h-6 text-custom-secondary" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className={itemNameClasses}>{item.name}</div>
              <div className={itemMetaClasses}>
                {item.category} • {item.store}
              </div>
            </div>
            <div className={cn("shrink-0", isRTL ? "text-left" : "text-right")}>
              <div className={qtyClasses}>
                {t("orders.qty")}: {item.quantity}
              </div>
              <div className={priceClasses}>{item.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      {additionalInfo && (
        <div className="text-sm text-custom-secondary mb-4">
          {additionalInfo}
        </div>
      )}

      {/* Bottom Section: Delivery Address, Total, Payment, and Actions */}
      <div className="mt-6">
        {/* Delivery Address */}
        {deliveryAddress && (
          <div className="text-sm text-custom-secondary mb-4">
            {t("orders.deliveredTo")}: {deliveryAddress}
          </div>
        )}

        {/* Main Content: Total, Payment, and Actions */}
        <div className="flex items-end justify-between gap-2">
          {/* Left Side: Total and Payment */}
          <div className="flex-1">
            {/* Total */}
            <div className="mb-2">
              <div className={totalLabelClasses}>{t("orders.total")}</div>
              <div className={totalValueClasses}>{total}</div>
            </div>

            {/* Payment Method */}
            <div className={paymentLabelClasses}>
              <div>
                {t("orders.payment")}: {t("orders.visaEnding")}
              </div>
              <div>{last4}</div>
            </div>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1">
              {onViewDetails && (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={onViewDetails}
                  className="bg-custom-accent hover:opacity-90 text-custom-inverse px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {t("orders.viewDetails")}
                </Button>
              )}
              {onTrackOrder && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onTrackOrder}
                  className="bg-custom-primary border border-custom-accent hover:bg-custom-hover text-custom-accent px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {t("orders.trackOrder")}
                </Button>
              )}
              {onReorder && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onReorder}
                  className="bg-custom-primary border border-custom-accent hover:bg-custom-hover text-custom-accent px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {t("orders.reorder")}
                </Button>
              )}
            </div>
            {/* Add Complaint Link */}
            {onAddComplaint && (
              <button
                type="button"
                onClick={onAddComplaint}
                className="text-sm text-custom-secondary hover:underline"
              >
                {t("orders.addComplaint")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Refund Status (for cancelled orders) */}
      {refundStatus && (
        <div
          className="text-sm mb-4 font-medium"
          style={{ color: "var(--color-green)" }}
        >
          {refundStatus}
        </div>
      )}
    </div>
  );
}
