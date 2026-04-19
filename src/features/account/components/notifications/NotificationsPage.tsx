import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { NotificationFilterTabs } from "./components/NotificationFilterTabs";
import { NotificationsListSection } from "./components/NotificationsListSection";
import { NotificationsPageHeader } from "./components/NotificationsPageHeader";
import { PushSettingsPanel } from "./components/PushSettingsPanel";
import {
  NOTIFICATIONS_DECO_BOTTOM_ORB_CLASS,
  NOTIFICATIONS_DECO_TOP_ORB_CLASS,
  NOTIFICATIONS_PAGE_SHELL_CLASS,
} from "./constants";
import { useBrowserPushSettings } from "./hooks/useBrowserPushSettings";
import { useNotificationsPageState } from "./hooks/useNotificationsPageState";
import { buildNotificationFilterTabs } from "./utils/buildFilterTabs";

export default function NotificationsPage() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const {
    notifications,
    filteredNotifications,
    isLoading,
    filter,
    setFilter,
    expandedId,
    unreadCount,
    handleNotificationActivate,
    handleMarkAllAsRead,
    markAllAsReadIsPending,
  } = useNotificationsPageState();

  const filterTabs = useMemo(
    () => buildNotificationFilterTabs(t, notifications, unreadCount),
    [t, notifications, unreadCount],
  );

  const { permission, fcmSupported, isRequestingToken, requestPushPermission } =
    useBrowserPushSettings();

  return (
    <div className={NOTIFICATIONS_PAGE_SHELL_CLASS} dir={isRTL ? "rtl" : "ltr"}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.35rem]">
        <div className={NOTIFICATIONS_DECO_TOP_ORB_CLASS} />
        <div className={NOTIFICATIONS_DECO_BOTTOM_ORB_CLASS} />
      </div>

      <div className="relative space-y-6 px-3 pb-4 pt-5 sm:px-5 sm:pb-6 sm:pt-6">
        <NotificationsPageHeader
          unreadCount={unreadCount}
          onMarkAllRead={handleMarkAllAsRead}
          markAllReadIsPending={markAllAsReadIsPending}
        />

        <NotificationFilterTabs tabs={filterTabs} activeTab={filter} onTabChange={setFilter} />

        <NotificationsListSection
          isLoading={isLoading}
          notifications={filteredNotifications}
          expandedId={expandedId}
          isRTL={isRTL}
          onNotificationActivate={handleNotificationActivate}
        />

        <PushSettingsPanel
          permission={permission}
          fcmSupported={fcmSupported}
          isRequestingToken={isRequestingToken}
          onEnablePush={requestPushPermission}
        />
      </div>
    </div>
  );
}
