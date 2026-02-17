import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { SchedulesResponse } from "../types";

export const schedulesApi = {
  getSchedules: async (page?: number): Promise<SchedulesResponse> => {
    const url = apiRoutes.schedules.list(page);
    const response = await _axios.get<SchedulesResponse>(url);
    return response.data;
  },
};
