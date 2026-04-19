import { useTranslation } from "react-i18next";

export function OrdersTableHead() {
    const { t } = useTranslation();

    const headerClass =
        "px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wide text-text-secondary";

    return (
        <thead>
            <tr className="border-b border-custom-primary bg-custom-light/90">
                <th scope="col" className={headerClass}>
                    #
                </th>
                <th scope="col" className={headerClass}>
                    {t("marketer.dashboard.customer", "Customer")}
                </th>
                <th scope="col" className={headerClass}>
                    {t("marketer.dashboard.total", "Total")}
                </th>
                <th scope="col" className={headerClass}>
                    {t("marketer.dashboard.commission", "Commission")}
                </th>
                <th scope="col" className={headerClass}>
                    {t("marketer.dashboard.source", "Source")}
                </th>
                <th scope="col" className={headerClass}>
                    {t("marketer.dashboard.status", "Status")}
                </th>
                <th scope="col" className={headerClass}>
                    {t("marketer.dashboard.date", "Date")}
                </th>
            </tr>
        </thead>
    );
}
