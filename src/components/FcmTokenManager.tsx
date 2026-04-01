import { useEffect, useRef } from"react";
import axios from"axios";
import { requestFcmToken, setupForegroundMessageListener } from"@/firebase";
import { useAuthStore } from"@/store/auth";

const DEVICE_ID_KEY ="fcm_device_id";
const LAST_TOKEN_KEY ="fcm_last_token";

const BASE_URL = import.meta.env.DEV
 ?"https://tickdash.tickmartsy.com/api"
 :"https://tickdash.tickmartsy.com/api/";

function getOrCreateDeviceId(): string {
 let id = localStorage.getItem(DEVICE_ID_KEY);
 if (!id) {
 id = `web_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
 localStorage.setItem(DEVICE_ID_KEY, id);
 }
 return id;
}

async function sendTokenToServer(
 fcmToken: string,
 deviceId: string,
 authToken: string
) {
 try {
 await axios.post(
 `${BASE_URL}/user/auth/store-token`,
 { deviceId, fcmToken },
 {
 headers: {
 Authorization: `Bearer ${authToken}`,
"Content-Type":"application/json",
 Accept:"application/json",
 },
 }
 );
 } catch {
 // Silently fail - will retry next time the app opens
 }
}

export default function FcmTokenManager() {
 const ran = useRef(false);
 const unsubscribeRef = useRef<null | (() => void)>(null);
 const token = useAuthStore((s) => s.token);

 useEffect(() => {
 if (!token) return;
 if (ran.current) return;
 ran.current = true;

 (async () => {
 const fcmToken = await requestFcmToken();
 if (!fcmToken) return;

 const deviceId = getOrCreateDeviceId();
 const lastToken = localStorage.getItem(LAST_TOKEN_KEY);

 if (lastToken !== fcmToken) {
 localStorage.setItem(LAST_TOKEN_KEY, fcmToken);
 }

 await sendTokenToServer(fcmToken, deviceId, token);
 })();
 }, [token]);

 useEffect(() => {
 if (!token) return;

 let mounted = true;

 (async () => {
 if (unsubscribeRef.current) return;
 const unsubscribe = await setupForegroundMessageListener();
 if (!mounted) {
 unsubscribe();
 return;
 }
 unsubscribeRef.current = unsubscribe;
 })();

 return () => {
 mounted = false;
 unsubscribeRef.current?.();
 unsubscribeRef.current = null;
 };
 }, [token]);

 return null;
}
