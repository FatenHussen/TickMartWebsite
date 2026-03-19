import { useMutation, useQuery, useQueryClient } from"@tanstack/react-query";
import { toast } from"sonner";
import { _MarketerApi } from"../api/marketerApi";
import { queryKeys } from"@/utils/queryKeys";

export function useMarketerStatistics() {
 return useQuery({
 queryKey: queryKeys.marketer.statistics(),
 queryFn: () => _MarketerApi.getStatistics(),
 select: (res) => res.data,
 });
}

export function useMarketerProfile() {
 return useQuery({
 queryKey: queryKeys.marketer.profile(),
 queryFn: () => _MarketerApi.getProfile(),
 select: (res) => res.data,
 });
}

export function useMarketerOrders(params?: {
 per_page?: number;
 from?: string;
 to?: string;
 coupon_code?: string;
 page?: number;
}) {
 return useQuery({
 queryKey: queryKeys.marketer.orders(params),
 queryFn: () => _MarketerApi.getOrders(params),
 select: (res) => res.data,
 });
}

export function useMarketerTransactions(params?: {
 per_page?: number;
 type?: string;
 from?: string;
 to?: string;
 page?: number;
}) {
 return useQuery({
 queryKey: queryKeys.marketer.transactions(params),
 queryFn: () => _MarketerApi.getTransactions(params),
 select: (res) => res.data,
 });
}

export function useMarketerWithdrawRequests(params?: {
 per_page?: number;
 status?: string;
 page?: number;
}) {
 return useQuery({
 queryKey: queryKeys.marketer.withdrawRequests(params),
 queryFn: () => _MarketerApi.getWithdrawRequests(params),
 select: (res) => res.data,
 });
}

export function useMonthlyOrders(year?: number) {
 return useQuery({
 queryKey: queryKeys.marketer.monthlyOrders(year),
 queryFn: () => _MarketerApi.getMonthlyOrders(year),
 select: (res) => res.data,
 });
}

export function useCreateWithdrawRequest() {
 const qc = useQueryClient();
 return useMutation({
 mutationFn: (amount: number) => _MarketerApi.createWithdrawRequest(amount),
 onSuccess: (res) => {
 toast.success(res.message ||"Withdraw request submitted");
 qc.invalidateQueries({ queryKey: queryKeys.marketer.all() });
 },
 onError: (err: any) => {
 const msg =
 err?.response?.data?.message || err?.message ||"Request failed";
 toast.error(msg);
 },
 });
}

export function useSendMarketerRequest() {
 return useMutation({
 mutationFn: () => _MarketerApi.sendMarketerRequest(),
 });
}
