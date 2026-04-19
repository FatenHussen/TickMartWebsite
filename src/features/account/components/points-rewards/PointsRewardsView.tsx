import { usePointsRewardsPage } from "./hooks/usePointsRewardsPage";
import { ExchangeHistorySection } from "./components/ExchangeHistorySection";
import { GiftAddressModal } from "./components/GiftAddressModal";
import { HowToEarnCard } from "./components/HowToEarnCard";
import { PointsBalanceCard } from "./components/PointsBalanceCard";
import { PointsHistorySection } from "./components/PointsHistorySection";
import { PointsRewardsErrorView } from "./components/PointsRewardsErrorView";
import { PointsRewardsHeader } from "./components/PointsRewardsHeader";
import { RedeemPointsSection } from "./components/RedeemPointsSection";

export default function PointsRewardsView() {
    const m = usePointsRewardsPage();

    if (m.summaryError) {
        return <PointsRewardsErrorView t={m.t} isRTL={m.isRTL} />;
    }

    return (
        <div className="space-y-8" dir={m.isRTL ? "rtl" : "ltr"}>
            <PointsRewardsHeader t={m.t} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                <PointsBalanceCard
                    t={m.t}
                    summaryLoading={m.summaryLoading}
                    points={m.points}
                    value={m.value}
                    nextReward={m.nextReward}
                    nextRewardThreshold={m.nextRewardThreshold}
                    progressPercentage={m.progressPercentage}
                />
                <HowToEarnCard t={m.t} expiry={m.expiry} earningRules={m.earningRules} />
            </div>

            <RedeemPointsSection
                t={m.t}
                userPoints={m.points}
                exchangeLoading={m.exchangeLoading}
                exchangeOptions={m.exchangeOptions}
                value={m.value}
                isCouponExchangePending={m.exchangeCouponMutation.isPending}
                isGiftExchangePending={m.exchangeGiftMutation.isPending}
                onExchangeCoupon={m.handleExchangeCoupon}
                onExchangeGift={m.handleExchangeGift}
            />

            <PointsHistorySection
                t={m.t}
                filterTabs={m.filterTabs}
                activeFilter={m.activeFilter}
                onFilterChange={m.setActiveFilter}
                transactionsLoading={m.transactionsLoading}
                transactionsError={m.transactionsError}
                itemsWithBalance={m.itemsWithBalance}
                pagination={m.pagination}
                historyPage={m.historyPage}
                onHistoryPageChange={m.setHistoryPage}
            />

            <ExchangeHistorySection
                t={m.t}
                exchangeHistoryLoading={m.exchangeHistoryLoading}
                exchangeHistoryData={m.exchangeHistoryData}
                exchangeHistoryPage={m.exchangeHistoryPage}
                onExchangeHistoryPageChange={m.setExchangeHistoryPage}
            />

            {m.pendingGiftId != null ? (
                <GiftAddressModal
                    t={m.t}
                    addresses={m.addresses}
                    selectedAddressId={m.selectedAddressId}
                    onSelectAddress={m.setSelectedAddressId}
                    onCancel={m.cancelGiftAddressModal}
                    onConfirm={m.handleConfirmGiftAddress}
                    isConfirmPending={m.setGiftAddressMutation.isPending}
                />
            ) : null}
        </div>
    );
}
