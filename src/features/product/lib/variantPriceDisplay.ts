import type { TFunction } from "i18next";
import {
    formatDualCurrencies,
    resolveDisplayListPrice,
    resolveDisplaySalePrice,
    type ApiDualCurrencies,
} from "@/shared/lib/formatApiPrice";
import type { ShopVariant, VariantDiscountType } from "../types/productDetails";

export type VariantPriceDisplay = {
    current: string;
    original: string | undefined;
    badge: string | null;
    savedLabel: string | null;
    hasDiscount: boolean;
};

export function normalizeVariantDiscountFields(variant: ShopVariant): {
    discountType: VariantDiscountType;
    discountValue: number;
} {
    const rawType = variant.discount_type;
    const discountType: VariantDiscountType =
        rawType === "percentage" || rawType === "fixed" || rawType === "none"
            ? rawType
            : "none";
    return {
        discountType,
        discountValue: variant.discount_value ?? 0,
    };
}

/** True when the API reports an effective variant-level discount. */
export function hasVariantDiscount(
    variant: ShopVariant | null | undefined,
): boolean {
    if (!variant) return false;

    const { discountType, discountValue } = normalizeVariantDiscountFields(variant);
    const discountAmount = variant.discount ?? 0;
    const list = variant.price;
    const after = variant.price_after_discount;

    if (
        discountType !== "none" &&
        discountType != null &&
        (discountValue > 0 || discountAmount > 0)
    ) {
        return true;
    }

    return (
        discountAmount > 0 &&
        after != null &&
        list != null &&
        Number.isFinite(after) &&
        Number.isFinite(list) &&
        after < list
    );
}

export function resolveVariantDiscountBadge(
    variant: ShopVariant,
    t: TFunction,
): string | null {
    const { discountType, discountValue } = normalizeVariantDiscountFields(variant);
    if (!hasVariantDiscount(variant)) return null;

    if (discountType === "percentage" && discountValue > 0) {
        return t("baskets.discountPercentOff", { value: discountValue });
    }
    if (discountType === "fixed" && discountValue > 0) {
        return t("baskets.discountAmountOff", { value: discountValue });
    }
    return null;
}

function pickSavedLabel(currencies: ApiDualCurrencies | null | undefined): string | null {
    const formatted = formatDualCurrencies(currencies);
    return formatted.trim() || null;
}

/**
 * Resolved display prices for the selected shop variant.
 * Prefer API `*_currencies` / `*_formatted` — never compute FX locally.
 */
export function resolveVariantPriceDisplay(
    variant: ShopVariant,
    t: TFunction,
): VariantPriceDisplay {
    const hasDiscount = hasVariantDiscount(variant);

    return {
        current: resolveDisplaySalePrice(variant),
        original: hasDiscount ? resolveDisplayListPrice(variant) : undefined,
        badge: resolveVariantDiscountBadge(variant, t),
        savedLabel: hasDiscount
            ? variant.discount_formatted?.trim() ||
              pickSavedLabel(variant.discount_currencies) ||
              null
            : null,
        hasDiscount,
    };
}
