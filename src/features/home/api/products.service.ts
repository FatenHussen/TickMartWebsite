import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { ProductsListResponse } from "../types";

export interface ProductsFilters {
  category_id?: number;
  brand_id?: number;
  shop_id?: number;
  page?: number;
}

export const _ProductsApi = {
  getProducts: async (
    filters?: ProductsFilters
  ): Promise<ProductsListResponse> => {
    const response = await _axios.get<ProductsListResponse>(
      apiRoutes.product.list(filters)
    );
    return response.data;
  },
};
