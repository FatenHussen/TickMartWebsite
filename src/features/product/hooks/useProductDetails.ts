import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { _ProductApi, type GetProductDetailsParams } from "../api/productApi";

export function useProductDetails(params: GetProductDetailsParams) {
  return useQuery({
    queryKey: queryKeys.product.details(params.productId, params.shopId),
    queryFn: () => _ProductApi.getProductDetails(params),
    select: (response) => response.data,
    enabled: !!params.productId && !!params.shopId,
  });
}
