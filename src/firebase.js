import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCaWSRgKaqd0P__owf8MtZLhdInskytXKo",
  authDomain: "tikmool-app-3241.firebaseapp.com",
  projectId: "tikmool-app-3241",
  storageBucket: "tikmool-app-3241.firebasestorage.app",
  messagingSenderId: "786190897596",
  appId: "1:786190897596:web:5a3eaba811e0f45141dbb9",
  measurementId: "G-BFM25BQN9N",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const SERVICE_WORKER_PATH = "/firebase-messaging-sw.js";
const DEFAULT_NOTIFICATION_ICON = "/images/shared/logo.jpg";

function looksLikeImageUrl(url) {
  return /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(url);
}

function resolveNotificationContent(payload) {
  const data = payload?.data ?? {};
  const notification = payload?.notification ?? {};
  const mediaUrl = data.media_url ?? notification.image ?? "";
  const mediaType = data.media_type ?? "";
  const image =
    mediaType === "image" || looksLikeImageUrl(mediaUrl) ? mediaUrl : undefined;

  return {
    title: notification.title ?? data.title ?? "Tikmool",
    options: {
      body: notification.body ?? data.body ?? "",
      icon: notification.icon ?? DEFAULT_NOTIFICATION_ICON,
      image,
      data: {
        targetPage: data.target_page ?? "",
        rawPayload: payload,
      },
    },
  };
}

async function getMessagingServiceWorkerRegistration() {
  if (!("serviceWorker" in navigator)) return null;

  const existingRegistration = await navigator.serviceWorker.getRegistration(
    SERVICE_WORKER_PATH
  );

  if (existingRegistration) return existingRegistration;

  return navigator.serviceWorker.register(SERVICE_WORKER_PATH);
}

/**
 * Request the FCM token from the browser.
 * Returns null when messaging is not supported or permission denied.
 */
async function requestFcmToken() {
  try {
    const supported = await isSupported();
    if (!supported) return null;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const messaging = getMessaging(app);
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    const serviceWorkerRegistration =
      await getMessagingServiceWorkerRegistration();

    const token = await getToken(messaging, {
      vapidKey: vapidKey || undefined,
      serviceWorkerRegistration: serviceWorkerRegistration ?? undefined,
    });

    return token || null;
  } catch (err) {
    console.error("[FCM] Failed to get token:", err);
    return null;
  }
}

async function setupForegroundMessageListener() {
  const supported = await isSupported();
  if (!supported || typeof Notification === "undefined") {
    return () => {};
  }

  const messaging = getMessaging(app);

  return onMessage(messaging, async (payload) => {
    if (Notification.permission !== "granted") return;

    const { title, options } = resolveNotificationContent(payload);
    const registration = await getMessagingServiceWorkerRegistration();

    if (registration?.showNotification) {
      await registration.showNotification(title, options);
      return;
    }

    new Notification(title, options);
  });
}

export { app, analytics, requestFcmToken, setupForegroundMessageListener };
