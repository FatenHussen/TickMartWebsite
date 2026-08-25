import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { NotificationItem } from "@/features/account/api/notificationsApi";
import {
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
} from "@/features/account/hooks/useNotifications";
import { paths } from "@/app/routes/path/paths";
import type { NotificationFilterTab } from "../types";

function filterNotifications(
  items: NotificationItem[],
  filter: NotificationFilterTab,
): NotificationItem[] {
  if (filter === "unread") return items.filter((n) => !n.read);
  if (filter === "read") return items.filter((n) => n.read);
  return items;
}

function resolveNotificationPath(notification: NotificationItem): string | null {
  if (notification.target_page) return notification.target_page;

  if (notification.type === "custom_order_request" && notification.related_id != null) {
    return paths.client.customOrderDetails(notification.related_id);
  }

  return null;
}

export function useNotificationsPageState() {
  const navigate = useNavigate();
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const [filter, setFilter] = useState<NotificationFilterTab>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const filteredNotifications = useMemo(
    () => filterNotifications(notifications, filter),
    [notifications, filter],
  );

  const handleNotificationActivate = useCallback(
    (id: string, isRead: boolean) => {
      const notification = notifications.find((n) => n.id === id);
      const deepLink = notification ? resolveNotificationPath(notification) : null;

      if (!isRead) {
        markAsRead.mutate(id);
      }

      if (deepLink) {
        navigate(deepLink);
        return;
      }

      if (expandedId === id) {
        setExpandedId(null);
        return;
      }
      setExpandedId(id);
    },
    [expandedId, markAsRead, navigate, notifications],
  );

  const handleMarkAllAsRead = useCallback(() => {
    if (unreadCount > 0) {
      markAllAsRead.mutate();
    }
  }, [unreadCount, markAllAsRead]);

  return {
    notifications,
    filteredNotifications,
    isLoading,
    filter,
    setFilter,
    expandedId,
    unreadCount,
    handleNotificationActivate,
    handleMarkAllAsRead,
    markAllAsReadIsPending: markAllAsRead.isPending,
  };
}
