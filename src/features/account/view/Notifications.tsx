import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { isSupported } from "firebase/messaging";
import { requestFcmToken } from "@/firebase";
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from "../hooks/useNotifications";
import {
  HiBell,
  HiCheck,
  HiCheckCircle,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";
import { cn } from "@/shared/lib/utils";

type FilterTab = "all" | "unread" | "read";

export default function Notifications() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Push notification state
  const [permission, setPermission] = useState<NotificationPermission | null>(
    typeof Notification !== "undefined" ? Notification.permission : null
  );
  const [fcmSupported, setFcmSupported] = useState<boolean | null>(null);
  const [pushLoading, setPushLoading] = useState(false);

  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  useEffect(() => {
    isSupported()
      .then(setFcmSupported)
      .catch(() => setFcmSupported(false));
  }, []);

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const filtered = useMemo(() => {
    if (filter === "unread") return notifications.filter((n) => !n.read);
    if (filter === "read") return notifications.filter((n) => n.read);
    return notifications;
  }, [notifications, filter]);

  const handleToggle = (id: string, read: boolean) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (!read) {
        markAsRead.mutate(id);
      }
    }
  };

  const handleMarkAllRead = () => {
    if (unreadCount > 0) {
      markAllAsRead.mutate();
    }
  };

  const handleEnablePush = async () => {
    setPushLoading(true);
    try {
      const token = await requestFcmToken();
      if (token) {
        setPermission("granted");
        setFcmSupported(true);
      } else if (typeof Notification !== "undefined") {
        setPermission(Notification.permission);
      }
    } catch {
      // silent
    } finally {
      setPushLoading(false);
    }
  };

  const filterTabs: { value: FilterTab; label: string; count?: number }[] = [
    { value: "all", label: t("account.myReviews.filters.all"), count: notifications.length },
    { value: "unread", label: t("account.notificationsPage.unreadCount", { count: unreadCount }).replace(/\d+ /, ""), count: unreadCount },
    { value: "read", label: t("account.notificationsPage.allRead"), count: notifications.length - unreadCount },
  ];

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <HiBell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("account.notificationsPage.title")}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("account.notificationsPage.description")}
              </p>
            </div>
          </div>
        </div>

        {/* Unread badge + Mark all read */}
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              {t("account.notificationsPage.unreadCount", { count: unreadCount })}
            </span>
          )}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markAllAsRead.isPending}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 rounded-lg transition-colors disabled:opacity-50"
            >
              <HiCheckCircle className="w-4 h-4" />
              {t("account.notificationsPage.markAllRead")}
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
              filter === tab.value
                ? "bg-cyan-500 text-white shadow-sm"
                : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            {tab.label}
            {tab.count != null && tab.count > 0 && (
              <span
                className={cn(
                  "text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center",
                  filter === tab.value
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="py-16 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <HiBell className="w-10 h-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {t("account.notificationsPage.noNotifications")}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            {t("account.notificationsPage.noNotificationsDesc")}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700/50">
          {filtered.map((notification) => {
            const isExpanded = expandedId === notification.id;
            return (
              <button
                key={notification.id}
                onClick={() => handleToggle(notification.id, notification.read)}
                className={cn(
                  "w-full text-left px-5 py-4 transition-colors",
                  isRTL && "text-right",
                  !notification.read
                    ? "bg-cyan-50/50 dark:bg-cyan-950/20 hover:bg-cyan-50 dark:hover:bg-cyan-950/30"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Unread indicator */}
                  <div className="pt-1.5 shrink-0">
                    {!notification.read ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50" />
                    ) : (
                      <HiCheck className="w-2.5 h-2.5 text-gray-300 dark:text-gray-600" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={cn(
                          "text-sm leading-snug",
                          !notification.read
                            ? "font-semibold text-gray-900 dark:text-white"
                            : "font-medium text-gray-700 dark:text-gray-300"
                        )}
                      >
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                          {notification.created_at}
                        </span>
                        {isExpanded ? (
                          <HiChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <HiChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Preview when collapsed, full when expanded */}
                    <p
                      className={cn(
                        "text-sm text-gray-500 dark:text-gray-400 mt-1",
                        !isExpanded && "line-clamp-1"
                      )}
                    >
                      {notification.body}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Push Settings Card */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
            <HiBell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {t("account.notificationsPage.pushSettings")}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {t("account.notificationsPage.enablePushDesc")}
            </p>

            {fcmSupported === false && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                {t("account.notificationsPage.notSupported")}
              </p>
            )}

            {permission === "denied" && (
              <p className="text-xs text-red-500 dark:text-red-400">
                {t("account.notificationsPage.denied")}
              </p>
            )}

            {permission === "granted" && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  {t("account.notificationsPage.tokenReady")}
                </span>
              </div>
            )}

            {permission !== "granted" && permission !== "denied" && fcmSupported !== false && (
              <button
                onClick={handleEnablePush}
                disabled={pushLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors disabled:opacity-50"
              >
                {pushLoading
                  ? t("common.loading", "Loading...")
                  : t("account.notificationsPage.enableNotifications")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
