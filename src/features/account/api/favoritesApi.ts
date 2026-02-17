import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type {
  FavoriteType,
  FavoritesResponse,
  ToggleFavoritePayload,
} from "../types";

export const favoritesApi = {
  getFavorites: async (type: FavoriteType): Promise<FavoritesResponse["data"]> => {
    const res = await _axios.get<FavoritesResponse>(
      apiRoutes.favorites.list(type),
    );
    return res.data.data;
  },

  toggleFavorite: async (
    payload: ToggleFavoritePayload,
  ): Promise<{ status: boolean; message: string }> => {
    const res = await _axios.post<{ status: boolean; message: string }>(
      apiRoutes.favorites.toggle,
      payload,
    );
    return res.data;
  },
};
