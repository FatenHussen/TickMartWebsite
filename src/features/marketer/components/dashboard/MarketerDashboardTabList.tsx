import { useTranslation } from "react-i18next";
import type { MarketerDashboardTab } from "@/features/marketer/types/dashboard";

const TAB_KEYS: MarketerDashboardTab[] = ["orders", "transactions", "withdrawals"];

interface MarketerDashboardTabListProps {
    activeTab: MarketerDashboardTab;
    onTabChange: (tab: MarketerDashboardTab) => void;
}

export function MarketerDashboardTabList({ activeTab, onTabChange }: MarketerDashboardTabListProps) {
    const { t } = useTranslation();

    const tabLabel = (tab: MarketerDashboardTab) => {
        if (tab === "orders") return t("marketer.dashboard.orders", "Orders");
        if (tab === "transactions") return t("marketer.dashboard.transactions", "Transactions");
        return t("marketer.dashboard.withdrawals", "Withdrawals");
    };

    return (
        <div className="flex flex-wrap gap-2">
            {TAB_KEYS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => onTabChange(tab)}
                        className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                            isActive
                                ? "bg-[var(--color-api-second)] text-white shadow-sm"
                                : "border border-custom-primary bg-custom-card text-text-secondary hover:border-[var(--color-api-second)]"
                        }`}
                    >
                        {tabLabel(tab)}
                    </button>
                );
            })}
        </div>
    );
}
