import { useQuery } from "@tanstack/react-query";
import { _ProductsApi } from "@/features/home/api/products.service";

export function useProductsFromSameSeller(shopId: number | undefined) {
  return useQuery({
    queryKey: ["products", "sameSeller", shopId],
    queryFn: () => _ProductsApi.getProducts({ shop_id: shopId, page: 1 }),
    select: (response) => response.data.items,
    enabled: !!shopId,
  });
}
