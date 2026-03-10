import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { RecipesResponse, RecipeDetailsResponse } from "../types";

export interface RecipeFilters {
  search?: string;
  discount_min?: number;
  discount_max?: number;
  serves_min?: number;
  serves_max?: number;
  prepare_time_min?: number;
  prepare_time_max?: number;
  sortField?: "discount" | "rating" | "orders_count" | "created_at";
  sortOrder?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export const _RecipesApi = {
  getRecipes: async (filters?: RecipeFilters): Promise<RecipesResponse> => {
    const response = await _axios.get<RecipesResponse>(
      apiRoutes.recipes.list(filters)
    );
    return response.data;
  },

  getRecipeDetails: async (
    id: number
  ): Promise<RecipeDetailsResponse["data"]> => {
    const response = await _axios.get<RecipeDetailsResponse>(
      apiRoutes.recipes.details(id)
    );
    return response.data.data;
  },
};
