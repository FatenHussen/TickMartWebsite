import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { CategoriesResponse } from "../types";

export const _CategoriesApi = {
  getCategories: async (page?: number): Promise<CategoriesResponse> => {
    const baseUrl = apiRoutes.categories.list();
    const url = page
      ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}page=${page}`
      : baseUrl;
    const response = await _axios.get<CategoriesResponse>(url);
    return response.data;
  },
};
