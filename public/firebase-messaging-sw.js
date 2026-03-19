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

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? "Tikmool";
  const options = {
    body: payload.notification?.body ?? "",
    icon: "/images/shared/logo.jpg",
  };
  self.registration.showNotification(title, options);
});
