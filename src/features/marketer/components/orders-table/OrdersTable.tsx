import { useTranslation } from "react-i18next";
import type { MarketerOrder, MarketerOrdersPagination } from "@/features/marketer/types";
import { OrdersTableEmptyState } from "./OrdersTableEmptyState";
import { OrdersTableHead } from "./OrdersTableHead";
import { OrdersTableHeaderBanner } from "./OrdersTableHeaderBanner";
import { OrdersTableLoadingSkeleton } from "./OrdersTableLoadingSkeleton";
import { OrdersTablePagination } from "./OrdersTablePagination";
import { OrdersTableDataRow } from "./OrdersTableDataRow";

export interface OrdersTableProps {
    items: MarketerOrder[];
    pagination: MarketerOrdersPagination | undefined;
    page: number;
    onPage: (nextPage: number) => void;
    isLoading: boolean;
    isRTL: boolean;
}

export function OrdersTable({
    items,
    pagination,
    page,
    onPage,
    isLoading,
    isRTL,
}: OrdersTableProps) {
    const { t } = useTranslation();

    const showBodyRows = !isLoading && items.length > 0;
    const showEmptyState = !isLoading && items.length === 0;

    return (
        <div className="overflow-hidden rounded-2xl border border-custom-primary/80 bg-custom-card shadow-[0_14px_44px_-18px_color-mix(in_srgb,var(--color-main)_12%,transparent)]">
            <OrdersTableHeaderBanner />

            <div className="overflow-x-auto">
                <table className="w-full text-sm" dir={isRTL ? "rtl" : "ltr"}>
                    <caption className="sr-only">
                        {t("marketer.dashboard.recentOrders", "Recent Orders")}
                    </caption>
                    <OrdersTableHead />
                    <tbody className="divide-y divide-custom-primary/80">
                        {isLoading && <OrdersTableLoadingSkeleton />}
                        {showEmptyState && <OrdersTableEmptyState />}
                        {showBodyRows &&
                            items.map((order, index) => (
                                <OrdersTableDataRow key={order.id} order={order} rowIndex={index} t={t} />
                            ))}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <OrdersTablePagination
                    pagination={pagination}
                    currentPage={page}
                    isRTL={isRTL}
                    onPageChange={onPage}
                />
            )}
        </div>
    );
}
