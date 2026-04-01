import {
    HiTruck,
    HiCheck,
    HiX,
    HiCube,
    HiShoppingBag,
    HiClock,
    HiClipboardList,
    HiLocationMarker,
} from "react-icons/hi";
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
    onCancelOrder?: () => void;
    refundStatus?: string;
};

// Helper: Get status UI configuration with colors from design
const getStatusUI = (
    status: OrderStatus,
    t: (key: string) => string,
): {
    label: string;
    icon: IconType;
    cardGradient: string;
    badgeBackgroundColor: string;
    badgeTextColor: string;
    buttonColor: string;
    iconBgColor: string;
} => {
    switch (status) {
        case "out_for_delivery":
            return {
                label: t("orders.out_for_delivery"),
                icon: HiTruck,
                cardGradient:
                    "linear-gradient(to bottom, #FFFFFF 0%, #D4EEF7 30%, #A8DCF0 60%, #7FCCE8 100%)",
                badgeBackgroundColor: "#7FCCE8",
                badgeTextColor: "#006A8A",
                buttonColor: "#006A8A",
                iconBgColor: "#006A8A",
            };
        case "delivered":
            return {
                label: t("orders.delivered"),
                icon: HiCheck,
                cardGradient:
                    "linear-gradient(to bottom, #FFFFFF 0%, #DCFCE7 30%, #98CFA9 60%, #16A34A 100%)",
                badgeBackgroundColor: "#98CFA9",
                badgeTextColor: "#166534",
                buttonColor: "#16A34A",
                iconBgColor: "#16A34A",
            };
        case "preparing":
            return {
                label: t("orders.preparing"),
                icon: HiCube,
                cardGradient:
                    "linear-gradient(to bottom, #FFFFFF 0%, #FEF9C3 30%, #FDE047 60%, #EAB308 100%)",
                badgeBackgroundColor: "#FDE047",
                badgeTextColor: "#854D0E",
                buttonColor: "#CA8A04",
                iconBgColor: "#CA8A04",
            };
        case "cancelled":
            return {
                label: t("orders.cancelled"),
                icon: HiX,
                cardGradient:
                    "linear-gradient(to bottom, #FFFFFF 0%, #FEE2E2 30%, #FECACA 60%, #EF4444 100%)",
                badgeBackgroundColor: "#FECACA",
                badgeTextColor: "#991B1B",
                buttonColor: "#DC2626",
                iconBgColor: "#DC2626",
            };
        case "pending":
            return {
                label: t("orders.pending"),
                icon: HiClock,
                cardGradient:
                    "linear-gradient(to bottom, #FFFFFF 0%, #FED7AA 30%, #FDBA74 60%, #F97316 100%)",
                badgeBackgroundColor: "#FDBA74",
                badgeTextColor: "#9A3412",
                buttonColor: "#EA580C",
                iconBgColor: "#EA580C",
            };
        default:
            return {
                label: t("orders.pending"),
                icon: HiClock,
                cardGradient:
                    "linear-gradient(to bottom, #FFFFFF 0%, #FED7AA 30%, #FDBA74 60%, #F97316 100%)",
                badgeBackgroundColor: "#FDBA74",
                badgeTextColor: "#9A3412",
                buttonColor: "#EA580C",
                iconBgColor: "#EA580C",
            };
    }
};

// Helper: Extract last 4 digits from payment method
const extractLast4 = (paymentMethod: string): string => {
    if (paymentMethod.includes("ending")) {
        return paymentMethod.split("ending")[1]?.trim() || "1234";
    }
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
    onCancelOrder,
    refundStatus,
}: OrderCardProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const statusUI = getStatusUI(status, t);
    const StatusIcon = statusUI.icon;
    const last4 = extractLast4(paymentMethod);

    return (
        <div
            className="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            dir={isRTL ? "rtl" : "ltr"}
            style={{ background: statusUI.cardGradient }}
        >
            {/* Top Section with Gradient */}
            <div className="p-4" style={{ background: statusUI.cardGradient }}>
                {/* Header: Order Icon + Info | Status Badge */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {/* Order Icon */}
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: statusUI.iconBgColor }}
                        >
                            <HiClipboardList className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="font-semibold text-custom-primary text-sm">
                                {t("orders.order")} #{orderNumber}
                            </div>
                            <div className="text-xs text-custom-secondary">{dateTime}</div>
                        </div>
                    </div>
                    {/* Status Badge */}
                    <div
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                        style={{
                            backgroundColor: statusUI.badgeBackgroundColor,
                            color: statusUI.badgeTextColor,
                        }}
                    >
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{statusUI.label}</span>
                    </div>
                </div>

                {/* Middle Row: Total/Payment | Address/Buttons */}
                <div className="flex items-start justify-between gap-4">
                    {/* Left: Total and Payment */}
                    <div>
                        <div className="text-xs text-custom-secondary mb-0.5">
                            {t("orders.total")}
                        </div>
                        <div className="font-bold text-xl text-custom-primary">{total}</div>
                        <div className="text-xs text-custom-secondary mt-1">
                            {t("orders.payment")}:{""}
                            {paymentMethod.includes("ending")
                                ? `${t("orders.visaEnding")} ${last4}`
                                : paymentMethod}
                        </div>
                    </div>

                    {/* Right: Address and Buttons */}
                    <div className="flex flex-col items-end gap-2">
                        {/* Delivery Address */}
                        {deliveryAddress && (
                            <div className="flex items-center gap-1.5 text-xs text-custom-secondary">
                                <HiLocationMarker className="w-3.5 h-3.5 shrink-0" />
                                <span>
                                    {t("orders.deliveredTo")}: {deliveryAddress}
                                </span>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            {onViewDetails && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onViewDetails?.();
                                    }}
                                    className="bg-custom-card hover:bg-custom-light px-3 py-1.5 rounded-lg text-xs font-medium border"
                                    style={{
                                        borderColor: statusUI.buttonColor,
                                        color: statusUI.buttonColor,
                                    }}
                                >
                                    {t("orders.viewDetails")}
                                </Button>
                            )}
                            {onTrackOrder && (
                                <Button
                                    type="button"
                                    variant="primary"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onTrackOrder?.();
                                    }}
                                    className="text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 flex items-center gap-1.5"
                                    style={{ backgroundColor: statusUI.buttonColor }}
                                >
                                    <HiTruck className="w-4 h-4" />
                                    {t("orders.trackOrder")}
                                </Button>
                            )}
                            {onReorder && (
                                <Button
                                    type="button"
                                    variant="primary"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onReorder?.();
                                    }}
                                    className="text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90"
                                    style={{ backgroundColor: statusUI.buttonColor }}
                                >
                                    {t("orders.reorder")}
                                </Button>
                            )}
                            {onCancelOrder &&
                                (status === "pending" || status === "preparing") && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onCancelOrder?.();
                                        }}
                                        className="bg-custom-card border border-red-500 hover:bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium"
                                    >
                                        {t("orders.cancelOrder")}
                                    </Button>
                                )}
                        </div>

                        {/* Add Complaint Link */}
                        {onAddComplaint && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddComplaint?.();
                                }}
                                className="text-xs text-custom-secondary hover:underline"
                            >
                                {t("orders.addComplaint")}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Section: Items List with White Background */}
            <div className="p-4 bg-custom-card">
                {/* Items List */}
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                            {/* Item Image */}
                            <div className="w-10 h-10 rounded-lg shrink-0 overflow-hidden bg-custom-tertiary">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <HiShoppingBag className="w-5 h-5 text-custom-tertiary" />
                                    </div>
                                )}
                            </div>
                            {/* Item Info */}
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-custom-primary truncate">
                                    {item.name}
                                </div>
                                <div className="text-xs text-custom-secondary">{item.store}</div>
                            </div>
                            {/* Qty and Price */}
                            <div
                                className={cn("shrink-0", isRTL ? "text-left" : "text-right")}
                            >
                                <div className="text-xs text-custom-secondary">
                                    {t("orders.qty")}: {item.quantity}
                                </div>
                                <div className="text-sm font-semibold text-custom-primary">
                                    {item.price}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Info - e.g."+1 more item from 1 store"*/}
                {additionalInfo && (
                    <div className="text-xs text-custom-secondary mt-3">
                        {additionalInfo}
                    </div>
                )}

                {/* Refund Status */}
                {refundStatus && (
                    <div className="text-xs text-green-600 font-medium mt-2">
                        {refundStatus}
                    </div>
                )}
            </div>
        </div>
    );
}
