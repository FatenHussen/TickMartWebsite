import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { _CategoriesApi, type CategoryFilters } from "../api/categoriesApi";

export type CategoryTypeFilter = "new" | "most_popular" | "top_rated" | undefined;

export function useCategories(filters?: CategoryTypeFilter | CategoryFilters) {
  const normalised: CategoryFilters | undefined =
    typeof filters === "string"
      ? { type: filters }
      : filters;

  return useQuery({
    queryKey: queryKeys.categories.list(normalised),
    queryFn: () => _CategoriesApi.getCategories(normalised),
    select: (response) => response.data.items,
  });
}
