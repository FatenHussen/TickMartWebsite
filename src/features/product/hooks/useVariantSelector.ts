import { useState, useMemo, useCallback, useEffect } from "react";
import type {
    AttributeMapItem,
    ShopVariant,
    ProductImage,
    SelectedAttributes,
} from "../types/productDetails";
import { isPurchasableVariant, isVariantInStock } from "../types/productDetails";
import { gallerySrcsForSelection } from "../lib/productMedia";
import {
    attributeValueHexMap,
    findShopVariant,
    findShopVariantWithValue,
    isIndependentPickerAttribute,
} from "../lib/findShopVariant";

interface UseVariantSelectorParams {
    /** When this changes, selection is dropped so we never keep another product's variant id. */
    productId?: number;
    attributesMap: AttributeMapItem[];
    shopVariants: ShopVariant[];
    defaultImages: ProductImage[];
    thumbnail?: string | null;
    basePrice: number;
    basePriceAfterDiscount: number;
}

interface AvailableAttribute extends AttributeMapItem {
    availableValues: string[];
    disabledValues: string[];
    valueHex: Record<string, string>;
}

function comboAttributes(variant: ShopVariant) {
    return variant.attributes ?? [];
}

function attributesFromVariant(variant: ShopVariant | null): SelectedAttributes {
    const attrs: SelectedAttributes = {};
    if (!variant) return attrs;
    for (const attr of comboAttributes(variant)) {
        attrs[attr.attribute] = attr.value;
    }
    return attrs;
}

function firstComboVariant(variants: ShopVariant[]): ShopVariant | undefined {
    return variants.find((variant) => comboAttributes(variant).length > 0);
}

function defaultVariant(
    shopVariants: ShopVariant[],
    hasAttributeMatrix: boolean,
): ShopVariant | undefined {
    if (shopVariants.length === 0) return undefined;
    if (!hasAttributeMatrix) {
        return (
            shopVariants.find(isPurchasableVariant) ??
            shopVariants.find(isVariantInStock) ??
            shopVariants[0]
        );
    }
    return firstComboVariant(shopVariants) ?? shopVariants[0];
}

function findVariantById(
    shopVariants: ShopVariant[],
    id: number | null,
): ShopVariant | undefined {
    if (id == null) return undefined;
    return shopVariants.find((variant) => variant.id === id);
}

interface UseVariantSelectorReturn {
    selectedAttributes: SelectedAttributes;
    setAttributeValue: (attributeName: string, value: string) => void;
    selectedVariant: ShopVariant | null;
    selectedShopVariantId: number | null;
    currentPrice: number;
    currentPriceAfterDiscount: number;
    currentImages: string[];
    currentQuantity: number | null;
    isVariantSelected: boolean;
    availableAttributes: AvailableAttribute[];
}

/**
 * Picker labels come from the last GET (`attributes[].value` / `attributes_map`).
 * Purchase identity is `shop_variants[].id` so an admin rename (صغير → XS)
 * keeps the same row and only updates the shown name.
 */
export function useVariantSelector({
    productId,
    attributesMap,
    shopVariants,
    defaultImages,
    thumbnail,
    basePrice,
    basePriceAfterDiscount,
}: UseVariantSelectorParams): UseVariantSelectorReturn {
    const [selectedShopVariantId, setSelectedShopVariantId] = useState<
        number | null
    >(null);
    const [boundProductId, setBoundProductId] = useState(productId);

    if (productId !== boundProductId) {
        setBoundProductId(productId);
        setSelectedShopVariantId(null);
    }

    const hasAttributeMatrix = attributesMap.length > 0;

    const selectedVariant = useMemo(() => {
        if (shopVariants.length === 0) return null;
        return (
            findVariantById(shopVariants, selectedShopVariantId) ??
            defaultVariant(shopVariants, hasAttributeMatrix) ??
            null
        );
    }, [shopVariants, selectedShopVariantId, hasAttributeMatrix]);

    useEffect(() => {
        if (shopVariants.length === 0) {
            setSelectedShopVariantId((id) => (id == null ? id : null));
            return;
        }

        const stillThere =
            selectedShopVariantId != null &&
            shopVariants.some((variant) => variant.id === selectedShopVariantId);
        if (stillThere) return;

        const nextId = defaultVariant(shopVariants, hasAttributeMatrix)?.id ?? null;
        setSelectedShopVariantId((id) => (id === nextId ? id : nextId));
    }, [shopVariants, selectedShopVariantId, hasAttributeMatrix]);

    const selectedAttributes = useMemo(
        () => attributesFromVariant(selectedVariant),
        [selectedVariant],
    );

    const setAttributeValue = useCallback(
        (attributeName: string, value: string) => {
            const nextSelected = {
                ...selectedAttributes,
                [attributeName]: value,
            };
            // Keep the other axes when that combo exists (أزرق + S).
            // Otherwise pick the first row with the new value (أسود → L).
            const match =
                findShopVariant(shopVariants, nextSelected) ??
                findShopVariantWithValue(shopVariants, attributeName, value);
            if (!match) return;
            setSelectedShopVariantId(match.id ?? null);
        },
        [shopVariants, selectedAttributes],
    );

    const hexByAttribute = useMemo(
        () => attributeValueHexMap(shopVariants),
        [shopVariants],
    );

    const availableAttributes = useMemo((): AvailableAttribute[] => {
        return attributesMap.map((attr) => {
            const availableValues: string[] = [];
            const disabledValues: string[] = [];
            const independent = isIndependentPickerAttribute(attr.type);

            // Colors that exist on any row stay clickable. Sizes are limited
            // to the current color so a missing combo is not left "stuck".
            const matchingVariants = independent
                ? shopVariants
                : shopVariants.filter((variant) =>
                      Object.entries(selectedAttributes).every(([name, val]) => {
                          if (!val || name === attr.attribute) return true;
                          return (variant.attributes ?? []).some(
                              (a) => a.attribute === name && a.value === val,
                          );
                      }),
                  );

            attr.values.forEach((value) => {
                const hasAnyVariant = matchingVariants.some((variant) =>
                    (variant.attributes ?? []).some(
                        (a) =>
                            a.attribute === attr.attribute && a.value === value,
                    ),
                );

                if (hasAnyVariant) {
                    availableValues.push(value);
                } else {
                    disabledValues.push(value);
                }
            });

            return {
                ...attr,
                availableValues,
                disabledValues,
                valueHex: hexByAttribute[attr.attribute] ?? {},
            };
        });
    }, [attributesMap, shopVariants, selectedAttributes, hexByAttribute]);

    const currentPrice = useMemo(() => {
        return selectedVariant?.price ?? basePrice;
    }, [selectedVariant, basePrice]);

    const currentPriceAfterDiscount = useMemo(() => {
        if (selectedVariant?.price_after_discount != null) {
            return selectedVariant.price_after_discount;
        }
        return basePriceAfterDiscount;
    }, [selectedVariant, basePriceAfterDiscount]);

    const currentImages = useMemo(
        () =>
            gallerySrcsForSelection(selectedVariant, {
                images: defaultImages,
                thumbnail,
            }),
        [selectedVariant, defaultImages, thumbnail],
    );

    const currentQuantity = useMemo(() => {
        return selectedVariant?.quantity ?? null;
    }, [selectedVariant]);

    const isVariantSelected = useMemo(() => {
        return !hasAttributeMatrix || selectedVariant !== null;
    }, [hasAttributeMatrix, selectedVariant]);

    return {
        selectedAttributes,
        setAttributeValue,
        selectedVariant,
        selectedShopVariantId,
        currentPrice,
        currentPriceAfterDiscount,
        currentImages,
        currentQuantity,
        isVariantSelected,
        availableAttributes,
    };
}
