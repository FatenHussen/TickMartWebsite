import i18next from "i18next";
import type { TFunction } from "i18next";

export type StorefrontDiscountType = "percentage" | "fixed" | "none";

export type DiscountFieldSource = {
    discount_type?: string | null;
    discount_value?: number | string | null;
};

/**
 * `null` / omitted / `"none"` = no discount. Unknown strings are treated as none.
 */
export function readDiscountType(
    raw: string | null | undefined,
): StorefrontDiscountType {
    if (raw === "percentage" || raw === "fixed") return raw;
    return "none";
}

/**
 * Admin-entered `discount_value` is a decimal `number`.
 * Use `Number` — never `parseInt`, and never assume the value is ≤ 100.
 */
export function readDiscountValue(
    raw: number | string | null | undefined,
): number {
    const n = Number(raw ?? 0);
    return Number.isFinite(n) ? n : 0;
}

/**
 * Selected shop variant wins when present; otherwise product-level fields.
 * `??` is intentional so `null` on the variant inherits the product.
 */
export function resolveDiscountFields(
    selected?: DiscountFieldSource | null,
    product?: DiscountFieldSource | null,
): { type: StorefrontDiscountType; value: number } {
    return {
        type: readDiscountType(
            selected?.discount_type ?? product?.discount_type,
        ),
        value: readDiscountValue(
            selected?.discount_value ?? product?.discount_value,
        ),
    };
}

/** Badge / sale UI: type is not `none` and the entered value is positive. No `<= 100` cap. */
export function hasStorefrontDiscount(
    selected?: DiscountFieldSource | null,
    product?: DiscountFieldSource | null,
): boolean {
    const { type, value } = resolveDiscountFields(selected, product);
    return type !== "none" && value > 0;
}

/**
 * Listing card + PDP badge.
 * percentage → `-10.5%`
 * fixed → localized `خصم 150.75` / `150.75 OFF` (fractions and values > 100 stay as-is)
 */
export function formatStorefrontDiscountBadge(
    selected?: DiscountFieldSource | null,
    product?: DiscountFieldSource | null,
    t?: TFunction,
): string | null {
    const { type, value } = resolveDiscountFields(selected, product);
    if (type === "none" || !(value > 0)) return null;
    if (type === "percentage") return `-${value}%`;
    if (t) return t("baskets.discountAmountOff", { value });
    return i18next.t("baskets.discountAmountOff", { value });
}
