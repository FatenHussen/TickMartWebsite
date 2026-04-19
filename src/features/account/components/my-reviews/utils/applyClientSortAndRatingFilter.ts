import type { ReviewUnion } from "../../../types";
import type { MyReviewsRatingFilter, MyReviewsSortBy } from "../constants";

export function applyClientSortAndRatingFilter(
    reviews: ReviewUnion[],
    sortBy: MyReviewsSortBy,
    ratingFilter: MyReviewsRatingFilter
): ReviewUnion[] {
    let next = reviews;

    if (ratingFilter !== "all") {
        const ratingValue = parseInt(ratingFilter, 10);
        next = next.filter(
            (review) => Math.round(review.rating) === ratingValue
        );
    }

    const sorted = [...next];
    sorted.sort((reviewA, reviewB) => {
        switch (sortBy) {
            case "newest":
                return (
                    new Date(reviewB.createdAt).getTime() -
                    new Date(reviewA.createdAt).getTime()
                );
            case "oldest":
                return (
                    new Date(reviewA.createdAt).getTime() -
                    new Date(reviewB.createdAt).getTime()
                );
            case "rating_high":
                return reviewB.rating - reviewA.rating;
            case "rating_low":
                return reviewA.rating - reviewB.rating;
            default:
                return 0;
        }
    });

    return sorted;
}
