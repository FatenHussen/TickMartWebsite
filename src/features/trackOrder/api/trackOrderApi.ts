import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";
import type { TrackOrderApiResponse, TrackOrderApiData } from"../types";

export const _TrackOrderApi = {
 getOrderById: async (id: number | string): Promise<TrackOrderApiData> => {
 const res = await _axios.get<TrackOrderApiResponse>(
 apiRoutes.orders.details(id)
 );
 return res.data.data;
 },
};
