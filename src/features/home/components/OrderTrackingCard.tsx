import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { HiCheck, HiHome } from "react-icons/hi2";
import { BsHourglassSplit, BsReceipt } from "react-icons/bs";
import { FiClock } from "react-icons/fi";
import { MdDeliveryDining } from "react-icons/md";
import { MapPin } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { paths } from "@/app/routes/path/paths";
import {
  getOrderCardDarkAmbientStyle,
  getOrderCardDarkStyle,
  getOrderStepperPanelDarkStyle,
} from "../lib/infoCardsDarkGradients";
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
    case "pending":      return "home.orderReceived";
    case "preparing":    return "home.storePreparing";
    case "out_for_delivery": return "home.driverOnWay";
    case "delivered":    return "home.orderDelivered";
    default:             return "home.orderReceived";
  }
}

function getStageIcon(stage: ActiveOrderStatus, state: "completed" | "active" | "upcoming") {
  if (state === "completed") {
    return <HiCheck className="h-5 w-5 sm:h-6 sm:w-6 text-white animate-check-pop" strokeWidth={3} />;
  }
  const color = state === "active" ? "text-white" : "text-stone-400";
  const size = "h-5 w-5 sm:h-6 sm:w-6";

  switch (stage) {
    case "pending":
      return <BsReceipt className={cn(size, color)} />;
    case "preparing":
      return <BsHourglassSplit className={cn(size, color, state === "active" && "animate-hourglass-flip")} />;
    case "out_for_delivery":
      return <MdDeliveryDining className={cn(size, color, state === "active" && "animate-truck-bounce")} />;
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
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  const currentStatus = useMemo(() => getStatusFromItems(order), [order]);
  const orderDisplay = order.order_code ?? order.id;
  const trackOrderUrl = paths.client.trackOrder.replace(":orderId", String(order.id));
  const isDelivered = currentStatus === "delivered";
  const showTrackOrderButton = !isDelivered;
  const statusSubtitleKey = getStatusSubtitleKey(currentStatus);

  const gradientBg = {
    background: "linear-gradient(135deg, var(--color-gradient-from) 0%, var(--color-gradient-to) 100%)",
  };

  /** Dark: desaturated brand gradient for step / header accents only (not full-bleed “neon” cards). */
  const gradientBgSoftDark = {
    background:
      "linear-gradient(135deg, color-mix(in srgb, var(--color-gradient-from) 72%, #121317 28%) 0%, color-mix(in srgb, var(--color-gradient-to) 72%, #121317 28%) 100%)",
  };

  const renderStage = (stage: ActiveOrderStatus, index: number) => {
    const state = getStepState(stage, currentStatus);
    const isActive = state === "active";
    const isCompleted = state === "completed";
    const isUpcoming = state === "upcoming";
    const isLast = index === STAGES.length - 1;

    return (
      <div
        key={stage}
        className="relative flex min-w-0 flex-1 flex-col items-center"
        data-step-state={state}
      >
        {/* Connector */}
        {!isLast && (
          <div
            className={cn(
              "absolute top-[22px] sm:top-[26px] h-[3px] z-0 overflow-hidden rounded-full",
              isRTL ? "right-1/2 mr-6 sm:mr-7" : "left-1/2 ml-6 sm:ml-7"
            )}
            style={{ width: "calc(100% - 3rem)" }}
          >
            <div className="absolute inset-0 bg-stone-200 dark:bg-[rgba(255,255,255,0.06)]" />
            <div
              className={cn(
                "absolute inset-y-0 rounded-full transition-all duration-700 ease-out",
                isRTL ? "right-0" : "left-0",
                isCompleted ? "w-full" : isActive ? "w-1/2" : "w-0"
              )}
              style={
                isCompleted || isActive
                  ? isDarkTheme
                    ? {
                        background:
                          "linear-gradient(90deg, color-mix(in srgb, var(--color-primary) 38%, rgba(255,255,255,0.1) 62%) 0%, color-mix(in srgb, var(--color-gradient-to) 35%, rgba(255,255,255,0.08) 65%) 100%)",
                      }
                    : { background: "linear-gradient(90deg, var(--color-gradient-from) 0%, var(--color-gradient-to) 100%)" }
                  : undefined
              }
            />
            {isCompleted && (
              <div
                className="absolute inset-y-0 w-1/3 animate-connector-flow rounded-full opacity-90 dark:opacity-40"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)",
                }}
              />
            )}
          </div>
        )}

        {/* Circle */}
        <div className="relative z-10 flex items-center justify-center">
          {isActive && !isDarkTheme && (
            <span
              className="absolute inline-flex h-12 w-12 sm:h-14 sm:w-14 rounded-full animate-ping"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-gradient-to) 30%, transparent)",
                animationDuration: "1.8s",
              }}
            />
          )}
          <div
            className={cn(
              "relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full transition-all duration-300",
              isUpcoming && "border border-stone-200/80 bg-white/80 dark:border-white/[0.08] dark:bg-white/[0.04]",
              !isUpcoming &&
                !isDarkTheme &&
                "shadow-md dark:shadow-[0_4px_18px_-6px_color-mix(in_srgb,var(--color-main)_40%,transparent)]",
              !isUpcoming &&
                isDarkTheme &&
                (isCompleted
                  ? "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ring-1 ring-white/[0.08]"
                  : "shadow-[0_4px_14px_-8px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.09]"),
              isActive && "animate-step-float ring-2 ring-white/60 dark:animate-none dark:ring-1 dark:ring-[color-mix(in_srgb,var(--color-primary)_35%,rgba(255,255,255,0.12))]",
              isCompleted && "animate-step-pop ring-2 ring-white/60 dark:ring-1 dark:ring-white/[0.07]"
            )}
            style={
              isUpcoming
                ? undefined
                : isDarkTheme && isCompleted
                  ? {
                      background: "rgba(255,255,255,0.06)",
                      boxShadow:
                        "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 0 22px -12px color-mix(in srgb, var(--color-primary) 14%, transparent)",
                    }
                  : isDarkTheme && isActive
                    ? gradientBgSoftDark
                    : gradientBg
            }
          >
            {getStageIcon(stage, state)}
          </div>
        </div>

        {/* Label */}
        <div
          className={cn(
            "relative mt-3 rounded-xl px-2 py-1 transition-all",
            isActive &&
              "bg-white/60 shadow-sm dark:bg-white/[0.04] dark:shadow-none animate-label-glow dark:animate-none"
          )}
        >
          <p
            className={cn(
              "text-center text-[11px] font-bold sm:text-xs",
              isUpcoming
                ? "text-stone-400 dark:text-[#71717A]"
                : "text-custom-primary dark:text-white"
            )}
          >
            {stage === "pending"           && t("home.pending")}
            {stage === "preparing"         && t("home.preparing")}
            {stage === "out_for_delivery"  && t("home.outForDeliveryTitle")}
            {stage === "delivered"         && t("home.delivered")}
          </p>
          <p
            className={cn(
              "mt-0.5 line-clamp-2 text-center text-[10px] leading-tight sm:text-[11px]",
              isUpcoming
                ? "text-stone-400 dark:text-[#71717A]"
                : "text-custom-secondary dark:text-[#A1A1AA]"
            )}
          >
            {stage === "pending"           && t("home.orderReceived")}
            {stage === "preparing"         && t("home.storePreparing")}
            {stage === "out_for_delivery"  && t("home.driverOnWay")}
            {stage === "delivered"         && t("home.orderDelivered")}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        /* Light */
        "relative overflow-hidden rounded-3xl border border-amber-200/90 bg-gradient-to-br from-[#FFF8EF] via-[#FFF3E0] to-[#FFE8CC] p-4 shadow-[0_8px_32px_-8px_color-mix(in_srgb,var(--color-primary)_25%,transparent)] animate-card-enter sm:p-6",
        /* Dark — creative charcoal gradient + ambient layers via style */
        "dark:border-white/[0.12]"
      )}
      style={isDarkTheme ? getOrderCardDarkStyle() : undefined}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 dark:opacity-100"
        style={isDarkTheme ? getOrderCardDarkAmbientStyle() : undefined}
      />

      {/* Header: order pill + track button */}
      <div className="relative z-10 mb-4 flex items-center gap-2 sm:gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 ring-black/5 dark:shadow-none dark:ring-white/[0.08] sm:h-11 sm:w-11"
            style={isDarkTheme ? gradientBgSoftDark : gradientBg}
          >
            <BsReceipt className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1 rounded-full border border-white/80 bg-white px-4 py-2.5 shadow-inner shadow-stone-200/60 dark:border-white/[0.07] dark:bg-white/[0.04] dark:shadow-none">
            <p className="truncate text-center text-sm font-bold text-stone-900 dark:text-white sm:text-base">
              {t("orders.order")} #{orderDisplay}
            </p>
          </div>
        </div>

        {showTrackOrderButton && (
          <Link
            to={trackOrderUrl}
            className="group inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 ease-out hover:brightness-[1.05] active:scale-[0.98] focus:outline-none sm:px-4 sm:py-3 sm:text-base dark:shadow-[0_6px_20px_-12px_color-mix(in_srgb,var(--color-primary)_26%,transparent)] dark:hover:shadow-[0_8px_24px_-10px_color-mix(in_srgb,var(--color-primary)_32%,transparent)]"
            style={isDarkTheme ? gradientBgSoftDark : gradientBg}
            aria-label={t("home.trackOrder")}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 backdrop-blur-sm transition-transform duration-300 ease-out group-hover:scale-110 sm:h-7 sm:w-7">
              <MapPin className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" strokeWidth={2.25} aria-hidden />
            </span>
            <span className="hidden whitespace-nowrap sm:inline">{t("home.trackOrder")}</span>
          </Link>
        )}
      </div>

      {/* Status row */}
      <div className="relative z-10 mb-5 flex items-center gap-2 text-stone-600 dark:text-[#A1A1AA]">
        <FiClock className="h-4 w-4 shrink-0 text-stone-500 dark:text-[#71717A]" aria-hidden />
        <p className="min-w-0 flex-1 truncate text-xs font-medium sm:text-sm">
          <span
            className="font-bold text-[var(--color-main)] dark:text-[color:color-mix(in_srgb,var(--color-primary)_52%,#ffffff_48%)]"
          >
            {currentStatus === "pending"           && t("home.pending")}
            {currentStatus === "preparing"         && t("home.preparing")}
            {currentStatus === "out_for_delivery"  && t("home.outForDeliveryTitle")}
            {currentStatus === "delivered"         && t("home.delivered")}
          </span>
          <span className="mx-1.5 opacity-40">·</span>
          <span>
            {isDelivered ? t(statusSubtitleKey) : t("home.estimatedDeliveryShort")}
          </span>
        </p>
      </div>

      {/* Stepper panel */}
      <div
        className="relative z-10 rounded-2xl bg-white/75 p-4 shadow-inner shadow-stone-200/40 backdrop-blur-sm dark:shadow-none dark:ring-1 dark:ring-white/[0.09] sm:p-5"
        style={isDarkTheme ? getOrderStepperPanelDarkStyle() : undefined}
      >
        <div className="flex items-start justify-between gap-1 sm:gap-2">
          {STAGES.map((stage, idx) => renderStage(stage, idx))}
        </div>
      </div>
    </div>
  );
}
