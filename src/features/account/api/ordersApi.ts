import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { OrderDetailData } from "../types/order";
import {
 parseOrderDetail,
 parseOrdersListResponse,
 type OrdersListPage,
} from "../utils/parseOrdersResponse";

export const _OrdersApi = {
 getOrders: async (page = 1, status?: string): Promise<OrdersListPage> => {
 const res = await _axios.get(apiRoutes.orders.list({ page, status: status || undefined }));
 return parseOrdersListResponse(res.data);
 },
 getOrderById: async (id: number | string): Promise<OrderDetailData> => {
 const res = await _axios.get(apiRoutes.orders.details(id));
 const order = parseOrderDetail(res.data);
 if (!order) {
 throw new Error("Order not found");
 }
 return order;
 },
};
