import { useQuery, useMutation, useQueryClient } from"@tanstack/react-query";
import { queryKeys } from"@/utils/queryKeys";
import { pointsApi } from"../api/pointsApi";

export function useActivePoints(enabled = true) {
 return useQuery({
 queryKey: queryKeys.points.activePoints(),
 enabled,
 queryFn: () => pointsApi.getActivePoints(),
 staleTime: 1000 * 60 * 2,
 });
}

export function usePointsSummary(enabled = true) {
 return useQuery({
 queryKey: queryKeys.points.summary(),
 enabled,
 queryFn: () => pointsApi.getSummary(),
 staleTime: 1000 * 60 * 2,
 });
}

export function usePointsTransactions(page = 1, enabled = true) {
 return useQuery({
 queryKey: queryKeys.points.transactions(page),
 enabled,
 queryFn: () => pointsApi.getTransactions(page),
 staleTime: 1000 * 60 * 2,
 });
}

export function usePointsExchangeOptions(enabled = true) {
 return useQuery({
 queryKey: queryKeys.points.exchangeOptions(),
 enabled,
 queryFn: () => pointsApi.getExchangeOptions(),
 staleTime: 1000 * 60 * 5,
 });
}

export function useExchangeHistory(page = 1, enabled = true) {
 return useQuery({
 queryKey: queryKeys.points.exchangeHistory(page),
 enabled,
 queryFn: () => pointsApi.getExchangeHistory(page),
 staleTime: 1000 * 60 * 2,
 });
}

export function useExchangeCoupon() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: (points: number) => pointsApi.exchangeCoupon(points),
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: queryKeys.points.all() });
 },
 });
}

export function useExchangeGift() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: ({ points, gift_id }: { points: number; gift_id: number }) =>
 pointsApi.exchangeGift(points, gift_id),
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: queryKeys.points.all() });
 },
 });
}

export function useSetGiftAddress() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: ({ giftId, address_id }: { giftId: number; address_id: number }) =>
 pointsApi.setGiftAddress(giftId, address_id),
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: queryKeys.points.exchangeHistory() });
 },
 });
}
