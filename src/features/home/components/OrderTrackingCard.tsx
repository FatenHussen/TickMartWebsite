import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { HiCheck, HiTruck } from "react-icons/hi2";
import { BsBoxSeam } from "react-icons/bs";
import { cn } from "@/shared/lib/utils";
import { paths } from "@/app/routes/path/paths";
import type { ActiveOrder, ActiveOrderItem, ActiveOrderShopGroup, ActiveOrderStatus } from "@/features/cart/types";

const STATUS_PRIORITY: Record<string, number> = {
  pending: 0,
  preparing: 1,
  out_for_delivery: 2,
  delivered: 3,
};

const STAGES: ActiveOrderStatus[] = ["pending", "preparing", "out_for_delivery", "delivered"];

function flattenOrderItems(order: ActiveOrder): ActiveOrderItem[] {
  const items = order.items;
  if (!items) return [];
  if (Array.isArray(items)) return items;
  return Object.values(items as Record<string, ActiveOrderShopGroup>).flatMap(
    (group) => group?.items ?? []
  );
}

function getStatusFromItems(order: ActiveOrder): ActiveOrderStatus {
  const flatItems = flattenOrderItems(order);
  if (flatItems.length === 0) {
    const s = (order.status || "pending").toLowerCase().replace(/-/g, "_");
    return (STATUS_PRIORITY[s] !== undefined ? s : "pending") as ActiveOrderStatus;
  }
  let minPriority = STATUS_PRIORITY.delivered;
  for (const item of flatItems) {
    const s = (item.status || "pending").toLowerCase().replace(/-/g, "_");
    const p = STATUS_PRIORITY[s] ?? 0;
    if (p < minPriority) minPriority = p;
  }
  const statusKey = Object.entries(STATUS_PRIORITY).find(([, v]) => v === minPriority)?.[0];
  return (statusKey ?? "pending") as ActiveOrderStatus;
}

function getStepState(
  stage: ActiveOrderStatus,
  currentStatus: ActiveOrderStatus
): "completed" | "active" | "upcoming" {
  const currentIdx = STAGES.indexOf(currentStatus);
  const stageIdx = STAGES.indexOf(stage);
  if (stageIdx < currentIdx) return "completed";
  if (stageIdx === currentIdx) return "active";
  return "upcoming";
}

function getStatusSubtitleKey(status: ActiveOrderStatus): string {
  switch (status) {
    case "pending":
      return "home.orderReceived";
    case "preparing":
      return "home.storePreparing";
    case "out_for_delivery":
      return "home.outForDelivery";
    case "delivered":
      return "home.orderDelivered";
    default:
      return "home.orderReceived";
  }
}

interface OrderTrackingCardProps {
  order: ActiveOrder;
}

export default function OrderTrackingCard({ order }: OrderTrackingCardProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const currentStatus = useMemo(() => getStatusFromItems(order), [order]);
  const orderDisplay = order.order_code ?? order.id;
  const trackOrderUrl = paths.client.trackOrder.replace(":orderId", String(order.id));
  const showTrackOrderButton = currentStatus !== "delivered";

  const renderStage = (stage: ActiveOrderStatus) => {
    const state = getStepState(stage, currentStatus);
    const isActive = state === "active";
    const isCompleted = state === "completed";
    const isUpcoming = state === "upcoming";

    const completedStyle = {
      background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
    };
    const activeStyle =
      stage === "out_for_delivery"
        ? { backgroundColor: "#fbbf24", borderColor: "#ffffff", borderWidth: 2 }
        : completedStyle;

    const circleStyle =
      !isUpcoming
        ? {
            ...(isCompleted ? completedStyle : activeStyle),
            ...(stage === "out_for_delivery" && isActive ? { border: "2px solid #ffffff" } : {}),
          }
        : undefined;

    return (
      <div
        key={stage}
        className="flex flex-col items-center shrink-0 flex-1 min-w-[80px] sm:min-w-[100px] md:min-w-[120px] lg:min-w-[130px] relative"
      >
        <div className="flex flex-col items-center w-full">
          <div
            className={cn(
              "mb-2 relative z-10 flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12",
              isUpcoming && "bg-slate-200 dark:bg-slate-600"
            )}
            style={circleStyle}
          >
            {stage === "out_for_delivery" && isActive ? (
              <HiTruck className="text-lg sm:text-xl text-white" />
            ) : !isUpcoming ? (
              <HiCheck className="text-lg sm:text-xl text-white" />
            ) : (
              <div className="relative flex items-center justify-center">
                <BsBoxSeam className="text-sm text-custom-tertiary sm:text-base" />
                <HiCheck className="absolute -bottom-0.5 -right-0.5 rounded-full bg-custom-card p-0.5 text-[8px] text-custom-tertiary sm:text-[10px]" />
              </div>
            )}
          </div>
          <p
            className={cn(
              "mb-1 text-center text-[10px] font-bold sm:text-xs",
              isUpcoming ? "text-custom-tertiary" : "text-custom-primary"
            )}
          >
            {stage === "pending" && t("home.pending")}
            {stage === "preparing" && t("home.preparing")}
            {stage === "out_for_delivery" && t("home.outForDeliveryTitle")}
            {stage === "delivered" && t("home.delivered")}
          </p>
          <p
            className={cn(
              "px-1 text-center text-[9px] leading-tight sm:text-xs",
              isUpcoming ? "text-custom-tertiary" : "text-custom-secondary"
            )}
          >
            {stage === "pending" && t("home.orderReceived")}
            {stage === "preparing" && t("home.storePreparing")}
            {stage === "out_for_delivery" && t("home.driverOnWay")}
            {stage === "delivered" && t("home.orderDelivered")}
          </p>
        </div>
        {stage !== "delivered" && (
          <div
            className={cn(
              "absolute top-5 z-0 hidden h-0.5 w-full sm:top-6 sm:block",
              isRTL ? "right-full translate-x-1/2" : "left-full -translate-x-1/2",
              isCompleted && "bg-[#60a5fa]",
              !isCompleted && isActive && "bg-[#fbbf24]",
              !isCompleted && !isActive && "bg-slate-300 dark:bg-slate-600"
            )}
            style={{ width: "calc(100% + 1rem)" }}
          />
        )}
      </div>
    );
  };

  const statusSubtitleKey = getStatusSubtitleKey(currentStatus);

  return (
    <div
      className="rounded-xl border border-emerald-200/90 bg-emerald-50 p-4 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/40 sm:p-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-base font-bold text-custom-primary sm:text-lg">
            {t("orders.order")} #{orderDisplay}
          </p>
          <p className="break-words text-xs text-custom-secondary">
            {t(statusSubtitleKey)}
          </p>
        </div>
        {showTrackOrderButton && (
          <Link
            to={trackOrderUrl}
            className="inline-flex items-center justify-center gap-2 font-semibold rounded-lg px-5 py-2 text-sm w-full sm:w-auto text-white whitespace-nowrap shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            style={{
              backgroundColor: "#22c55e",
            }}
          >
            {t("home.trackOrder")}
          </Link>
        )}
      </div>

      <div className="relative w-full">
        <div className="flex items-start justify-between gap-2 sm:gap-4 md:gap-6 overflow-x-auto pb-2">
          {STAGES.map(renderStage)}
        </div>
      </div>
{/* 
      <div className="flex items-center gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-green-200/60">
        <p className="text-sm font-bold text-slate-900">
          {t("home.confirmationCode")}:
        </p>
        <span
          className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: "#38bdf8" }}
        >
          {confirmationCode}
        </span>
      </div> */}
    </div>
  );
}
