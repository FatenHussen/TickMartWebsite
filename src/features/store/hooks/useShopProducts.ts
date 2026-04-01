import { useQuery } from"@tanstack/react-query";
import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";
import type { ProductsResponse } from"@/features/categories/types";

export function useShopProducts(
shopId: number,
page?: number,
categoryId?: number
) {
 return useQuery({
 queryKey: ["shop","products", shopId, page, categoryId],
 queryFn: async () => {
 const response = await _axios.get<ProductsResponse>(
 apiRoutes.product.listByShop(shopId, page, categoryId)
 );
 return response.data.data;
 },
 enabled: shopId > 0,
 });
}
