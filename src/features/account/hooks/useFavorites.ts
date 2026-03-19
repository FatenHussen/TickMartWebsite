import { useQuery, useMutation, useQueryClient } from"@tanstack/react-query";
import { queryKeys } from"@/utils/queryKeys";
import { favoritesApi } from"../api/favoritesApi";
import type { FavoriteType, ToggleFavoritePayload } from"../types";

export function useFavorites(type: FavoriteType, enabled = true) {
 return useQuery({
 queryKey: queryKeys.favorites.list(type),
 enabled,
 queryFn: () => favoritesApi.getFavorites(type),
 staleTime: 1000 * 60 * 2, // 2 minutes
 gcTime: 1000 * 60 * 10,
 });
}

export type WishlistFiltersParams = {
 shopId?: number;
 categoryId?: number;
 type?: FavoriteType;
};

export function useAllFavorites(params?: WishlistFiltersParams, enabled = true) {
 const queryParams = {
 shop_id: params?.shopId,
 category_id: params?.categoryId,
 };
 return useQuery({
 queryKey: [
"favorites",
"list",
 params?.type ?? null,
 params?.shopId ?? null,
 params?.categoryId ?? null,
 ],
 enabled,
 queryFn: () => favoritesApi.getFavorites(params?.type, queryParams),
 staleTime: 1000 * 60 * 2,
 gcTime: 1000 * 60 * 10,
 });
}

export function useToggleFavorite() {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: (payload: ToggleFavoritePayload) =>
 favoritesApi.toggleFavorite(payload),
 onMutate: async (variables) => {
 if (variables?.type !== "product" || variables?.id == null) return;
 const matches = queryClient.getQueriesData<{ is_favorite?: boolean }>({
 queryKey: ["product", "details"],
 predicate: (query) => query.queryKey[2] === variables.id,
 });
 matches.forEach(([queryKey, data]) => {
 if (data && typeof data === "object") {
 queryClient.setQueryData(queryKey, {
 ...data,
 is_favorite: !data.is_favorite,
 });
 }
 });
 },
 onSuccess: (_, variables) => {
 queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all() });
 if (variables?.type === "product" && variables?.id != null) {
 queryClient.invalidateQueries({ queryKey: ["product", "details"] });
 }
 },
 });
}
