/**
 * The category drill-down path lives entirely in the URL: `?trail=3,17,45`
 * means root 3 → child 17 → grandchild 45. Keeping it there is what makes the
 * browser Back button walk one level up, and what lets a shared link restore
 * the breadcrumb (the API returns no `parent_id`, so ancestors are not
 * recoverable from the data alone).
 */

export const TRAIL_PARAM = "trail";
/** Links from the home page still use `?category=<id>`; treated as a 1-level trail. */
export const LEGACY_CATEGORY_PARAM = "category";

const MAX_DEPTH = 8;

export function parseCategoryTrail(searchParams: URLSearchParams): number[] {
    const raw =
        searchParams.get(TRAIL_PARAM) ??
        searchParams.get(LEGACY_CATEGORY_PARAM) ??
        "";

    const ids = raw
        .split(",")
        .map((part) => Number(part.trim()))
        .filter((id) => Number.isInteger(id) && id > 0);

    // An id appears once in a tree — duplicates mean a hand-edited/looping URL.
    return ids.filter((id, i) => ids.indexOf(id) === i).slice(0, MAX_DEPTH);
}

/** Writes the trail while preserving sort/price/… params and dropping the legacy alias. */
export function writeCategoryTrail(
    searchParams: URLSearchParams,
    trail: number[],
): URLSearchParams {
    const next = new URLSearchParams(searchParams);
    next.delete(LEGACY_CATEGORY_PARAM);

    if (trail.length > 0) {
        next.set(TRAIL_PARAM, trail.join(","));
    } else {
        next.delete(TRAIL_PARAM);
    }

    return next;
}

/** `/categories?trail=…` for links built outside the categories view. */
export function buildCategoryTrailSearch(trail: number[]): string {
    const params = writeCategoryTrail(new URLSearchParams(), trail);
    const query = params.toString();
    return query ? `?${query}` : "";
}

export function isSameTrail(a: number[], b: number[]): boolean {
    return a.length === b.length && a.every((id, i) => id === b[i]);
}
