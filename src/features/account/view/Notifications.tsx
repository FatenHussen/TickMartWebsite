import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { app } from "@/firebase";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { Button } from "@/shared/ui";

const FCM_TOKEN_KEY = "fcm_token";

export default function Notifications() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [permission, setPermission] = useState<NotificationPermission | null>(
    typeof Notification !== "undefined" ? Notification.permission : null
  );
  const [fcmSupported, setFcmSupported] = useState<boolean | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(FCM_TOKEN_KEY);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleEnableNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      if (typeof Notification === "undefined") {
        setFcmSupported(false);
        return;
      }
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "denied") return;
      if (result !== "granted") return;

      const supported = await isSupported();
      if (!supported) {
        setFcmSupported(false);
        return;
      }
      setFcmSupported(true);

      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        setToken("");
        return;
      }
      const messaging = getMessaging(app);
      const fcmToken = await getToken(messaging, { vapidKey });
      if (fcmToken) {
        setToken(fcmToken);
        try {
          localStorage.setItem(FCM_TOKEN_KEY, fcmToken);
        } catch {
          // ignore
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {t("account.notificationsPage.title")}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("account.notificationsPage.description")}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        {fcmSupported === false && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
            {t("account.notificationsPage.notSupported")}
          </p>
        )}

        {permission === "denied" && (
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">
            {t("account.notificationsPage.denied")}
          </p>
        )}

        {permission === "granted" && !token && !import.meta.env.VITE_FIREBASE_VAPID_KEY && (
          <p className="text-sm text-green-600 dark:text-green-400 mb-4">
            {t("account.notificationsPage.enabled")}
          </p>
        )}

        {permission === "granted" && (token || import.meta.env.VITE_FIREBASE_VAPID_KEY) && (
          <p className="text-sm text-green-600 dark:text-green-400 mb-4">
            {t("account.notificationsPage.tokenReady")}
          </p>
        )}

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
        )}

        {permission !== "granted" && fcmSupported !== false && (
          <Button
            type="button"
            variant="primary"
            onClick={handleEnableNotifications}
            disabled={loading}
          >
            {loading
              ? t("common.loading", "Loading...")
              : t("account.notificationsPage.enableNotifications")}
          </Button>
        )}
      </div>
    </div>
  );
}
