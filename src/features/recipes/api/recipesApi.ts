import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { RecipesResponse, RecipeDetailsResponse } from "../types";

export const _RecipesApi = {
  // Get all recipes with pagination
  getRecipes: async (page?: number): Promise<RecipesResponse> => {
    const response = await _axios.get<RecipesResponse>(
      apiRoutes.recipes.list(page)
    );
    return response.data;
  },

  // Get single recipe details
  getRecipeDetails: async (
    id: number
  ): Promise<RecipeDetailsResponse["data"]> => {
    const response = await _axios.get<RecipeDetailsResponse>(
      apiRoutes.recipes.details(id)
    );
    return response.data.data;
  },
};
