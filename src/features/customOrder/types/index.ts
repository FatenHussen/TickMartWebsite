export type CustomOrderStatus =
  | "pending_pricing"
  | "waiting_approval"
  | "approved"
  | "cancelled"
  | "cancelled_by_admin";

export type PriceVarianceType = "percent" | "fixed" | string;

export interface CustomOrderActions {
  can_approve: boolean;
  can_cancel: boolean;
}

export interface CustomOrderImage {
  id?: number;
  url: string;
  path?: string;
}

export interface CustomOrderPricedItem {
  id?: number;
  product_name: string;
  quantity: number;
  price?: number;
  unit_price?: number;
  total_price?: number;
  price_after_discount?: number;
  /** Dual-currency / alternate display fields when present */
  price_syp?: number;
  price_usd?: number;
  prices?: Record<string, number>;
  is_external?: boolean;
  invoice_image?: string | null;
}

export interface CustomOrderLinkedOrder {
  id?: number;
  order_id?: number;
  order_code?: string;
  status?: string;
  items: CustomOrderPricedItem[];
  total: number;
  delivery_price: number;
  subtotal: number;
  has_external_items?: boolean;
  price_variance_type?: PriceVarianceType | null;
  price_variance_value?: number | null;
  approximate_total?: number | null;
  is_paid?: boolean;
}

export interface CustomOrderRequest {
  id: number;
  description: string;
  status: CustomOrderStatus | string;
  address_id?: number;
  payment_method_id?: number | null;
  expected_at?: string | null;
  rejection_reason?: string | null;
  images?: CustomOrderImage[] | string[];
  order?: CustomOrderLinkedOrder | null;
  actions?: CustomOrderActions;
  created_at?: string;
  updated_at?: string;
  approximate_total?: number | null;
}

export interface CustomOrderListParams {
  status?: string;
  page?: number;
  per_page?: number;
}

export interface CustomOrderListMeta {
  current_page: number;
  last_page?: number;
  per_page: number;
  total: number;
}

export interface CreateCustomOrderPayload {
  description: string;
  address_id: number | string;
  payment_method_id?: number | string | null;
  expected_at?: string | null;
  images?: File[];
}
