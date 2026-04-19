/**
 * Backend Page slugs (see Page model / seed) — used as GET /notifications?target_page=…
 */
export const NOTIFICATION_PAGE_SLUGS = {
  home: "home",
  recipes: "recipes",
  recipe_details: "recipe_details",
  brands: "brands",
  brand_details: "brand_details",
  baskets: "baskets",
  basket_details: "basket_details",
  products: "products",
  product_details: "product_details",
  shops: "shops",
  shop_details: "shop_details",
} as const;

export type NotificationPageSlug =
  (typeof NOTIFICATION_PAGE_SLUGS)[keyof typeof NOTIFICATION_PAGE_SLUGS];

/**
 * Maps the current URL pathname to a notification `target_page` slug, or null if none applies.
 */
export function getNotificationTargetPageFromPathname(
  pathname: string
): NotificationPageSlug | null {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/home" || path === "/") {
    return NOTIFICATION_PAGE_SLUGS.home;
  }

  if (path === "/recipes") {
    return NOTIFICATION_PAGE_SLUGS.recipes;
  }
  if (path.startsWith("/recipe/")) {
    return NOTIFICATION_PAGE_SLUGS.recipe_details;
  }

  if (path === "/brands") {
    return NOTIFICATION_PAGE_SLUGS.brands;
  }
  if (/^\/brand\/[^/]+\/products$/.test(path)) {
    return NOTIFICATION_PAGE_SLUGS.brand_details;
  }

  if (path === "/baskets") {
    return NOTIFICATION_PAGE_SLUGS.baskets;
  }
  if (path.startsWith("/basket/")) {
    return NOTIFICATION_PAGE_SLUGS.basket_details;
  }

  if (path === "/products") {
    return NOTIFICATION_PAGE_SLUGS.products;
  }
  if (path.startsWith("/product/")) {
    return NOTIFICATION_PAGE_SLUGS.product_details;
  }

  if (path === "/shops" || path.startsWith("/shops/")) {
    return NOTIFICATION_PAGE_SLUGS.shops;
  }
  if (path.startsWith("/shop_details/")) {
    return NOTIFICATION_PAGE_SLUGS.shop_details;
  }

  return null;
}
