declare module "@/components/NotificationToast" {
  import type { FC } from "react";
  import type { NormalizedFirebaseNotification } from "@/firebase/messaging";

  export interface NotificationToastProps {
    notification: NormalizedFirebaseNotification | null;
    onClick: () => void;
    onClose: () => void;
  }

  const NotificationToast: FC<NotificationToastProps>;
  export default NotificationToast;
}
