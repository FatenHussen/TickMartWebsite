import type { PaginationData } from"@/shared/types/pagination";

// ============ Recipe Badge Types ============
export interface RecipeBadge {
 id: number;
 name: string;
 color:"success"|"warning"|"danger"| string;
 type?: string;
 image?: string;
 postion:"top"|"bottom"| null;
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
 price: number;
}

export interface RecipeItemAlternative {
 product_id: number;
 shop_product_variant_id: number;
 name: string;
 image_url: string | null;
 price: number;
}

export interface RecipeItemTerms {
 is_required: number;
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
 rating: number;
 orders_count: number;
 discount: string;
 serves?: string;
 prepare_time?: string;
 is_favorite?: boolean;
 badges?: RecipeBadge[];
 budges?: RecipeBadge[];
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
