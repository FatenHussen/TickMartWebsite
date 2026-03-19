import { useQuery } from"@tanstack/react-query";
import { queryKeys } from"@/utils/queryKeys";
import { _ActiveBenefitsApi } from"../api/activeBenefitsApi";
import { useAuthStore } from"@/store/auth";

export function useActiveBenefits() {
 const authenticated = useAuthStore((s) => s.authenticated);

 return useQuery({
 queryKey: queryKeys.activeBenefits.get(),
 queryFn: () => _ActiveBenefitsApi.get(),
 enabled: authenticated,
 staleTime: 1000 * 60 * 5,
 });
}
