/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCaWSRgKaqd0P__owf8MtZLhdInskytXKo",
  authDomain: "tikmool-app-3241.firebaseapp.com",
  projectId: "tikmool-app-3241",
  storageBucket: "tikmool-app-3241.firebasestorage.app",
  messagingSenderId: "786190897596",
  appId: "1:786190897596:web:5a3eaba811e0f45141dbb9",
});

const messaging = firebase.messaging();

function looksLikeImageUrl(url) {
  return /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(url || "");
}

messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  const mediaUrl = data.media_url || payload.notification?.image || "";
  const mediaType = data.media_type || "";
  const title = payload.notification?.title ?? data.title ?? "Tikmool";
  const options = {
    body: payload.notification?.body ?? data.body ?? "",
    icon: "/images/shared/logo.png",
    image:
      mediaType === "image" || looksLikeImageUrl(mediaUrl)
        ? mediaUrl
        : undefined,
    data: {
      targetPage: data.target_page || "",
    },
  };
  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetPage = event.notification?.data?.targetPage || "/";
  const targetUrl = new URL(targetPage || "/", self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          client.postMessage({
            type: "FCM_NOTIFICATION_CLICK",
            targetPage,
          });
          if (client.url === targetUrl) {
            return client.focus();
          }
        }
      }

      const matchingClient = clients[0];
      if (matchingClient && "navigate" in matchingClient) {
        matchingClient.postMessage({
          type: "FCM_NOTIFICATION_CLICK",
          targetPage,
        });
        return matchingClient.navigate(targetUrl).then(() => matchingClient.focus());
      }

      return self.clients.openWindow(targetUrl);
    })
  );
});
