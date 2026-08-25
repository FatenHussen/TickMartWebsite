import { useTranslation } from "react-i18next";
import { Bell, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { NotificationItem } from "@/features/account/api/notificationsApi";

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

  return (
    <button
      type="button"
      onClick={onActivate}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl text-start transition-all duration-200",
        "bg-custom-card shadow-sm",
        "hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-api-second)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]",
        isRTL && "text-right",
        isUnread &&
          "bg-[linear-gradient(120deg,color-mix(in_srgb,var(--color-api-second)_8%,var(--color-bg-card))_0%,var(--color-bg-card)_55%)] shadow-[0_4px_20px_-8px_color-mix(in_srgb,var(--color-api-second)_20%,transparent)] dark:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.4)]",
      )}
    >
      <span
        className={cn(
          "absolute start-0 top-3 bottom-3 w-[3px] rounded-full transition-colors",
          isUnread ? "bg-[var(--color-api-second)]" : "bg-custom-tertiary/40",
        )}
        aria-hidden
      />

      <div className="relative flex items-start gap-3 px-4 py-4 ps-5">
        <div
          className={cn(
            "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg transition-colors",
            isUnread
              ? "bg-[color-mix(in_srgb,var(--color-api-second)_20%,var(--color-bg-card))] text-[var(--color-api-second)] shadow-sm"
              : "bg-custom-tertiary/70 text-custom-tertiary shadow-sm",
          )}
        >
          <Bell className="h-5 w-5" aria-hidden />
          {isUnread && (
            <span className="absolute -end-0.5 -top-0.5 flex h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_2px_var(--color-bg-card)]" />
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
                className="whitespace-nowrap text-[11px] font-medium uppercase tracking-wide text-custom-tertiary"
                dateTime={notification.created_at}
              >
                {notification.created_at}
              </time>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 shrink-0 text-custom-tertiary opacity-70 group-hover:opacity-100" aria-hidden />
              ) : (
                <ChevronDown className="h-4 w-4 shrink-0 text-custom-tertiary opacity-70 group-hover:opacity-100" aria-hidden />
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
              <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--color-api-second)_14%,var(--color-bg-card))] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-api-second)] shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-api-second)]" aria-hidden />
                {t("account.notificationsPage.badgeNew")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-custom-tertiary">
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
