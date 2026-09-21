import { useMe } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/store/auth";
import { isApprovedMarketer } from "@/features/marketer/utils/isApprovedMarketer";

/**
 * Refresh affiliate flags from `/user/auth/me` and expose approval gate.
 */
export function useMarketerAccess() {
    const user = useAuthStore((s) => s.user);
    const token = useAuthStore((s) => s.token);
    const meQuery = useMe();

    // Wait only for the initial me sync — not every background refetch.
    const isAffiliateStatusPending =
        Boolean(token) && meQuery.isLoading && !meQuery.isFetched;

    return {
        user,
        isApprovedMarketer: isApprovedMarketer(user),
        isAffiliateStatusPending,
        meQuery,
    };
}
