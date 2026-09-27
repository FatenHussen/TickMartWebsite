import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";
import type { ProductDetailsResponse } from"../types/productDetails";

export interface GetProductDetailsParams {
 productId: number;
 lat: number;
 lng: number;
}

export const _ProductApi = {
 getProductDetails: async (
 params: GetProductDetailsParams,
 ): Promise<ProductDetailsResponse> => {
 const { productId, lat, lng } = params;
 const response = await _axios.get<ProductDetailsResponse>(
 apiRoutes.product.details(productId, lat, lng),
 {
 // Revalidate so a replaced icon URL (`?v=`) is not read from a cached GET.
 headers: {
 "Cache-Control": "no-cache",
 Pragma: "no-cache",
 },
 },
 );
 return response.data;
 },
};
