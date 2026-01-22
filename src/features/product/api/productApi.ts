import _axios from "@/app/middleware/interceptor";
import { endpoints } from "@/app/routes/path/paths";
import type { ProductDetailsResponse } from "../types/productDetails";

export interface GetProductDetailsParams {
  productId: number;
  lat: number;
  lng: number;
  shopId: number;
}

export const _ProductApi = {
  getProductDetails: async (params: GetProductDetailsParams): Promise<ProductDetailsResponse> => {
    const { productId, lat, lng, shopId } = params;
    const response = await _axios.get<ProductDetailsResponse>(
      endpoints.product.details(productId, lat, lng, shopId)
    );
    return response.data;
  },
};
