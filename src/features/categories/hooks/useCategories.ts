import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { _CategoriesApi } from "../api/categoriesApi";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => _CategoriesApi.getCategories(),
    select: (response) => response.data.items,
  });
}
