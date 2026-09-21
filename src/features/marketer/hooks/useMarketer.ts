import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { _MarketerApi } from "../api/marketerApi";
import { queryKeys } from "@/utils/queryKeys";
import { getApiErrorMessage, getApiSuccessMessage } from "@/shared/lib/apiMessage";
import { useAuthStore } from "@/store/auth";
import { isApprovedMarketer } from "@/features/marketer/utils/isApprovedMarketer";

type EnabledOption = { enabled?: boolean };

function useMarketerApiEnabled(override?: boolean) {
    const user = useAuthStore((s) => s.user);
    const approved = isApprovedMarketer(user);
    if (override !== undefined) return override && approved;
    return approved;
}

export function useMarketerStatistics(options?: EnabledOption) {
    const enabled = useMarketerApiEnabled(options?.enabled);
    return useQuery({
        queryKey: queryKeys.marketer.statistics(),
        queryFn: () => _MarketerApi.getStatistics(),
        select: (res) => res.data,
        enabled,
        retry: false,
    });
}

export function useMarketerProfile(options?: EnabledOption) {
    const enabled = useMarketerApiEnabled(options?.enabled);
    return useQuery({
        queryKey: queryKeys.marketer.profile(),
        queryFn: () => _MarketerApi.getProfile(),
        select: (res) => res.data,
        enabled,
        retry: false,
    });
}

export function useMarketerOrders(
    params?: {
        per_page?: number;
        from?: string;
        to?: string;
        coupon_code?: string;
        page?: number;
    },
    options?: EnabledOption,
) {
    const enabled = useMarketerApiEnabled(options?.enabled);
    return useQuery({
        queryKey: queryKeys.marketer.orders(params),
        queryFn: () => _MarketerApi.getOrders(params),
        select: (res) => res.data,
        enabled,
        retry: false,
    });
}

export function useMarketerTransactions(
    params?: {
        per_page?: number;
        type?: string;
        from?: string;
        to?: string;
        page?: number;
    },
    options?: EnabledOption,
) {
    const enabled = useMarketerApiEnabled(options?.enabled);
    return useQuery({
        queryKey: queryKeys.marketer.transactions(params),
        queryFn: () => _MarketerApi.getTransactions(params),
        select: (res) => res.data,
        enabled,
        retry: false,
    });
}

export function useMarketerWithdrawRequests(
    params?: {
        per_page?: number;
        status?: string;
        page?: number;
    },
    options?: EnabledOption,
) {
    const enabled = useMarketerApiEnabled(options?.enabled);
    return useQuery({
        queryKey: queryKeys.marketer.withdrawRequests(params),
        queryFn: () => _MarketerApi.getWithdrawRequests(params),
        select: (res) => res.data,
        enabled,
        retry: false,
    });
}

export function useMonthlyOrders(year?: number, options?: EnabledOption) {
    const enabled = useMarketerApiEnabled(options?.enabled);
    return useQuery({
        queryKey: queryKeys.marketer.monthlyOrders(year),
        queryFn: () => _MarketerApi.getMonthlyOrders(year),
        select: (res) => res.data,
        enabled,
        retry: false,
    });
}

export function useCreateWithdrawRequest() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (amount: number) => _MarketerApi.createWithdrawRequest(amount),
        onSuccess: (res) => {
            toast.success(getApiSuccessMessage(res, "Withdraw request submitted"));
            qc.invalidateQueries({ queryKey: queryKeys.marketer.all() });
        },
        onError: (err: unknown) => {
            const msg = getApiErrorMessage(err, "Request failed");
            toast.error(msg);
        },
    });
}

export function useSendMarketerRequest() {
    return useMutation({
        mutationFn: () => _MarketerApi.sendMarketerRequest(),
    });
}
