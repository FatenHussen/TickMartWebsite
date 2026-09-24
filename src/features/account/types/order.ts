/** API response types for GET user/orders */

import type { ApiDualCurrencies } from "@/shared/lib/formatApiPrice";

export interface OrderListUser {
 id: number;
 name: string;
 email: string;
 phone: string | null;
 affiliate: {
 is_affiliate: boolean;
 affiliate_approved: boolean;
 affiliate_id: string | null;
 };
 created_at: string;
}

export interface OrderListItem {
 id: number;
 order_code?: string | null;
 status?: string;
 status_label?: string | null;
 cart_type?: string;
 is_instant_delivery?: boolean;
 delivery_price?: number | string | null;
 total?: number | string | null;
 subtotal?: number | string | null;
 total_with_delivery?: number | string | null;
 total_quantity?: number | null;
 basket_discount?: number | null;
 coupon_discount?: number | null;
 created_at?: string;
 assigned_by?: string | null;
 affiliate_rate?: number | null;
 affiliate_source?: string | null;
 affiliate_commission?: number;
 user?: OrderListUser;
 payment_method?: OrderDetailPaymentMethod | null;
 currency?: string | null;
 currency_symbol?: string | null;
 delivery_price_formatted?: string | null;
 delivery_price_currencies?: ApiDualCurrencies | null;
 total_formatted?: string | null;
 total_currencies?: ApiDualCurrencies | null;
 total_with_delivery_formatted?: string | null;
 total_with_delivery_currencies?: ApiDualCurrencies | null;
}

export interface OrdersListPagination {
 current_page: number;
 last_page: number;
 per_page: number;
 total: number;
}

export interface OrdersListResponse {
 ok?: boolean;
 status?: boolean;
 msg?: string;
 message?: string;
 data?:
  | OrderListItem[]
  | {
     items?: OrderListItem[];
     data?: OrderListItem[];
     pagination?: OrdersListPagination;
    };
 items?: OrderListItem[];
 pagination?: OrdersListPagination;
 meta?: OrdersListPagination;
 current_page?: number;
 last_page?: number;
}

/** API response types for GET user/orders/:id */

export interface OrderDetailVariantAttribute {
 attribute?: string;
 value: string;
 type?: string;
}

export interface OrderDetailItem {
 id: number;
 product_id?: number; // optional; when present used for rating
 product_name: string;
 variant_attributes?: Record<string, string> | OrderDetailVariantAttribute[];
 quantity: number;
 price: number;
 discount: number;
 price_after_discount?: number;
 extras_price?: number;
 final_price_with_extras?: number;
 status: string;
 extras?: Array<{
 id?: number;
 name?: string;
 price?: number;
 quantity?: number;
 }>;
}

export interface OrderDetailUser {
 id: number;
 name: string;
 email: string;
 phone: string | null;
 area_id?: number | null;
 affiliate?: {
 is_affiliate: boolean;
 affiliate_approved: boolean;
 affiliate_id: string | null;
 };
 created_at: string;
}

export interface OrderDetailAffiliate {
 affiliate_rate: string;
 affiliate_source: string;
 affiliate_commission: number;
}

export interface OrderDetailTimestamps {
 pending_at?: string | null;
 preparing_at?: string | null;
 out_delivery_at?: string | null;
 delivered_at?: string | null;
}

export interface OrderDetailAddress {
 id: number;
 label: string;
 street_name: string;
 nearest_landmark: string;
 building_number?: string;
 floor_apartment?: string;
 contact_phone?: string;
 lat: number;
 lng: number;
 is_default: boolean;
 area?: string | { en?: string; ar?: string } | null;
 created_at: string;
}

export interface OrderDetailPaymentMethod {
 id: number;
 name: string;
 icon?: string | null;
}

export interface OrderDetailData {
 id: number;
 order_code?: string | null;
 status: string;
 status_label?: string | null;
 cart_type: string;
 is_instant_delivery: boolean;
 delivery_price: number;
 total: number;
 subtotal: number;
 total_quantity: number;
 discount_source: string | null;
 basket_discount: number;
 coupon_discount: number | null;
 promotion_discount?: string | number | null;
 subscription_discount?: string | number | null;
 coupon_discount_from_points?: string | number | null;
 free_delivery_from_points?: number;
 use_coupon_exchange_id?: number | null;
 use_free_delivery_exchange_id?: number | null;
 subscription_free_delivery?: boolean;
 assigned_by?: string | null;
 created_at: string;
 affiliate?: OrderDetailAffiliate | null;
 timestamps?: OrderDetailTimestamps;
 user?: OrderDetailUser;
 driver?: {
 id: number;
 name: string;
 phone: string;
 status: string;
 image: string | null;
 rate_per_order: number;
 is_active: boolean;
 average_rating: number;
 total_orders: number;
 completed_orders: number;
 total_earnings: number;
 created_at: string;
 } | null;
 user_address?: OrderDetailAddress | null;
 payment_method?: OrderDetailPaymentMethod | null;
 items?: OrderDetailItem[] | Record<string, { shop?: string; items?: OrderDetailItem[] }>;
 delivery_price_formatted?: string | null;
 delivery_price_currencies?: ApiDualCurrencies | null;
 total_formatted?: string | null;
 total_currencies?: ApiDualCurrencies | null;
 subtotal_formatted?: string | null;
 subtotal_currencies?: ApiDualCurrencies | null;
}

export interface OrderDetailResponse {
 ok?: boolean;
 status?: boolean;
 msg?: string;
 message?: string;
 data?: OrderDetailData;
}
