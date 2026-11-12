export type MergeableCartItem = {
    shop_product_variant_id: number;
    quantity: number;
    note?: string;
};

/**
 * Collapses lines that target the same shop variant into a single request.
 * `POST /user/cart/items` adds to the quantity already held for that variant,
 * so sending the same variant twice in one sync doubled the ordered amount.
 *
 * A distinct note is a distinct server line, so quantity only merges within one.
 */
export function mergeServerCartItems<T extends MergeableCartItem>(items: T[]): T[] {
    const byVariant = new Map<string, T>();
    for (const item of items) {
        const key = `${item.shop_product_variant_id}::${item.note ?? ""}`;
        const existing = byVariant.get(key);
        if (existing) {
            byVariant.set(key, {
                ...existing,
                quantity: existing.quantity + item.quantity,
            });
        } else {
            byVariant.set(key, { ...item });
        }
    }
    return [...byVariant.values()];
}
