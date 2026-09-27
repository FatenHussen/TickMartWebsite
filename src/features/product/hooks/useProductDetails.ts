import { useQuery } from"@tanstack/react-query";
import { queryKeys } from"@/utils/queryKeys";
import { isNotFoundResult, valueOrNotFound } from"@/shared/lib/apiNotFound";
import { _ProductApi, type GetProductDetailsParams } from"../api/productApi";
import { readProductRating } from"../lib/productRating";

export function useProductDetails(params: GetProductDetailsParams) {
 return useQuery({
 queryKey: queryKeys.product.details(params.productId),
 queryFn: () => valueOrNotFound(() => _ProductApi.getProductDetails(params)),
 select: (response) => {
 if (isNotFoundResult(response)) return null;
 const data = response.data;
 if (!data) return data;
 return {
 ...data,
 rating: readProductRating(data.rating),
 };
 },
 enabled: !!params.productId,
 // Latest GET on each visit. Icon image URLs include `?v=` and must not
 // stay on a previously cached product payload.
 staleTime: 0,
 refetchOnMount: "always",
 refetchOnWindowFocus: true,
 });
}
