import type { MyReviewsUiFilterValue } from "../constants";

/**
 * Maps the UI review-type tab to the `type` query param for GET my ratings.
 */
export function mapUiFilterToApiRatingType(
    uiFilter: MyReviewsUiFilterValue
): string | undefined {
    if (uiFilter === "all") return undefined;
    if (uiFilter === "scheduled_basket") return "schedule_basket";
    if (uiFilter === "store") return "shop";
    if (uiFilter === "basket") return "basket";
    return uiFilter;
}
