export type TrackOrderStatus = "pending" | "preparing" | "out_for_delivery" | "delivered";

export type PaymentMethod = "cash_on_delivery" | "credit_card" | "paypal";

export type Driver = {
  name: string;
  image?: string;
  vehicleType: string;
  phoneNumber: string;
  vehicle: string;
  plateNumber: string;
  location: {
    lat: number;
    lng: number;
  };
  eta: string; // e.g., "12 min"
};

export type OrderItem = {
  id: number | string;
  name: string;
  quantity: number;
  price: string;
};

export type OrderLocationUpdate = {
  orderId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
  ts?: number;
};

export type TrackOrderData = {
  orderNumber: string;
  status: TrackOrderStatus;
  store: string;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  itemsSubtotal: string;
  deliveryFee: string;
  deliveryIsFree: boolean;
  totalAmount: string;
  driver: Driver;
  destination: {
    lat: number;
    lng: number;
    address: string;
  };
  eta: string; // e.g., "15 min"
};

