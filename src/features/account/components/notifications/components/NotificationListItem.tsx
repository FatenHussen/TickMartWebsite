import { useTranslation } from "react-i18next";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { NotificationItem } from "@/features/account/api/notificationsApi";
import { getNotificationIcon } from "../utils/getNotificationIcon";

interface NotificationListItemProps {
  notification: NotificationItem;
  isExpanded: boolean;
  isRTL: boolean;
  onActivate: () => void;
}

export function NotificationListItem({
  notification,
  isExpanded,
  isRTL,
  onActivate,
}: NotificationListItemProps) {
  const { t } = useTranslation();
  const isUnread = !notification.read;
  const Icon = getNotificationIcon(notification.type);

  return (
    <button
      type="button"
      onClick={onActivate}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl text-start transition-all duration-200",
        "bg-custom-card shadow-sm",
        "hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9f00]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]",
        isRTL && "text-right",
        isUnread
          ? "border border-[#c45c4a]/35"
          : "border border-[var(--color-border-primary)]",
      )}
    >
      <span
        className={cn(
          "absolute start-0 top-3 bottom-3 w-[3px] rounded-full transition-colors",
          isUnread ? "bg-[#c45c4a]" : "bg-[var(--color-border-primary)]",
        )}
        aria-hidden
      />

      <div className="relative flex items-start gap-3 px-4 py-4 ps-5">
        <div
          className={cn(
            "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg transition-colors",
            isUnread
              ? "bg-[#c45c4a] text-white"
              : "bg-[color-mix(in_srgb,#ff9f00_12%,var(--color-bg-primary))] text-[#ff9f00]",
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
          {isUnread && (
            <span className="absolute -end-0.5 -top-0.5 flex h-2.5 w-2.5 rounded-full bg-[#c45c4a] shadow-[0_0_0_2px_var(--color-bg-card)]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "min-w-0 flex-1 text-[15px] leading-snug tracking-tight",
                isUnread ? "font-semibold text-custom-primary" : "font-medium text-custom-primary",
              )}
            >
              {notification.title ?? ""}
            </h3>
            <div className="flex shrink-0 items-center gap-1.5">
              <time
                className="whitespace-nowrap text-[11px] font-medium text-custom-secondary"
                dateTime={notification.created_at}
              >
                {notification.created_at}
              </time>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 shrink-0 text-custom-secondary" aria-hidden />
              ) : (
                <ChevronDown className="h-4 w-4 shrink-0 text-custom-secondary" aria-hidden />
              )}
            </div>
          </div>

          <p
            className={cn(
              "mt-1.5 text-sm leading-relaxed text-custom-secondary",
              !isExpanded && "line-clamp-2",
            )}
          >
            {notification.body ?? ""}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {isUnread ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#c45c4a] px-2 py-0.5 text-[11px] font-semibold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
                {t("account.notificationsPage.badgeNew")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-custom-secondary">
                <Check className="h-3.5 w-3.5" aria-hidden />
                {t("account.notificationsPage.badgeRead")}
              </span>
            )}
            {notification.type === "custom_order_request" &&
              notification.status === "waiting_approval" && (
                <span className="inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  {t("customOrder.openToApprove")}
                </span>
              )}
          </div>
        </div>
      </div>
    </button>
  );
}
