import { useState, useMemo, useCallback } from "react";
import type {
    AttributeMapItem,
    AttributeMapOption,
    ShopVariant,
    ProductImage,
    SelectedAttributes,
} from "../types/productDetails";
import { isPurchasableVariant, isVariantInStock, requiresVariantSelection } from "../types/productDetails";
import { gallerySrcsForSelection } from "../lib/productMedia";
import {
    isIndependentPickerAttribute,
    optionHexById,
    resolveAttributeOptions,
    resolvePickerAttributes,
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

function attributeKey(attribute: AttributeMapItem): string {
    return attribute.id != null ? `id:${attribute.id}` : attribute.attribute;
}

interface UseVariantSelectorReturn {
    selectedAttributes: SelectedAttributes;
    selectedIds: number[];
    setAttributeOption: (attr: AttributeMapItem, optionId: number) => void;
    selectShopVariant: (id: number) => void;
    selectedVariant: ShopVariant | null;
    selectedShopVariantId: number | null;
    currentPrice: number;
    currentPriceAfterDiscount: number;
    currentImages: string[];
    currentQuantity: number | null;
    isVariantSelected: boolean;
    requiresSelection: boolean;
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
    const [selection, setSelection] = useState<{
        productId?: number;
        optionIds: Record<string, number>;
        shopVariantId: number | null;
    }>({ productId, optionIds: {}, shopVariantId: null });

    // Reset during render so a route change cannot reuse another product's choices.
    let activeSelection = selection;
    if (productId !== selection.productId) {
        activeSelection = { productId, optionIds: {}, shopVariantId: null };
        setSelection(activeSelection);
    }

    const pickerAttributes = useMemo(
        () => resolvePickerAttributes(attributesMap, shopVariants),
        [attributesMap, shopVariants],
    );
    const needsSelection = requiresVariantSelection(shopVariants, pickerAttributes);
    const choices = pickerAttributes.map((attribute) => ({
        attribute,
        option: resolveAttributeOptions(attribute, shopVariants).find(
            (option) => option.id === activeSelection.optionIds[attributeKey(attribute)],
        ),
    }));
    const selectedAttributes: SelectedAttributes = {};
    const selectedIds: number[] = [];
    for (const { attribute, option } of choices) {
        if (!option) continue;
        selectedAttributes[attribute.attribute] = option.name;
        if (option.id > 0) selectedIds.push(option.id);
    }

    let selectedVariant: ShopVariant | null = null;
    if (!needsSelection) {
        // A simple product still needs an internal shop row for cart identity.
        selectedVariant = shopVariants.find(isPurchasableVariant) ??
            shopVariants.find(isVariantInStock) ?? shopVariants[0] ?? null;
    } else if (activeSelection.shopVariantId != null) {
        selectedVariant = shopVariants.find(
            (variant) => variant.id === activeSelection.shopVariantId,
        ) ?? null;
    } else if (choices.length > 0 && choices.every(({ option }) => option != null)) {
        const matches = shopVariants.filter((variant) =>
            choices.every(({ attribute, option }) =>
                variantHasOption(variant, option!, attribute.attribute),
            ),
        );
        selectedVariant = matches.find(isPurchasableVariant) ?? matches[0] ?? null;
    }

    const setAttributeOption = useCallback(
        (attr: AttributeMapItem, optionId: number) => {
            const options = resolveAttributeOptions(attr, shopVariants);
            const option = options.find((o) => o.id === optionId);
            if (!option) return;

            setSelection((previous) => {
                const previousIds = previous.productId === productId ? previous.optionIds : {};
                const nextIds: Record<string, number> = { [attributeKey(attr)]: optionId };
                let candidates = shopVariants.filter((variant) =>
                    variantHasOption(variant, option, attr.attribute),
                );
                // Retain only compatible explicit choices. Never fill unchosen axes.
                for (const other of pickerAttributes) {
                    if (attributeKey(other) === attributeKey(attr)) continue;
                    const chosen = resolveAttributeOptions(other, shopVariants).find(
                        (item) => item.id === previousIds[attributeKey(other)],
                    );
                    if (!chosen) continue;
                    const matching = candidates.filter((variant) =>
                        variantHasOption(variant, chosen, other.attribute),
                    );
                    if (!matching.length) continue;
                    nextIds[attributeKey(other)] = chosen.id;
                    candidates = matching;
                }
                return { productId, optionIds: nextIds, shopVariantId: null };
            });
        },
        [shopVariants, pickerAttributes, productId],
    );

    const selectShopVariant = useCallback((id: number) => {
        const variant = shopVariants.find((row) => row.id === id);
        if (!variant) return;
        const optionIds: Record<string, number> = {};
        for (const attribute of pickerAttributes) {
            const option = resolveAttributeOptions(attribute, shopVariants).find(
                (item) => variantHasOption(variant, item, attribute.attribute),
            );
            if (option) optionIds[attributeKey(attribute)] = option.id;
        }
        setSelection({ productId, optionIds, shopVariantId: id });
    }, [shopVariants, pickerAttributes, productId]);

    const hexById = useMemo(
        () => optionHexById(pickerAttributes, shopVariants),
        [pickerAttributes, shopVariants],
    );

    const availableAttributes = useMemo((): AvailableAttribute[] => {
        return pickerAttributes.map((attr) => {
            const options = resolveAttributeOptions(attr, shopVariants);
            const axisIds = new Set(
                options.map((o) => o.id).filter((id) => id > 0),
            );
            const independent = isIndependentPickerAttribute(attr);
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
        pickerAttributes,
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
        return selectedVariant !== null;
    }, [selectedVariant]);

    return {
        selectedAttributes,
        selectedIds,
        setAttributeOption,
        selectShopVariant,
        selectedVariant,
        selectedShopVariantId: selectedVariant?.id ?? null,
        currentPrice,
        currentPriceAfterDiscount,
        currentImages,
        currentQuantity,
        isVariantSelected,
        requiresSelection: needsSelection,
        availableAttributes,
    };
}
