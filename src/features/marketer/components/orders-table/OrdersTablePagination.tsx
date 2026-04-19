import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import type { MarketerOrdersPagination } from "@/features/marketer/types";
import { ORDERS_TABLE_PAGINATION_NAV_CLASS } from "@/features/marketer/utils/orderTableStyles";

interface OrdersTablePaginationProps {
    pagination: MarketerOrdersPagination;
    currentPage: number;
    isRTL: boolean;
    onPageChange: (page: number) => void;
}

export function OrdersTablePagination({
    pagination,
    currentPage,
    isRTL,
    onPageChange,
}: OrdersTablePaginationProps) {
    const { t } = useTranslation();

    if (pagination.last_page <= 1) {
        return null;
    }

    const goToPreviousPage = () => onPageChange(currentPage - 1);
    const goToNextPage = () => onPageChange(currentPage + 1);

    const isPrevDisabled = currentPage <= 1;
    const isNextDisabled = currentPage >= pagination.last_page;

    return (
        <div className="flex flex-col gap-3 border-t border-custom-primary bg-custom-light/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-center text-sm text-text-secondary sm:text-start">
                <span className="font-medium text-text-primary">{pagination.current_page}</span>
                <span className="mx-1 text-text-secondary/80">/</span>
                <span>{pagination.last_page}</span>
                <span className="ms-2 text-text-secondary">
                    {t("marketer.dashboard.pageLabel", "pages")}
                </span>
            </p>
            <div className="flex justify-center gap-2 sm:justify-end">
                <button
                    type="button"
                    disabled={isPrevDisabled}
                    onClick={goToPreviousPage}
                    className={ORDERS_TABLE_PAGINATION_NAV_CLASS}
                    aria-label={t("marketer.dashboard.prevPage", "Previous page")}
                >
                    {isRTL ? <HiChevronRight className="h-4 w-4" /> : <HiChevronLeft className="h-4 w-4" />}
                </button>
                <button
                    type="button"
                    disabled={isNextDisabled}
                    onClick={goToNextPage}
                    className={ORDERS_TABLE_PAGINATION_NAV_CLASS}
                    aria-label={t("marketer.dashboard.nextPage", "Next page")}
                >
                    {isRTL ? <HiChevronLeft className="h-4 w-4" /> : <HiChevronRight className="h-4 w-4" />}
                </button>
            </div>
        </div>
    );
}
