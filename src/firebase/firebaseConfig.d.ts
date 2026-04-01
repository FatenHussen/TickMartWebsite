declare module "@/firebase/firebaseConfig" {
  import type { FirebaseApp } from "firebase/app";
  import type { Messaging } from "firebase/messaging";

  export const app: FirebaseApp;
  export function getMessagingInstance(): Promise<Messaging | null>;
}
