import type { ShopVariant, VariantAttribute } from "../types/productDetails";

function attrs(variant: ShopVariant): VariantAttribute[] {
    return variant.attributes ?? [];
}

/** Match a shop row by `attribute` + `value` (names from the last GET). */
export function findShopVariant(
    variants: ShopVariant[],
    selected: Record<string, string>,
): ShopVariant | null {
    const entries = Object.entries(selected).filter(([, value]) => value);
    if (!entries.length) return null;
    return (
        variants.find((variant) =>
            entries.every(([attribute, value]) =>
                attrs(variant).some(
                    (a) => a.attribute === attribute && a.value === value,
                ),
            ),
        ) ?? null
    );
}

/** First row that has this attribute value — used when the current combo does not exist. */
export function findShopVariantWithValue(
    variants: ShopVariant[],
    attribute: string,
    value: string,
): ShopVariant | null {
    return (
        variants.find((variant) =>
            attrs(variant).some(
                (a) => a.attribute === attribute && a.value === value,
            ),
        ) ?? null
    );
}

/**
 * Color is an independent axis: every color that appears on a row is selectable.
 * Size (and other non-color attrs) stay constrained to the current color so
 * Blue+L / Black+S do not look like real options when those rows are missing.
 */
export function isIndependentPickerAttribute(type: string | undefined): boolean {
    return String(type ?? "").toLowerCase() === "color";
}

/** `attributes[].hex` keyed by attribute name → value label. */
export function attributeValueHexMap(
    variants: ShopVariant[],
): Record<string, Record<string, string>> {
    const map: Record<string, Record<string, string>> = {};
    for (const variant of variants) {
        for (const attr of attrs(variant)) {
            const hex = attr.hex?.trim();
            if (!hex) continue;
            map[attr.attribute] ??= {};
            if (!map[attr.attribute][attr.value]) {
                map[attr.attribute][attr.value] = hex;
            }
        }
    }
    return map;
}
