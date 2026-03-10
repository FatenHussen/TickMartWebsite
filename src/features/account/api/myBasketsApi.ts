import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { MyBasketsResponse } from "../types/myBasket";

export const _MyBasketsApi = {
  getMyBaskets: async (
    type?: "subscription" | "custom" | "user-schedule"
  ): Promise<MyBasketsResponse> => {
    const response = await _axios.get<MyBasketsResponse>(
      apiRoutes.myBaskets.list(type)
    );
    return response.data;
  },
};
