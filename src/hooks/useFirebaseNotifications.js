import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFcmToken,
  listenToForegroundMessages,
  requestNotificationPermission,
} from "@/firebase/messaging";

const AUTO_DISMISS_MS = 6000;

export default function useFirebaseNotifications() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [permission, setPermission] = useState(
    typeof Notification === "undefined" ? "unsupported" : Notification.permission
  );
  const [token, setToken] = useState(null);
  const timeoutRef = useRef(null);

  const dismissNotification = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setNotification(null);
  }, []);

  const showNotification = useCallback(
    (nextNotification) => {
      dismissNotification();
      setNotification(nextNotification);
      timeoutRef.current = window.setTimeout(() => {
        setNotification(null);
        timeoutRef.current = null;
      }, AUTO_DISMISS_MS);
    },
    [dismissNotification]
  );

  const navigateToTarget = useCallback(
    (targetPage) => {
      if (!targetPage) return;
      navigate(targetPage);
    },
    [navigate]
  );

  const handleNotificationClick = useCallback(() => {
    if (!notification?.target_page) {
      dismissNotification();
      return;
    }

    navigateToTarget(notification.target_page);
    dismissNotification();
  }, [dismissNotification, navigateToTarget, notification]);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe = () => {};

    async function initializeNotifications() {
      try {
        const nextPermission = await requestNotificationPermission();
        if (!isMounted) return;

        setPermission(nextPermission);

        if (nextPermission !== "granted") return;

        const nextToken = await getFcmToken();
        if (!isMounted) return;

        setToken(nextToken);

        unsubscribe = await listenToForegroundMessages((payload) => {
          showNotification(payload);
        });
      } catch (error) {
        console.error("[FCM] Failed to initialize notifications:", error);
      }
    }

    initializeNotifications();

    async function refreshTokenOnFocus() {
      if (Notification.permission !== "granted") return;
      const refreshedToken = await getFcmToken();
      if (isMounted) {
        setToken(refreshedToken);
      }
    }

    function handleServiceWorkerMessage(event) {
      if (event.data?.type !== "FCM_NOTIFICATION_CLICK") return;
      navigateToTarget(event.data.targetPage || "/");
    }

    window.addEventListener("focus", refreshTokenOnFocus);
    navigator.serviceWorker?.addEventListener("message", handleServiceWorkerMessage);

    return () => {
      isMounted = false;
      unsubscribe();
      window.removeEventListener("focus", refreshTokenOnFocus);
      navigator.serviceWorker?.removeEventListener("message", handleServiceWorkerMessage);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [navigateToTarget, showNotification]);

  return {
    dismissNotification,
    handleNotificationClick,
    navigateToTarget,
    notification,
    permission,
    token,
  };
}
