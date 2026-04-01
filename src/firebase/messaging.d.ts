declare module "@/firebase/messaging" {
  import type { MessagePayload } from "firebase/messaging";

  export type NormalizedFirebaseNotification = {
    messageId: string;
    title: string;
    body: string;
    target_page: string;
    emoji: string;
    media_type: string;
    type: string;
    is_fixed: string;
    media_url: string;
    hasImage: boolean;
  };

  export function registerMessagingServiceWorker(): Promise<ServiceWorkerRegistration>;
  export function requestNotificationPermission(): Promise<NotificationPermission | "unsupported">;
  export function getFcmToken(): Promise<string | null>;
  export function normalizeNotificationPayload(
    payload: MessagePayload
  ): NormalizedFirebaseNotification;
  export function listenToForegroundMessages(
    callback: (
      notification: NormalizedFirebaseNotification,
      payload: MessagePayload
    ) => void
  ): Promise<() => void>;
}
