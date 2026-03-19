import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";
import type {
 PointsSummaryResponse,
 PointsTransactionsResponse,
 PointsExchangeOptionsResponse,
 ExchangeCouponResponse,
 ExchangeGiftResponse,
 ExchangeHistoryResponse,
} from"../types";

export interface ActivePointsResponse {
 status: boolean;
 message: string;
 data: {
 points: number;
 gifts_count: number;
 subscription_name: string | null;
 };
}

export const pointsApi = {
 getActivePoints: async (): Promise<ActivePointsResponse["data"]> => {
 const res = await _axios.get<ActivePointsResponse>(apiRoutes.points.activePoints);
 return res.data.data;
 },

 getSummary: async () => {
 const res = await _axios.get<PointsSummaryResponse>(apiRoutes.points.summary);
 return res.data.data;
 },

 getTransactions: async (page = 1) => {
 const res = await _axios.get<PointsTransactionsResponse>(
 apiRoutes.points.transactions(page),
 );
 return res.data.data;
 },

 getExchangeOptions: async () => {
 const res = await _axios.get<PointsExchangeOptionsResponse>(
 apiRoutes.points.exchangeOptions,
 );
 return res.data.data;
 },

 exchangeCoupon: async (points: number) => {
 const res = await _axios.post<ExchangeCouponResponse>(
 apiRoutes.points.exchangeCoupon,
 { points },
 );
 return res.data;
 },

 exchangeGift: async (points: number, gift_id: number) => {
 const res = await _axios.post<ExchangeGiftResponse>(
 apiRoutes.points.exchangeGift,
 { points, gift_id },
 );
 return res.data;
 },

 getExchangeHistory: async (page = 1) => {
 const res = await _axios.get<ExchangeHistoryResponse>(
 apiRoutes.points.exchangeHistory(page),
 );
 return res.data.data;
 },

 setGiftAddress: async (giftId: number, address_id: number) => {
 const res = await _axios.put(
 apiRoutes.userGifts.setAddress(giftId),
 { address_id },
 );
 return res.data;
 },
};
