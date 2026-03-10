import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { BasketsResponse, BasketDetailsResponse } from "../types/basket";

export interface BasketApiFilters {
  is_schedule?: 0 | 1;
  category_id?: number;
  price_min?: number;
  price_max?: number;
  rating_min?: number;
  items_count_min?: number;
  items_count_max?: number;
  type?: "new" | "best_selling" | "top_rated";
  page?: number;
  per_page?: number;
}

export const _BasketApi = {
  getBaskets: async (filters?: BasketApiFilters): Promise<BasketsResponse> => {
    const response = await _axios.get<BasketsResponse>(
      apiRoutes.baskets.list(filters)
    );
    return response.data;
  },

  getBasketDetails: async (
    basketId: number | string
  ): Promise<BasketDetailsResponse> => {
    const response = await _axios.get<BasketDetailsResponse>(
      apiRoutes.baskets.details(basketId)
    );
    return response.data;
  },
};
