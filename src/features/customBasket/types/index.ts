import type { ScheduleBadge, ScheduleItem } from "@/features/cart/types";

export type { ScheduleBadge, ScheduleItem };

export type ScheduleDiscountType = "percentage" | "fixed" | "none" | string;

export interface CustomBasketProduct {
    id?: number;
    name: string;
    image: string;
    brand?: { id?: number; name?: string } | null;
}

export interface CustomBasketShop {
    id?: number;
    name?: string;
}

export interface CustomBasketLine {
    id: number;
    quantity: number;
    unit?: string | null;
    shop_product_variant_id: number;
    original_price_formatted?: string | null;
    line_total_formatted?: string | null;
    variantLabel: string;
    product: CustomBasketProduct;
    shop?: CustomBasketShop | null;
}

export interface CustomBasketSummary {
    items_count: number;
    total_quantity: number;
    original_price_formatted?: string | null;
    discount_value?: number | null;
    discount_type?: ScheduleDiscountType | null;
    savings_formatted?: string | null;
    final_price_formatted?: string | null;
}

export interface CustomBasketState {
    schedule: ScheduleItem | null;
    items: CustomBasketLine[];
    summary: CustomBasketSummary;
}

export interface ConfirmCustomBasketPayload {
    confirm_schedule: boolean;
    start_date?: string;
}

export interface ConfirmCartItem {
    shop_product_variant_id: number;
    quantity: number;
}

export interface ConfirmCustomBasketResult {
    cart_items: ConfirmCartItem[];
    raw: unknown;
}
