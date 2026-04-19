import type { PaginationData } from"@/shared/types/pagination";

// ============ Recipe Badge Types ============
export interface RecipeBadge {
 id: number;
 name: string;
 color:"success"|"warning"|"danger"| string | null;
 type?: string;
 image?: string | null;
 /** API may use `position`; legacy typo `postion` kept for compatibility */
 postion?: "top"|"bottom"| null;
 position?: "top"|"bottom"| null;
}

// ============ Recipe List Item Types ============
export interface Recipe {
 id: number;
 name: string;
 description: string;
 image: string;
 rating: number;
 price: number;
 price_after_discount: number;
 discount: string;
 sold?: number;
 sold_formatted?: string;
 orders_count: number;
 created_at: string;
 budges: RecipeBadge[];
 is_favorite?: boolean;
}

// ============ Recipe Details Types ============
export interface RecipeTotals {
 total_before_discount: number;
 total_after_discount: number;
 discount_value: number;
 currency?: string;
 currency_symbol?: string;
 total_before_discount_formatted?: string;
 total_after_discount_formatted?: string;
 discount_value_formatted?: string;
}

export interface RecipeStep {
 step_number: number;
 instruction: string;
 time_minutes: string;
 heat_level: string;
}

export interface RecipeItemMain {
 product_id: number;
 shop_product_variant_id: number;
 image_url: string | null;
 name: string;
 variant?: string[];
 price: number;
 currency?: string;
 currency_symbol?: string;
 price_formatted?: string;
}

export interface RecipeItemAlternative {
 product_id: number;
 shop_product_variant_id: number;
 name: string;
 image_url: string | null;
 price: number;
 currency?: string;
 currency_symbol?: string;
 price_formatted?: string;
 variant?: string[];
}

export interface RecipeItemTerms {
 is_required: boolean | number;
 default_quantity: number;
 min_quantity: number;
 max_quantity: number;
}

export interface RecipeItem {
 terms: RecipeItemTerms;
 main_item: RecipeItemMain;
 alternatives: RecipeItemAlternative[];
 other_shops: unknown[];
}

export interface RecipeDetails {
 id: number;
 name: string;
 description: string;
 image: string;
 video_url: string | null;
 /** Optional title for the cooking video (from API). */
 video_title?: string | null;
 /** Optional short description for the cooking video (from API). */
 video_desc?: string | null;
 rating: number;
 orders_count: number;
 discount: string;
 serves?: string;
 prepare_time?: string;
 is_favorite?: boolean;
 badges?: RecipeBadge[];
 budges?: RecipeBadge[];
 top_badges?: RecipeBadge[];
 bottom_badges?: RecipeBadge[];
 totals?: RecipeTotals;
 steps: RecipeStep[];
 items: RecipeItem[];
 created_at: string;
}

// ============ API Response Types ============
export interface RecipesResponse {
 status: boolean;
 message: string;
 data: {
 items: Recipe[];
 pagination: PaginationData;
 };
}

export interface RecipeDetailsResponse {
 status: boolean;
 message: string;
 data: RecipeDetails;
}
