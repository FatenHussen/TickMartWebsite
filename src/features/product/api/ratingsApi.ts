import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { RatingsResponse } from "../types/ratings";

export interface GetRatingsParams {
  rateableId: number;
  rateableType: string;
  page?: number;
}

export const _RatingsApi = {
  getRatings: async (
    params: GetRatingsParams
  ): Promise<RatingsResponse["data"]> => {
    const { rateableId, rateableType, page } = params;
    const response = await _axios.get<RatingsResponse>(
      apiRoutes.ratings.list(rateableId, rateableType, page)
    );
    return response.data.data;
  },
};
