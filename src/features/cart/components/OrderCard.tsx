import {
    Truck,
    X,
    ShoppingBag,
    Clock,
    ClipboardList,
    MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
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

type StatusUI = {
    label: string;
    dotColorVar: string;
};

type AccentColors = {
    accent: string;
    orbStrong: string;
    orbSoft: string;
};

const getStatusUI = (status: OrderStatus, t: (key: string) => string): StatusUI => {
    switch (status) {
        case "out_for_delivery":
            return { label: t("orders.out_for_delivery"), dotColorVar: "#2563eb" };
        case "delivered":
            return { label: t("orders.delivered"), dotColorVar: "var(--color-success)" };
        case "preparing":
            return { label: t("orders.preparing"), dotColorVar: "var(--color-warning)" };
        case "cancelled":
            return { label: t("orders.cancelled"), dotColorVar: "var(--color-error)" };
        case "pending":
        default:
            return { label: t("orders.pending"), dotColorVar: "var(--color-primary)" };
    }
};

const getCardBackground = (status: OrderStatus): string => {
    const bg = "var(--color-bg-card)";
    const mix = (color: string, pct1: number, pct2: number) =>
        `linear-gradient(165deg, color-mix(in srgb, ${color} ${pct1}%, ${bg}) 0%, ${bg} 42%, color-mix(in srgb, ${color} ${pct2}%, ${bg}) 100%)`;

    switch (status) {
        case "pending":          return mix("var(--color-primary)", 13, 6);
        case "preparing":        return mix("var(--color-warning)", 11, 5);
        case "out_for_delivery": return mix("#3b82f6", 10, 4);
        case "delivered":        return mix("var(--color-success)", 9, 4);
        case "cancelled":        return mix("var(--color-error)", 9, 4);
        default:                 return mix("var(--color-primary)", 13, 6);
    }
};

const getAccentColors = (status: OrderStatus): AccentColors => {
    switch (status) {
        case "pending":
            return { accent: "var(--color-primary)", orbStrong: "var(--color-primary)", orbSoft: "var(--color-api-second)" };
        case "preparing":
            return { accent: "var(--color-warning)", orbStrong: "var(--color-warning)", orbSoft: "var(--color-primary)" };
        case "out_for_delivery":
            return { accent: "#3b82f6", orbStrong: "#3b82f6", orbSoft: "var(--color-primary)" };
        case "delivered":
            return { accent: "var(--color-success)", orbStrong: "var(--color-success)", orbSoft: "var(--color-primary)" };
        case "cancelled":
            return { accent: "var(--color-error)", orbStrong: "var(--color-error)", orbSoft: "var(--color-text-tertiary)" };
        default:
            return { accent: "var(--color-primary)", orbStrong: "var(--color-primary)", orbSoft: "var(--color-api-second)" };
    }
};

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
    const cardBg = getCardBackground(status);
    const fe = getAccentColors(status);
    const last4 = extractLast4(paymentMethod);

    const canCancel = !!onCancelOrder && (status === "pending" || status === "preparing");
    const totalItems = items.reduce((acc, item) => acc + (item.quantity || 0), 0);

    // Decorative line gradient (top border accent)
    const topLineBg = `linear-gradient(90deg, transparent 0%, color-mix(in srgb, ${fe.accent} 55%, transparent) 35%, color-mix(in srgb, ${fe.accent} 75%, transparent) 50%, color-mix(in srgb, ${fe.accent} 55%, transparent) 65%, transparent 100%)`;
    // Orb backgrounds
    const orbStrongBg = `radial-gradient(circle, color-mix(in srgb, ${fe.orbStrong} 42%, transparent) 0%, transparent 70%)`;
    const orbSoftBg = `radial-gradient(circle, color-mix(in srgb, ${fe.orbSoft} 35%, transparent) 0%, transparent 72%)`;
    // Overlay gradient
    const overlayBg = `radial-gradient(at 0% 0%, color-mix(in srgb, ${fe.accent} 20%, transparent) 0px, transparent 50%), radial-gradient(at 100% 100%, color-mix(in srgb, ${fe.orbSoft} 18%, transparent) 0px, transparent 55%)`;
    // Icon background
    const iconBg = `linear-gradient(145deg, color-mix(in srgb, ${fe.accent} 22%, var(--color-bg-tertiary)) 0%, var(--color-bg-tertiary) 100%)`;
    const iconBoxShadow = `inset 0 1px 0 color-mix(in srgb, ${fe.accent} 25%, transparent)`;

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-3xl",
                "shadow-[0_6px_24px_-4px_color-mix(in_srgb,var(--color-main)_22%,transparent),0_20px_44px_-16px_color-mix(in_srgb,var(--color-main)_14%,transparent)]",
                "transition-all duration-300 ease-out",
                "group-hover:-translate-y-1 group-hover:shadow-[0_14px_40px_-8px_color-mix(in_srgb,var(--color-main)_32%,transparent),0_24px_48px_-14px_color-mix(in_srgb,var(--color-main)_18%,transparent)]",
            )}
            style={{ background: cardBg }}
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Decorative top accent line */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[3px] opacity-90"
                style={{ background: topLineBg }}
                aria-hidden
            />
            {/* Top-right orb */}
            <div
                className="pointer-events-none absolute -right-10 -top-12 z-0 h-36 w-36 rounded-full blur-3xl"
                style={{ background: orbStrongBg }}
                aria-hidden
            />
            {/* Bottom-left orb */}
            <div
                className="pointer-events-none absolute -bottom-14 -left-8 z-0 h-32 w-32 rounded-full blur-2xl"
                style={{ background: orbSoftBg }}
                aria-hidden
            />
            {/* Color overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.35] mix-blend-soft-light dark:opacity-[0.2]"
                style={{ backgroundImage: overlayBg }}
                aria-hidden
            />

            {/* Content */}
            <div className="relative z-10">
                {/* Header: icon + order info + status badge */}
                <div className="p-4 pb-3">
                    <div className="flex items-start justify-between gap-3">
                        {/* Left: icon + order details */}
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                            <div
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-inner ring-1 ring-black/5 dark:ring-white/10"
                                style={{ background: iconBg, boxShadow: iconBoxShadow }}
                            >
                                <ClipboardList className="h-5 w-5" style={{ color: fe.accent }} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-text-primary">
                                    {t("orders.order")} #{orderNumber}
                                </p>
                                <div className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
                                    <span className="truncate">{dateTime}</span>
                                    <Clock className="h-3.5 w-3.5 shrink-0 opacity-80" />
                                </div>
                            </div>
                        </div>

                        {/* Status badge */}
                        <div
                            className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-text-secondary backdrop-blur-[2px] shadow-[0_2px_10px_-2px_color-mix(in_srgb,var(--color-main)_16%,transparent)]"
                            style={{ backgroundColor: "color-mix(in srgb, var(--color-bg-card) 65%, transparent)" }}
                        >
                            <span
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{ backgroundColor: statusUI.dotColorVar }}
                                aria-hidden
                            />
                            <span className="whitespace-nowrap">{statusUI.label}</span>
                        </div>
                    </div>
                </div>

                {/* Dotted divider */}
                <div
                    className="mx-4 border-b border-dotted"
                    style={{ borderColor: "color-mix(in srgb, var(--color-text-tertiary) 35%, transparent)" }}
                />

                {/* Middle: items badge + total */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
                    <div
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-text-secondary"
                        style={{ backgroundColor: "color-mix(in srgb, var(--color-text-tertiary) 10%, transparent)" }}
                    >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>{t("orders.itemsBadge", { count: totalItems })}</span>
                    </div>
                    <div className={cn("min-w-0", isRTL ? "text-left" : "text-right")}>
                        <p className="text-xs text-text-secondary">{t("orders.total")}</p>
                        <p className="text-xl font-bold text-primary">{total}</p>
                    </div>
                </div>

                {/* Delivery address */}
                {deliveryAddress && (
                    <>
                        <div className="mx-4 border-t border-custom-primary" />
                        <div className="flex items-start gap-2 px-4 py-3">
                            <p className="min-w-0 flex-1 text-xs leading-relaxed text-text-secondary">
                                <span className="text-text-tertiary">{t("orders.deliveredTo")}: </span>
                                {deliveryAddress}
                            </p>
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-text-tertiary" />
                        </div>
                    </>
                )}

                {/* Track / Reorder / Complaint buttons */}
                {(onTrackOrder || onReorder || onAddComplaint) && (
                    <div className="flex flex-wrap gap-2 px-4 pb-2">
                        {onTrackOrder && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onTrackOrder?.(); }}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-custom-primary px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-custom-primary/10 transition-colors"
                            >
                                <Truck className="h-4 w-4" />
                                {t("orders.trackOrder")}
                            </button>
                        )}
                        {onReorder && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onReorder?.(); }}
                                className="rounded-lg border border-custom-primary px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-custom-primary/10 transition-colors"
                            >
                                {t("orders.reorder")}
                            </button>
                        )}
                        {onAddComplaint && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onAddComplaint?.(); }}
                                className="text-xs text-text-secondary underline-offset-2 hover:underline"
                            >
                                {t("orders.addComplaint")}
                            </button>
                        )}
                    </div>
                )}

                {/* Cancel / View Details */}
                {(canCancel || onViewDetails) && (
                    <>
                        <div className="mx-4 border-t border-custom-primary" />
                        <div className="flex gap-2 p-4">
                            {canCancel && (
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); onCancelOrder?.(); }}
                                    className="inline-flex w-[32%] max-w-[140px] shrink-0 items-center justify-center gap-1.5 rounded-xl border border-error bg-error/5 px-2 py-2.5 text-sm font-medium text-error transition-colors hover:bg-error/10"
                                >
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-error">
                                        <X className="h-3 w-3" strokeWidth={2.5} />
                                    </span>
                                    {t("common.cancel")}
                                </button>
                            )}
                            {onViewDetails && (
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); onViewDetails?.(); }}
                                    className="min-w-0 flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors bg-[var(--color-api-second)] hover:bg-[var(--color-api-second-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-main)]/35"
                                >
                                    {t("orders.viewDetails")}
                                </button>
                            )}
                        </div>
                    </>
                )}

                {/* Footer: payment, additionalInfo, refund */}
                {(additionalInfo || refundStatus || (paymentMethod && paymentMethod !== "-")) && (
                    <div className="space-y-1 border-t border-custom-primary/80 bg-[color-mix(in_srgb,var(--color-bg-tertiary)_45%,transparent)] px-4 py-3 text-xs text-text-secondary backdrop-blur-[1px]">
                        {paymentMethod && paymentMethod !== "-" && (
                            <p>
                                {t("orders.payment")}:{" "}
                                {paymentMethod.includes("ending")
                                    ? `${t("orders.visaEnding")} ${last4}`
                                    : paymentMethod}
                            </p>
                        )}
                        {additionalInfo && <p>{additionalInfo}</p>}
                        {refundStatus && (
                            <p className="font-medium text-success">{refundStatus}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
