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
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#ff9f00] [animation-delay:-0.2s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#ff9f00] [animation-delay:-0.1s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#ff9f00]" />
        </div>
        <p className="text-sm font-medium text-custom-tertiary">{t("common.loading", "Loading...")}</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-card)] px-6 py-16 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#ff9f00]">
          <Bell className="h-7 w-7 text-white" aria-hidden />
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
