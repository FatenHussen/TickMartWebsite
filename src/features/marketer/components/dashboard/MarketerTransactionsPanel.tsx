import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import type { MarketerTransaction } from "@/features/marketer/types";
import type { MarketerOrdersPagination } from "@/features/marketer/types";
import type { MarketerTransactionFilter } from "@/features/marketer/types/dashboard";

const TRANSACTION_FILTER_OPTIONS: MarketerTransactionFilter[] = ["", "commission", "withdraw"];

interface MarketerTransactionsPanelProps {
    transactions: MarketerTransaction[] | undefined;
    pagination: MarketerOrdersPagination | undefined;
    isLoading: boolean;
    isRTL: boolean;
    activeFilter: MarketerTransactionFilter;
    currentPage: number;
    onFilterChange: (filter: MarketerTransactionFilter) => void;
    onPageChange: (page: number) => void;
}

export function MarketerTransactionsPanel({
    transactions,
    pagination,
    isLoading,
    isRTL,
    activeFilter,
    currentPage,
    onFilterChange,
    onPageChange,
}: MarketerTransactionsPanelProps) {
    const { t } = useTranslation();

    const filterButtonClass = (filter: MarketerTransactionFilter) =>
        activeFilter === filter
            ? "bg-[var(--color-api-second)] text-white"
            : "bg-custom-tertiary text-text-secondary hover:bg-[color-mix(in_srgb,var(--color-api-second)_12%,var(--color-bg-card))]";

    const filterLabel = (filter: MarketerTransactionFilter) => {
        if (filter === "") return t("orders.all", "All");
        if (filter === "commission") return t("marketer.dashboard.commission", "Commission");
        return t("marketer.dashboard.withdraw", "Withdraw");
    };

    const typeBadgeClass = (tx: MarketerTransaction) =>
        tx.type === "commission" ? "bg-status-success-bg text-success" : "bg-warning-bg text-warning-dark";

    const amountClass = (tx: MarketerTransaction) =>
        tx.type === "commission" ? "text-success" : "text-warning";

    const amountPrefix = (tx: MarketerTransaction) => (tx.type === "commission" ? "+" : "-");

    return (
        <div className="overflow-hidden rounded-2xl border border-custom-primary bg-custom-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-custom-primary p-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-semibold text-text-primary">
                    {t("marketer.dashboard.transactions", "Transactions")}
                </h3>
                <div className="flex gap-2">
                    {TRANSACTION_FILTER_OPTIONS.map((filter) => (
                        <button
                            key={filter || "all"}
                            type="button"
                            onClick={() => onFilterChange(filter)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${filterButtonClass(filter)}`}
                        >
                            {filterLabel(filter)}
                        </button>
                    ))}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm" dir={isRTL ? "rtl" : "ltr"}>
                    <thead>
                        <tr className="bg-custom-light">
                            <th className="px-4 py-3 text-start font-medium text-text-secondary">#</th>
                            <th className="px-4 py-3 text-start font-medium text-text-secondary">
                                {t("marketer.dashboard.transactionType", "Type")}
                            </th>
                            <th className="px-4 py-3 text-start font-medium text-text-secondary">
                                {t("marketer.dashboard.amount", "Amount")}
                            </th>
                            <th className="px-4 py-3 text-start font-medium text-text-secondary">
                                {t("marketer.dashboard.status", "Status")}
                            </th>
                            <th className="px-4 py-3 text-start font-medium text-text-secondary">
                                {t("marketer.dashboard.orderId", "Order")}
                            </th>
                            <th className="px-4 py-3 text-start font-medium text-text-secondary">
                                {t("marketer.dashboard.date", "Date")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-custom-primary ">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Array.from({ length: 6 }).map((__, colIndex) => (
                                        <td key={colIndex} className="px-4 py-3">
                                            <div className="h-4 animate-pulse rounded bg-custom-tertiary" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : !transactions?.length ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-10 text-center text-text-secondary">
                                    {t("marketer.dashboard.noTransactions", "No transactions yet")}
                                </td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="transition-colors hover:bg-custom-light">
                                    <td className="px-4 py-3 font-mono text-xs text-text-secondary">#{tx.id}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeBadgeClass(tx)}`}
                                        >
                                            {tx.type === "commission"
                                                ? t("marketer.dashboard.commission", "Commission")
                                                : t("marketer.dashboard.withdraw", "Withdraw")}
                                        </span>
                                    </td>
                                    <td className={`px-4 py-3 font-semibold ${amountClass(tx)}`}>
                                        {amountPrefix(tx)}
                                        {Number(tx.amount).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded-full bg-accent-light-bg px-2 py-0.5 text-xs font-medium text-accent-primary">
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-text-secondary">
                                        {tx.order_id ? `#${tx.order_id}` : "—"}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-text-secondary">
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-between border-t border-custom-primary p-4">
                    <span className="text-sm text-text-secondary">
                        {t("marketer.dashboard.page", "Page")} {pagination.current_page} / {pagination.last_page}
                    </span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={currentPage <= 1}
                            onClick={() => onPageChange(currentPage - 1)}
                            className="rounded-lg border border-custom-primary p-2 transition-colors hover:bg-custom-light disabled:opacity-40"
                        >
                            {isRTL ? <HiChevronRight className="h-4 w-4" /> : <HiChevronLeft className="h-4 w-4" />}
                        </button>
                        <button
                            type="button"
                            disabled={currentPage >= pagination.last_page}
                            onClick={() => onPageChange(currentPage + 1)}
                            className="rounded-lg border border-custom-primary p-2 transition-colors hover:bg-custom-light disabled:opacity-40"
                        >
                            {isRTL ? <HiChevronLeft className="h-4 w-4" /> : <HiChevronRight className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
