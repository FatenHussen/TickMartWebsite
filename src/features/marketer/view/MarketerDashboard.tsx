import { useLanguage } from "@/context/LanguageContext";
import { useMarketerDashboard } from "@/features/marketer/hooks/useMarketerDashboard";
import { OrdersTable } from "@/features/marketer/components/orders-table/OrdersTable";
import { MarketerDashboardHero } from "@/features/marketer/components/MarketerDashboardHero";
import { MarketerWithdrawModal } from "@/features/marketer/components/MarketerWithdrawModal";
import { MarketerAffiliateProfileCard } from "@/features/marketer/components/dashboard/MarketerAffiliateProfileCard";
import { MarketerDashboardTabList } from "@/features/marketer/components/dashboard/MarketerDashboardTabList";
import { MarketerMonthlyPerformanceChart } from "@/features/marketer/components/dashboard/MarketerMonthlyPerformanceChart";
import { MarketerStatisticsGrid } from "@/features/marketer/components/dashboard/MarketerStatisticsGrid";
import { MarketerTransactionsPanel } from "@/features/marketer/components/dashboard/MarketerTransactionsPanel";
import { MarketerWithdrawalsPanel } from "@/features/marketer/components/dashboard/MarketerWithdrawalsPanel";

export default function MarketerDashboard() {
    const { isRTL } = useLanguage();
    const dashboard = useMarketerDashboard();

    const showAffiliateCard = dashboard.isProfileLoading || Boolean(dashboard.profile);

    return (
        <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
            <MarketerDashboardHero
                benefitItems={dashboard.heroBenefitItems}
                availableBalance={dashboard.availableBalance}
                onRequestWithdraw={dashboard.openWithdrawModal}
            />

            {showAffiliateCard && (
                <MarketerAffiliateProfileCard
                    profile={dashboard.profile}
                    isLoading={dashboard.isProfileLoading}
                    onCopyAffiliateLink={dashboard.copyAffiliateLink}
                />
            )}

            <MarketerStatisticsGrid stats={dashboard.stats} isLoading={dashboard.isStatsLoading} />

            {dashboard.isMonthlyChartLoading ? (
                <div className="h-48 animate-pulse rounded-2xl bg-custom-card p-6" />
            ) : (
                <MarketerMonthlyPerformanceChart
                    monthlyPerformance={dashboard.monthlyPerformance}
                    isRTL={isRTL}
                />
            )}

            <MarketerDashboardTabList activeTab={dashboard.activeTab} onTabChange={dashboard.setActiveTab} />

            {dashboard.activeTab === "orders" && (
                <OrdersTable
                    items={dashboard.orderItems}
                    pagination={dashboard.ordersPagination}
                    page={dashboard.ordersPage}
                    onPage={dashboard.setOrdersPage}
                    isLoading={dashboard.isOrdersLoading}
                    isRTL={isRTL}
                />
            )}

            {dashboard.activeTab === "transactions" && (
                <MarketerTransactionsPanel
                    transactions={dashboard.transactionItems}
                    pagination={dashboard.transactionsPagination}
                    isLoading={dashboard.isTransactionsLoading}
                    isRTL={isRTL}
                    activeFilter={dashboard.transactionFilter}
                    currentPage={dashboard.transactionsPage}
                    onFilterChange={dashboard.selectTransactionFilter}
                    onPageChange={dashboard.setTransactionsPage}
                />
            )}

            {dashboard.activeTab === "withdrawals" && (
                <MarketerWithdrawalsPanel requests={dashboard.withdrawalItems} isRTL={isRTL} />
            )}

            {dashboard.isWithdrawModalOpen && (
                <MarketerWithdrawModal
                    availableBalance={dashboard.stats?.available_balance ?? 0}
                    onClose={dashboard.closeWithdrawModal}
                    onSubmit={dashboard.submitWithdrawAmount}
                    isPending={dashboard.isWithdrawMutationPending}
                />
            )}
        </div>
    );
}
