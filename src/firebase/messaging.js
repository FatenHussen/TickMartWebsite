import { getToken, onMessage } from "firebase/messaging";
import { getMessagingInstance } from "./firebaseConfig";

const SERVICE_WORKER_PATH = "/firebase-messaging-sw.js";

function looksLikeImageUrl(url) {
  return /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(url || "");
}

function normalizeNotificationPayload(payload) {
  const data = payload?.data ?? {};
  const notification = payload?.notification ?? {};

  return {
    messageId: payload?.messageId ?? "",
    title: notification.title ?? data.title ?? "Tikmool",
    body: notification.body ?? data.body ?? "",
    target_page: data.target_page ?? "",
    emoji: data.emoji ?? "",
    media_type: data.media_type ?? "",
    type: data.type ?? "",
    is_fixed: String(data.is_fixed ?? "0"),
    media_url: data.media_url ?? notification.image ?? "",
    hasImage:
      data.media_type === "image" ||
      looksLikeImageUrl(data.media_url ?? notification.image ?? ""),
  };
}

async function registerMessagingServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    throw new Error("Service workers are not supported in this browser.");
  }

  const existingRegistration = await navigator.serviceWorker.getRegistration(
    SERVICE_WORKER_PATH
  );

  if (existingRegistration) return existingRegistration;

  return navigator.serviceWorker.register(SERVICE_WORKER_PATH);
}

async function requestNotificationPermission() {
  if (typeof window === "undefined" || typeof Notification === "undefined") {
    return "unsupported";
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "denied") {
      console.warn("[FCM] Notification permission denied.");
    }
    return permission;
  } catch (error) {
    console.warn("[FCM] Notification permission request failed:", error);
    return "default";
  }
}

async function getFcmToken() {
  if (typeof window === "undefined") return null;

  const messaging = await getMessagingInstance();
  if (!messaging) {
    console.warn("[FCM] Messaging is not supported in this browser.");
    return null;
  }

  if (typeof Notification === "undefined") {
    console.warn("[FCM] Notifications API is not available.");
    return null;
  }

  if (Notification.permission !== "granted") {
    console.warn("[FCM] Token skipped because permission is not granted.");
    return null;
  }

  try {
    const serviceWorkerRegistration =
      await registerMessagingServiceWorker();
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

    const token = await getToken(messaging, {
      vapidKey: vapidKey || undefined,
      serviceWorkerRegistration,
    });

    if (token) {
      console.log("[FCM] Token:", token);
    } else {
      console.warn("[FCM] No registration token available.");
    }

    return token || null;
  } catch (error) {
    console.error("[FCM] Failed to get token:", error);
    return null;
  }
}

async function listenToForegroundMessages(callback) {
  const messaging = await getMessagingInstance();
  if (!messaging) return () => {};

  return onMessage(messaging, (payload) => {
    const normalized = normalizeNotificationPayload(payload);

    console.log("[FCM] Received foreground message:", normalized.messageId);
    console.log("[FCM] Full payload:", payload);
    console.log("[FCM] target_page:", normalized.target_page);
    console.log("[FCM] emoji:", normalized.emoji);
    console.log("[FCM] media_type:", normalized.media_type);
    console.log("[FCM] type:", normalized.type);
    console.log("[FCM] is_fixed:", normalized.is_fixed);
    console.log("[FCM] media_url:", normalized.media_url);

    callback(normalized, payload);
  });
}

export {
  getFcmToken,
  listenToForegroundMessages,
  normalizeNotificationPayload,
  registerMessagingServiceWorker,
  requestNotificationPermission,
};
