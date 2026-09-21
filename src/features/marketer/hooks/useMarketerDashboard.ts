import { useCallback, useMemo, useState } from "react";
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
import { isAffiliateNotAuthorizedError } from "@/features/marketer/utils/isApprovedMarketer";
import { buildMarketerDashboardHeroBenefits } from "@/features/marketer/utils/buildMarketerDashboardHeroBenefits";
import type {
    MarketerDashboardTab,
    MarketerTransactionFilter,
} from "@/features/marketer/types/dashboard";

/**
 * Marketer API data for the dashboard. Call only when the user is an approved marketer.
 */
export function useMarketerDashboard(enabled = true) {
    const { t } = useTranslation();
    const [ordersPage, setOrdersPage] = useState(1);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<MarketerDashboardTab>("orders");
    const [transactionFilter, setTransactionFilter] =
        useState<MarketerTransactionFilter>("");
    const [transactionsPage, setTransactionsPage] = useState(1);

    const statisticsQuery = useMarketerStatistics({ enabled });
    const profileQuery = useMarketerProfile({ enabled });
    const ordersQuery = useMarketerOrders(
        { per_page: 10, page: ordersPage },
        { enabled },
    );
    const monthlyOrdersQuery = useMonthlyOrders(undefined, { enabled });
    const transactionsQuery = useMarketerTransactions(
        {
            per_page: 10,
            type: transactionFilter || undefined,
            page: transactionsPage,
        },
        { enabled },
    );
    const withdrawRequestsQuery = useMarketerWithdrawRequests(
        { per_page: 10 },
        { enabled },
    );
    const withdrawMutation = useCreateWithdrawRequest();

    const isUnauthorized = [
        statisticsQuery.error,
        profileQuery.error,
        ordersQuery.error,
        monthlyOrdersQuery.error,
        transactionsQuery.error,
        withdrawRequestsQuery.error,
    ].some(isAffiliateNotAuthorizedError);

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

    const selectTransactionFilter = useCallback(
        (filter: MarketerTransactionFilter) => {
            setTransactionFilter(filter);
            setTransactionsPage(1);
        },
        [],
    );

    const heroBenefitItems = useMemo(
        () => buildMarketerDashboardHeroBenefits(t),
        [t],
    );

    const stats = statisticsQuery.data;
    const availableBalance = stats?.available_balance ?? 0;

    const ordersPayload = ordersQuery.data;
    const monthlyPayload = monthlyOrdersQuery.data;
    const transactionsPayload = transactionsQuery.data;
    const withdrawRequestsPayload = withdrawRequestsQuery.data;

    return {
        isUnauthorized,
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
