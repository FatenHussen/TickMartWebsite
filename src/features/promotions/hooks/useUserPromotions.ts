import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { _PromotionsApi } from "../api/promotionsApi";

const STALE_MS = 2 * 60 * 1000;

export function useUserPromotions(pageSlug?: string) {
    return useQuery({
        queryKey: queryKeys.promotions.list(pageSlug),
        queryFn: () => _PromotionsApi.list(pageSlug),
        staleTime: STALE_MS,
        retry: (failureCount, error: unknown) => {
            const status = (error as { response?: { status?: number } })?.response
                ?.status;
            if (status === 422) return false;
            return failureCount < 2;
        },
    });
}
