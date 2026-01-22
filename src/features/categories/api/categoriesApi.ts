import _axios from "@/app/middleware/interceptor";
import { endpoints } from "@/app/routes/path/paths";
import type { CategoriesResponse, ProductsResponse } from "../types";

export const _CategoriesApi = {
  // Get all categories with subcategories
  getCategories: async (): Promise<CategoriesResponse> => {
    const response = await _axios.get<CategoriesResponse>(endpoints.categories.list);
    return response.data;
  },

  // Get products by category ID
  getProductsByCategory: async (
    categoryId: number,
    page?: number
  ): Promise<ProductsResponse> => {
    const response = await _axios.get<ProductsResponse>(
      endpoints.product.listByCategory(categoryId, page)
    );
    return response.data;
  },
};
