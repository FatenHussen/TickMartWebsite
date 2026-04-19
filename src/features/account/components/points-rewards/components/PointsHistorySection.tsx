import type { TFunction } from "i18next";
import { HiClock, HiClipboardList, HiSparkles, HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import type { PointsHistoryFilter, TransactionRow } from "../hooks/usePointsRewardsPage";
import { historySectionShellClass } from "../constants";
import { formatPointsRewardDate } from "../utils/formatPointsRewardDate";
import { getTransactionStatusBadgeClass } from "../utils/transactionStatusStyles";
import { SectionShell } from "./SectionShell";
import { TablePagination } from "./TablePagination";

type PointsHistorySectionProps = {
    t: TFunction;
    filterTabs: { value: PointsHistoryFilter; label: string }[];
    activeFilter: PointsHistoryFilter;
    onFilterChange: (value: PointsHistoryFilter) => void;
    transactionsLoading: boolean;
    transactionsError: boolean;
    itemsWithBalance: TransactionRow[];
    pagination?: { current_page: number; last_page: number };
    historyPage: number;
    onHistoryPageChange: (page: number | ((p: number) => number)) => void;
};

function StatusVisual({ status }: { status: TransactionRow["status"] }) {
    const wrap = "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl";
    switch (status) {
        case "earned":
            return (
                <div className={cn(wrap, "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400")} aria-hidden>
                    <HiTrendingUp className="h-5 w-5" />
                </div>
            );
        case "redeemed":
            return (
                <div className={cn(wrap, "bg-rose-500/15 text-rose-600 dark:text-rose-400")} aria-hidden>
                    <HiTrendingDown className="h-5 w-5" />
                </div>
            );
        case "expired":
            return (
                <div className={cn(wrap, "bg-amber-500/15 text-amber-700 dark:text-amber-300")} aria-hidden>
                    <HiClock className="h-5 w-5" />
                </div>
            );
        default:
            return (
                <div className={cn(wrap, "bg-custom-muted text-custom-secondary")} aria-hidden>
                    <HiSparkles className="h-5 w-5" />
                </div>
            );
    }
}

function HistorySkeleton() {
    return (
        <ul className="space-y-3" aria-hidden>
            {[1, 2, 3, 4].map((i) => (
                <li
                    key={i}
                    className="h-28 animate-pulse rounded-2xl bg-gradient-to-r from-custom-muted/60 to-custom-muted/30"
                />
            ))}
        </ul>
    );
}

export function PointsHistorySection({
    t,
    filterTabs,
    activeFilter,
    onFilterChange,
    transactionsLoading,
    transactionsError,
    itemsWithBalance,
    pagination,
    historyPage,
    onHistoryPageChange,
}: PointsHistorySectionProps) {
    return (
        <SectionShell padding="lg" className={historySectionShellClass}>
            <header className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-primary-light">
                    {t("account.pointsRewards.history.eyebrow", "Your activity")}
                </p>
                <h2 className="text-xl font-bold tracking-tight text-custom-primary sm:text-2xl">
                    {t("account.pointsRewards.history.title")}
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-custom-secondary">
                    {t(
                        "account.pointsRewards.history.subtitle",
                        "Every change to your balance in one place — filter by type to focus on what matters.",
                    )}
                </p>
            </header>

            <div className="mt-6 flex flex-wrap gap-2">
                {filterTabs.map((tab) => {
                    const isActive = activeFilter === tab.value;
                    return (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => onFilterChange(tab.value)}
                            className={cn(
                                "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
                                isActive
                                    ? "bg-primary-light text-white shadow-md shadow-primary-light/30"
                                    : "bg-custom-card text-custom-primary shadow-sm shadow-black/[0.04] hover:bg-primary-light/[0.08] hover:shadow-md dark:shadow-black/30",
                            )}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="mt-8">
                {transactionsLoading ? (
                    <HistorySkeleton />
                ) : transactionsError ? (
                    <div className="rounded-2xl bg-custom-muted/30 px-6 py-12 text-center shadow-inner">
                        <p className="text-sm text-custom-secondary">
                            {t("account.pointsRewards.errorLoading") ?? "Failed to load history."}
                        </p>
                    </div>
                ) : itemsWithBalance.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-b from-custom-muted/40 to-custom-card px-6 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light/12 text-primary-light">
                            <HiClipboardList className="h-7 w-7" />
                        </span>
                        <p className="max-w-sm text-sm leading-relaxed text-custom-secondary">
                            {t("account.pointsRewards.history.noHistory")}
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {itemsWithBalance.map((item) => (
                            <li
                                key={item.id}
                                className={cn(
                                    "rounded-2xl bg-custom-card p-4 sm:p-5",
                                    "shadow-[0_1px_3px_rgba(15,23,42,0.05),0_6px_20px_rgba(15,23,42,0.06)]",
                                    "dark:shadow-[0_2px_8px_rgba(0,0,0,0.35)]",
                                    "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)]",
                                )}
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="flex gap-4 sm:min-w-0 sm:flex-1">
                                        <StatusVisual status={item.status} />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <time
                                                    className="text-xs font-medium text-custom-secondary"
                                                    dateTime={item.created_at}
                                                >
                                                    {formatPointsRewardDate(item.created_at)}
                                                </time>
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                                                        getTransactionStatusBadgeClass(item.status),
                                                    )}
                                                >
                                                    {t(`account.pointsRewards.history.types.${item.status}`)}
                                                </span>
                                            </div>
                                            <p className="mt-1.5 text-sm font-semibold leading-snug text-custom-primary sm:text-base">
                                                {item.rule?.title ?? item.type ?? item.reason ?? "—"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-end justify-between gap-6 border-t border-custom-primary/5 pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                                        <div className="text-end">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-custom-secondary">
                                                {t("account.pointsRewards.history.table.points")}
                                            </p>
                                            <p
                                                className={cn(
                                                    "text-lg font-bold tabular-nums sm:text-xl",
                                                    item.status === "earned"
                                                        ? "text-emerald-600 dark:text-emerald-400"
                                                        : "text-rose-600 dark:text-rose-400",
                                                )}
                                            >
                                                {item.status === "earned" ? "+" : "-"}
                                                {item.points}
                                            </p>
                                        </div>
                                        <div className="text-end">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-custom-secondary">
                                                {t("account.pointsRewards.history.table.balance")}
                                            </p>
                                            <p className="text-sm font-semibold tabular-nums text-custom-primary">
                                                {item.displayBalance.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {pagination ? (
                <TablePagination
                    t={t}
                    currentPage={historyPage}
                    lastPage={pagination.last_page}
                    onPrev={() => onHistoryPageChange((p) => p - 1)}
                    onNext={() => onHistoryPageChange((p) => p + 1)}
                />
            ) : null}
        </SectionShell>
    );
}
