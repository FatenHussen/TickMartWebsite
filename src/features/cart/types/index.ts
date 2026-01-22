export type CartItem = {
  id: number | string;
  name: string;
  description?: string;
  category?: string; // e.g., "Shoes"
  store?: string; // e.g., "Fashion Hub"
  size?: string; // e.g., "Size: 8"
  color?: string; // e.g., "Color: White"
  type?: string; // e.g., "Type: Running"
  image: string;
  price: string;
  originalPrice?: string;
  savingsText?: string; // e.g., "You save $17"
  quantity: number;
  subtotal: string; // calculated price * quantity
  modifiers?: string[]; // e.g., "+ Extra cheese, + Garlic bread"
  storeId: number | string;
  hasFreeDelivery?: boolean;
};

export type StoreInfo = {
  id: number | string;
  name: string;
  type: string;
  icon?: string;
  promotion?: string; // e.g., "10% OFF on this store"
};

export type CartStoreGroup = {
  store: StoreInfo;
  image?: string;
  items: CartItem[];
  subtotal: string;
  deliveryFee: string; // "Free" or price
  deliveryIsFree: boolean;
};

export type OrderSummary = {
  numOfItems: number;
  subtotal: string;
  shipping: string; // "Free" or price
  shippingIsFree: boolean;
  storeDiscounts: string; // negative value like "-$67.00"
  tax: string; // e.g., "10%"
  couponDiscount: string; // e.g., "$0.00"
  total: string;
};

// Legacy type for backward compatibility
export type OrderSummaryLegacy = {
  itemsTotal: string;
  discounts: string; // negative value like "-$0.50"
  deliveryFees: string;
  serviceFee: string;
  total: string;
};

export type RepeatBasketOption = "schedule" | "one_time";

export type DeliveryFrequency =
  | "every_3_days"
  | "weekly"
  | "every_2_weeks"
  | "monthly";

export type OrderStatus =
  | "pending"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  name: string;
  category: string;
  store: string;
  quantity: number;
  price: string;
};

export type Order = {
  id: number | string;
  orderNumber: string;
  dateTime: string; // e.g., "05 Feb 2025, 08:28 PM"
  status: OrderStatus;
  items: OrderItem[];
  additionalInfo?: string; // e.g., "+1 more item from 1 store"
  deliveryAddress?: string; // e.g., "Home, 123 Main Street"
  total: string;
  paymentMethod: string; // e.g., "Visa ending 1234"
  refundStatus?: string; // For cancelled orders
  actions: {
    viewDetails?: boolean;
    trackOrder?: boolean;
    reorder?: boolean;
    addComplaint?: boolean;
  };
};

export type OrderFilter = "all" | "active" | "completed" | "cancelled";

export type OrderStatusStep =
  | "pending"
  | "preparing"
  | "out_for_delivery"
  | "delivered";

export type OrderDetails = {
  id: number | string;
  orderNumber: string;
  status: OrderStatusStep;
  items: CartItem[];
  priceSummary: {
    numOfItems: number;
    subtotal: string;
    shipping: string;
    shippingIsFree: boolean;
    storeDiscounts: string;
    tax: string;
    couponDiscount: string;
    total: string;
  };
  delivery: {
    fullName: string;
    phoneNumber: string;
    address: string;
    eta: string;
    message?: string;
  };
  payment: {
    method: "cash_on_delivery" | "credit_card" | "paypal";
    description: string;
  };
};

export type DeliveryAddress = {
  id: number | string;
  fullName: string;
  phoneNumber: string;
  address: string;
  tags?: string[];
  isDefault?: boolean;
};

export type PaymentMethodOption = {
  id: string;
  name: string;
  description: string;
  type:
    | "cash_on_delivery"
    | "syriatel_cash"
    | "mtn_cash"
    | "credit_card"
    | "paypal";
};

export type CheckoutOrderSummary = {
  items: CartItem[];
  itemsTotal: string;
  subtotal: string;
  deliveryFees: string;
  storeDiscounts: string;
  couponDiscount: string;
  total: string;
  estimatedDelivery?: string;
  deliveryNote?: string;
};

export type ReviewOrderSummary = {
  items: CartItem[];
  numOfItems: number;
  subtotal: string;
  shipping: string;
  discounts: string;
  tax: string;
  couponDiscount: string;
  pointsRedeemed: number;
  pointsValue: string;
  total: string;
  estimatedDelivery: string;
  pointsEarned: number;
  pointsBefore: number;
  pointsNewBalance: number;
  pointsSavings: string;
};
