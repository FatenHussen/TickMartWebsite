import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";

/**
 * NotificationResource - matches GET /api/notifications response format
 */
export interface NotificationItem {
  id: string;
  title: string | null;
  body: string | null;
  type: string | null;
  is_fixed: number;
  read: boolean;
  created_at: string;
}

/**
 * Query params for GET /api/notifications
 * - read: true/1 = only read, false/0 = only unread
 * - is_fixed: when present, returns only unread fixed admin notifications
 * - page: Laravel pagination page number
 */
export interface NotificationsListParams {
  read?: boolean;
  is_fixed?: boolean;
  page?: number;
}

export interface NotificationsPaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface NotificationsPaginatedResponse {
  data: NotificationItem[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: NotificationsPaginationMeta;
}

export interface NotificationsListResponse {
  status: boolean;
  message: string;
  data: NotificationItem[] | NotificationsPaginatedResponse;
}

export const _NotificationsApi = {
  /**
   * GET /api/notifications
   * Returns paginated notifications. Extracts items array for backward compatibility.
   */
  list: async (params?: NotificationsListParams): Promise<NotificationItem[]> => {
    const searchParams = new URLSearchParams();
    if (params?.read !== undefined) searchParams.set("read", params.read ? "1" : "0");
    if (params?.is_fixed !== undefined) searchParams.set("is_fixed", "1");
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    const query = searchParams.toString();
    const url = query ? `${apiRoutes.notifications.list}?${query}` : apiRoutes.notifications.list;
    const res = await _axios.get<NotificationsListResponse>(url);
    const payload = res.data.data;
    if (Array.isArray(payload)) return payload;
    return (payload as NotificationsPaginatedResponse)?.data ?? [];
  },

  /**
   * POST /api/notifications/mark-as-read
   * Body: { notification_id: uuid }
   */
  markAsRead: async (notificationId: string): Promise<void> => {
    await _axios.post(apiRoutes.notifications.markAsRead, {
      notification_id: notificationId,
    });
  },

  /**
   * POST /api/notifications/mark-all-as-read
   * No body required.
   */
  markAllAsRead: async (): Promise<void> => {
    await _axios.post(apiRoutes.notifications.markAllAsRead);
  },
};
