import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { _RecipesApi } from "../api/recipesApi";

export function useRecipes(page?: number) {
  return useQuery({
    queryKey: queryKeys.recipes.list(page),
    queryFn: () => _RecipesApi.getRecipes(page),
    select: (response) => response.data,
  });
}

export function useRecipeDetails(id: number) {
  return useQuery({
    queryKey: queryKeys.recipes.details(id),
    queryFn: () => _RecipesApi.getRecipeDetails(id),
    enabled: id > 0,
  });
}
