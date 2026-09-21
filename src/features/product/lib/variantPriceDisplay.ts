import type { TFunction } from "i18next";
import {
    pickCurrencyFormatted,
    resolveDisplayListPrice,
    resolveDisplaySalePrice,
    selectFormattedForCurrency,
    type ApiDualCurrencies,
} from "@/shared/lib/formatApiPrice";
import {
    formatStorefrontDiscountBadge,
    readDiscountType,
    readDiscountValue,
    type DiscountFieldSource,
} from "@/shared/lib/productDiscountDisplay";
import type { ShopVariant, VariantDiscountType } from "../types/productDetails";

export type VariantPriceDisplay = {
    current: string;
    original: string | undefined;
    badge: string | null;
    savedLabel: string | null;
    hasDiscount: boolean;
};

export function normalizeVariantDiscountFields(
    variant?: DiscountFieldSource | null,
    product?: DiscountFieldSource | null,
): {
    discountType: VariantDiscountType;
    discountValue: number;
} {
    return {
        discountType: readDiscountType(
            variant?.discount_type ?? product?.discount_type,
        ),
        discountValue: readDiscountValue(
            variant?.discount_value ?? product?.discount_value,
        ),
    };
}

/** True when the API reports an effective variant-level discount. */
export function hasVariantDiscount(
    variant: ShopVariant | null | undefined,
    product?: DiscountFieldSource | null,
): boolean {
    const { discountType, discountValue } = normalizeVariantDiscountFields(
        variant,
        product,
    );
    if (
        (discountType === "percentage" || discountType === "fixed") &&
        discountValue > 0
    ) {
        return true;
    }
    if (!variant) return false;

    const discountAmount = Number(variant.discount ?? 0);
    const list = variant.price;
    const after = variant.price_after_discount;

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
    variant?: DiscountFieldSource | null,
    t?: TFunction,
    product?: DiscountFieldSource | null,
): string | null {
    return formatStorefrontDiscountBadge(variant, product, t);
}

function pickSavedLabel(
    currencies: ApiDualCurrencies | null | undefined,
    currencyCode?: string | null,
): string | null {
    const formatted = pickCurrencyFormatted(currencies, currencyCode);
    return formatted.trim() || null;
}

/**
 * Resolved display prices for the selected shop variant.
 * Prefer API `*_currencies` / `*_formatted` — never compute FX locally.
 * `discount_type` / `discount_value` fall back to product-level fields.
 */
export function resolveVariantPriceDisplay(
    variant: ShopVariant | null | undefined,
    t: TFunction,
    currencyCode?: string | null,
    product?: DiscountFieldSource | null,
): VariantPriceDisplay {
    const priceSource = variant ?? product;
    const hasDiscount = hasVariantDiscount(variant, product);

    return {
        current: resolveDisplaySalePrice(priceSource, currencyCode),
        original: hasDiscount
            ? resolveDisplayListPrice(priceSource, currencyCode)
            : undefined,
        badge: resolveVariantDiscountBadge(variant, t, product),
        savedLabel:
            hasDiscount && variant
                ? pickSavedLabel(variant.discount_currencies, currencyCode) ||
                  selectFormattedForCurrency(
                      variant.discount_formatted?.trim() ?? "",
                      currencyCode,
                  ) ||
                  null
                : null,
        hasDiscount,
    };
}
