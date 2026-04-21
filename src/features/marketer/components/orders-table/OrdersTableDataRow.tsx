import { DollarSign } from "lucide-react";
import type { TFunction } from "i18next";
import type { MarketerOrder } from "@/features/marketer/types";
import { calculateOrderAffiliateCommission } from "@/features/marketer/utils/affiliateCommission";
import {
    getAffiliateSourceBadgeClassNames,
    getOrderStatusBadgeClassNames,
} from "@/features/marketer/utils/orderTableStyles";

interface OrdersTableDataRowProps {
    order: MarketerOrder;
    rowIndex: number;
    t: TFunction;
}

export function OrdersTableDataRow({ order, rowIndex, t }: OrdersTableDataRowProps) {
    const commission = calculateOrderAffiliateCommission(order.total, order.affiliate_rate);
    const isCoupon = order.affiliate_source === "coupon";
    const sourceLabel = isCoupon
        ? t("marketer.dashboard.coupon", "Coupon")
        : t("marketer.dashboard.link", "Link");

    const rowBackgroundClass =
        rowIndex % 2 === 1 ? "bg-custom-light/35" : "";

    return (
        <tr
            className={`transition-colors duration-150 hover:bg-[color-mix(in_srgb,var(--color-api-second)_5%,var(--color-bg-card))] ${rowBackgroundClass}`}
        >
            <td className="px-4 py-3.5 font-mono text-xs text-text-secondary">#{order.id}</td>
            <td className="px-4 py-3.5">
                <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-text-primary">{order.user.name}</span>
                    <span className="text-xs text-text-secondary">{order.user.phone}</span>
                </div>
            </td>
            <td className="px-4 py-3.5 font-semibold tabular-nums text-text-primary">
                {order.total.toLocaleString()}
            </td>
            <td className="px-4 py-3.5">
                <span className="inline-flex items-center gap-1 rounded-lg bg-status-success-bg/80 px-2 py-1 text-sm font-semibold tabular-nums text-success">
                    <DollarSign className="h-3.5 w-3.5 opacity-80" aria-hidden />+
                    {commission.toLocaleString()}
                </span>
            </td>
            <td className="px-4 py-3.5">
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getAffiliateSourceBadgeClassNames(order.affiliate_source)}`}
                >
                    {sourceLabel}
                </span>
            </td>
            <td className="px-4 py-3.5">
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getOrderStatusBadgeClassNames(order.status)}`}
                >
                    {order.status}
                </span>
            </td>
            <td className="px-4 py-3.5 text-xs text-text-secondary tabular-nums">
                {new Date(order.created_at).toLocaleDateString()}
            </td>
        </tr>
    );
}
