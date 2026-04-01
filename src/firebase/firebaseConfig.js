import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCaWSRgKaqd0P__owf8MtZLhdInskytXKo",
  authDomain: "tikmool-app-3241.firebaseapp.com",
  projectId: "tikmool-app-3241",
  storageBucket: "tikmool-app-3241.firebasestorage.app",
  messagingSenderId: "786190897596",
  appId: "1:786190897596:web:5a3eaba811e0f45141dbb9",
  measurementId: "G-BFM25BQN9N",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let messagingInstancePromise = null;

async function getMessagingInstance() {
  if (messagingInstancePromise) return messagingInstancePromise;

  messagingInstancePromise = (async () => {
    if (typeof window === "undefined") return null;

    try {
      const supported = await isSupported();
      if (!supported) return null;
      return getMessaging(app);
    } catch (error) {
      console.warn("[FCM] Messaging initialization failed:", error);
      return null;
    }
  })();

  return messagingInstancePromise;
}

export { app, getMessagingInstance };
