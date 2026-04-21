import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { HiCheck, HiHome } from "react-icons/hi2";
import { BsHourglassSplit, BsReceipt } from "react-icons/bs";
import { FiClock } from "react-icons/fi";
import { MdDeliveryDining } from "react-icons/md";
import { MapPin } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { paths } from "@/app/routes/path/paths";
import type {
  ActiveOrder,
  ActiveOrderItem,
  ActiveOrderShopGroup,
  ActiveOrderStatus,
} from "@/features/cart/types";

const STATUS_PRIORITY: Record<string, number> = {
  pending: 0,
  preparing: 1,
  out_for_delivery: 2,
  delivered: 3,
};

const STAGES: ActiveOrderStatus[] = [
  "pending",
  "preparing",
  "out_for_delivery",
  "delivered",
];

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
  const statusKey = Object.entries(STATUS_PRIORITY).find(
    ([, v]) => v === minPriority
  )?.[0];
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
      return "home.driverOnWay";
    case "delivered":
      return "home.orderDelivered";
    default:
      return "home.orderReceived";
  }
}

function getStageIcon(
  stage: ActiveOrderStatus,
  state: "completed" | "active" | "upcoming"
) {
  if (state === "completed") {
    return (
      <HiCheck
        className="h-5 w-5 sm:h-6 sm:w-6 text-white animate-check-pop"
        strokeWidth={3}
      />
    );
  }

  const color =
    state === "active"
      ? "text-white"
      : "text-stone-400 dark:text-custom-tertiary";
  const size = "h-5 w-5 sm:h-6 sm:w-6";

  switch (stage) {
    case "pending":
      return <BsReceipt className={cn(size, color)} />;
    case "preparing":
      return (
        <BsHourglassSplit
          className={cn(size, color, state === "active" && "animate-hourglass-flip")}
        />
      );
    case "out_for_delivery":
      return (
        <MdDeliveryDining
          className={cn(size, color, state === "active" && "animate-truck-bounce")}
        />
      );
    case "delivered":
      return <HiHome className={cn(size, color)} />;
    default:
      return null;
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
  const isDelivered = currentStatus === "delivered";
  const showTrackOrderButton = !isDelivered;

  const statusSubtitleKey = getStatusSubtitleKey(currentStatus);

  const renderStage = (stage: ActiveOrderStatus, index: number) => {
    const state = getStepState(stage, currentStatus);
    const isActive = state === "active";
    const isCompleted = state === "completed";
    const isUpcoming = state === "upcoming";
    const isLast = index === STAGES.length - 1;

    const gradientBg = {
      background:
        "linear-gradient(135deg, var(--color-gradient-from) 0%, var(--color-gradient-to) 100%)",
    };

    return (
      <div
        key={stage}
        className="relative flex min-w-0 flex-1 flex-col items-center"
      >
        {/* Connector to next step */}
        {!isLast && (
          <div
            className={cn(
              "absolute top-[22px] sm:top-[26px] h-1 z-0 overflow-hidden rounded-full",
              isRTL ? "right-1/2 mr-6 sm:mr-7" : "left-1/2 ml-6 sm:ml-7"
            )}
            style={{ width: "calc(100% - 3rem)" }}
          >
            <div className="absolute inset-0 bg-border-light dark:bg-border-secondary" />
            <div
              className={cn(
                "absolute inset-y-0 rounded-full transition-all duration-700 ease-out",
                isRTL ? "right-0" : "left-0",
                isCompleted ? "w-full" : isActive ? "w-1/2" : "w-0"
              )}
              style={
                isCompleted || isActive
                  ? {
                      background:
                        "linear-gradient(90deg, var(--color-gradient-from) 0%, var(--color-gradient-to) 100%)",
                    }
                  : undefined
              }
            />
            {isCompleted && (
              <div
                className="absolute inset-y-0 w-1/3 animate-connector-flow rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
                }}
              />
            )}
          </div>
        )}

        {/* Circle */}
        <div className="relative z-10 flex items-center justify-center">
          {isActive && (
            <span
              className="absolute inline-flex h-12 w-12 sm:h-14 sm:w-14 rounded-full opacity-60 animate-ping"
              style={{
                backgroundColor: "var(--color-gradient-to)",
                animationDuration: "1.8s",
              }}
            />
          )}
          <div
            className={cn(
              "relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full transition-all",
              isUpcoming &&
                "border-2 border-stone-200 bg-white shadow-sm dark:border-border-secondary dark:bg-bg-tertiary",
              !isUpcoming && "shadow-md ring-2 ring-white/90 dark:ring-bg-tertiary",
              isActive && "animate-step-float",
              isCompleted && "animate-step-pop"
            )}
            style={!isUpcoming ? gradientBg : undefined}
          >
            {getStageIcon(stage, state)}
          </div>
        </div>

        {/* Label */}
        <div
          className={cn(
            "relative mt-3 rounded-lg px-2 py-1 transition-all",
            isActive &&
              "bg-custom-card shadow-sm ring-1 ring-black/5 dark:ring-white/10 animate-label-glow"
          )}
        >
          <p
            className={cn(
              "text-center text-[11px] font-bold sm:text-xs",
              isUpcoming
              ? "text-stone-500 dark:text-custom-tertiary"
              : "text-custom-primary"
            )}
          >
            {stage === "pending" && t("home.pending")}
            {stage === "preparing" && t("home.preparing")}
            {stage === "out_for_delivery" && t("home.outForDeliveryTitle")}
            {stage === "delivered" && t("home.delivered")}
          </p>
          <p
            className={cn(
              "mt-0.5 line-clamp-2 text-center text-[10px] leading-tight sm:text-[11px]",
              isUpcoming
                ? "text-stone-500 dark:text-custom-tertiary"
                : "text-custom-secondary"
            )}
          >
            {stage === "pending" && t("home.orderReceived")}
            {stage === "preparing" && t("home.storePreparing")}
            {stage === "out_for_delivery" && t("home.driverOnWay")}
            {stage === "delivered" && t("home.orderDelivered")}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-amber-200/90 bg-gradient-to-br from-[#FFF8EF] via-[#FFF3E0] to-[#FFE8CC] p-4 shadow-[0_8px_32px_-8px_color-mix(in_srgb,var(--color-primary)_25%,transparent)] animate-card-enter sm:p-6 dark:border-white/10 dark:from-bg-tertiary dark:via-bg-tertiary dark:to-bg-primary dark:shadow-none dark:ring-1 dark:ring-white/10"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Decorative gradient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-gradient-from) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-gradient-to) 0%, transparent 70%)",
        }}
      />

      {/* Header: order pill + track button */}
      <div className="relative mb-3 flex items-center gap-2 sm:gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm sm:h-11 sm:w-11"
            style={{
              background:
                "linear-gradient(135deg, var(--color-gradient-from) 0%, var(--color-gradient-to) 100%)",
            }}
          >
            <BsReceipt className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1 rounded-full border border-white/80 bg-white px-4 py-2.5 shadow-inner shadow-stone-200/60 dark:border-border-secondary dark:bg-bg-tertiary">
            <p className="truncate text-center text-sm font-bold text-stone-900 sm:text-base dark:text-custom-primary">
              {t("orders.order")} #{orderDisplay}
            </p>
          </div>
        </div>

        {showTrackOrderButton && (
          <Link
            to={trackOrderUrl}
            className="group inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 sm:px-4 sm:py-3 sm:text-base"
            style={{
              background:
                "linear-gradient(135deg, var(--color-gradient-from) 0%, var(--color-gradient-to) 100%)",
            }}
            aria-label={t("home.trackOrder")}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110 sm:h-7 sm:w-7">
              <MapPin
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5"
                strokeWidth={2.25}
                aria-hidden
              />
            </span>
            <span className="hidden whitespace-nowrap sm:inline">
              {t("home.trackOrder")}
            </span>
          </Link>
        )}
      </div>

      {/* Clock + status */}
      <div className="relative mb-4 flex items-center gap-2 text-stone-600 dark:text-custom-secondary">
        <FiClock
          className="h-4 w-4 shrink-0 text-[var(--color-primary)]"
          aria-hidden
        />
        <p className="min-w-0 flex-1 truncate text-xs font-medium sm:text-sm">
          <span className="font-bold text-[var(--color-primary)]">
            {currentStatus === "pending" && t("home.pending")}
            {currentStatus === "preparing" && t("home.preparing")}
            {currentStatus === "out_for_delivery" && t("home.outForDeliveryTitle")}
            {currentStatus === "delivered" && t("home.delivered")}
          </span>
          <span className="mx-1.5 text-stone-400 dark:text-custom-tertiary">·</span>
          <span className="text-stone-600 dark:text-custom-secondary">
            {isDelivered
              ? t(statusSubtitleKey)
              : t("home.estimatedDeliveryShort")}
          </span>
        </p>
      </div>

      {/* Stepper card */}
      <div className="relative rounded-2xl border border-white/70 bg-white/75 p-4 shadow-inner shadow-stone-200/40 backdrop-blur-sm dark:border-border-secondary dark:bg-bg-primary/30 sm:p-5">
        <div className="flex items-start justify-between gap-1 sm:gap-2">
          {STAGES.map((stage, idx) => renderStage(stage, idx))}
        </div>
      </div>
    </div>
  );
}
