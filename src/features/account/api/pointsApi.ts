import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type {
  PointsSummaryResponse,
  PointsTransactionsResponse,
  PointsExchangeOptionsResponse,
} from "../types";

export const pointsApi = {
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
};
