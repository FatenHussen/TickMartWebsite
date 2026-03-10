import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

interface NotificationsListResponse {
  status: boolean;
  message: string;
  data: NotificationItem[];
}

export const _NotificationsApi = {
  list: async (): Promise<NotificationItem[]> => {
    const res = await _axios.get<NotificationsListResponse>(
      apiRoutes.notifications.list
    );
    return Array.isArray(res.data.data) ? res.data.data : [];
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await _axios.post(apiRoutes.notifications.markAsRead, {
      notification_id: notificationId,
    });
  },

  markAllAsRead: async (): Promise<void> => {
    await _axios.post(apiRoutes.notifications.markAllAsRead);
  },
};
