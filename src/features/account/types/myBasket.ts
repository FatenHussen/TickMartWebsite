// ==================== My Basket Types (user/my-baskets API) ====================
export type MyBasketType = "subscription" | "custom" | "user-schedule";

export interface MyBasketSchedule {
  id: number;
  title: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  number_of_days: number;
}

export interface MyBasketCategory {
  id: number;
  name: string;
}

/** Common fields for all basket types */
export interface MyBasketBase {
  id: number;
  name: string;
  image: string | null;
  basket_type: MyBasketType;
  is_active: boolean;
  num_varieties: number;
  original_price: number;
  discount_value: string;
  discount_type: "percentage" | "fixed";
  discount_amount: number;
  final_price: number;
  schedules: MyBasketSchedule[];
}

/** User-schedule basket (from scheduled-baskets) */
export interface MyBasketUserSchedule extends MyBasketBase {
  basket_type: "user-schedule";
  start_date: string;
  next_run_date: string;
  category?: never;
}

/** Subscription basket */
export interface MyBasketSubscription extends MyBasketBase {
  basket_type: "subscription";
  category: MyBasketCategory;
  offer_ends_at: string | null;
  rating: string | number;
  num_sold: number;
  is_on_offer: boolean;
}

/** Custom basket */
export interface MyBasketCustom extends MyBasketBase {
  basket_type: "custom";
  category: MyBasketCategory;
  offer_ends_at: string | null;
  rating: string | number;
  num_sold: number;
  is_on_offer: boolean;
}

export type MyBasketListItem =
  | MyBasketUserSchedule
  | MyBasketSubscription
  | MyBasketCustom;

export interface MyBasketsResponse {
  status: boolean;
  message: string;
  data: MyBasketListItem[];
}
