declare module "@/hooks/useFirebaseNotifications" {
  import type { NormalizedFirebaseNotification } from "@/firebase/messaging";

  export default function useFirebaseNotifications(): {
    dismissNotification: () => void;
    handleNotificationClick: () => void;
    navigateToTarget: (targetPage: string) => void;
    notification: NormalizedFirebaseNotification | null;
    permission: NotificationPermission | "unsupported";
    token: string | null;
  };
}
