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
 /** When present (e.g. some APIs), shown on brand cards. */
 orders_count?: number;
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
 cover_image?: string | null;
 is_active: boolean;
 average_rating: number;
 ratings_count: number;
 is_open_now: boolean;
 created_at: string;
 vendor: ShopItemVendor;
 /** Optional: store cover image (API may add later) */
 image?: string | null;
 address?: string | null;
 is_service_provider?: boolean;
 is_restaurant?: boolean;
 is_recommended?: boolean;
 pricing_tier?: string | null;
 payment_methods?: string[];
 categories?: Array<{ id: number; name: string }>;
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
  main_color?: string | null;
  second_color?: string | null;
  text_color?: string | null;
 is_favorite?: boolean;
}

// Base interface for backward compatibility
export interface SectionItemBase {
 id: number;
 title: string | null;
 desc: string | null;
 /** Banner CTA label from the dashboard; absent on non-banner items. */
 button_text?: string | null;
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

/** Home section card shape — drives Swiper density + card aspect */
export type SectionCardVariant = "horizontal" | "vertical" | "square";

/**
 * How a whole section is laid out — API `layout`. Orthogonal to
 * {@link SectionCardVariant}, which only says what a single card looks like
 * inside that layout, and to `display_type_id`, which only says what the items
 * are.
 */
export type SectionLayout = "slider" | "list" | "grid";

export interface Section {
 id: number;
 /**
  * Section title. Typed as a string because that is what consumers may render,
  * but the API also sends it as `{ ar, en }` when an admin set a name override
  * in the dashboard — `ApiSectionsRenderer` resolves it for the active language
  * before anything reads it. Never render a raw section straight from an API
  * response.
  */
 name: string;
 /** Optional subtitle under the section title (when provided by CMS). */
 description?: string | null;
 type:"api"|"manual";
 position:"before"|"after";
 order: number;
 /**
  * Card layout behind the section, seeded to a fixed id per kind in every
  * environment (see `DISPLAY_TYPE`). A host whose `DisplayTypeSeeder` has not
  * run can still send `null` here, or the old `firstOrCreate`d id of the
  * subcategories row, so resolve it through `getSectionKind` /
  * `withResolvedDisplayType` rather than switching on it directly.
  */
 display_type_id: number | null;
 /**
  * What the section's items are (e.g. "category", "product", "banner") — the
  * one discriminator the API sets on *every* section, `api` and `manual` alike.
  * Prefer it over the two fields below. Optional in the type only because an
  * un-migrated API host omits it; `getSectionKind` falls back for those.
  */
 content_type?: string | null;
 /**
  * Backend model behind the section's items (e.g. "category", "product") — set
  * on `type: "manual"` sections and `null` on `type: "api"` ones, so it cannot
  * answer for every section on its own.
  */
 manual_model?: string | null;
 /** Backend data source for `type: "api"` sections (e.g. "categories", "products"). */
 api_method?: string | null;
 /**
  * True for a section the backend generates itself (the subcategories and
  * products rows of a category page), false for one an admin built in the
  * dashboard. Informational only — **every** section renders, generated or
  * not; a generated row nobody wants is deleted in the dashboard, which is the
  * one place that owns that call.
  */
 is_default?: boolean | null;
 background_color: string | null;
 background_crad_color: string | null;
 /** Preferred spelling; falls back to `background_crad_color` in helpers */
 background_card_color?: string | null;
 /**
  * API `layout` — how the whole section is laid out: a horizontal slider, a
  * vertical list, or a grid. Read it through `getSectionLayout`, which falls
  * back to `"slider"` for a host that does not send the field yet.
  */
 layout?: SectionLayout | null;
 /**
  * API `variant` — the shape of a single card *inside* the layout, never the
  * layout itself. Read it through `getSectionCardVariant`.
  */
 variant?: SectionCardVariant | null;
 end_date?: string | null;
 /** Section-level flash-sale discount applied to every item. */
 discount?: number | null;
 discount_type?: "percent" | "percentage" | "fixed" | string | null;
 main_color?: string | null;
 second_color?: string | null;
 text_color?: string | null;
 see_more: SectionSeeMore | null;
 action: SectionAction;
 /**
  * Display conditions. An empty object — what the backend sends today — means
  * "always show". No condition keys are specified yet, so nothing evaluates
  * this: a section is never hidden because of a rule this client can't read.
  */
 show_when?: Record<string, unknown> | null;
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
 SCHEDULED_BASKET: 5,
 BRAND: 6,
 RECIPE: 7,
 CATEGORY: 8,
 /** Dashboard welcome / intro banner rows — both render as banners. */
 WELCOME_BANNER: 9,
 INTRO_BANNER: 10,
 /** Schedule category cards — customize at `/schedules/{id}`. Not admin baskets. */
 SCHEDULE: 11,
} as const;

export type DisplayTypeId = (typeof DISPLAY_TYPE)[keyof typeof DISPLAY_TYPE];

// ==================== Category Types ====================
export interface CategoryChild {
 id: number;
 name: string;
 order?: number;
 is_restaurant?: boolean;
}

export interface Category {
 id: number;
 name: string;
 icon: string | null;
 order?: number;
 is_restaurant?: boolean;
 children?: CategoryChild[];
 /** Optional brand colors from API (snake_case or camelCase). */
 main_color?: string | null;
 second_color?: string | null;
 mainColor?: string | null;
 secondColor?: string | null;
 text_color?: string | null;
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
