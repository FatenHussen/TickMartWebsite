import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { queryKeys } from "@/utils/queryKeys";
import { customBasketApi } from "../api/customBasketApi";

export function useScheduleCatalog() {
    const query = useQuery({
        queryKey: queryKeys.schedules.catalog(),
        queryFn: () => customBasketApi.getSchedules(),
        staleTime: 1000 * 60,
    });

    return {
        ...query,
        items: query.data ?? [],
    };
}

export function useScheduleDetail(id: number | string | undefined) {
    return useQuery({
        queryKey: queryKeys.schedules.details(id),
        queryFn: () => customBasketApi.getSchedule(id!),
        enabled: id != null && id !== "" && Number(id) > 0,
        staleTime: 1000 * 60,
        retry: (failureCount, error) => {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return false;
            }
            return failureCount < 2;
        },
    });
}
