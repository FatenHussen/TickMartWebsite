import { useTranslation } from "react-i18next";
import { HiBell, HiCheckCircle } from "react-icons/hi";
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
        "relative overflow-hidden rounded-2xl",
        "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-bg-card)_88%,var(--color-api-second))_0%,var(--color-bg-card)_48%,color-mix(in_srgb,var(--color-bg-card)_94%,var(--color-main))_100%)]",
        "p-4 shadow-sm sm:p-5",
      )}
    >
      <div
        className="pointer-events-none absolute -end-10 -top-12 h-36 w-36 rounded-full bg-[var(--color-api-second)] opacity-[0.12] blur-2xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3.5 sm:items-center">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-md",
              "bg-gradient-to-br from-primary to-primary-dark",
            )}
          >
            <HiBell className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-api-second)]">
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
            <span className="inline-flex items-center rounded-full bg-error px-3 py-1 text-xs font-bold text-white shadow-sm">
              {t("account.notificationsPage.unreadCount", { count: unreadCount })}
            </span>
          )}
          {showUnreadActions && (
            <button
              type="button"
              onClick={onMarkAllRead}
              disabled={markAllReadIsPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-custom-card/90 px-4 py-2.5 text-sm font-medium text-accent-primary shadow-sm transition-colors hover:bg-custom-light dark:bg-bg-hover/60 dark:text-accent-light dark:hover:bg-bg-hover disabled:opacity-50"
            >
              <HiCheckCircle className="h-4 w-4 shrink-0" />
              {t("account.notificationsPage.markAllRead")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
