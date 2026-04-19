import { useQuery } from "@tanstack/react-query";
import { _quickActionsApi } from "../api/quickActions.service";
import { queryKeys } from "@/utils/queryKeys";

export function useQuickActions() {
    return useQuery({
        queryKey: queryKeys.affiliate.quickActions(),
        queryFn: () => _quickActionsApi.list(),
        select: (res) => {
            if (!res.status || !Array.isArray(res.data)) return [];
            return [...res.data].sort((a, b) => a.order - b.order);
        },
        staleTime: 1000 * 60 * 5,
    });
}
