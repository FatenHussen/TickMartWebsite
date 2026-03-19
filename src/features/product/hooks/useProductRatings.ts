import { useMemo } from"react";
import { useQuery } from"@tanstack/react-query";
import { queryKeys } from"@/utils/queryKeys";
import { _RatingsApi, type GetRatingsParams } from"../api/ratingsApi";
import type { RatingItem } from"../types/ratings";
import type {
 Review,
 RatingDistribution,
} from"@/shared/component/ProductReviews";

const RATEABLE_TYPE_PRODUCT ="product";

function mapItemToReview(item: RatingItem): Review {
 const date = item.created_at
 ? new Date(item.created_at).toLocaleDateString(undefined, {
 year:"numeric",
 month:"short",
 day:"numeric",
 })
 :"";
 return {
 id: String(item.id),
 rating: item.rating,
 text: item.comment,
 date,
 reviewerName: item.user?.name ??"",
 reviewerAvatar: item.user?.image ?? undefined,
 };
}

function computeDistribution(items: RatingItem[]): RatingDistribution {
 const dist: RatingDistribution = {"5": 0,"4": 0,"3": 0,"2": 0,"1": 0 };
 for (const item of items) {
 const key = String(
 Math.min(5, Math.max(1, item.rating))
 ) as keyof RatingDistribution;
 if (key in dist) dist[key] += 1;
 }
 return dist;
}

function computeAverage(items: RatingItem[]): number {
 if (items.length === 0) return 0;
 const sum = items.reduce((acc, i) => acc + i.rating, 0);
 return sum / items.length;
}

export function useProductRatings(productId: number) {
 const params: GetRatingsParams = {
 rateableId: productId,
 rateableType: RATEABLE_TYPE_PRODUCT,
 };

 const query = useQuery({
 queryKey: queryKeys.product.ratings(productId, RATEABLE_TYPE_PRODUCT),
 queryFn: () => _RatingsApi.getRatings(params),
 enabled: productId > 0,
 });

 const { data, isLoading, error } = query;

 const mapped = useMemo(() => {
 if (!data) {
 return {
 reviews: [] as Review[],
 averageRating: 0,
 totalReviews: 0,
 ratingDistribution: {
"5": 0,
"4": 0,
"3": 0,
"2": 0,
"1": 0,
 } as RatingDistribution,
 };
 }
 const items = data.items ?? [];
 const reviews = items.map(mapItemToReview);
 const ratingDistribution = computeDistribution(items);
 const averageRating = computeAverage(items);
 const totalReviews = data.pagination?.total ?? items.length;
 return {
 reviews,
 averageRating,
 totalReviews,
 ratingDistribution,
 };
 }, [data]);

 return {
 ...mapped,
 isLoading,
 error,
 pagination: data?.pagination,
 };
}
