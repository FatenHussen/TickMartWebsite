import { useState, useMemo, useCallback, useEffect } from"react";
import type {
 AttributeMapItem,
 ShopVariant,
 ProductImage,
 SelectedAttributes,
} from"../types/productDetails";
import { isPurchasableVariant, isVariantInStock } from"../types/productDetails";
import { gallerySrcsForSelection } from "../lib/productMedia";

interface UseVariantSelectorParams {
 attributesMap: AttributeMapItem[];
 shopVariants: ShopVariant[];
 defaultImages: ProductImage[];
 thumbnail?: string | null;
 basePrice: number;
 basePriceAfterDiscount: number;
}

interface AvailableAttribute extends AttributeMapItem {
 availableValues: string[]; // Values available (exist in any variant)
 disabledValues: string[]; // Values that don't exist in any variant
}

function comboAttributes(variant: ShopVariant) {
 return variant.attributes ?? [];
}

/** Identity is attributes + sku. Empty `attributes` is a display-only fallback row. */
function matchesSelection(
 variant: ShopVariant,
 selected: SelectedAttributes,
): boolean {
 const attrs = comboAttributes(variant);
 if (attrs.length === 0) return false;
 return attrs.every((attr) => selected[attr.attribute] === attr.value);
}

function firstComboVariant(variants: ShopVariant[]): ShopVariant | undefined {
 return variants.find((variant) => comboAttributes(variant).length > 0);
}

interface UseVariantSelectorReturn {
 selectedAttributes: SelectedAttributes;
 setAttributeValue: (attributeName: string, value: string) => void;
 selectedVariant: ShopVariant | null;
 currentPrice: number;
 currentPriceAfterDiscount: number;
 currentImages: string[];
 currentQuantity: number | null;
 isVariantSelected: boolean;
 availableAttributes: AvailableAttribute[];
}

export function useVariantSelector({
 attributesMap,
 shopVariants,
 defaultImages,
 thumbnail,
 basePrice,
 basePriceAfterDiscount,
}: UseVariantSelectorParams): UseVariantSelectorReturn {
 const [selectedAttributes, setSelectedAttributes] =
 useState<SelectedAttributes>({});

 // Initialize with first available variant, or re-initialize when current selection is invalid (e.g. after language change)
 useEffect(() => {
 if (shopVariants.length === 0) return;

 const firstVariant = firstComboVariant(shopVariants) ?? shopVariants[0];
 const initialAttrs: SelectedAttributes = {};
 comboAttributes(firstVariant).forEach((attr) => {
 initialAttrs[attr.attribute] = attr.value;
 });

 const hasMatch = shopVariants.some((v) =>
 matchesSelection(v, selectedAttributes)
 );
 if (!hasMatch) {
 setSelectedAttributes(initialAttrs);
 }
 }, [shopVariants]);

 // Set a single attribute value - auto-select first available option for other attributes
 const setAttributeValue = useCallback(
 (attributeName: string, value: string) => {
 const hasValue = (variant: ShopVariant) =>
 comboAttributes(variant).some(
 (attr) => attr.attribute === attributeName && attr.value === value
 );

 const keepsOthers = (variant: ShopVariant) =>
 Object.entries(selectedAttributes).every(([name, val]) => {
 if (!val || name === attributeName) return true;
 return comboAttributes(variant).some(
 (attr) => attr.attribute === name && attr.value === val
 );
 });

 const variantWithValue =
 shopVariants.find((variant) => hasValue(variant) && keepsOthers(variant)) ??
 shopVariants.find(hasValue);

 if (variantWithValue) {
 const newAttrs: SelectedAttributes = {};
 comboAttributes(variantWithValue).forEach((attr) => {
 newAttrs[attr.attribute] = attr.value;
 });
 setSelectedAttributes(newAttrs);
 }
 },
 [shopVariants, selectedAttributes]
 );

 // Calculate available values — filter by other selected attributes (no Cartesian)
 const availableAttributes = useMemo((): AvailableAttribute[] => {
 return attributesMap.map((attr) => {
 const availableValues: string[] = [];
 const disabledValues: string[] = [];

 const matchingVariants = shopVariants.filter((variant) =>
 Object.entries(selectedAttributes).every(([name, val]) => {
 if (!val || name === attr.attribute) return true;
 return (variant.attributes ?? []).some(
 (a) => a.attribute === name && a.value === val
 );
 })
 );

 attr.values.forEach((value) => {
 const hasAnyVariant = matchingVariants.some((variant) =>
 (variant.attributes ?? []).some(
 (a) => a.attribute === attr.attribute && a.value === value
 )
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
 };
 });
 }, [attributesMap, shopVariants, selectedAttributes]);

 // Find the matching variant based on selected attributes
 const selectedVariant = useMemo(() => {
 if (shopVariants.length === 0) {
 return null;
 }

 // No attribute matrix → the product has a single option (possibly the
 // API's synthetic fallback variant), so use it directly instead of
 // falling back to the parent product's price/stock.
 if (attributesMap.length === 0) {
 return shopVariants.find(isPurchasableVariant)
 ?? shopVariants.find(isVariantInStock)
 ?? shopVariants[0];
 }

 return (
 shopVariants.find((variant) =>
 matchesSelection(variant, selectedAttributes)
 ) || null
 );
 }, [selectedAttributes, shopVariants, attributesMap.length]);

 // Current price - from variant or base price
 const currentPrice = useMemo(() => {
 return selectedVariant?.price ?? basePrice;
 }, [selectedVariant, basePrice]);

 // Current price after discount — API-computed only (no local ratio)
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

 // Current quantity
 const currentQuantity = useMemo(() => {
 return selectedVariant?.quantity ?? null;
 }, [selectedVariant]);

 // Check if all attributes are selected
 const isVariantSelected = useMemo(() => {
 return attributesMap.length === 0 || selectedVariant !== null;
 }, [attributesMap, selectedVariant]);

 return {
 selectedAttributes,
 setAttributeValue,
 selectedVariant,
 currentPrice,
 currentPriceAfterDiscount,
 currentImages,
 currentQuantity,
 isVariantSelected,
 availableAttributes,
 };
}
