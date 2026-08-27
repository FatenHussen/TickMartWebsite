import { useQuery } from"@tanstack/react-query";
import { queryKeys } from"@/utils/queryKeys";
import { _CategoriesApi } from"../api/categories.service";

const HOME_CATEGORIES_LIMIT = 7;

export function useCategories() {
 return useQuery({
 queryKey: queryKeys.categories.list(),
 queryFn: () => _CategoriesApi.getCategories(),
 select: (response) => response.data.items,
 // Catalog changes from the dashboard; don't keep a deleted category for minutes.
 staleTime: 30_000,
 refetchOnWindowFocus: true,
 refetchOnMount: "always",
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
