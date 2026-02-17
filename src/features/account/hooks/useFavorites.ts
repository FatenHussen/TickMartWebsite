import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { favoritesApi } from "../api/favoritesApi";
import type { FavoriteType, ToggleFavoritePayload } from "../types";

export function useFavorites(type: FavoriteType, enabled = true) {
  return useQuery({
    queryKey: queryKeys.favorites.list(type),
    enabled,
    queryFn: () => favoritesApi.getFavorites(type),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ToggleFavoritePayload) =>
      favoritesApi.toggleFavorite(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all() });
    },
  });
}
