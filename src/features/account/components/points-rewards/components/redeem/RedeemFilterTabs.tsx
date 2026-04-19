import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import type { RedeemFilter, RedeemFilterTab } from "../../hooks/useRedeemCatalog";

type RedeemFilterTabsProps = {
    tabs: RedeemFilterTab[];
    activeFilter: RedeemFilter;
    onChange: (filter: RedeemFilter) => void;
};

export function RedeemFilterTabs({ tabs, activeFilter, onChange }: RedeemFilterTabsProps) {
    const { t } = useTranslation();
    return (
        <div
            role="tablist"
            aria-label={t("account.pointsRewards.redeem.filterTabsAriaLabel")}
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        >
            {tabs.map((tab) => {
                const isActive = activeFilter === tab.value;
                const isEmpty = tab.count === 0 && tab.value !== "all";
                return (
                    <button
                        key={tab.value}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        disabled={isEmpty}
                        onClick={() => onChange(tab.value)}
                        className={cn(
                            "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold",
                            "transition-all duration-200",
                            isActive
                                ? "bg-primary-light text-white shadow-md shadow-primary-light/30"
                                : "bg-custom-card text-custom-primary shadow-sm shadow-black/[0.04] hover:bg-primary-light/[0.08] hover:shadow-md dark:shadow-black/30",
                            isEmpty && "cursor-not-allowed opacity-50",
                        )}
                    >
                        {tab.label}
                        <span
                            className={cn(
                                "inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums",
                                isActive
                                    ? "bg-white/25 text-white"
                                    : "bg-custom-muted text-custom-secondary",
                            )}
                        >
                            {tab.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
