import { paths } from"@/app/routes/path/paths";

/**
 * Converts params object to query string
 * Handles simple params like { type:"trend"}
 * and complex params like { discount: { value: 50, operator:"<="} }
 */
function buildQueryString(
 params: Record<string, unknown> | unknown[] | null | undefined
): string {
 if (!params) return"";

 // If params is an empty array, return empty string
 if (Array.isArray(params) && params.length === 0) return"";

 // If params is an object
 if (typeof params ==="object"&& !Array.isArray(params)) {
 const searchParams = new URLSearchParams();

 for (const [key, value] of Object.entries(params)) {
 if (value === null || value === undefined) continue;

 // Handle nested objects (e.g., { discount: { value: 50, operator:"<="} })
 if (typeof value ==="object"&& !Array.isArray(value)) {
 for (const [nestedKey, nestedValue] of Object.entries(value)) {
 if (nestedValue !== null && nestedValue !== undefined) {
 searchParams.append(`${key}[${nestedKey}]`, String(nestedValue));
 }
 }
 } else if (Array.isArray(value)) {
 // Handle arrays
 value.forEach((item) => {
 searchParams.append(`${key}[]`, String(item));
 });
 } else {
 // Handle simple values
 searchParams.append(key, String(value));
 }
 }

 const queryString = searchParams.toString();
 return queryString ? `?${queryString}` :"";
 }

 return"";
}

/**
 * Maps page_slug from API to actual route path
 * @param pageSlug - The page_slug from API (e.g.,"brands","recipes","products","baskets")
 * @param params - Optional params object to append as query string
 * @returns The full route path with query string if params provided
 */
export function mapPageSlugToRoute(
 pageSlug: string,
 params?: Record<string, unknown> | unknown[] | null
): string {
 const routeMap: Record<string, string> = {
 brands: paths.client.brands,
 recipes: paths.client.recipes,
 products: paths.client.products,
 baskets: paths.client.baskets,
 categories: paths.client.categories,
 };

 const baseRoute = routeMap[pageSlug] || `/${pageSlug}`;
 const queryString = buildQueryString(params);

 return `${baseRoute}${queryString}`;
}

/**
 * Maps action.page_slug from API to actual route path with item ID
 * @param actionPageSlug - The action.page_slug from API (e.g.,"brand_details","product_details")
 * @param itemId - The ID of the item to navigate to
 * @returns The route path with ID
 */
export function mapActionPageSlugToRoute(
 actionPageSlug: string,
 itemId: number | string
): string {
 const routeMap: Record<string, (id: number | string) => string> = {
 brand_details: paths.client.brandDetails,
 product_details: paths.client.productDetails,
 recipe_details: paths.client.recipeDetails,
 basket_details: paths.client.basketDetails,
 shop_details: paths.client.shopDetails,
 };

 const routeBuilder = routeMap[actionPageSlug];

 if (routeBuilder) {
 return routeBuilder(itemId);
 }

 // Fallback: if no mapping found, use product details as default
 return paths.client.productDetails(itemId);
}
