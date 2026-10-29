const BIDI_MARKS = /[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g;

/**
 * `delivery_time` is already localized by `Accept-Language`.
 * Tikmool products come back as `12-48 hours` or `12-48 ساعة`
 * (Arabic keeps bidi isolates around the range). Seller text is returned as typed.
 * Show that string unchanged: no extra unit, no rebuild from the numbers.
 */
export function productDeliveryTimeText(value: unknown): string | null {
    if (typeof value !== "string") return null;
    const visible = value.replace(BIDI_MARKS, "").trim();
    if (!visible) return null;
    return value;
}
