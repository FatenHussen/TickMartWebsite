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
import { buildMarketerDashboardHeroBenefits } from "@/features/marketer/utils/buildMarketerDashboardHeroBenefits";
import type { MarketerDashboardTab, MarketerTransactionFilter } from "@/features/marketer/types/dashboard";

export function useMarketerDashboard() {
    const { t } = useTranslation();
    const [ordersPage, setOrdersPage] = useState(1);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<MarketerDashboardTab>("orders");
    const [transactionFilter, setTransactionFilter] = useState<MarketerTransactionFilter>("");
    const [transactionsPage, setTransactionsPage] = useState(1);

    const statisticsQuery = useMarketerStatistics();
    const profileQuery = useMarketerProfile();
    const ordersQuery = useMarketerOrders({
        per_page: 10,
        page: ordersPage,
    });
    const monthlyOrdersQuery = useMonthlyOrders();
    const transactionsQuery = useMarketerTransactions({
        per_page: 10,
        type: transactionFilter || undefined,
        page: transactionsPage,
    });
    const withdrawRequestsQuery = useMarketerWithdrawRequests({ per_page: 10 });
    const withdrawMutation = useCreateWithdrawRequest();

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
