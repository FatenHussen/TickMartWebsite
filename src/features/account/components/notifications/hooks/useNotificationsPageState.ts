import { useCallback, useMemo, useState } from "react";
import type { NotificationItem } from "@/features/account/api/notificationsApi";
import {
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
} from "@/features/account/hooks/useNotifications";
import type { NotificationFilterTab } from "../types";

function filterNotifications(
  items: NotificationItem[],
  filter: NotificationFilterTab,
): NotificationItem[] {
  if (filter === "unread") return items.filter((n) => !n.read);
  if (filter === "read") return items.filter((n) => n.read);
  return items;
}

export function useNotificationsPageState() {
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
      if (expandedId === id) {
        setExpandedId(null);
        return;
      }
      setExpandedId(id);
      if (!isRead) {
        markAsRead.mutate(id);
      }
    },
    [expandedId, markAsRead],
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
