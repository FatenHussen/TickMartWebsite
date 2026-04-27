import {
    HiCheckCircle,
    HiClock,
    HiCurrencyDollar,
    HiDownload,
    HiShoppingBag,
    HiTrendingUp,
} from "react-icons/hi";
import { useTranslation } from "react-i18next";
import type { MarketerStatistics } from "@/features/marketer/types";
import { MarketerStatCard } from "./MarketerStatCard";

const STATS_SKELETON_COUNT = 7;

interface MarketerStatisticsGridProps {
    stats: MarketerStatistics | undefined;
    isLoading: boolean;
}

export function MarketerStatisticsGrid({ stats, isLoading }: MarketerStatisticsGridProps) {
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {Array.from({ length: STATS_SKELETON_COUNT }).map((_, index) => (
                    <div key={index} className="animate-pulse rounded-2xl bg-custom-card p-5">
                        <div className="flex gap-4">
                            <div className="h-12 w-12 rounded-xl bg-custom-tertiary" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-3 rounded bg-custom-tertiary" />
                                <div className="h-5 w-2/3 rounded bg-custom-tertiary" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MarketerStatCard
                icon={HiShoppingBag}
                label={t("marketer.dashboard.totalOrders", "Total Orders")}
                value={stats.total_orders.toLocaleString()}
                color="bg-primary"
            />
            <MarketerStatCard
                icon={HiCheckCircle}
                label={t("marketer.dashboard.deliveredOrders", "Delivered")}
                value={stats.delivered_orders.toLocaleString()}
                color="bg-success"
            />
            <MarketerStatCard
                icon={HiTrendingUp}
                label={t("marketer.dashboard.totalSales", "Total Sales")}
                value={stats.total_sales.toLocaleString()}
                color="bg-primary-dark"
            />
            <MarketerStatCard
                icon={HiCurrencyDollar}
                label={t("marketer.dashboard.earnedCommission", "Earned Commission")}
                value={stats.earned_commission.toLocaleString()}
                color="bg-primary-light"
            />
            <MarketerStatCard
                icon={HiClock}
                label={t("marketer.dashboard.pendingEarnings", "Pending Earnings")}
                value={stats.pending_earnings.toLocaleString()}
                color="bg-warning"
            />
            <MarketerStatCard
                icon={HiDownload}
                label={t("marketer.dashboard.withdrawn", "Withdrawn")}
                value={stats.withdrawn.toLocaleString()}
                color="bg-custom-hover"
            />
            <div className="col-span-2">
                <MarketerStatCard
                    icon={HiCurrencyDollar}
                    label={t("marketer.dashboard.availableBalance", "Available Balance")}
                    value={stats.available_balance.toLocaleString()}
                    color="bg-[var(--color-api-second)]"
                    subLabel={t("marketer.dashboard.readyToWithdraw", "Ready to withdraw")}
                />
            </div>
        </div>
    );
}
