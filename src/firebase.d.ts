declare module"@/firebase"{
 export const app: import("firebase/app").FirebaseApp;
 export const analytics: import("firebase/analytics").Analytics;
 export function requestFcmToken(): Promise<string | null>;
}
