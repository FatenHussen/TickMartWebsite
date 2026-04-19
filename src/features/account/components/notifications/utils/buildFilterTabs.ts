import type { TFunction } from "i18next";
import type { NotificationItem } from "@/features/account/api/notificationsApi";
import type { NotificationFilterTab } from "../types";
import { stripLeadingCountFromUnreadLabel } from "./unreadTabLabel";

export interface NotificationFilterTabConfig {
  value: NotificationFilterTab;
  label: string;
  count?: number;
}

export function buildNotificationFilterTabs(
  t: TFunction,
  notifications: NotificationItem[],
  unreadCount: number,
): NotificationFilterTabConfig[] {
  const unreadCountLabel = t("account.notificationsPage.unreadCount", { count: unreadCount });

  return [
    {
      value: "all",
      label: t("account.myReviews.filters.all"),
      count: notifications.length,
    },
    {
      value: "unread",
      label: stripLeadingCountFromUnreadLabel(unreadCountLabel),
      count: unreadCount,
    },
    {
      value: "read",
      label: t("account.notificationsPage.allRead"),
      count: notifications.length - unreadCount,
    },
  ];
}
