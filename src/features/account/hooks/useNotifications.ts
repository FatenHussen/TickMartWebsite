import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { queryKeys } from "@/utils/queryKeys";
import {
  _NotificationsApi,
  type NotificationsListParams,
} from "../api/notificationsApi";

export function useNotifications(params?: NotificationsListParams) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: queryKeys.notifications.list(params),
    queryFn: () => _NotificationsApi.list(params),
    enabled: !!token,
    staleTime: 1000 * 30,
  });
}

export function useMarkAsRead() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: (id: string) => _NotificationsApi.markAsRead(id),
 onSuccess: () => {
 qc.invalidateQueries({ queryKey: queryKeys.notifications.all() });
 },
 });
}

export function useMarkAllAsRead() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: () => _NotificationsApi.markAllAsRead(),
 onSuccess: () => {
 qc.invalidateQueries({ queryKey: queryKeys.notifications.all() });
 },
 });
}
