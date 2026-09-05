import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { ScheduleItem } from "@/features/cart/types";
import type {
    ConfirmCustomBasketPayload,
    ConfirmCustomBasketResult,
    CustomBasketState,
} from "../types";
import { parseCustomBasket, parseConfirmResult } from "../lib/parseCustomBasket";
import { parseScheduleDetail, parseScheduleList } from "../lib/parseSchedule";

export const customBasketApi = {
    getSchedules: async (): Promise<ScheduleItem[]> => {
        const response = await _axios.get(apiRoutes.schedules.list());
        return parseScheduleList(response.data);
    },

    getSchedule: async (id: number | string): Promise<ScheduleItem | null> => {
        const response = await _axios.get(apiRoutes.schedules.details(id));
        return parseScheduleDetail(response.data);
    },

    getCustomBasket: async (
        id: number | string,
        fallbackSchedule?: ScheduleItem | null,
    ): Promise<CustomBasketState> => {
        const response = await _axios.get(apiRoutes.schedules.customBasket(id));
        return parseCustomBasket(response.data, fallbackSchedule);
    },

    addItem: async (
        scheduleId: number | string,
        body: { shop_product_variant_id: number; quantity: number },
    ): Promise<CustomBasketState> => {
        const response = await _axios.post(
            apiRoutes.schedules.customBasketItems(scheduleId),
            body,
        );
        return parseCustomBasket(response.data);
    },

    updateItem: async (
        scheduleId: number | string,
        itemId: number | string,
        body: { quantity: number },
    ): Promise<CustomBasketState> => {
        const response = await _axios.put(
            apiRoutes.schedules.customBasketItem(scheduleId, itemId),
            body,
        );
        return parseCustomBasket(response.data);
    },

    deleteItem: async (
        scheduleId: number | string,
        itemId: number | string,
    ): Promise<CustomBasketState | void> => {
        const response = await _axios.delete(
            apiRoutes.schedules.customBasketItem(scheduleId, itemId),
        );
        if (response.data) return parseCustomBasket(response.data);
    },

    confirm: async (
        scheduleId: number | string,
        body: ConfirmCustomBasketPayload,
    ): Promise<ConfirmCustomBasketResult> => {
        const response = await _axios.post(
            apiRoutes.schedules.customBasketConfirm(scheduleId),
            body,
        );
        return parseConfirmResult(response.data);
    },
};
