import _axios from "@/app/middleware/interceptor";
import type {
    ScheduledBasketsResponse,
    ScheduledBasketDetailResponse,
    UpdateScheduledBasketPayload,
} from "../types/scheduledBasket";
import type { CreateScheduledBasketPayload } from "@/features/cart/types";

// API routes defined locally to avoid stale module cache issues
const SCHEDULED_BASKETS_BASE = "/user/scheduled-baskets";

export const _ScheduledBasketApi = {
    createScheduledBasket: async (
        payload: CreateScheduledBasketPayload
    ): Promise<ScheduledBasketDetailResponse> => {
        const response = await _axios.post<ScheduledBasketDetailResponse>(
            SCHEDULED_BASKETS_BASE,
            payload
        );
        return response.data;
    },
    getScheduledBaskets: async (
        page?: number,
    ): Promise<ScheduledBasketsResponse> => {
        const url = page
            ? `${SCHEDULED_BASKETS_BASE}?page=${page}`
            : SCHEDULED_BASKETS_BASE;
        const response = await _axios.get<ScheduledBasketsResponse>(url);
        return response.data;
    },

    getScheduledBasketDetails: async (
        id: number | string,
    ): Promise<ScheduledBasketDetailResponse> => {
        const response = await _axios.get<ScheduledBasketDetailResponse>(
            `${SCHEDULED_BASKETS_BASE}/${id}`,
        );
        return response.data;
    },

    updateScheduledBasket: async (
        id: number | string,
        payload: UpdateScheduledBasketPayload,
    ): Promise<ScheduledBasketDetailResponse> => {
        const response = await _axios.put<ScheduledBasketDetailResponse>(
            `${SCHEDULED_BASKETS_BASE}/${id}`,
            payload,
        );
        return response.data;
    },

    deleteScheduledBasket: async (
        id: number | string,
    ): Promise<{ status: boolean; message: string }> => {
        const response = await _axios.delete(
            `${SCHEDULED_BASKETS_BASE}/${id}`,
        );
        return response.data;
    },

    pauseScheduledBasket: async (
        id: number | string,
    ): Promise<{ status: boolean; message: string }> => {
        const response = await _axios.post(
            `${SCHEDULED_BASKETS_BASE}/${id}/pause`,
        );
        return response.data;
    },

    resumeScheduledBasket: async (
        id: number | string,
    ): Promise<{ status: boolean; message: string }> => {
        const response = await _axios.post(
            `${SCHEDULED_BASKETS_BASE}/${id}/resume`,
        );
        return response.data;
    },
};
