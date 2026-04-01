import type { PaginationData } from"@/shared/types/pagination";

// ==================== Hero Slider Types ====================
export type SlideData = {
 id: number;
 title: string;
 subtitle: string;
 description: string;
 image: string;
};

// ==================== Section Item Types ====================
export interface SectionItemBadge {
 id: number;
 name: string;
 color?: string;
 type?: string;
 image?: string;
 postion?: string | null; // Typo from API:"postion"instead of"position"
 position?: string | null; // Support both spellings
}

// Brand Item (display_type_id: 6)
export interface BrandItem {
 id: number;
 name: string;
 image: string;
 created_at: string;
 updated_at: string;
 is_favorite?: boolean;
 top_badges?: SectionItemBadge[];
 bottom_badges?: SectionItemBadge[];
 budges?: SectionItemBadge[];
}

// Recipe Item (display_type_id: 7)
export interface RecipeItem {
 id: number;
 name: string;
 description: string;
 image: string;
 rating: number;
 price: number;
 currency?: string;
 currency_symbol?: string;
 price_formatted?: string;
 price_after_discount: number;
 price_after_discount_formatted?: string;
 discount: string;
 /** Units sold (or API-defined sold metric) */
 sold?: number;
 sold_formatted?: string;
 orders_count: number;
 top_badges?: SectionItemBadge[];
 bottom_badges?: SectionItemBadge[];
 budges?: SectionItemBadge[]; // Legacy typo field kept for backward compat
 created_at: string;
 is_favorite?: boolean;
}

// Product Item (display_type_id: 2)
export interface ProductItem {
 id: number;
 category: string;
 name: string;
 description: string;
 country: string | null;
 price: number;
 currency?: string;
 currency_symbol?: string;
 price_formatted?: string;
 price_after_discount: number;
 price_after_discount_formatted?: string;
 amount_saved: number;
 amount_saved_formatted?: string;
 quantity: number | null;
 image: string;
 discount: string;
 top_badges?: SectionItemBadge[];
 bottom_badges?: SectionItemBadge[];
 budges?: SectionItemBadge[]; // Legacy typo field kept for backward compat
 created_at: string;
 sold_number: number;
 rating: number;
 is_favorite?: boolean;
 is_instant_delivery?: number;
 shop_product_variant_id?: number;
}

// Shop Item (display_type_id: 3 - Nearby Shops)
export interface ShopItemVendor {
  id: number;
  name: string;
  owner_name: string;
  logo_url: string | null;
  is_active: boolean;
  average_rating: number;
  ratings_count: number;
  created_at: string;
  top_badges?: SectionItemBadge[];
  bottom_badges?: SectionItemBadge[];
}

export interface ShopItem {
 id: number;
 name: string;
 description: string | null;
 logo_url: string | null;
 is_active: boolean;
 average_rating: number;
 ratings_count: number;
 is_open_now: boolean;
 created_at: string;
 vendor: ShopItemVendor;
 /** Optional: store cover image (API may add later) */
 image?: string | null;
 /** Optional: delivery fee display (API may add later) */
 delivery_price?: string | number | null;
 /** Optional: discount badge e.g."30% OFF"(API may add later) */
 discount_label?: string | null;
 is_favorite?: boolean;
 /** Same badge shape as other section items; may also live on `vendor` */
 top_badges?: SectionItemBadge[];
 bottom_badges?: SectionItemBadge[];
 budges?: SectionItemBadge[];
}

// Basket Item (display_type_id: 4)
export interface BasketItem {
 id: number;
 title: string;
 desc: string | null;
 image: string;
 category: string;
 original_price: number;
 discount_value: string;
 discount_type:"percentage"|"fixed";
 discount_amount: number;
 price_after_discount: number;
 rating: number;
 saving: number;
 num_sold: number;
 is_on_offer: boolean;
 offer_ends_at: string | null;
 next_delivery_date: string | null;
 items_count: number;
 delivery_price: number;
 // Optional legacy fields
 name?: string;
 final_price?: number;
 num_varieties?: number;
 top_badges?: SectionItemBadge[];
 bottom_badges?: SectionItemBadge[];
 budges?: SectionItemBadge[];
 is_favorite?: boolean;
}

// Base interface for backward compatibility
export interface SectionItemBase {
 id: number;
 title: string | null;
 desc: string | null;
 image: string | null;
 price: number | null;
 price_after_discount?: number | null;
 discount: string | null;
 top_badges: SectionItemBadge[];
 bottom_badges: SectionItemBadge[];
 is_favorite?: boolean;
}

// For API type sections (products, brands, recipes, baskets, shops)
export type SectionItemApi =
 | BrandItem
 | RecipeItem
 | ProductItem
 | BasketItem
 | ShopItem
 | SectionItemBase;

// For Manual type sections (banners, selected products)
export interface SectionItemManual {
 id: number;
 link: string;
 order: number;
 item: SectionItemBase;
}

export type SectionItem = SectionItemApi | SectionItemManual;

// ==================== Section Types ====================
export interface SectionSeeMore {
 page_slug: string;
 params: Record<string, unknown> | unknown[];
}

export interface SectionAction {
 page_slug: string | null;
}

export interface Section {
 id: number;
 name: string;
 type:"api"|"manual";
 position:"before"|"after";
 order: number;
 display_type_id: number;
 background_color: string | null;
 background_crad_color: string | null;
 see_more: SectionSeeMore | null;
 action: SectionAction;
 items: SectionItem[];
}

// ==================== API Response Types ====================
export interface SectionsResponse {
 status: boolean;
 message: string;
 data: Section[];
}

// ==================== Display Type Mapping ====================
export const DISPLAY_TYPE = {
 BANNER: 1,
 PRODUCT: 2,
 SHOP: 3,
 BASKET: 4,
 BRAND: 6,
 RECIPE: 7,
} as const;

export type DisplayTypeId = (typeof DISPLAY_TYPE)[keyof typeof DISPLAY_TYPE];

// ==================== Category Types ====================
export interface Category {
 id: number;
 name: string;
 icon: string | null;
}

export interface CategoriesResponse {
 status: boolean;
 message: string;
 data: {
 items: Category[];
 pagination: PaginationData;
 };
}

// ==================== Products List Types ====================
export interface ProductsListResponse {
 status: boolean;
 message: string;
 data: {
 items: ProductItem[];
 pagination: PaginationData;
 };
}
