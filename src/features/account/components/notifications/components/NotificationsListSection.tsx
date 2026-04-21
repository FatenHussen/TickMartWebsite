import { useTranslation } from "react-i18next";
import { Bell } from "lucide-react";
import type { NotificationItem } from "@/features/account/api/notificationsApi";
import { NotificationListItem } from "./NotificationListItem";

interface NotificationsListSectionProps {
  isLoading: boolean;
  notifications: NotificationItem[];
  expandedId: string | null;
  isRTL: boolean;
  onNotificationActivate: (id: string, isRead: boolean) => void;
}

export function NotificationsListSection({
  isLoading,
  notifications,
  expandedId,
  isRTL,
  onNotificationActivate,
}: NotificationsListSectionProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="relative flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[var(--color-api-second)] [animation-delay:-0.2s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[var(--color-api-second)] [animation-delay:-0.1s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[var(--color-api-second)]" />
          <div className="pointer-events-none absolute inset-0 -z-10 scale-150 rounded-full bg-[var(--color-api-second)]/15 blur-2xl" />
        </div>
        <p className="text-sm font-medium text-custom-tertiary">{t("common.loading", "Loading...")}</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-2xl bg-custom-card/50 px-6 py-16 text-center shadow-sm backdrop-blur-sm">
        <div className="relative mx-auto mb-5 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[color-mix(in_srgb,var(--color-api-second)_18%,var(--color-bg-card))] blur-md" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-custom-card shadow-inner">
            <Bell className="h-10 w-10 text-[var(--color-api-second)] opacity-80" aria-hidden />
          </div>
        </div>
        <h3 className="mb-1 text-lg font-semibold text-custom-primary">
          {t("account.notificationsPage.noNotifications")}
        </h3>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-custom-secondary">
          {t("account.notificationsPage.noNotificationsDesc")}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3" role="list">
      {notifications.map((notification) => (
        <li key={notification.id}>
          <NotificationListItem
            notification={notification}
            isExpanded={expandedId === notification.id}
            isRTL={isRTL}
            onActivate={() => onNotificationActivate(notification.id, notification.read)}
          />
        </li>
      ))}
    </ul>
  );
}
