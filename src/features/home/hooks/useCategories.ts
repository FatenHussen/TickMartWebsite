import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { _CategoriesApi } from "../api/categories.service";

const HOME_CATEGORIES_LIMIT = 7;

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => _CategoriesApi.getCategories(),
    select: (response) => response.data.items,
  });
}

export function useHomeCategories() {
  const query = useCategories();

  const categories = query.data?.slice(0, HOME_CATEGORIES_LIMIT) ?? [];

  return {
    ...query,
    categories,
  };
}
