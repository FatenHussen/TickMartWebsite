import { useCallback, useEffect, useState } from "react";
import { isSupported } from "firebase/messaging";
import { requestFcmToken } from "@/firebase";

export function useBrowserPushSettings() {
  const [permission, setPermission] = useState<NotificationPermission | null>(() =>
    typeof Notification !== "undefined" ? Notification.permission : null,
  );
  const [fcmSupported, setFcmSupported] = useState<boolean | null>(null);
  const [isRequestingToken, setIsRequestingToken] = useState(false);

  useEffect(() => {
    isSupported()
      .then(setFcmSupported)
      .catch(() => setFcmSupported(false));
  }, []);

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPushPermission = useCallback(async () => {
    setIsRequestingToken(true);
    try {
      const token = await requestFcmToken();
      if (token) {
        setPermission("granted");
        setFcmSupported(true);
      } else if (typeof Notification !== "undefined") {
        setPermission(Notification.permission);
      }
    } catch {
      // intentional: keep UI stable if FCM fails
    } finally {
      setIsRequestingToken(false);
    }
  }, []);

  return {
    permission,
    fcmSupported,
    isRequestingToken,
    requestPushPermission,
  };
}
