// Product Details API Response Types

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

export interface VariantAttribute {
 attribute: string;
 value: string;
 type:"color"|"square";
}

export interface ShopVariant {
 id: number;
 variant_id: number;
 attributes: VariantAttribute[];
 price: number;
 currency?: string;
 currency_symbol?: string;
 price_formatted?: string;
 quantity: number;
 shop_id: number;
 images: ProductImage[];
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

export interface ExtraDetail {
 id: number;
 key: string;
 value: string;
 price?: number;
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
 country?: string;
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
 country: string;
 price: number;
 currency_symbol?: string;
 price_formatted?: string;
 price_after_discount: number;
 price_after_discount_formatted?: string;
 quantity: number;
 sku: string;
 model: string;
 barcode: string;
 time_prepare: string;
 bought_with: BoughtWithProduct[];
 is_instant_delivery: number;
 rating: number;
 rating_breakdown: number[];
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
