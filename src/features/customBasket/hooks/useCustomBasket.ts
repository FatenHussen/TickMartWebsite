import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { queryKeys } from "@/utils/queryKeys";
import { customBasketApi } from "../api/customBasketApi";
import type { ScheduleItem } from "@/features/cart/types";
import type { ConfirmCustomBasketPayload, CustomBasketState } from "../types";

const emptyBasket = (schedule?: ScheduleItem | null): CustomBasketState => ({
    schedule: schedule ?? null,
    items: [],
    summary: {
        items_count: 0,
        total_quantity: 0,
        original_price_formatted: null,
        discount_value: null,
        discount_type: null,
        savings_formatted: null,
        final_price_formatted: null,
    },
    is_draft: true,
});

export function useCustomBasket(
    scheduleId: number | undefined,
    options: { enabled: boolean; fallbackSchedule?: ScheduleItem | null },
) {
    const queryClient = useQueryClient();
    const key = queryKeys.schedules.customBasket(scheduleId);

    const query = useQuery({
        queryKey: key,
        queryFn: () =>
            customBasketApi.getCustomBasket(
                scheduleId!,
                options.fallbackSchedule,
            ),
        enabled: Boolean(options.enabled && scheduleId),
        retry: (failureCount, error) => {
            if (
                axios.isAxiosError(error) &&
                (error.response?.status === 401 ||
                    error.response?.status === 404)
            ) {
                return false;
            }
            return failureCount < 2;
        },
    });

    const invalidate = () => {
        void queryClient.invalidateQueries({ queryKey: key });
        void queryClient.invalidateQueries({
            queryKey: queryKeys.scheduledBaskets.all(),
        });
        void queryClient.invalidateQueries({
            queryKey: queryKeys.myBaskets.all(),
        });
    };

    const addItem = useMutation({
        mutationFn: (body: {
            shop_product_variant_id: number;
            quantity: number;
        }) => customBasketApi.addItem(scheduleId!, body),
        onSuccess: (data) => {
            if (data.items.length || data.summary) {
                queryClient.setQueryData(key, data);
            }
            invalidate();
        },
    });

    const updateItem = useMutation({
        mutationFn: (vars: { itemId: number; quantity: number }) =>
            customBasketApi.updateItem(scheduleId!, vars.itemId, {
                quantity: vars.quantity,
            }),
        onSuccess: (data) => {
            if (data.items.length || data.summary) {
                queryClient.setQueryData(key, data);
            }
            invalidate();
        },
    });

    const deleteItem = useMutation({
        mutationFn: (itemId: number) =>
            customBasketApi.deleteItem(scheduleId!, itemId),
        onSuccess: (data) => {
            if (data) queryClient.setQueryData(key, data);
            invalidate();
        },
    });

    const confirm = useMutation({
        mutationFn: (body: ConfirmCustomBasketPayload) =>
            customBasketApi.confirm(scheduleId!, body),
        onSuccess: () => {
            invalidate();
        },
    });

    return {
        basket: query.data ?? emptyBasket(options.fallbackSchedule),
        isLoading: query.isLoading,
        isError: query.isError,
        addItem,
        updateItem,
        deleteItem,
        confirm,
    };
}
