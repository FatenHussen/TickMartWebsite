import { useMemo } from"react";
import { useQuery } from"@tanstack/react-query";
import { queryKeys } from"@/utils/queryKeys";
import { _ShopApi } from"../api/shopApi";
import { _RatingsApi, type GetRatingsParams } from"@/features/product/api/ratingsApi";
import type { RatingItem } from"@/features/product/types/ratings";
import type {
 Review,
 RatingDistribution,
} from"@/shared/component/ProductReviews";

export function useShopDetails(shopId: number) {
 return useQuery({
 queryKey: queryKeys.shop.details(shopId),
 queryFn: () => _ShopApi.getShopDetails(shopId),
 enabled: shopId > 0,
 });
}

export function useShopServices(shopId: number, enabled = true) {
 return useQuery({
 queryKey: queryKeys.shop.services(shopId),
 queryFn: () => _ShopApi.getShopServices(shopId),
 enabled: enabled && shopId > 0,
 });
}

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
 return items.reduce((acc, i) => acc + i.rating, 0) / items.length;
}

export function useShopRatings(shopId: number) {
 const params: GetRatingsParams = {
 rateableId: shopId,
 rateableType:"shop",
 };

 const query = useQuery({
 queryKey: queryKeys.ratings.list(shopId,"shop"),
 queryFn: () => _RatingsApi.getRatings(params),
 enabled: shopId > 0,
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
