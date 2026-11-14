import type { CartItem } from "../types";

/**
 * A cart line with no usable `shop_product_variant_id` is silently dropped from
 * the order-preview payload, so `POST /user/orders/preview` answered
 * `items.0.shop_product_variant_id` is required (422) and the page rendered a
 * bare total with no explanation — the cart said "4 عناصر" while only 3 lines
 * were priced. Detect those lines so the UI can name them and block checkout.
 */
export function findInvalidCartLines(items: CartItem[]): CartItem[] {
    return items.filter((item) => {
        const id = Number(item.shop_product_variant_id);
        return item.shop_product_variant_id == null || !Number.isFinite(id) || id <= 0;
    });
}

/** Comma-separated product names for the customer-facing warning. */
export function invalidCartLineNames(items: CartItem[]): string {
    return findInvalidCartLines(items)
        .map((item) => item.name?.trim())
        .filter((name): name is string => Boolean(name))
        .join("، ");
}
