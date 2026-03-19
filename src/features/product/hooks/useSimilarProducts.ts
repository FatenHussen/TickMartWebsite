import { useQuery } from"@tanstack/react-query";
import { _ProductsApi } from"@/features/home/api/products.service";

export function useSimilarProducts(categoryId: number | undefined) {
 return useQuery({
 queryKey: ["products","similar", categoryId],
 queryFn: () => _ProductsApi.getProducts({ category_id: categoryId, page: 1 }),
 select: (response) => response.data.items,
 enabled: !!categoryId,
 });
}
