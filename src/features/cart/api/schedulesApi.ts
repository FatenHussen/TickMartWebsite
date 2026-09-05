import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { SchedulesResponse } from "../types";
import { parseScheduleList } from "@/features/customBasket/lib/parseSchedule";

export const schedulesApi = {
    getSchedules: async (page?: number): Promise<SchedulesResponse> => {
        const url = apiRoutes.schedules.list(page);
        const response = await _axios.get(url);
        const items = parseScheduleList(response.data);
        return {
            status: true,
            success: true,
            message:
                typeof response.data?.message === "string"
                    ? response.data.message
                    : "",
            data: {
                items,
                pagination: {
                    current_page: 1,
                    last_page: 1,
                    per_page: items.length,
                    total: items.length,
                },
            },
        };
    },
};
