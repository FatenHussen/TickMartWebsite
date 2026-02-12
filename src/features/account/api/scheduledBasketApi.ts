import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type {
  ScheduledBasketsResponse,
  ScheduledBasketDetailResponse,
  UpdateScheduledBasketPayload,
} from "../types/scheduledBasket";

export const _ScheduledBasketApi = {
  getScheduledBaskets: async (
    page?: number
  ): Promise<ScheduledBasketsResponse> => {
    const response = await _axios.get<ScheduledBasketsResponse>(
      apiRoutes.scheduledBaskets.list(page)
    );
    return response.data;
  },

  getScheduledBasketDetails: async (
    id: number | string
  ): Promise<ScheduledBasketDetailResponse> => {
    const response = await _axios.get<ScheduledBasketDetailResponse>(
      apiRoutes.scheduledBaskets.details(id)
    );
    return response.data;
  },

  updateScheduledBasket: async (
    id: number | string,
    payload: UpdateScheduledBasketPayload
  ): Promise<ScheduledBasketDetailResponse> => {
    const response = await _axios.put<ScheduledBasketDetailResponse>(
      apiRoutes.scheduledBaskets.update(id),
      payload
    );
    return response.data;
  },

  deleteScheduledBasket: async (
    id: number | string
  ): Promise<{ status: boolean; message: string }> => {
    const response = await _axios.delete(
      apiRoutes.scheduledBaskets.delete(id)
    );
    return response.data;
  },
};
