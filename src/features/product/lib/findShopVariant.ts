import type {
    AttributeMapItem,
    AttributeMapOption,
    ShopVariant,
    VariantAttribute,
} from "../types/productDetails";

function attrs(variant: ShopVariant): VariantAttribute[] {
    return variant.attributes ?? [];
}

export function selectedIdsFromVariant(
    variant: ShopVariant | null | undefined,
): number[] {
    if (!variant) return [];
    return attrs(variant)
        .map((a) => a.id)
        .filter((id): id is number => id != null && Number.isFinite(id) && id > 0);
}

/**
 * Match a shop row by attribute-value IDs.
 * Admin rename (صغير → XS) keeps the same `id`; only `name` / `value` change.
 */
export function findShopVariant(
    variants: ShopVariant[],
    selectedIds: number[],
): ShopVariant | null {
    const ids = selectedIds.filter((id) => Number.isFinite(id) && id > 0);
    if (!ids.length) return null;
    return (
        variants.find((variant) =>
            ids.every((id) => attrs(variant).some((a) => a.id === id)),
        ) ?? null
    );
}

/** First row that has this option id — used when the current combo does not exist. */
export function findShopVariantWithOptionId(
    variants: ShopVariant[],
    optionId: number,
): ShopVariant | null {
    if (!Number.isFinite(optionId) || optionId <= 0) return null;
    return (
        variants.find((variant) => attrs(variant).some((a) => a.id === optionId)) ??
        null
    );
}

/** Legacy name match when a payload has no option ids. */
export function findShopVariantByNames(
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

/** Options that actually appear on at least one shop variant for this attribute. */
function optionsFromVariants(
    attr: AttributeMapItem,
    variants: ShopVariant[],
): AttributeMapOption[] {
    const seen = new Set<number>();
    const fromVariants: AttributeMapOption[] = [];
    for (const variant of variants) {
        for (const a of attrs(variant)) {
            if (a.attribute !== attr.attribute) continue;
            if (a.id == null || !Number.isFinite(a.id) || seen.has(a.id)) continue;
            seen.add(a.id);
            fromVariants.push({
                id: a.id,
                name: a.value,
                hex: a.hex ?? null,
            });
        }
    }
    return fromVariants;
}

/**
 * Prefer `attributes_map[].options[]`, but only keep values that exist on
 * `shop_variants` when the product has rows — avoids the full category palette
 * (24+ colors) on a product that only ships 1–2 shades.
 */
export function resolveAttributeOptions(
    attr: AttributeMapItem,
    variants: ShopVariant[],
): AttributeMapOption[] {
    const fromVariants = optionsFromVariants(attr, variants);

    if (attr.options?.length) {
        const fromApi = attr.options.filter((o) => Number.isFinite(o.id));
        if (fromVariants.length) {
            const onProduct = new Set(fromVariants.map((o) => o.id));
            const present = fromApi.filter((o) => onProduct.has(o.id));
            if (present.length) {
                return present.map((o) => {
                    const hit = fromVariants.find((v) => v.id === o.id);
                    return {
                        ...o,
                        name: o.name || hit?.name || o.name,
                        hex: o.hex ?? hit?.hex ?? null,
                    };
                });
            }
            return fromVariants;
        }
        return fromApi;
    }

    if (fromVariants.length) {
        if (attr.values?.length) {
            const byName = new Map(fromVariants.map((o) => [o.name, o]));
            const ordered: AttributeMapOption[] = [];
            for (const name of attr.values) {
                const hit = byName.get(name);
                if (hit) {
                    ordered.push(hit);
                    byName.delete(name);
                }
            }
            ordered.push(...byName.values());
            return ordered;
        }
        return fromVariants;
    }

    return (attr.values ?? []).map((name, index) => ({
        id: -(index + 1),
        name,
        hex: null,
    }));
}

export function variantHasOption(
    variant: ShopVariant,
    option: AttributeMapOption,
    attributeName: string,
): boolean {
    return attrs(variant).some((a) => {
        if (option.id > 0 && a.id != null) return a.id === option.id;
        return a.attribute === attributeName && a.value === option.name;
    });
}

/** Swatch fill: `options[].hex` first, then `shop_variants[].attributes[].hex`. */
export function optionHexById(
    attributesMap: AttributeMapItem[],
    variants: ShopVariant[],
): Record<number, string> {
    const map: Record<number, string> = {};
    for (const attr of attributesMap) {
        for (const option of attr.options ?? []) {
            const hex = option.hex?.trim();
            if (hex && option.id > 0) map[option.id] = hex;
        }
    }
    for (const variant of variants) {
        for (const attr of attrs(variant)) {
            const hex = attr.hex?.trim();
            if (hex && attr.id != null && attr.id > 0 && !map[attr.id]) {
                map[attr.id] = hex;
            }
        }
    }
    return map;
}
