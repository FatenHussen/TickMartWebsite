// Product Details API Response Types

import type { ApiDualCurrencies } from "@/shared/lib/formatApiPrice";

export interface ProductImage {
 id: number;
 path: string;
}

export interface ProductCategory {
 id: number;
 name: string;
}

export interface AttributeMapItem {
 attribute: string;
 type:"color"|"square";
 values: string[];
}

export type VariantDiscountType = "none" | "percentage" | "fixed";

export interface VariantAttribute {
 attribute: string;
 value: string;
 type: "color" | "square" | "circle" | string;
}

/**
 * A shop variant. The API always returns at least one entry, falling back to a
 * synthetic variant built from the parent product when nothing is linked to a
 * branch. In that fallback `id` / `variant_id` / `shop_id` are `null`, which
 * means the variant is displayable but **not purchasable** (the cart needs a
 * real `shop_product_variant_id`).
 */
export interface ShopVariant {
 id: number | null;
 variant_id: number | null;
 sku?: string | null;
 model?: string | null;
 barcode?: string | null;
 attributes: VariantAttribute[];
 price: number;
 currency?: string;
 currency_symbol?: string;
 price_formatted?: string;
 /** Admin-entered discount (10 = 10% or 10 units when fixed). */
 discount_value?: number;
 discount_type?: VariantDiscountType | string;
 /** Computed discount amount (USD base + discount_currencies). */
 discount?: number;
 discount_formatted?: string | null;
 discount_currencies?: ApiDualCurrencies | null;
 price_after_discount?: number;
 price_after_discount_formatted?: string;
 /** Dual-currency map from API — prefer over local FX. */
 price_currencies?: ApiDualCurrencies;
 price_after_discount_currencies?: ApiDualCurrencies;
 quantity: number;
 shop_id: number | null;
 is_restaurant?: boolean;
 city_id?: number | null;
 images: ProductImage[];
}

/** True when a variant can actually be added to the cart. */
export function isPurchasableVariant(
    variant: ShopVariant | null | undefined
): variant is ShopVariant & { id: number; shop_id: number } {
    return (
        variant != null &&
        variant.id != null &&
        variant.shop_id != null &&
        variant.quantity > 0
    );
}

export interface AvailableShop {
 id: number;
 name: string;
}

export interface CategoryDetail {
 id: number;
 name: string;
 value: string;
}

/** API may return a plain string or `{ ar, en }` */
export type LocalizedOrString =
    | string
    | { ar?: string | null; en?: string | null }
    | null
    | undefined;

/**
 * `country` may come back as a plain string or as the full country record
 * (`{ id, name: { ar, en }, code, ... }`) depending on the endpoint.
 */
export type ProductCountry =
    | string
    | {
          id?: number;
          name?: LocalizedOrString;
          code?: string | null;
      }
    | null
    | undefined;

export interface ExtraDetailCategory {
 id: number;
 name: string;
}

export interface ExtraDetail {
 id: number;
 key: LocalizedOrString;
 value: LocalizedOrString;
 /** Minimum selectable quantity for this extra (cannot go below). */
 quantity?: number;
 price?: number;
 category?: ExtraDetailCategory;
}

export interface ProductIcon {
 id: number;
 name: string;
 image: string;
 description: string;
}

export interface ProductApiBadge {
 id: number;
 name: string;
 color: string;
 type?: string;
 image?: string;
 /** API typo: "postion" */
 postion?: string;
 position?: string;
}

export interface BoughtWithProduct {
 id: number;
 name: string;
 description?: string;
 category?: string;
 country?: ProductCountry;
 price: number;
 price_after_discount?: number;
 price_formatted?: string;
 price_after_discount_formatted?: string;
 amount_saved?: number;
 amount_saved_formatted?: string;
 image: string;
 currency?: string;
 currency_symbol?: string;
 rating?: number;
 sold_number?: number;
 is_favorite?: boolean;
 top_badges?: ProductApiBadge[];
 bottom_badges?: ProductApiBadge[];
 shop_product_variant_id?: number;
}

export interface ProductExtra {
 id: number;
 name: string;
 price: number | string;
}

export interface ProductDetailsData {
 id: number;
 name: string;
 description?: string;
 full_description?: string;
 country: ProductCountry;
 price: number;
 currency_symbol?: string;
 price_formatted?: string;
 price_after_discount: number;
 price_after_discount_formatted?: string;
 price_currencies?: {
  USD?: { formatted?: string | null };
  SYP?: { formatted?: string | null };
  [code: string]: { formatted?: string | null } | null | undefined;
 };
 price_after_discount_currencies?: {
  USD?: { formatted?: string | null };
  SYP?: { formatted?: string | null };
  [code: string]: { formatted?: string | null } | null | undefined;
 };
 amount_saved_formatted?: string;
 quantity: number;
 /** Max units of the main product per order line (when returned by API). */
 max_purchase_quantity?: number;
 sku: string;
 model: string;
 barcode: string;
 /** Legacy field — prefer `delivery_time` when present. */
 time_prepare: string;
 /** Product-level delivery estimate (not per variant). */
 delivery_time?: string | null;
 /** Product-level discount metadata — do not mix with variant discount. */
 discount_type?: VariantDiscountType | string;
 bought_with: BoughtWithProduct[];
 is_instant_delivery: number;
 rating: number;
 rating_breakdown: number[];
 /** Single fallback image, used when `images` / variant images are empty. */
 thumbnail?: string | null;
 sold_number?: number;
 is_most_ordered?: number;
 product_type?: string;
 extras?: ProductExtra[];
 category: ProductCategory;
 attributes_map: AttributeMapItem[];
 shop_variants: ShopVariant[];
 category_details: CategoryDetail[];
 extra_details: ExtraDetail[];
 images: ProductImage[];
 available_shops: AvailableShop[];
 is_favorite?: boolean;
 icons?: ProductIcon[];
}

export interface ProductDetailsResponse {
 status: boolean;
 message: string;
 data: ProductDetailsData;
}

// Helper type for selected attributes
export interface SelectedAttributes {
 [attributeName: string]: string;
}
