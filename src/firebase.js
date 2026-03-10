import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

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

    const token = await getToken(messaging, {
      vapidKey: vapidKey || undefined,
      serviceWorkerRegistration: await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      ),
    });

    return token || null;
  } catch (err) {
    console.error("[FCM] Failed to get token:", err);
    return null;
  }
}

export { app, analytics, requestFcmToken };
