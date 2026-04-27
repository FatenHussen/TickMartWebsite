export type CartItem = {
 id: number | string;
 name: string;
 description?: string;
 category?: string; // e.g.,"Shoes"
 /** For API: category id from product when cart_type is default */
 category_id?: number;
 store?: string; // e.g.,"Fashion Hub"
 size?: string; // e.g.,"Size: 8"
 color?: string; // e.g.,"Color: White"
 type?: string; // e.g.,"Type: Running"
 image: string;
 price: string;
 originalPrice?: string;
 savingsText?: string; // e.g.,"You save $17"
 quantity: number;
 subtotal: string; // calculated price * quantity
 modifiers?: string[]; // e.g.,"+ Extra cheese, + Garlic bread"
 storeId: number | string;
 hasFreeDelivery?: boolean;
 /** For API: product id from product details */
 productId?: number;
 /** For API: variant id when product has variants */
 variantId?: number;
 /** For API: shop id (same as storeId but typed for API) */
 shopId?: number;
 /** For API: selected attribute key-value for variant */
 selectedAttributes?: Record<string, string>;
 /** Numeric price per unit for recalculating subtotal */
 priceNumeric?: number;
 /** For API: shop_product_variant_id (from product variant, recipe item, or basket item) */
 shop_product_variant_id?: number;
 /** For API: cannot mix instant and non-instant delivery in same cart */
 is_instant_delivery?: boolean;
 /** Extra detail / add-on IDs for order preview & create (POST items[].extras) */
 extras?: number[];
};

export type CartType ="default"|"recipe"|"basket"|"schedule_admin_cart";

/** Schedule item from GET user/schedules */
export interface ScheduleItem {
 id: number;
 name: string;
 interval_days: number;
 discount_type:"percentage"|"fixed";
 discount_value: number;
 /** Omitted on some API responses; treat missing as active */
 is_active?: boolean;
}

export interface SchedulesResponse {
 status: boolean;
 message: string;
 data: {
 items: ScheduleItem[];
 pagination: {
 current_page: number;
 last_page: number;
 per_page: number;
 total: number;
 };
 };
}

/** Create scheduled basket payload for POST user/scheduled-baskets */
export interface CreateScheduledBasketPayload {
 name: string;
 category_id: number;
 schedule_id: number;
 is_active: boolean;
 start_date: string; // YYYY-MM-DD
 items: Array<{
 product_id: number;
 shop_product_variant_id: number;
 quantity: number;
 }>;
}

export type OrderPreviewItem = {
 shop_product_variant_id: number;
 quantity: number;
 extras?: number[];
};

/** GET user/orders/active response */
export interface ActiveOrderVariantAttribute {
 type: string;
 value: string;
 attribute: string;
}

export interface ActiveOrderItem {
 id: number;
 product_name: string;
 quantity: number;
 price: number;
 discount: number;
 status: string;
 variant_attributes?: Record<string, string> | ActiveOrderVariantAttribute[];
}

export interface ActiveOrderShopGroup {
 shop: string;
 lat: string;
 lng: string;
 items: ActiveOrderItem[];
}

export type ActiveOrderStatus = "pending" | "preparing" | "out_for_delivery" | "delivered";

export interface ActiveOrder {
 id: number;
 order_code: string | null;
 status: string;
 cart_type: string;
 is_instant_delivery: boolean;
 delivery_price: number;
 subtotal: number;
 total: number;
 total_with_delivery?: number;
 total_quantity: number;
 items: ActiveOrderItem[] | Record<string, ActiveOrderShopGroup>;
}

export interface ActiveOrderResponse {
 status: boolean;
 message: string;
 data: ActiveOrder | null;
}

export interface OrderPreviewPayload {
 coupon?: string;
 cart_type: CartType;
 address_id: number;
 is_instant_delivery: boolean;
 items: OrderPreviewItem[];
 recipe_id?: number;
 admin_basket_id?: number;
 admin_schedule_basket_id?: number;
 basket_schedule_id?: number;
 point_coupon_exchange_id?: number;
 point_free_delivery_exchange_id?: number;
 use_subscription_discount?: boolean;
 use_subscription_free_delivery?: boolean;
 promotion_id?: number;
 payment_method_id?: string | number;
}

export interface OrderCreatePayload {
 address_id: number;
 cart_type: CartType;
 is_instant_delivery: boolean;
 items: OrderPreviewItem[];
 coupon?: string;
 recipe_id?: number;
 admin_basket_id?: number;
 admin_schedule_basket_id?: number;
 basket_schedule_id?: number;
 affiliate_id?: string;
 payment_method_id?: string | number;
 notes?: string;
 point_coupon_exchange_id?: number;
 point_free_delivery_exchange_id?: number;
 use_subscription_discount?: boolean;
 use_subscription_free_delivery?: boolean;
 promotion_id?: number;
}

export interface CouponPreviewResponse {
 provided: boolean;
 valid: boolean;
 applied: boolean;
 code: string | null;
 discount: number;
 excluded_items: number[];
 fail_reasons: string[];
}

export interface AvailablePromotion {
 id: number;
 name: string | { ar?: string | null; en?: string | null };
 description?: string;
 discount_type?: string;
 discount_value?: number;
 min_order_amount?: number;
}

export interface NonDiscountPromotion {
 promotion_id: number;
 promotion_title: string;
 free_items: { shop_product_variant_id: number; free_quantity: number }[];
}

export interface OrderPreviewDiscounts {
 coupon_discount: number;
 coupon_discount_from_points: number;
 subscription_discount: number;
 promotion_discount: number;
 free_delivery_from_points: boolean;
 delivery_price: number;
 total_discount: number;
 excluded_items: number[];
}

/** Per-item price from order preview (when API returns item breakdown) */
export interface OrderPreviewItemPrice {
 shop_product_variant_id: number;
 quantity: number;
 price?: number;
 price_before_discount?: number;
}

/** Order item from preview API (orderItems format) */
export interface OrderPreviewOrderItem {
 shop_product_variant_id: number;
 product_name?: string;
  product_image?: string;
 quantity: number;
 price?: number | string;
unit_price?: number | string;
  product_discount?: number | string;
 price_after_discount?: number | string;
final_price?: number | string;
subtotal?: number | string;
  total?: number | string;
 variant?: string[];
  image?: string;
 shop_name?: string;
 extras?: number[];
}

export interface OrderPreviewResponse {
 // new3/8+ format: nested delivery object
 delivery?: { price: number };
 // Per-item breakdown - items (legacy) or orderItems (new API)
 items?: OrderPreviewItemPrice[] | Record<string, { items: OrderPreviewItemPrice[] }>;
 orderItems?: OrderPreviewOrderItem[];
 // All formats - can be number or string from API
 subtotal_before_discount: number | string;
 subtotal_after_product_discount: number | string;
 products_total_after_all_discounts?: number;
 total_quantity: number;
 total: number | string;
 // Discounts object (shape varies by API version — handled in normalization layer)
 discounts?: Record<string, unknown>;
 // Old format: root-level points/subscription objects
 point_exchanges?: unknown;
 subscription?: unknown;
 // Promotions
 available_promotions?: AvailablePromotion[];
 non_discount_promotions?: NonDiscountPromotion | null | unknown[];
 excluded_items?: number[];
 // Normalized fields (set by API layer for UI compatibility)
 subtotal: number;
 delivery_price: number;
 basket_discount_percent: number;
 basket_discount_amount: number;
 coupon?: CouponPreviewResponse;
 coupon_discount?: number;
 coupon_discount_from_points?: number;
 subscription_discount?: number;
 promotion_discount?: number;
 free_delivery_from_points?: boolean;
}

export type StoreInfo = {
 id: number | string;
 name: string;
 type: string;
 icon?: string;
 promotion?: string; // e.g.,"10% OFF on this store"
};

export type CartStoreGroup = {
 store: StoreInfo;
 image?: string;
 items: CartItem[];
 subtotal: string;
 deliveryFee: string; //"Free"or price
 deliveryIsFree: boolean;
};

export type OrderSummary = {
 numOfItems: number;
 subtotal: string;
 subtotalBeforeDiscount?: string;
 productDiscount?: string;
 shipping: string;
 shippingIsFree: boolean;
 storeDiscounts: string;
 basketDiscount?: string;
 tax: string;
 couponDiscount: string;
 subscriptionDiscount?: string;
 promotionDiscount?: string;
 excludedItemsCount?: number;
 total: string;
 couponFeedback?: {
 valid: boolean;
 applied: boolean;
 fail_reasons: string[];
 };
};

// Legacy type for backward compatibility
export type OrderSummaryLegacy = {
 itemsTotal: string;
 discounts: string; // negative value like"-$0.50"
 deliveryFees: string;
 serviceFee: string;
 total: string;
};

export type RepeatBasketOption ="schedule"|"one_time";

export type DeliveryFrequency =
 |"every_3_days"
 |"weekly"
 |"every_2_weeks"
 |"monthly";

export type OrderStatus =
 |"pending"
 |"preparing"
 |"out_for_delivery"
 |"delivered"
 |"cancelled";

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
 dateTime: string; // e.g.,"05 Feb 2025, 08:28 PM"
 status: OrderStatus;
 items: OrderItem[];
 additionalInfo?: string; // e.g.,"+1 more item from 1 store"
 deliveryAddress?: string; // e.g.,"Home, 123 Main Street"
 total: string;
 paymentMethod: string; // e.g.,"Visa ending 1234"
 refundStatus?: string; // For cancelled orders
 actions: {
 viewDetails?: boolean;
 trackOrder?: boolean;
 reorder?: boolean;
 addComplaint?: boolean;
 };
};

export type OrderFilter ="all"|"active"|"completed"|"cancelled";

export type OrderStatusStep =
 |"pending"
 |"preparing"
 |"out_for_delivery"
 |"delivered";

export type OrderDetails = {
 id: number | string;
 /** From API order_code; empty when null */
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
 method:"cash_on_delivery"|"credit_card"|"paypal";
 /** Display name from API (e.g."MTN Cash","Cash on Delivery") */
 name: string;
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
 icon?: string;
 type?:
 |"cash_on_delivery"
 |"syriatel_cash"
 |"mtn_cash"
 |"credit_card"
 |"paypal";
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
 subscriptionDiscount?: string;
 promotionDiscount?: string;
 pointsRedeemed: number;
 pointsValue: string;
 total: string;
 estimatedDelivery: string;
 pointsEarned: number;
 pointsBefore: number;
 pointsNewBalance: number;
 pointsSavings: string;
};
