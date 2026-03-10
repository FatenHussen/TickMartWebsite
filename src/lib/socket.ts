import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/auth";

const SOCKET_URL = "https://tikmool-ws.octopus-software.online";

export type OrderLocationPayload = {
  orderId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
  ts?: number;
};

type OrderLocationCallback = (location: { lat: number; lng: number }) => void;

const orderLocationSubscribers = new Map<string, OrderLocationCallback>();

function notifyOrderLocationSubscribers(data: OrderLocationPayload) {
  const key = String(data.orderId);
  const callback = orderLocationSubscribers.get(key);
  if (callback) {
    callback({ lat: data.lat, lng: data.lng });
  }
}

let socket: Socket | null = null;

export async function getSocket(): Promise<Socket> {
  if (!socket) {
    const token = useAuthStore.getState().getToken();

    socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("order:location", (data: OrderLocationPayload) => {
      notifyOrderLocationSubscribers(data);
    });

    socket.on("order:joined", (data) => {
      console.log("order:joined:", data);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  }

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function reconnectSocket(): void {
  disconnectSocket();
  getSocket();
}

export async function joinOrderRoom(orderId: number): Promise<void> {
  if (socket) {
    socket.emit("order:join", { orderId: orderId });
  }
}

export function subscribeOrderLocation(
  orderId: number | string,
  callback: OrderLocationCallback
): () => void {
  const key = String(orderId);
  orderLocationSubscribers.set(key, callback);
  return () => {
    orderLocationSubscribers.delete(key);
  };
}

export function useOrderLocation(
  orderId: string | number | null
): { lat: number; lng: number } | null {
  const [liveLocation, setLiveLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (orderId == null || orderId === "") return;
    const unsubscribe = subscribeOrderLocation(orderId, (loc) =>
      setLiveLocation(loc)
    );
    return unsubscribe;
  }, [orderId]);

  return liveLocation;
}
