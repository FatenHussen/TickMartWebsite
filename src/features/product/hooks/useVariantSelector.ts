import { useState, useMemo, useCallback, useEffect } from "react";
import type {
    AttributeMapItem,
    AttributeMapOption,
    ShopVariant,
    ProductImage,
    SelectedAttributes,
} from "../types/productDetails";
import { isPurchasableVariant, isVariantInStock } from "../types/productDetails";
import { gallerySrcsForSelection } from "../lib/productMedia";
import {
    findShopVariant,
    findShopVariantByNames,
    findShopVariantWithOptionId,
    findShopVariantWithValue,
    isIndependentPickerAttribute,
    optionHexById,
    resolveAttributeOptions,
    selectedIdsFromVariant,
    variantHasOption,
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
    options: AttributeMapOption[];
    availableIds: number[];
    disabledIds: number[];
    selectedId: number | null;
    selectedName: string;
    valueHex: Record<number, string>;
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
    selectedIds: number[];
    setAttributeOption: (attr: AttributeMapItem, optionId: number) => void;
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
 * Picker state is `options[].id` / `attributes[].id`.
 * Labels (`name` / `value`) come from the last GET so a rename (صغير → XS)
 * only updates the shown text. Purchase identity is `shop_variants[].id`.
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

    const selectedIds = useMemo(
        () => selectedIdsFromVariant(selectedVariant),
        [selectedVariant],
    );

    const setAttributeOption = useCallback(
        (attr: AttributeMapItem, optionId: number) => {
            const options = resolveAttributeOptions(attr, shopVariants);
            const option = options.find((o) => o.id === optionId);
            if (!option) return;

            const axisIds = new Set(
                options.map((o) => o.id).filter((id) => id > 0),
            );
            const currentIds = selectedIdsFromVariant(selectedVariant);
            const nextIds = [
                ...currentIds.filter((id) => !axisIds.has(id)),
                ...(optionId > 0 ? [optionId] : []),
            ];

            // Keep the other axes when that combo exists (أزرق + S).
            // Otherwise pick the first row with the new value (أسود → L).
            const match =
                (nextIds.length
                    ? findShopVariant(shopVariants, nextIds)
                    : null) ??
                findShopVariantWithOptionId(shopVariants, optionId) ??
                findShopVariantByNames(shopVariants, {
                    ...attributesFromVariant(selectedVariant),
                    [attr.attribute]: option.name,
                }) ??
                findShopVariantWithValue(
                    shopVariants,
                    attr.attribute,
                    option.name,
                );
            if (!match) return;
            setSelectedShopVariantId(match.id ?? null);
        },
        [shopVariants, selectedVariant],
    );

    const hexById = useMemo(
        () => optionHexById(attributesMap, shopVariants),
        [attributesMap, shopVariants],
    );

    const availableAttributes = useMemo((): AvailableAttribute[] => {
        return attributesMap.map((attr) => {
            const options = resolveAttributeOptions(attr, shopVariants);
            const axisIds = new Set(
                options.map((o) => o.id).filter((id) => id > 0),
            );
            const independent = isIndependentPickerAttribute(attr.type);
            const otherIds = selectedIds.filter((id) => !axisIds.has(id));

            const matchingVariants = independent
                ? shopVariants
                : shopVariants.filter((variant) => {
                      if (otherIds.length) {
                          return otherIds.every((id) =>
                              (variant.attributes ?? []).some((a) => a.id === id),
                          );
                      }
                      return Object.entries(selectedAttributes).every(
                          ([name, val]) => {
                              if (!val || name === attr.attribute) return true;
                              return (variant.attributes ?? []).some(
                                  (a) =>
                                      a.attribute === name && a.value === val,
                              );
                          },
                      );
                  });

            const availableIds: number[] = [];
            const disabledIds: number[] = [];
            for (const option of options) {
                const hasAnyVariant = matchingVariants.some((variant) =>
                    variantHasOption(variant, option, attr.attribute),
                );
                if (hasAnyVariant) availableIds.push(option.id);
                else disabledIds.push(option.id);
            }

            const selectedId =
                options.find((o) => o.id > 0 && selectedIds.includes(o.id))
                    ?.id ??
                options.find(
                    (o) => o.name === selectedAttributes[attr.attribute],
                )?.id ??
                null;

            return {
                ...attr,
                options,
                availableIds,
                disabledIds,
                selectedId,
                selectedName:
                    options.find((o) => o.id === selectedId)?.name ??
                    selectedAttributes[attr.attribute] ??
                    "",
                valueHex: hexById,
            };
        });
    }, [
        attributesMap,
        shopVariants,
        selectedAttributes,
        selectedIds,
        hexById,
    ]);

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
        selectedIds,
        setAttributeOption,
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
