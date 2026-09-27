import type { RatingDistribution } from "@/shared/component/ProductReviews";

const EMPTY_BREAKDOWN: RatingDistribution = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
};

function toCount(value: unknown): number {
    const n = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return n;
}

/** Average from the product payload. `0` means the API reported no ratings. */
export function readProductRating(value: unknown): number {
    if (value == null || value === "") return 0;
    const n = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(n) || n < 0) return 0;
    return n;
}

/**
 * Product details return `rating_breakdown` as `{ "1": 0, ..., "5": 1 }`.
 * Older payloads used a 5-item array indexed from 1 star.
 */
export function readRatingBreakdown(value: unknown): RatingDistribution {
    if (Array.isArray(value)) {
        return {
            "1": toCount(value[0]),
            "2": toCount(value[1]),
            "3": toCount(value[2]),
            "4": toCount(value[3]),
            "5": toCount(value[4]),
        };
    }

    if (value && typeof value === "object") {
        const source = value as Record<string, unknown>;
        return {
            "1": toCount(source["1"] ?? source[1]),
            "2": toCount(source["2"] ?? source[2]),
            "3": toCount(source["3"] ?? source[3]),
            "4": toCount(source["4"] ?? source[4]),
            "5": toCount(source["5"] ?? source[5]),
        };
    }

    return { ...EMPTY_BREAKDOWN };
}

export function ratingBreakdownTotal(breakdown: RatingDistribution): number {
    return (
        breakdown["1"] +
        breakdown["2"] +
        breakdown["3"] +
        breakdown["4"] +
        breakdown["5"]
    );
}
