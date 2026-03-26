import { useQuery, useMutation, useQueryClient } from"@tanstack/react-query";
import { queryKeys } from"@/utils/queryKeys";
import { packagesApi } from"../api/packagesApi";

export function usePackages(enabled = true) {
 return useQuery({
 queryKey: queryKeys.packages.list(),
 enabled,
 queryFn: () => packagesApi.getPackages(),
 staleTime: 1000 * 60 * 5,
 });
}

export function useMySubscription(enabled = true) {
 return useQuery({
 queryKey: queryKeys.packages.mySubscription(),
 enabled,
 queryFn: () => packagesApi.getMySubscription(),
 staleTime: 1000 * 60 * 2,
 });
}

export function useSubscribe() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: (packageId: number) => packagesApi.subscribe(packageId),
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: queryKeys.packages.all() });
 },
 });
}

export function useRenewSubscription() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: (packageId: number) => packagesApi.renew(packageId),
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: queryKeys.packages.all() });
 },
 });
}

export function useCancelSubscription() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: (packageId: number) =>
   packagesApi.cancelSubscription(packageId),
 onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: queryKeys.packages.all() });
 },
 });
}

export function useSubscriptionBenefits(enabled = true) {
 return useQuery({
 queryKey: queryKeys.packages.benefits(),
 enabled,
 queryFn: () => packagesApi.getSubscriptionBenefits(),
 staleTime: 1000 * 60 * 2,
 });
}
