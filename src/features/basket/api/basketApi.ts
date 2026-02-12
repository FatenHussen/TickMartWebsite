import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { BasketsResponse, BasketDetailsResponse } from "../types/basket";

export const _BasketApi = {
  /**
   * Get all baskets with optional schedule filter
   * @param isSchedule - 0 for custom baskets, 1 for subscription baskets, undefined for all
   * @param page - Page number (optional)
   */
  getBaskets: async (
    isSchedule?: 0 | 1,
    page?: number
  ): Promise<BasketsResponse> => {
    const response = await _axios.get<BasketsResponse>(
      apiRoutes.baskets.list(isSchedule, page)
    );
    return response.data;
  },

  /**
   * Get basket details by ID
   * @param basketId - Basket ID
   */
  getBasketDetails: async (
    basketId: number | string
  ): Promise<BasketDetailsResponse> => {
    const response = await _axios.get<BasketDetailsResponse>(
      apiRoutes.baskets.details(basketId)
    );
    return response.data;
  },
};
