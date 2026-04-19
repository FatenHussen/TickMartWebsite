import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { QuickActionsApiResponse } from "../types";

export const _quickActionsApi = {
    list: async (): Promise<QuickActionsApiResponse> => {
        const response = await _axios.get<QuickActionsApiResponse>(
            apiRoutes.quickActions.list
        );
        return response.data;
    },
};
