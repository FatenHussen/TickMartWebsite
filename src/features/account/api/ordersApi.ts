import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";
import type {
 OrdersListResponse,
 OrderDetailResponse,
} from"../types/order";

export const _OrdersApi = {
 getOrders: async (
 page = 1,
 status?: string
 ): Promise<OrdersListResponse> => {
 const res = await _axios.get<OrdersListResponse>(
 apiRoutes.orders.list({ page, status: status || undefined })
 );
 return res.data;
 },
 getOrderById: async (
 id: number | string
 ): Promise<OrderDetailResponse["data"]> => {
 const res = await _axios.get<OrderDetailResponse>(
 apiRoutes.orders.details(id)
 );
 return res.data.data;
 },
};
