import { paths } from "@/app/routes/path/paths";
import { buildCategoryTrailSearch } from "@/features/categories/lib/categoryTrail";
import type { NavMenuItem } from "../types";

/**
 * `route_key` → the route that actually exists in this SPA.
 *
 * The API docs suggest `/points`, `/help`, `/my-baskets` and
 * `/subscription-packages`, none of which this app routes — they map onto the
 * real equivalents below instead. Aliases cover the alternative spellings the
 * dashboard already uses for the same destinations elsewhere (compare
 * `resolveQuickActionPath`); keys are normalized so `points_rewards` and
 * `points-rewards` both land.
 */
const NAV_ROUTE_MAP: Record<string, string> = {
    home: paths.client.home,
    categories: paths.client.categories,
    brands: paths.client.brands,
    shops: paths.client.store,
    shop: paths.client.store,
    store: paths.client.store,
    baskets: paths.client.baskets,
    "my-baskets": paths.client.baskets,
    schedules: paths.client.schedules,
    "custom-basket": paths.client.schedules,
    "custom-baskets": paths.client.schedules,
    points: paths.account.pointsRewards,
    "points-rewards": paths.account.pointsRewards,
    help: paths.account.helpSupport,
    "help-support": paths.account.helpSupport,
    recipes: paths.client.recipes,
    products: paths.client.products,
    privacy: paths.client.privacyPolicy,
    terms: paths.client.termsConditions,
};

/**
 * Subscription packages have no page in this app — they live in the
 * `AffiliatePackagesPopup` modal, so the item renders as a button. The dashboard
 * still controls its title, order and visibility like any other item.
 */
const MODAL_ROUTE_KEYS = new Set(["subscriptions", "subscription-packages"]);

/** Destinations that are a modal on web rather than a route. */
export type NavMenuModal = "subscriptionPackages";

export type NavMenuDestination =
    | { kind: "internal"; to: string }
    | { kind: "external"; href: string }
    | { kind: "modal"; modal: NavMenuModal };

/** A resolved item: the API row plus where it actually goes. */
export type ResolvedNavMenuItem = {
    item: NavMenuItem;
    destination: NavMenuDestination;
};

function normalizeKey(value: string): string {
    return value.trim().toLowerCase().replace(/_/g, "-");
}

/**
 * `target.url` is dashboard-authored, so it reaches `href` only if it is really
 * an http(s) address — this is what keeps a `javascript:` value out of the DOM.
 */
function isSafeExternalUrl(raw: string): boolean {
    try {
        const { protocol } = new URL(raw, window.location.origin);
        return protocol === "http:" || protocol === "https:";
    } catch {
        return false;
    }
}

/**
 * Maps one API item to a web destination, or `null` when it cannot be resolved
 * (unknown `route_key`, missing id, unsafe url…). Callers drop `null` items
 * instead of rendering a dead link — that is the safe fallback the API contract
 * asks for when the dashboard grows a value the web app does not know yet.
 */
export function resolveNavMenuItem(item: NavMenuItem): NavMenuDestination | null {
    const target = item.target;

    switch (item.type) {
        case "route": {
            if (!target?.route_key) return null;
            const key = normalizeKey(target.route_key);
            if (MODAL_ROUTE_KEYS.has(key)) {
                return { kind: "modal", modal: "subscriptionPackages" };
            }
            const to = NAV_ROUTE_MAP[key];
            return to ? { kind: "internal", to } : null;
        }

        case "category": {
            const id = Number(target?.category_id);
            if (!Number.isInteger(id) || id <= 0) return null;
            // There is no `/categories/:id` route — the drill-down path lives in
            // `?trail=`, which is also what makes Back walk one level up.
            return {
                kind: "internal",
                to: `${paths.client.categories}${buildCategoryTrailSearch([id])}`,
            };
        }

        case "brand": {
            const id = Number(target?.brand_id);
            if (!Number.isInteger(id) || id <= 0) return null;
            return { kind: "internal", to: paths.client.brandDetails(id) };
        }

        case "page": {
            // Prefer CMS Page Builder `/pages/{slug}`; fall back to a known
            // app route when the slug matches NAV_ROUTE_MAP (e.g. "brands").
            const slug =
                target?.slug?.trim() ||
                (target?.page_id != null ? String(target.page_id) : "");
            if (!slug) return null;
            const mapped = NAV_ROUTE_MAP[normalizeKey(slug)];
            if (mapped) return { kind: "internal", to: mapped };
            return {
                kind: "internal",
                to: paths.client.cmsPageBySlug(slug),
            };
        }

        case "url": {
            const url = target?.url?.trim();
            if (!url || !isSafeExternalUrl(url)) return null;
            return { kind: "external", href: url };
        }

        default:
            return null;
    }
}

/** Resolves the whole menu, dropping items with no reachable destination. */
export function resolveNavMenu(items: NavMenuItem[]): ResolvedNavMenuItem[] {
    return items.reduce<ResolvedNavMenuItem[]>((acc, item) => {
        const destination = resolveNavMenuItem(item);
        if (destination) acc.push({ item, destination });
        else if (import.meta.env.DEV) {
            console.warn(
                `[nav-menu] dropped item #${item.id} ("${item.title}") — unresolved ${item.type} target`,
                item.target,
            );
        }
        return acc;
    }, []);
}

/**
 * Active-state test for a nav destination. `to` may carry a query string (the
 * category trail), and only a full segment counts as a match so `/brands` does
 * not light up on `/brands-something`.
 */
export function isNavPathActive(pathname: string, to: string): boolean {
    const path = to.split("?")[0];
    if (path === "/" || path === paths.client.home) {
        return pathname === "/" || pathname === paths.client.home;
    }
    return pathname === path || pathname.startsWith(`${path}/`);
}
