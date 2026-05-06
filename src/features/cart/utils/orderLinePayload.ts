import type { CartExtraLine, CartItem, OrderPreviewItem } from "../types";
import { normalizeCartExtras } from "./cartExtras";

/**
 * Builds `items[]` for order preview & create order:
 * - `shop_product_variant_id`, `quantity` (line) as positive integers
 * - optional `note`: non-empty string, max 500 (nullable on API when omitted)
 * - optional `extras`: `{ id, quantity }[]` with positive integers (nullable when omitted / empty)
 */
function toPositiveInt(n: unknown): number | null {
    const v = Number(n);
    if (!Number.isFinite(v)) return null;
    const t = Math.trunc(v);
    return t > 0 ? t : null;
}

export function cartItemToPreviewOrderItem(
    item: CartItem
): OrderPreviewItem | null {
    const spv = toPositiveInt(item.shop_product_variant_id);
    if (spv == null) return null;

    const lineQty = toPositiveInt(item.quantity) ?? 1;
    const line: OrderPreviewItem = {
        shop_product_variant_id: spv,
        quantity: lineQty,
    };

    const rawExtras = normalizeCartExtras(item.extras);
    if (rawExtras?.length) {
        const extras: CartExtraLine[] = [];
        for (const e of rawExtras) {
            const id = toPositiveInt(e.id);
            const eq = toPositiveInt(e.quantity) ?? 1;
            if (id != null) {
                extras.push({
                    id,
                    quantity: Math.max(1, eq),
                });
            }
        }
        if (extras.length > 0) {
            line.extras = extras;
        }
    }

    const note = item.note?.trim();
    if (note) {
        line.note = note.slice(0, 500);
    }

    return line;
}

export function cartItemsToPreviewOrderItems(
    items: CartItem[]
): OrderPreviewItem[] {
    return items
        .map(cartItemToPreviewOrderItem)
        .filter((x): x is OrderPreviewItem => x != null);
}
