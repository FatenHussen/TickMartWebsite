import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { _NotificationsApi } from "@/features/account/api/notificationsApi";
import { useAuthStore } from "@/store/auth";
import { getNotificationTargetPageFromPathname } from "@/shared/lib/notificationPageSlug";
import { queryKeys } from "@/utils/queryKeys";

/**
 * When the user visits a mapped app page, requests GET /notifications?target_page=<slug>
 * (authenticated only). Does not render UI; primes cache / satisfies backend page targeting.
 */
export function usePageTargetNotifications() {
  const { pathname } = useLocation();
  const token = useAuthStore((s) => s.token);
  const targetPage = getNotificationTargetPageFromPathname(pathname);

  return useQuery({
    queryKey: targetPage
      ? queryKeys.notifications.list({ target_page: targetPage })
      : (["notifications", "pageTarget", "idle"] as const),
    queryFn: () => _NotificationsApi.list({ target_page: targetPage! }),
    enabled: !!token && !!targetPage,
    staleTime: 1000 * 30,
  });
}
