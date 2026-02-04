import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { CategoriesResponse } from "../types";

export const _CategoriesApi = {
  getCategories: async (): Promise<CategoriesResponse> => {
    const response = await _axios.get<CategoriesResponse>(
      apiRoutes.categories.list,
    );
    return response.data;
  },
};
