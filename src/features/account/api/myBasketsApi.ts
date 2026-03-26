import _axios from "@/app/middleware/interceptor";
import type { MyBasketsResponse } from "../types/myBasket";

const MY_BASKETS_BASE = "/user/my-baskets";

export const _MyBasketsApi = {
    getMyBaskets: async (
        type?: "subscription" | "custom" | "user-schedule"
    ): Promise<MyBasketsResponse> => {
        const url = type
            ? `${MY_BASKETS_BASE}?type=${encodeURIComponent(type)}`
            : MY_BASKETS_BASE;
        const response = await _axios.get<MyBasketsResponse>(url);
        return response.data;
    },

    pauseSubscription: async (
        id: number | string
    ): Promise<{ status: boolean; message: string }> => {
        const response = await _axios.post(
            `${MY_BASKETS_BASE}/${id}/pause-subscription`
        );
        return response.data;
    },

    resumeSubscription: async (
        id: number | string
    ): Promise<{ status: boolean; message: string }> => {
        const response = await _axios.post(
            `${MY_BASKETS_BASE}/${id}/resume-subscription`
        );
        return response.data;
    },
};
