import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { CategoriesResponse, ProductsResponse } from "../types";

export const _CategoriesApi = {
  // Get all categories with subcategories
  getCategories: async (): Promise<CategoriesResponse> => {
    const response = await _axios.get<CategoriesResponse>(
      apiRoutes.categories.list,
    );
    return response.data;
  },

  // Get products by category ID
  getProductsByCategory: async (
    categoryId: number,
    page?: number,
  ): Promise<ProductsResponse> => {
    const response = await _axios.get<ProductsResponse>(
      apiRoutes.product.listByCategory(categoryId, page),
    );
    return response.data;
  },
};
