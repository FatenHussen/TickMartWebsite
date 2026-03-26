import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import type { ExtraDetail } from "../types/productDetails";

export interface ExtraDetailsTableProps {
    details: ExtraDetail[];
    currencySymbol?: string;
    className?: string;
    /** When set, rows show checkboxes and `onToggle` is called with extra detail id */
    selectable?: boolean;
    selectedIds?: number[];
    onToggle?: (id: number) => void;
}

export default function ExtraDetailsTable({
    details,
    currencySymbol = "$",
    className,
    selectable = false,
    selectedIds = [],
    onToggle,
}: ExtraDetailsTableProps) {
    const { t } = useTranslation();

    if (!details || details.length === 0) {
        return null;
    }

    const hasPriceColumn = details.some((d) => d.price != null);

    const formatPriceCell = (detail: ExtraDetail) => {
        if (detail.price == null) return "—";
        if (detail.price === 0) {
            return t("product.free", "Free");
        }
        return `${currencySymbol}${detail.price.toFixed(2)}`;
    };

    return (
        <div className={cn("w-full", className)}>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-custom-secondary bg-custom-tertiary">
                        {selectable && onToggle && (
                            <th className="px-3 py-3 text-left text-xs font-semibold text-custom-primary w-12">
                                {t("product.check", "Check")}
                            </th>
                        )}
                        <th className="px-4 py-3 text-left text-xs font-semibold text-custom-primary">
                            {t("product.extraDetailKey", "Key")}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-custom-primary">
                            {t("product.extraDetailValue", "Value")}
                        </th>
                        {hasPriceColumn && (
                            <th className="px-4 py-3 text-left text-xs font-semibold text-custom-primary">
                                {t("product.price", "Price")}
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {details.map((detail, index) => {
                        const isSelected = selectedIds.includes(detail.id);
                        const rowClick = selectable && onToggle ? () => onToggle(detail.id) : undefined;
                        return (
                            <tr
                                key={detail.id}
                                onClick={rowClick}
                                className={cn(
                                    "border-b border-custom-secondary",
                                    index % 2 === 0
                                        ? "bg-custom-primary"
                                        : "bg-custom-secondary",
                                    selectable && onToggle && "cursor-pointer hover:opacity-90"
                                )}
                            >
                                {selectable && onToggle && (
                                    <td className="px-3 py-3 align-middle">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => onToggle(detail.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="h-4 w-4 rounded border-custom-secondary text-primary-light accent-primary-light cursor-pointer"
                                        />
                                    </td>
                                )}
                                <td className="px-4 py-3 text-sm font-medium text-custom-secondary w-1/3">
                                    {detail.key}
                                </td>
                                <td className="px-4 py-3 text-sm text-custom-primary">
                                    {detail.value}
                                </td>
                                {hasPriceColumn && (
                                    <td className="px-4 py-3 text-sm text-custom-primary">
                                        {formatPriceCell(detail)}
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
