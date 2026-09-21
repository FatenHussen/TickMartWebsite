import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
    useMarketerStatistics,
    useMarketerProfile,
    useMarketerOrders,
    useMonthlyOrders,
    useMarketerTransactions,
    useMarketerWithdrawRequests,
    useCreateWithdrawRequest,
} from "@/features/marketer/hooks/useMarketer";
import { useMarketerAccess } from "@/features/marketer/hooks/useMarketerAccess";
import {
    isAffiliateNotAuthorizedError,
} from "@/features/marketer/utils/isApprovedMarketer";
import { buildMarketerDashboardHeroBenefits } from "@/features/marketer/utils/buildMarketerDashboardHeroBenefits";
import type { MarketerDashboardTab, MarketerTransactionFilter } from "@/features/marketer/types/dashboard";
import { paths } from "@/app/routes/path/paths";
import { useAuthStore } from "@/store/auth";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";

export function useMarketerDashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const setUser = useAuthStore((s) => s.setUser);
    const { isApprovedMarketer, isAffiliateStatusPending } = useMarketerAccess();

    const [ordersPage, setOrdersPage] = useState(1);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<MarketerDashboardTab>("orders");
    const [transactionFilter, setTransactionFilter] = useState<MarketerTransactionFilter>("");
    const [transactionsPage, setTransactionsPage] = useState(1);

    const canFetchMarketerApis = isApprovedMarketer;

    const statisticsQuery = useMarketerStatistics({ enabled: canFetchMarketerApis });
    const profileQuery = useMarketerProfile({ enabled: canFetchMarketerApis });
    const ordersQuery = useMarketerOrders(
        { per_page: 10, page: ordersPage },
        { enabled: canFetchMarketerApis },
    );
    const monthlyOrdersQuery = useMonthlyOrders(undefined, {
        enabled: canFetchMarketerApis,
    });
    const transactionsQuery = useMarketerTransactions(
        {
            per_page: 10,
            type: transactionFilter || undefined,
            page: transactionsPage,
        },
        { enabled: canFetchMarketerApis },
    );
    const withdrawRequestsQuery = useMarketerWithdrawRequests(
        { per_page: 10 },
        { enabled: canFetchMarketerApis },
    );
    const withdrawMutation = useCreateWithdrawRequest();

    const demoteAndRedirect = useCallback(() => {
        const current = useAuthStore.getState().user;
        if (current?.affiliate) {
            setUser({
                ...current,
                affiliate: {
                    ...current.affiliate,
                    approved: false,
                },
            });
        }
        void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
        void queryClient.removeQueries({ queryKey: queryKeys.marketer.all() });
        navigate(paths.becomeMarketer, { replace: true });
    }, [navigate, queryClient, setUser]);

    useEffect(() => {
        const errors = [
            statisticsQuery.error,
            profileQuery.error,
            ordersQuery.error,
            monthlyOrdersQuery.error,
            transactionsQuery.error,
            withdrawRequestsQuery.error,
        ];
        if (errors.some(isAffiliateNotAuthorizedError)) {
            demoteAndRedirect();
        }
    }, [
        demoteAndRedirect,
        statisticsQuery.error,
        profileQuery.error,
        ordersQuery.error,
        monthlyOrdersQuery.error,
        transactionsQuery.error,
        withdrawRequestsQuery.error,
    ]);

    const copyAffiliateLink = useCallback(() => {
        const link = profileQuery.data?.affiliate_link;
        if (!link) return;
        navigator.clipboard.writeText(link);
        toast.success(t("marketer.dashboard.linkCopied", "Link copied!"));
    }, [profileQuery.data?.affiliate_link, t]);

    const submitWithdrawAmount = useCallback(
        (amount: number) => {
            withdrawMutation.mutate(amount, {
                onSuccess: () => setIsWithdrawModalOpen(false),
            });
        },
        [withdrawMutation],
    );

    const selectTransactionFilter = useCallback((filter: MarketerTransactionFilter) => {
        setTransactionFilter(filter);
        setTransactionsPage(1);
    }, []);

    const heroBenefitItems = useMemo(() => buildMarketerDashboardHeroBenefits(t), [t]);

    const stats = statisticsQuery.data;
    const availableBalance = stats?.available_balance ?? 0;

    const ordersPayload = ordersQuery.data;
    const monthlyPayload = monthlyOrdersQuery.data;
    const transactionsPayload = transactionsQuery.data;
    const withdrawRequestsPayload = withdrawRequestsQuery.data;

    return {
        isApprovedMarketer,
        isAffiliateStatusPending,
        stats,
        isStatsLoading: statisticsQuery.isLoading,
        profile: profileQuery.data,
        isProfileLoading: profileQuery.isLoading,
        orderItems: ordersPayload?.items ?? [],
        ordersPagination: ordersPayload?.pagination,
        isOrdersLoading: ordersQuery.isLoading,
        ordersPage,
        setOrdersPage,
        monthlyPerformance: monthlyPayload?.monthly_performance,
        isMonthlyChartLoading: monthlyOrdersQuery.isLoading,
        transactionItems: transactionsPayload?.items,
        transactionsPagination: transactionsPayload?.pagination,
        isTransactionsLoading: transactionsQuery.isLoading,
        transactionFilter,
        selectTransactionFilter,
        transactionsPage,
        setTransactionsPage,
        withdrawalItems: withdrawRequestsPayload?.items,
        isWithdrawMutationPending: withdrawMutation.isPending,
        activeTab,
        setActiveTab,
        isWithdrawModalOpen,
        openWithdrawModal: () => setIsWithdrawModalOpen(true),
        closeWithdrawModal: () => setIsWithdrawModalOpen(false),
        submitWithdrawAmount,
        copyAffiliateLink,
        availableBalance,
        heroBenefitItems,
    };
}
