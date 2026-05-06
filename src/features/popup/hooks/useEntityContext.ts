import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import type { PopupEntityContext } from "../types";

// Regex patterns ordered from most-specific to most-general to avoid greedy
// matches on ambiguous paths like /product-details/123 vs /products.
const PATTERNS: Array<{
    regex: RegExp;
    key: keyof PopupEntityContext;
}> = [
    { regex: /^\/product\/(\d+)/, key: "product_id" },
    { regex: /^\/shop_details\/(\d+)/, key: "shop_id" },
    { regex: /^\/recipe\/(\d+)/, key: "recipe_id" },
    { regex: /^\/basket\/(\d+)/, key: "basket_id" },
];

function resolveEntity(pathname: string): PopupEntityContext {
    for (const { regex, key } of PATTERNS) {
        const match = pathname.match(regex);
        if (match) return { [key]: Number(match[1]) };
    }
    return {};
}

/**
 * Reads the current route and returns whichever entity ID is in the URL.
 * Returns an empty object on non-entity pages. Memoized by pathname so it
 * doesn't cause re-renders on query-string changes.
 */
export function useEntityContext(): PopupEntityContext {
    const { pathname } = useLocation();
    return useMemo(() => resolveEntity(pathname), [pathname]);
}
