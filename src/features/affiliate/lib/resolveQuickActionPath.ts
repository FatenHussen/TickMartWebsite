import { paths } from "@/app/routes/path/paths";

/**
 * Maps CMS `page_slug` values from quick-actions API to app routes.
 */
const PAGE_SLUG_TO_PATH: Record<string, string> = {
    home: paths.client.home,
    products: paths.client.products,
    shops: paths.client.store,
    shop: paths.client.store,
    baskets: paths.client.baskets,
    recipes: paths.client.recipes,
    brands: paths.client.brands,
};

export function resolveQuickActionPath(pageSlug: string): string {
    const key = pageSlug.trim().toLowerCase();
    return PAGE_SLUG_TO_PATH[key] ?? `/${key}`;
}
