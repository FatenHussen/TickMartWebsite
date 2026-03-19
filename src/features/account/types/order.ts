/** API response types for GET user/orders */

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
 order_code?: string;
 status: string;
 cart_type: string;
 is_instant_delivery: boolean;
 delivery_price: number;
 total: number;
 subtotal: number;
 total_with_delivery: number;
 total_quantity: number;
 basket_discount: number;
 coupon_discount: number | null;
 created_at: string;
 assigned_by: string | null;
 affiliate_rate: number | null;
 affiliate_source: string | null;
 affiliate_commission: number;
 user: OrderListUser;
}

export interface OrdersListPagination {
 current_page: number;
 last_page: number;
 per_page: number;
 total: number;
}

export interface OrdersListResponse {
 status: boolean;
 message: string;
 data: {
 items: OrderListItem[];
 pagination: OrdersListPagination;
 };
}

/** API response types for GET user/orders/:id */

export interface OrderDetailVariantAttribute {
 attribute: string;
 value: string;
}

export interface OrderDetailItem {
 id: number;
 product_id?: number; // optional; when present used for rating
 product_name: string;
 variant_attributes: OrderDetailVariantAttribute[];
 quantity: number;
 price: number;
 discount: number;
 status: string;
}

export interface OrderDetailUser {
 id: number;
 name: string;
 email: string;
 phone: string | null;
 created_at: string;
}

export interface OrderDetailData {
 id: number;
 status: string;
 cart_type: string;
 is_instant_delivery: number;
 delivery_price: number;
 total: number;
 subtotal: number;
 total_quantity: number;
 discount_source: string | null;
 basket_discount: number;
 coupon_discount: number | null;
 created_at: string;
 user: OrderDetailUser;
 items: OrderDetailItem[];
}

export interface OrderDetailResponse {
 status: boolean;
 message: string;
 data: OrderDetailData;
}
