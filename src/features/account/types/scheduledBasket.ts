import type { PaginationData } from "@/shared/types/pagination";

// ==================== Scheduled Basket List Item ====================
export interface ScheduledBasketListItem {
  id: number;
  name: string;
  category: string;
  image: string | null;
  num_varieties: number;
  original_price: number;
  discount_value: string;
  discount_type: "percentage" | "fixed";
  discount_amount: number;
  final_price: number;
  next_run_date: string;
}

// ==================== Scheduled Basket Detail Types ====================
export interface ScheduledBasketSchedule {
  id: number;
  name: string;
  interval_days: number;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  is_active: boolean;
}

export interface ScheduledBasketProduct {
  id: number;
  name: string;
  image: string;
}

export interface ScheduledBasketDetailItem {
  id: number;
  quantity: number;
  price: number;
  product: ScheduledBasketProduct;
  variant: {
    name: string[];
  };
}

export interface ScheduledBasketDetail {
  id: number;
  name: string;
  is_active: boolean;
  start_date: string;
  next_run_date: string;
  schedule: ScheduledBasketSchedule;
  category: string;
  items: ScheduledBasketDetailItem[];
}

// ==================== API Response Types ====================
export interface ScheduledBasketsResponse {
  status: boolean;
  message: string;
  data: {
    items: ScheduledBasketListItem[];
    pagination: PaginationData;
  };
}

export interface ScheduledBasketDetailResponse {
  status: boolean;
  message: string;
  data: ScheduledBasketDetail;
}

// ==================== Update Payload ====================
export interface UpdateScheduledBasketItemPayload {
  id?: number;
  product_id: number;
  shop_product_variant_id: number;
  quantity: number;
}

export interface UpdateScheduledBasketPayload {
  name: string;
  next_run_date: string;
  items: UpdateScheduledBasketItemPayload[];
}
