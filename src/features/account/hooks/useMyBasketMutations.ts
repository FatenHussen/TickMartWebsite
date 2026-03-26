import { useMutation, useQueryClient } from "@tanstack/react-query";
import { _MyBasketsApi } from "../api/myBasketsApi";
import { queryKeys } from "@/utils/queryKeys";

export function usePauseSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) =>
            _MyBasketsApi.pauseSubscription(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.myBaskets.all(),
            });
        },
    });
}

export function useResumeSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) =>
            _MyBasketsApi.resumeSubscription(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.myBaskets.all(),
            });
        },
    });
}
