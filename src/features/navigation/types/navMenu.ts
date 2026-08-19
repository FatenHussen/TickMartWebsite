/**
 * Top navigation bar, driven by the dashboard.
 *
 * `GET /user/nav-menu` (public, no token) returns only the enabled items,
 * already sorted by `order` ascending — the web app renders them in the order
 * they arrive and never re-sorts.
 *
 * `title` arrives as a single string in the language of the request's
 * `Accept-Language` header (not an `{ ar, en }` object), so it needs no
 * localized-value resolution.
 */

export type NavMenuItemType = "route" | "category" | "brand" | "page" | "url";

export interface NavMenuTarget {
    /** `type: "route"` — a fixed internal destination, see `NAV_ROUTE_MAP`. */
    route_key?: string;
    /** `type: "category"` */
    category_id?: number;
    /** Category/brand display name; the item's own `title` wins over it. */
    name?: string;
    /** `type: "brand"` */
    brand_id?: number;
    /** `type: "page"` — Page Builder page. */
    page_id?: number;
    slug?: string;
    /** `type: "url"` — external link. */
    url?: string;
}

export interface NavMenuItem {
    id: number;
    title: string;
    type: NavMenuItemType;
    /** Absolute image URL, or `null` — render the item as text only then. */
    icon?: string | null;
    order?: number;
    open_in_new_tab?: boolean;
    target?: NavMenuTarget | null;
}

export interface NavMenuResponse {
    status: boolean;
    message: string;
    data: NavMenuItem[];
}
