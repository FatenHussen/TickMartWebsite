import type { PaginationData } from"@/shared/types/pagination";

// ==================== Basket Badge Types ====================
export interface BasketBadge {
 id: number;
 name: string;
 color: string;
 position:"top"|"bottom"| null;
}

// ==================== Basket Types ====================
export type DiscountType ="percentage"|"fixed";

export interface BasketItem {
 id: number;
 name: string;
 category: string;
 image: string;
 num_varieties: number;
 offer_ends_at: string;
 original_price: number;
 discount_value: string;
 discount_type: DiscountType;
 discount_amount: number;
 final_price: number;
 final_price_formatted?: string;
 rating: number;
 saving: number;
 saving_formatted?: string;
 num_sold: number;
 is_on_offer: boolean;
 next_delivery_date: string | null;
 delivery_price: number;
 currency_symbol?: string;
 // Optional fields that may exist in some responses
 desc?: string | null;
 top_badges?: BasketBadge[];
 bottom_badges?: BasketBadge[];
 items_count?: number;
 is_favorite?: boolean;
}

// ==================== Basket Detail Item Types ====================
export interface BasketDetailProduct {
 id: number;
 name: string;
 image: string;
}

export interface BasketDetailAlternative {
 product_id: number;
 shop_product_variant_id: number;
 name: string;
 image_url: string;
 price: number;
}

export interface BasketDetailItem {
 id: number;
 quantity: number;
 unit_price: number;
 subtotal: number;
 is_required: boolean;
 is_extra: boolean;
 min_quantity: number;
 max_quantity: number;
 can_adjust: boolean;
 shop_product_variant_id: number;
 product: BasketDetailProduct;
 variant: (string | number)[];
 alternatives: BasketDetailAlternative[];
}

export interface BasketSchedule {
 id: number;
 title: string;
 discount_type: DiscountType;
 discount_value: number;
 number_of_days: number;
}

export interface BasketDetailsData {
 id: number;
 name: string;
 image: string;
 num_varieties: number;
 offer_ends_at: string | null;
 original_price: number;
 discount_value: string;
 discount_type: DiscountType;
 discount_amount: number;
 final_price: number;
 rating: string | number;
 num_sold: number;
 is_on_offer: boolean;
 saving?: number;
 items: BasketDetailItem[];
 extras: BasketDetailItem[];
 schedules?: BasketSchedule[];
 next_delivery_date?: string | null;
 delivery_price?: number;
}

// ==================== API Response Types ====================
export interface BasketsResponse {
 status: boolean;
 message: string;
 data: {
 items: BasketItem[];
 pagination: PaginationData;
 };
}

export interface BasketDetailsResponse {
 status: boolean;
 message: string;
 data: BasketDetailsData;
}

// ==================== Filter Types ====================
export type BasketType ="all"|"custom"|"subscription";
export type BasketSortType ="new"|"best_selling"|"top_rated";

export interface BasketFilters {
 basketType: BasketType;
 sortType?: BasketSortType;
 priceMin?: number;
 priceMax?: number;
 ratingMin?: number;
 itemsCountMin?: number;
 itemsCountMax?: number;
}
