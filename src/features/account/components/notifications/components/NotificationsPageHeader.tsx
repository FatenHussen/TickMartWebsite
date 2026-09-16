import { useTranslation } from "react-i18next";
import { Bell, CircleCheck } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface NotificationsPageHeaderProps {
  unreadCount: number;
  onMarkAllRead: () => void;
  markAllReadIsPending: boolean;
}

export function NotificationsPageHeader({
  unreadCount,
  onMarkAllRead,
  markAllReadIsPending,
}: NotificationsPageHeaderProps) {
  const { t } = useTranslation();
  const showUnreadActions = unreadCount > 0;

  return (
    <div
      className={cn(
        "account-shell relative overflow-hidden rounded-2xl border border-[var(--color-border-primary)]",
        "bg-[var(--color-bg-card)] p-4 shadow-[0_2px_12px_-4px_var(--color-shadow)] sm:p-5",
      )}
    >
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3.5 sm:items-center">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ff9f00] shadow-sm"
          >
            <Bell className="h-6 w-6 text-white" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff9f00]">
              {t("account.menu.notifications")}
            </p>
            <h1 className="mt-0.5 text-xl font-bold leading-tight text-custom-primary sm:text-2xl">
              {t("account.notificationsPage.title")}
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-custom-secondary">
              {t("account.notificationsPage.description")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end sm:gap-3">
          {showUnreadActions && (
            <span className="inline-flex items-center rounded-full bg-[#c45c4a] px-3 py-1 text-xs font-bold text-white">
              {t("account.notificationsPage.unreadCount", { count: unreadCount })}
            </span>
          )}
          {showUnreadActions && (
            <button
              type="button"
              onClick={onMarkAllRead}
              disabled={markAllReadIsPending}
              className="cta-honey inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              <CircleCheck className="h-4 w-4 shrink-0" aria-hidden />
              {t("account.notificationsPage.markAllRead")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
