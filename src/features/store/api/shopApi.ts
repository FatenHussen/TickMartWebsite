import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { ShopDetailsResponse } from "../types/shop";

export const _ShopApi = {
  getShopDetails: async (
    shopId: number
  ): Promise<ShopDetailsResponse["data"]> => {
    const response = await _axios.get<ShopDetailsResponse>(
      apiRoutes.shop.details(shopId)
    );
    return response.data.data;
  },
};
