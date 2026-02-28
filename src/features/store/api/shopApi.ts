import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type {
  ShopDetailsResponse,
  ShopsListResponse,
} from "../types/shop";

export const _ShopApi = {
  getShops: async (filters?: {
    page?: number;
    type?: "top_rated" | "offers" | "nearby";
    lat?: number;
    lng?: number;
  }): Promise<ShopsListResponse> => {
    const response = await _axios.get<ShopsListResponse>(
      apiRoutes.shop.list(filters)
    );
    return response.data;
  },

  getShopDetails: async (
    shopId: number
  ): Promise<ShopDetailsResponse["data"]> => {
    const response = await _axios.get<ShopDetailsResponse>(
      apiRoutes.shop.details(shopId)
    );
    return response.data.data;
  },
};
