import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import {
    HiOutlineLocationMarker,
    HiOutlineClock,
    HiOutlineArrowLeft,
} from "react-icons/hi";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import SideContentLayout from "@/layout/SideContentLayout";
import { cn } from "@/shared/lib/utils";
import OrderStatusTimeline from "../components/OrderStatusTimeline";
import OrderItemsTable from "../components/OrderItemsTable";
import OrderSidebar from "../components/OrderSidebar";
import { useOrderDetails } from "../hooks/useOrderDetails";

type StatusVisuals = {
    label: string;
    color: string;
    bg: string;
};

const getStatusVisuals = (
    status: string,
    t: TFunction,
): StatusVisuals => {
    switch (status) {
        case "delivered":
            return {
                label: t("orders.delivered", "Delivered"),
                color: "var(--color-success)",
                bg: "color-mix(in srgb, var(--color-success) 12%, transparent)",
            };
        case "out_for_delivery":
            return {
                label: t("orders.out_for_delivery", "Out for Delivery"),
                color: "var(--color-accent-primary)",
                bg: "color-mix(in srgb, var(--color-accent-primary) 12%, transparent)",
            };
        case "preparing":
            return {
                label: t("orders.preparing", "Preparing"),
                color: "var(--color-ui-amber-400)",
                bg: "color-mix(in srgb, var(--color-ui-amber-400) 14%, transparent)",
            };
        case "cancelled":
            return {
                label: t("orders.cancelled", "Cancelled"),
                color: "var(--color-error)",
                bg: "color-mix(in srgb, var(--color-error) 12%, transparent)",
            };
        case "pending":
        default:
            return {
                label: t("orders.pending", "Order received"),
                color: "var(--color-text-tertiary)",
                bg: "color-mix(in srgb, var(--color-text-tertiary) 14%, transparent)",
            };
    }
};

export default function OrderDetails() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const navigate = useNavigate();
    const { order, isLoading, error, trackOnMap } = useOrderDetails();

    const handleMoveToWishlist = (itemId: number | string) => {
        console.log("Move to wishlist:", itemId);
    };

    if (isLoading || (!order && !error)) {
        return (
            <div className="bg-custom-tertiary min-h-screen">
                <div className="page-container py-6 sm:py-8">
                    <OrderDetailsSkeleton />
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="bg-custom-tertiary min-h-screen">
                <div className="page-container py-12">
                    <div className="max-w-md mx-auto text-center bg-custom-card border border-custom-primary rounded-2xl p-8">
                        <div
                            className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4"
                            style={{
                                background:
                                    "color-mix(in srgb, var(--color-error) 12%, var(--color-bg-card))",
                                color: "var(--color-error)",
                            }}
                        >
                            <HiOutlineExclamationTriangle className="w-7 h-7" />
                        </div>
                        <h2 className="text-lg font-semibold text-[color:var(--color-text)] mb-1">
                            {t("orders.orderNotFound", "Order not found.")}
                        </h2>
                        <p className="text-sm text-custom-secondary">
                            {t(
                                "orders.orderNotFoundDescription",
                                "We couldn't load the details for this order.",
                            )}
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-custom-inverse bg-[color:var(--color-api-second)] hover:bg-[color:var(--color-api-second-hover)] transition-colors"
                        >
                            <HiOutlineArrowLeft className="w-4 h-4" />
                            {t("common.goBack", "Go back")}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const visuals = getStatusVisuals(order.status, t);
    const canTrack =
        order.status !== "delivered" &&
        (order.status as string) !== "cancelled";

    return (
        <div className="bg-custom-tertiary min-h-screen">
            <div
                className="page-container py-6 sm:py-8 space-y-6"
                dir={isRTL ? "rtl" : "ltr"}
            >
                {/* Back link */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-medium",
                        "text-custom-secondary hover:text-[color:var(--color-main)] transition-colors",
                    )}
                >
                    <HiOutlineArrowLeft
                        className={cn("w-4 h-4", isRTL && "rotate-180")}
                    />
                    {t("common.back", "Back")}
                </button>

                {/* Hero header */}
                <header
                    className={cn(
                        "rounded-2xl bg-custom-card border border-custom-primary",
                        "shadow-sm p-4 sm:p-5 md:p-6",
                        "flex flex-col gap-4",
                        "lg:flex-row lg:items-center lg:justify-between",
                    )}
                >
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide"
                                style={{
                                    backgroundColor: visuals.bg,
                                    color: visuals.color,
                                }}
                            >
                                <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: visuals.color }}
                                />
                                {visuals.label}
                            </span>
                        </div>

                        {order.orderNumber ? (
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[color:var(--color-text)] break-words">
                                {t("orders.order", "Order")} #
                                {order.orderNumber}
                            </h1>
                        ) : (
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[color:var(--color-text)]">
                                {t("orders.orderDetails", "Order Details")}
                            </h1>
                        )}

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-custom-secondary">
                            <span className="inline-flex items-center gap-1.5">
                                <HiOutlineClock className="w-4 h-4 text-custom-tertiary" />
                                <span className="text-custom-tertiary">
                                    {t("orders.eta", "ETA")}:
                                </span>
                                <span className="font-medium text-[color:var(--color-text)]">
                                    {order.delivery.eta}
                                </span>
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="text-custom-tertiary">
                                    {t("orders.total", "Total")}:
                                </span>
                                <span className="font-semibold text-[color:var(--color-main)]">
                                    {order.priceSummary.total}
                                </span>
                            </span>
                        </div>
                    </div>

                    {canTrack && (
                        <button
                            type="button"
                            onClick={trackOnMap}
                            className={cn(
                                "inline-flex items-center justify-center gap-2",
                                "px-4 sm:px-5 py-2.5 rounded-xl",
                                "text-sm font-semibold text-custom-inverse",
                                "transition-all duration-200",
                                "hover:-translate-y-0.5",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_srgb,var(--color-main)_35%,transparent)]",
                                "w-full sm:w-auto shrink-0 self-start lg:self-auto",
                            )}
                            style={{
                                background:
                                    "linear-gradient(135deg, var(--color-main) 0%, var(--color-api-second) 100%)",
                                boxShadow:
                                    "0 8px 22px -8px color-mix(in srgb, var(--color-main) 55%, transparent)",
                            }}
                        >
                            <HiOutlineLocationMarker className="w-5 h-5" />
                            {t("orders.trackOrderOnMap", "Track Order on Map")}
                        </button>
                    )}
                </header>

                <SideContentLayout
                    sidebar={
                        <OrderSidebar
                            priceSummary={order.priceSummary}
                            delivery={order.delivery}
                            payment={order.payment}
                        />
                    }
                    sidebarPosition="right"
                    gapClassName="gap-6"
                    columnTemplate="1fr 362px"
                >
                    <div className="space-y-6">
                        <OrderStatusTimeline currentStatus={order.status} />
                        <OrderItemsTable
                            items={order.items}
                            onMoveToWishlist={handleMoveToWishlist}
                        />
                    </div>
                </SideContentLayout>
            </div>
        </div>
    );
}

function OrderDetailsSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="h-3 w-16 bg-custom-muted rounded" />
            <div className="rounded-2xl bg-custom-card border border-custom-primary p-6 space-y-3">
                <div className="h-5 w-24 bg-custom-muted rounded-full" />
                <div className="h-8 w-64 bg-custom-muted rounded" />
                <div className="h-4 w-48 bg-custom-muted rounded" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_362px] gap-6">
                <div className="space-y-6">
                    <div className="h-32 bg-custom-card border border-custom-primary rounded-2xl" />
                    <div className="h-64 bg-custom-card border border-custom-primary rounded-2xl" />
                </div>
                <div className="space-y-4">
                    <div className="h-44 bg-custom-card border border-custom-primary rounded-2xl" />
                    <div className="h-44 bg-custom-card border border-custom-primary rounded-2xl" />
                    <div className="h-24 bg-custom-card border border-custom-primary rounded-2xl" />
                </div>
            </div>
        </div>
    );
}
