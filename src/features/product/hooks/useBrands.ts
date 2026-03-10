import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { _BrandApi } from "../api/brandApi";
import { _RatingsApi, type GetRatingsParams } from "../api/ratingsApi";
import type { RatingItem } from "../types/ratings";
import type {
  Review,
  RatingDistribution,
} from "@/shared/component/ProductReviews";

export type BrandsFilters = {
  search?: string;
  type?: "new" | "top_rated" | "most_popular";
  page?: number;
  per_page?: number;
};

/**
 * Hook to fetch all brands with optional filters
 */
export function useBrands(filters?: BrandsFilters) {
  return useQuery({
    queryKey: queryKeys.brands.list(filters),
    queryFn: () => _BrandApi.getBrands(filters),
    select: (response) => response.data,
  });
}

/**
 * Hook to fetch brand details by ID
 */
export function useBrandDetails(brandId: number | string) {
  return useQuery({
    queryKey: queryKeys.brands.details(brandId),
    queryFn: () => _BrandApi.getBrandDetails(brandId),
    select: (response) => response.data,
    enabled: !!brandId,
  });
}

export interface BrandProductFilters {
  is_free_delivery?: 0 | 1;
  on_sale?: 0 | 1;
  in_stock_only?: 0 | 1;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

/**
 * Hook to fetch products for a specific brand with full filter support.
 */
export function useBrandProducts(brandId: number, filters?: BrandProductFilters) {
  return useQuery({
    queryKey: queryKeys.brands.products(brandId, filters),
    queryFn: () => _BrandApi.getBrandProducts(brandId, filters),
    select: (response) => response.data,
    enabled: !!brandId,
  });
}

function mapItemToReview(item: RatingItem): Review {
  const date = item.created_at
    ? new Date(item.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";
  return {
    id: String(item.id),
    rating: item.rating,
    text: item.comment,
    date,
    reviewerName: item.user?.name ?? "",
    reviewerAvatar: item.user?.image ?? undefined,
  };
}

function computeDistribution(items: RatingItem[]): RatingDistribution {
  const dist: RatingDistribution = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
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

/**
 * Hook to fetch ratings for a brand
 */
export function useBrandRatings(brandId: number) {
  const params: GetRatingsParams = {
    rateableId: brandId,
    rateableType: "brand",
  };

  const query = useQuery({
    queryKey: queryKeys.ratings.list(brandId, "brand"),
    queryFn: () => _RatingsApi.getRatings(params),
    enabled: brandId > 0,
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
