import type { PopupPageType } from "../types";

export function getPageTypeFromPath(pathname: string): PopupPageType {
    const path = pathname.replace(/\/+$/, "") || "/";

    if (path === "/" || path === "") return "home";

    // Detail pages — checked before list pages. Their slugs use the `_details`
    // convention to match the backend `pages.slug` values, and they carry an
    // entity id (see useEntityContext) so the popup can be scoped correctly.
    if (/^\/product\/\d+/.test(path)) return "product_details";
    if (/^\/shop_details\/\d+/.test(path)) return "shop_details";
    if (/^\/recipe\/\d+/.test(path)) return "recipe_details";
    if (/^\/basket\/\d+/.test(path)) return "basket_details";

    // List / section pages
    if (path.startsWith("/categories") || path.startsWith("/products"))
        return "category";
    if (path.startsWith("/cart") || path.startsWith("/checkout")) return "cart";
    if (path.startsWith("/account") || path.startsWith("/profile"))
        return "account";

    return "home";
}
