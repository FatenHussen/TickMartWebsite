import type { ReviewType } from "../../types";

export const MY_REVIEWS_STORAGE_BASE =
    "https://tickdash.tickmartsy.com/storage" as const;

/** UI filter tab value (includes "all"); maps to API `type` via `mapUiFilterToApiRatingType`. */
export type MyReviewsUiFilterValue = ReviewType | "all";

export type MyReviewsSortBy = "newest" | "oldest" | "rating_high" | "rating_low";

export type MyReviewsRatingFilter = "all" | "5" | "4" | "3" | "2" | "1";

export const MY_REVIEWS_FILTER_DEFS: ReadonlyArray<{
    value: MyReviewsUiFilterValue;
    labelKey: string;
}> = [
    { value: "all", labelKey: "account.myReviews.filters.all" },
    { value: "product", labelKey: "account.myReviews.filters.products" },
    { value: "store", labelKey: "account.myReviews.filters.stores" },
    { value: "delivery", labelKey: "account.myReviews.filters.delivery" },
    {
        value: "scheduled_basket",
        labelKey: "account.myReviews.filters.scheduledBaskets",
    },
    { value: "recipe", labelKey: "account.myReviews.filters.recipes" },
    { value: "brand", labelKey: "account.myReviews.filters.brands" },
    { value: "basket", labelKey: "account.myReviews.filters.baskets" },
];

export const MY_REVIEWS_SORT_DEFS: ReadonlyArray<{
    value: MyReviewsSortBy;
    labelKey: string;
}> = [
    { value: "newest", labelKey: "account.myReviews.sort.newest" },
    { value: "oldest", labelKey: "account.myReviews.sort.oldest" },
    {
        value: "rating_high",
        labelKey: "account.myReviews.sort.highestRating",
    },
    { value: "rating_low", labelKey: "account.myReviews.sort.lowestRating" },
];

export const MY_REVIEWS_RATING_FILTER_DEFS: ReadonlyArray<{
    value: MyReviewsRatingFilter;
    labelKey: string;
}> = [
    { value: "all", labelKey: "account.myReviews.ratingFilter.all" },
    { value: "5", labelKey: "account.myReviews.ratingFilter.fiveStars" },
    { value: "4", labelKey: "account.myReviews.ratingFilter.fourStars" },
    { value: "3", labelKey: "account.myReviews.ratingFilter.threeStars" },
    { value: "2", labelKey: "account.myReviews.ratingFilter.twoStars" },
    { value: "1", labelKey: "account.myReviews.ratingFilter.oneStar" },
];
