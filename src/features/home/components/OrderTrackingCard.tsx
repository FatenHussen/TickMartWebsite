import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { HiCheck, HiTruck } from "react-icons/hi2";
import { BsBoxSeam } from "react-icons/bs";
import { cn } from "@/shared/lib/utils";
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

function getConfirmationCode(order: ActiveOrder): string {
  const code = order.order_code ?? String(order.id);
  return code.length >= 5 ? code.slice(-5) : code.padStart(5, "0");
}

interface OrderTrackingCardProps {
  order: ActiveOrder;
}

export default function OrderTrackingCard({ order }: OrderTrackingCardProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const currentStatus = useMemo(() => getStatusFromItems(order), [order]);
  const orderDisplay = order.order_code ?? order.id;

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
    const upcomingStyle = { backgroundColor: "#e5e7eb" };

    const bgStyle = isCompleted ? completedStyle : isActive ? activeStyle : upcomingStyle;

    return (
      <div
        key={stage}
        className="flex flex-col items-center shrink-0 flex-1 min-w-[80px] sm:min-w-[100px] md:min-w-[120px] lg:min-w-[130px] relative"
      >
        <div className="flex flex-col items-center w-full">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 relative z-10"
            style={{
              ...bgStyle,
              ...(stage === "out_for_delivery" && isActive ? { border: "2px solid #ffffff" } : {}),
            }}
          >
            {stage === "out_for_delivery" && isActive ? (
              <HiTruck className="text-lg sm:text-xl text-white" />
            ) : !isUpcoming ? (
              <HiCheck className="text-lg sm:text-xl text-white" />
            ) : (
              <div className="relative flex items-center justify-center">
                <BsBoxSeam className="text-sm sm:text-base" style={{ color: "#6b7280" }} />
                <HiCheck
                  className="absolute -bottom-0.5 -right-0.5 text-[8px] sm:text-[10px] bg-custom-card rounded-full p-0.5"
                  style={{ color: "#6b7280" }}
                />
              </div>
            )}
          </div>
          <p
            className={`text-[10px] sm:text-xs font-bold mb-1 text-center ${
              isUpcoming ? "text-slate-500" : "text-slate-900"
            }`}
          >
            {stage === "pending" && t("home.pending")}
            {stage === "preparing" && t("home.preparing")}
            {stage === "out_for_delivery" && t("home.outForDeliveryTitle")}
            {stage === "delivered" && t("home.delivered")}
          </p>
          <p
            className={`text-[9px] sm:text-xs text-center px-1 leading-tight ${
              isUpcoming ? "text-slate-400" : "text-slate-600"
            }`}
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
              "hidden sm:block absolute top-5 sm:top-6 w-full h-0.5 z-0",
              isRTL ? "right-full translate-x-1/2" : "left-full -translate-x-1/2"
            )}
            style={{
              backgroundColor: isCompleted ? "#60a5fa" : isActive ? "#fbbf24" : "#d1d5db",
              width: "calc(100% + 1rem)",
            }}
          />
        )}
      </div>
    );
  };

  const confirmationCode = getConfirmationCode(order);
  const statusSubtitleKey = getStatusSubtitleKey(currentStatus);

  return (
    <div
      className="rounded-xl p-4 sm:p-6 shadow-sm"
      style={{ backgroundColor: "#ecfdf5" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex-1 min-w-0">
          <p className="text-base sm:text-lg font-bold text-slate-900 mb-1">
            {t("orders.order")} #{orderDisplay}
          </p>
          <p className="text-xs text-slate-600 break-words">
            {t(statusSubtitleKey)}
          </p>
        </div>
        {/* <Link
          to={trackOrderUrl}
          className="inline-flex items-center justify-center gap-2 font-semibold rounded-lg px-5 py-2 text-sm w-full sm:w-auto text-white whitespace-nowrap shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          style={{
            backgroundColor: "#22c55e",
          }}
        >
          {t("home.trackOrder")}
        </Link> */}
      </div>

      <div className="relative w-full">
        <div className="flex items-start justify-between gap-2 sm:gap-4 md:gap-6 overflow-x-auto pb-2">
          {STAGES.map(renderStage)}
        </div>
      </div>

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
      </div>
    </div>
  );
}
