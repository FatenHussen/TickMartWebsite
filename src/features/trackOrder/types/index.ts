export type TrackOrderStatus ="pending"|"preparing"|"out_for_delivery"|"delivered";

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
 eta: string;
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
  totalQuantity: number;
 paymentMethod: string;
 itemsSubtotal: string;
  basketDiscount?: string;
  couponDiscount?: string;
 deliveryFee: string;
 deliveryIsFree: boolean;
 totalAmount: string;
 driver?: Driver;
 destination: {
 lat: number;
 lng: number;
 address: string;
 };
 eta: string;
};

// --- API response types for GET /user/orders/:id ---

export interface TrackOrderApiVariantAttribute {
 type: string;
 value: string;
 attribute: string;
}

export interface TrackOrderApiItem {
 id: number;
 product_name: string;
 quantity: number;
 price: number;
 discount: number;
 status: string;
 variant_attributes: TrackOrderApiVariantAttribute[];
}

export interface TrackOrderApiShopGroup {
 shop: string;
 lat: string;
 lng: string;
 items?: TrackOrderApiItem[];
}

export interface TrackOrderApiDriver {
 name: string;
 image?: string;
 vehicle_type: string;
 phone_number: string;
 vehicle: string;
 plate_number: string;
 lat: number;
 lng: number;
 eta: string;
}

export interface TrackOrderApiAddress {
 id: number;
 label: string;
 street_name: string;
 nearest_landmark: string;
 building_number: string;
 floor_apartment: string;
 contact_phone: string;
 lat: number;
 lng: number;
 is_default: boolean;
 area: string;
 created_at: string;
}

export interface TrackOrderApiData {
 id: number;
 order_code: string | null;
 status: string;
 cart_type: string;
 is_instant_delivery: boolean;
 delivery_price: number;
 subtotal: number;
 total: number;
 total_quantity: number;
 basket_discount?: number;
 coupon_discount?: number | null;
 assigned_by: string | null;
 created_at: string;
 user: {
 id: number;
 name: string;
 email: string;
 phone: string;
 };
 driver: TrackOrderApiDriver | null;
 user_address: TrackOrderApiAddress;
 payment_method?: {
 id: number;
 name: string;
 } | null;
 items?: Record<string, TrackOrderApiShopGroup> | null;
}

export interface TrackOrderApiResponse {
 status: boolean;
 message: string;
 data: TrackOrderApiData;
}

