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
  type: "color" | "square";
  values: string[];
}

export interface VariantAttribute {
  attribute: string;
  value: string;
  type: "color" | "square";
}

export interface ShopVariant {
  id: number;
  variant_id: number;
  attributes: VariantAttribute[];
  price: number;
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
}

export interface BoughtWithProduct {
  id: number;
  name: string;
  price: number;
  price_after_discount?: number;
  image: string;
  is_favorite?: boolean;
}

export interface ProductExtra {
  id: number;
  name: string;
  price: number | string;
}

export interface ProductDetailsData {
  id: number;
  name: string;
  description: string;
  full_description: string;
  country: string;
  price: number;
  price_after_discount: number;
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
