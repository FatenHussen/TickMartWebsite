import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { _AuthApi } from "@/features/auth/api/auth.service";
import { queryKeys } from "@/utils/queryKeys";
import { useAuthStore } from "@/store/auth";
import { isApprovedMarketer } from "@/features/marketer/utils/isApprovedMarketer";

/**
 * Refresh affiliate flags from `/user/auth/me` and expose approval gate.
 * Does not log the user out on fetch errors (unlike `useMe`).
 */
export function useMarketerAccess() {
    const user = useAuthStore((s) => s.user);
    const token = useAuthStore((s) => s.token);
    const setUser = useAuthStore((s) => s.setUser);

    const meQuery = useQuery({
        queryKey: queryKeys.auth.me(),
        queryFn: async () => {
            const response = await _AuthApi.me();
            return response.data.user;
        },
        enabled: !!token,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 30_000,
    });

    useEffect(() => {
        if (meQuery.isSuccess && meQuery.data) {
            setUser(meQuery.data);
        }
    }, [meQuery.isSuccess, meQuery.data, setUser]);

    return {
        user,
        isApprovedMarketer: isApprovedMarketer(user),
        isAffiliateStatusPending: meQuery.isLoading || meQuery.isFetching,
        meQuery,
    };
}
