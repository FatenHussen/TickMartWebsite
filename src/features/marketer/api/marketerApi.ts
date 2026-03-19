import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";
import type {
 MarketerStatisticsResponse,
 MarketerProfileResponse,
 MarketerOrdersResponse,
 MarketerTransactionsResponse,
 WithdrawRequestsResponse,
 CreateWithdrawRequestResponse,
 MonthlyOrdersResponse,
 MarketerRequestResponse,
} from"../types";

export const _MarketerApi = {
 sendMarketerRequest: async (): Promise<MarketerRequestResponse> => {
 const response = await _axios.post<MarketerRequestResponse>(
 apiRoutes.marketer.request,
 {}
 );
 return response.data;
 },

 getStatistics: async (): Promise<MarketerStatisticsResponse> => {
 const response = await _axios.get<MarketerStatisticsResponse>(
 apiRoutes.marketer.statistics
 );
 return response.data;
 },

 getProfile: async (): Promise<MarketerProfileResponse> => {
 const response = await _axios.get<MarketerProfileResponse>(
 apiRoutes.marketer.profile
 );
 return response.data;
 },

 getOrders: async (params?: {
 per_page?: number;
 from?: string;
 to?: string;
 coupon_code?: string;
 page?: number;
 }): Promise<MarketerOrdersResponse> => {
 const response = await _axios.get<MarketerOrdersResponse>(
 apiRoutes.marketer.orders(params)
 );
 return response.data;
 },

 getTransactions: async (params?: {
 per_page?: number;
 type?: string;
 from?: string;
 to?: string;
 page?: number;
 }): Promise<MarketerTransactionsResponse> => {
 const response = await _axios.get<MarketerTransactionsResponse>(
 apiRoutes.marketer.transactions(params)
 );
 return response.data;
 },

 createWithdrawRequest: async (
 amount: number
 ): Promise<CreateWithdrawRequestResponse> => {
 const response = await _axios.post<CreateWithdrawRequestResponse>(
 apiRoutes.marketer.withdrawRequest,
 { amount }
 );
 return response.data;
 },

 getWithdrawRequests: async (params?: {
 per_page?: number;
 status?: string;
 page?: number;
 }): Promise<WithdrawRequestsResponse> => {
 const response = await _axios.get<WithdrawRequestsResponse>(
 apiRoutes.marketer.withdrawRequests(params)
 );
 return response.data;
 },

 getMonthlyOrders: async (year?: number): Promise<MonthlyOrdersResponse> => {
 const response = await _axios.get<MonthlyOrdersResponse>(
 apiRoutes.marketer.monthlyOrders(year)
 );
 return response.data;
 },
};
