import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { _CategoriesApi } from "../api/categoriesApi";

export function useProductsByCategory(categoryId: number | undefined, page?: number) {
  return useQuery({
    queryKey: [queryKeys.product.listByCategory, categoryId, page],
    queryFn: () => _CategoriesApi.getProductsByCategory(categoryId!, page),
    select: (response) => ({
      items: response.data.items,
      pagination: response.data.pagination,
    }),
    enabled: !!categoryId,
  });
}
