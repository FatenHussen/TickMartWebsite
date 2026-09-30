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
 * First decimal digit rule: < 5 truncates, ≥ 5 rounds up.
 * Matches storefront price display (whole numbers only).
 */
function roundDiscountDisplayValue(value: number): number {
    if (!Number.isFinite(value)) return 0;
    const sign = value < 0 ? -1 : 1;
    const abs = Math.abs(value);
    const intPart = Math.trunc(abs);
    const firstDecimal = Math.floor((abs - intPart) * 10 + 1e-8);
    return sign * (firstDecimal >= 5 ? intPart + 1 : intPart);
}

/**
 * Listing card + PDP badge — same copy as the app.
 * percentage → `خصم 15%` / `15% OFF`
 * fixed → `خصم 151` / `151 OFF`
 */
export function formatStorefrontDiscountBadge(
    selected?: DiscountFieldSource | null,
    product?: DiscountFieldSource | null,
    t?: TFunction,
): string | null {
    const { type, value } = resolveDiscountFields(selected, product);
    if (type === "none" || !(value > 0)) return null;
    const displayValue = roundDiscountDisplayValue(value);
    if (type === "percentage") {
        if (t) return t("baskets.discountPercentOff", { value: displayValue });
        return i18next.t("baskets.discountPercentOff", { value: displayValue });
    }
    if (t) return t("baskets.discountAmountOff", { value: displayValue });
    return i18next.t("baskets.discountAmountOff", { value: displayValue });
}
