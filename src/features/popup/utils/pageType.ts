import type { PopupPageType } from "../types";

export function getPageTypeFromPath(pathname: string): PopupPageType {
    const path = pathname.replace(/\/+$/, "") || "/";

    if (path === "/" || path === "") return "home";
    if (path.startsWith("/categories")) return "category";
    if (path.startsWith("/products") || path.startsWith("/product"))
        return "product";
    if (path.startsWith("/cart") || path.startsWith("/checkout")) return "cart";
    if (path.startsWith("/store") || path.startsWith("/shop")) return "shop";
    if (path.startsWith("/recipes") || path.startsWith("/recipe"))
        return "recipe";
    if (path.startsWith("/account") || path.startsWith("/profile"))
        return "account";

    return "home";
}
