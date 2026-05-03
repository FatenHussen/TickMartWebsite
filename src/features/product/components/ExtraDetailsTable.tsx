import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import type { ExtraDetail, LocalizedOrString } from "../types/productDetails";

function resolveLocalizedOrString(
    value: LocalizedOrString | number,
    language: string
): string {
    if (value == null) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    if (typeof value === "object") {
        const isArabic = language.toLowerCase().startsWith("ar");
        return (
            (isArabic ? value.ar : value.en) ?? value.en ?? value.ar ?? ""
        );
    }
    return "";
}

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
    const { t, i18n } = useTranslation();

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
        <div
            className={cn(
                "w-full overflow-hidden rounded-xl border",
                "border-[color-mix(in_srgb,var(--color-api-second)_32%,var(--color-border-primary))]",
                className
            )}
        >
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b-2 border-primary/20 bg-[color-mix(in_srgb,var(--color-primary)_9%,var(--color-bg-card))]">
                        {selectable && onToggle && (
                            <th className="px-3 py-3 text-start text-xs font-semibold text-primary w-12">
                                {t("product.check", "Check")}
                            </th>
                        )}
                        <th className="px-4 py-3 text-start text-xs font-semibold text-primary">
                            {t("product.extraDetailKey", "Key")}
                        </th>
                        <th className="px-4 py-3 text-start text-xs font-semibold text-primary">
                            {t("product.extraDetailValue", "Value")}
                        </th>
                        {hasPriceColumn && (
                            <th className="px-4 py-3 text-start text-xs font-semibold text-primary">
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
                                    "border-b border-[color-mix(in_srgb,var(--color-api-second)_22%,var(--color-border-primary))] last:border-b-0",
                                    index % 2 === 0
                                        ? "bg-[color-mix(in_srgb,var(--color-api-second)_4%,var(--color-bg-card))]"
                                        : "bg-custom-primary",
                                    selectable && onToggle &&
                                        "cursor-pointer transition-colors hover:bg-[color-mix(in_srgb,var(--color-api-second)_11%,var(--color-bg-card))]"
                                )}
                            >
                                {selectable && onToggle && (
                                    <td className="px-3 py-3 align-middle">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => onToggle(detail.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            className={cn(
                                                "h-4 w-4 cursor-pointer rounded border-2",
                                                "border-[color-mix(in_srgb,var(--color-api-second)_45%,var(--color-border-secondary))]",
                                                "text-primary accent-primary focus:ring-2 focus:ring-primary/30 focus:ring-offset-0"
                                            )}
                                        />
                                    </td>
                                )}
                                <td className="px-4 py-3 text-sm font-medium text-custom-secondary w-1/3">
                                    {resolveLocalizedOrString(
                                        detail.key,
                                        i18n.language
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm text-custom-primary">
                                    {resolveLocalizedOrString(
                                        detail.value,
                                        i18n.language
                                    )}
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
