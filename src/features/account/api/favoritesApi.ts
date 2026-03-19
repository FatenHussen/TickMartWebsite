import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";
import type {
 FavoriteItem,
 FavoriteType,
 FavoritesResponse,
 ToggleFavoritePayload,
} from"../types";

export interface FavoritesListParams {
 shop_id?: number;
 category_id?: number;
 page?: number;
 per_page?: number;
}

export const favoritesApi = {
 getFavorites: async (
 type?: FavoriteType,
 params?: FavoritesListParams
 ): Promise<FavoriteItem[]> => {
 const res = await _axios.get<FavoritesResponse>(
 apiRoutes.favorites.list(type, params),
 );
 const raw = res.data.data;
 if (Array.isArray(raw)) return raw;
 if (raw && typeof raw ==="object"&&"items"in raw && Array.isArray(raw.items)) {
 return raw.items;
 }
 return [];
 },

 toggleFavorite: async (payload: ToggleFavoritePayload): Promise<{
 success: boolean;
 data?: { message: string; is_favorite: boolean };
 }> => {
 const res = await _axios.post<
 | { success: boolean; data: { message: string; is_favorite: boolean } }
 | { status: boolean; message: string }
 >(apiRoutes.favorites.toggle, payload);
 const d = res.data as { success?: boolean; data?: { message: string; is_favorite: boolean }; status?: boolean; message?: string };
 if (d.data) {
 return { success: d.success ?? true, data: d.data };
 }
 return {
 success: d.status ?? d.success ?? true,
 data: { message: d.message ??"", is_favorite: true },
 };
 },
};
