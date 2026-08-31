import { useState, useMemo, useCallback, useEffect } from"react";
import type {
 AttributeMapItem,
 ShopVariant,
 ProductImage,
 SelectedAttributes,
} from"../types/productDetails";

interface UseVariantSelectorParams {
 attributesMap: AttributeMapItem[];
 shopVariants: ShopVariant[];
 defaultImages: ProductImage[];
 basePrice: number;
 basePriceAfterDiscount: number;
}

interface AvailableAttribute extends AttributeMapItem {
 availableValues: string[]; // Values available (exist in any variant)
 disabledValues: string[]; // Values that don't exist in any variant
}

interface UseVariantSelectorReturn {
 selectedAttributes: SelectedAttributes;
 setAttributeValue: (attributeName: string, value: string) => void;
 selectedVariant: ShopVariant | null;
 currentPrice: number;
 currentPriceAfterDiscount: number;
 currentImages: string[];
 currentQuantity: number;
 isVariantSelected: boolean;
 availableAttributes: AvailableAttribute[];
}

export function useVariantSelector({
 attributesMap,
 shopVariants,
 defaultImages,
 basePrice,
 basePriceAfterDiscount,
}: UseVariantSelectorParams): UseVariantSelectorReturn {
 const [selectedAttributes, setSelectedAttributes] =
 useState<SelectedAttributes>({});

 // Initialize with first available variant, or re-initialize when current selection is invalid (e.g. after language change)
 useEffect(() => {
 if (shopVariants.length === 0) return;

 const firstVariant = shopVariants[0];
 const initialAttrs: SelectedAttributes = {};
 (firstVariant.attributes ?? []).forEach((attr) => {
 initialAttrs[attr.attribute] = attr.value;
 });

 const hasMatch = shopVariants.some((v) =>
 (v.attributes ?? []).every(
 (attr) => selectedAttributes[attr.attribute] === attr.value
 )
 );
 if (!hasMatch) {
 setSelectedAttributes(initialAttrs);
 }
 }, [shopVariants]);

 // Set a single attribute value - auto-select first available option for other attributes
 const setAttributeValue = useCallback(
 (attributeName: string, value: string) => {
 // Find first variant that has this attribute value
 const variantWithValue = shopVariants.find((variant) =>
 (variant.attributes ?? []).some(
 (attr) => attr.attribute === attributeName && attr.value === value
 )
 );

 if (variantWithValue) {
 // Set all attributes from this variant
 const newAttrs: SelectedAttributes = {};
 (variantWithValue.attributes ?? []).forEach((attr) => {
 newAttrs[attr.attribute] = attr.value;
 });
 setSelectedAttributes(newAttrs);
 }
 },
 [shopVariants]
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
 return shopVariants.find((v) => v.quantity > 0) ?? shopVariants[0];
 }

 return (
 shopVariants.find((variant) => {
 return (variant.attributes ?? []).every((attr) => {
 return selectedAttributes[attr.attribute] === attr.value;
 });
 }) || null
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

 // Current images - from variant, then the product's own images
 const currentImages = useMemo(() => {
 if (selectedVariant?.images && selectedVariant.images.length > 0) {
 return selectedVariant.images.map((img) => img.path);
 }
 return (defaultImages ?? []).map((img) => img.path);
 }, [selectedVariant, defaultImages]);

 // Current quantity
 const currentQuantity = useMemo(() => {
 return selectedVariant?.quantity ?? 0;
 }, [selectedVariant]);

 // Check if all attributes are selected
 const isVariantSelected = useMemo(() => {
 return (
 attributesMap.length === 0 ||
 (selectedVariant !== null && selectedVariant.quantity > 0)
 );
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
