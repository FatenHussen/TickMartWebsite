import _axios from "@/app/middleware/interceptor";
import { endpoints } from "@/app/routes/path/paths";
import type { CategoriesResponse } from "../types";

export const _CategoriesApi = {
  getCategories: async (): Promise<CategoriesResponse> => {
    const response = await _axios.get<CategoriesResponse>(endpoints.categories.list);
    return response.data;
  },
};
