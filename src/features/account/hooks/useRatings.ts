import { useQuery, useMutation, useQueryClient } from"@tanstack/react-query";
import { useAuthStore } from"@/store/auth";
import { queryKeys } from"@/utils/queryKeys";
import { _RatingsApi } from"@/features/product/api/ratingsApi";
import type {
 CreateRatingPayload,
 UpdateRatingPayload,
} from"@/features/product/types/ratings";

export function useCanRate(productId: number) {
 const token = useAuthStore((s) => s.token);
 return useQuery({
 queryKey: queryKeys.ratings.canRate(productId),
 queryFn: () => _RatingsApi.getCanRate(productId),
 enabled: !!token && productId > 0,
 staleTime: 1000 * 60,
 });
}

export function useMyRatings(params?: { type?: string; rateable_id?: number }) {
 const token = useAuthStore((s) => s.token);
 return useQuery({
 queryKey: queryKeys.ratings.myRatings(params?.type, params?.rateable_id),
 queryFn: () => _RatingsApi.getMyRatings(params),
 enabled: !!token,
 staleTime: 1000 * 60,
 });
}

export function useCreateRating() {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: (payload: CreateRatingPayload) =>
 _RatingsApi.createRating(payload),
 onSuccess: (_, variables) => {
 queryClient.invalidateQueries({ queryKey: queryKeys.ratings.all() });
 queryClient.invalidateQueries({
 queryKey: queryKeys.ratings.myRatings(),
 });
 queryClient.invalidateQueries({
 queryKey: queryKeys.ratings.canRate(variables.rateable_id),
 });
 if (variables.type ==="product") {
 queryClient.invalidateQueries({
 queryKey: queryKeys.product.ratings(
 variables.rateable_id,
"product",
 ),
 });
 queryClient.invalidateQueries({ queryKey: queryKeys.product.all() });
 }
 if (variables.type ==="recipe") {
 queryClient.invalidateQueries({
 queryKey: queryKeys.recipes.details(variables.rateable_id),
 });
 }
 if (
 variables.type ==="basket"||
 variables.type ==="schedule_basket"
 ) {
 queryClient.invalidateQueries({
 queryKey: queryKeys.ratings.list(
 variables.rateable_id,
 variables.type
 ),
 });
 }
 if (variables.type ==="shop") {
 queryClient.invalidateQueries({
 queryKey: queryKeys.ratings.list(variables.rateable_id,"shop"),
 });
 queryClient.invalidateQueries({
 queryKey: queryKeys.shop.details(variables.rateable_id),
 });
 }
 if (variables.type ==="brand") {
 queryClient.invalidateQueries({
 queryKey: queryKeys.ratings.list(variables.rateable_id,"brand"),
 });
 queryClient.invalidateQueries({
 queryKey: queryKeys.brands.details(variables.rateable_id),
 });
 }
 },
 });
}

export function useUpdateRating() {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: ({
 id,
 payload,
 }: { id: number; payload: UpdateRatingPayload }) =>
 _RatingsApi.updateRating(id, payload),
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: queryKeys.ratings.all() });
 queryClient.invalidateQueries({
 queryKey: queryKeys.ratings.myRatings(),
 });
 },
 });
}

export function useDeleteRating() {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: (id: number) => _RatingsApi.deleteRating(id),
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: queryKeys.ratings.all() });
 queryClient.invalidateQueries({
 queryKey: queryKeys.ratings.myRatings(),
 });
 },
 });
}
