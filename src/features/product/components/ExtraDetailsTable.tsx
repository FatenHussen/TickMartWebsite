import { useTranslation } from "react-i18next";
import { HiMinus, HiPlus } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import type { ExtraDetail } from "../types/productDetails";
import { resolveLocalizedOrString } from "../lib/resolveLocalizedOrString";

function minQtyForDetail(detail: ExtraDetail): number {
    return Math.max(1, detail.quantity ?? 1);
}

export interface ExtraDetailsTableProps {
    details: ExtraDetail[];
    currencySymbol?: string;
    className?: string;
    /** When set, rows show checkboxes and `onToggle` is called with extra detail id */
    selectable?: boolean;
    /** Selected rows only — maps extra id → chosen quantity */
    selection?: Record<number, number>;
    onToggle?: (id: number) => void;
    /** Called when changing quantity for a selected extra (already clamped by parent) */
    onQuantityChange?: (id: number, quantity: number) => void;
    /** Upper bound per extra (variant stock / max purchase cap); prevents unlimited + */
    maxQuantityPerExtra?: number;
}

export default function ExtraDetailsTable({
    details,
    currencySymbol = "$",
    className,
    selectable = false,
    selection = {},
    onToggle,
    onQuantityChange,
    maxQuantityPerExtra = 999,
}: ExtraDetailsTableProps) {
    const { t, i18n } = useTranslation();

    if (!details || details.length === 0) {
        return null;
    }

    const hasPriceColumn = details.some((d) => d.price != null);
    const showQtyColumn = selectable && onToggle && onQuantityChange;

    const formatPriceCell = (detail: ExtraDetail, lineQuantity: number) => {
        if (detail.price == null) return "—";
        if (detail.price === 0) {
            return t("product.free", "Free");
        }
        const total = detail.price * lineQuantity;
        return `${currencySymbol}${total.toFixed(2)}`;
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
                        {showQtyColumn && (
                            <th className="px-4 py-3 text-start text-xs font-semibold text-primary whitespace-nowrap">
                                {t("product.extraDetailQuantity", "Quantity")}
                            </th>
                        )}
                        {hasPriceColumn && (
                            <th className="px-4 py-3 text-start text-xs font-semibold text-primary">
                                {t("product.price", "Price")}
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {details.map((detail, index) => {
                        const isSelected = selection[detail.id] != null;
                        const minQ = minQtyForDetail(detail);
                        const currentQ = selection[detail.id] ?? minQ;
                        const cap = Math.max(minQ, maxQuantityPerExtra);
                        const priceLineQty = showQtyColumn
                            ? isSelected
                                ? currentQ
                                : minQ
                            : minQ;
                        const rowClick =
                            selectable && onToggle
                                ? () => onToggle(detail.id)
                                : undefined;
                        return (
                            <tr
                                key={detail.id}
                                onClick={rowClick}
                                className={cn(
                                    "border-b border-[color-mix(in_srgb,var(--color-api-second)_22%,var(--color-border-primary))] last:border-b-0",
                                    index % 2 === 0
                                        ? "bg-[color-mix(in_srgb,var(--color-api-second)_4%,var(--color-bg-card))]"
                                        : "bg-custom-primary",
                                    selectable &&
                                        onToggle &&
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
                                {showQtyColumn && onQuantityChange && onToggle && (
                                    <td
                                        className="px-4 py-3 align-middle"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (
                                                        !isSelected ||
                                                        currentQ <= minQ
                                                    ) {
                                                        return;
                                                    }
                                                    onQuantityChange(
                                                        detail.id,
                                                        currentQ - 1
                                                    );
                                                }}
                                                disabled={
                                                    !isSelected ||
                                                    currentQ <= minQ
                                                }
                                                className={cn(
                                                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2",
                                                    "border-[color-mix(in_srgb,var(--color-api-second)_42%,var(--color-border-primary))] bg-white",
                                                    "dark:bg-[color-mix(in_srgb,var(--color-main)_18%,#13151c)] text-primary",
                                                    "transition-colors hover:border-[var(--color-api-second)]/80",
                                                    "disabled:cursor-not-allowed disabled:opacity-40"
                                                )}
                                                aria-label={t(
                                                    "product.decreaseQuantity",
                                                    "Decrease quantity"
                                                )}
                                            >
                                                <HiMinus className="h-3.5 w-3.5" />
                                            </button>
                                            <span
                                                className={cn(
                                                    "min-w-[2rem] text-center text-sm font-medium tabular-nums",
                                                    isSelected
                                                        ? "text-custom-primary"
                                                        : "text-custom-secondary"
                                                )}
                                            >
                                                {isSelected ? currentQ : minQ}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (!isSelected) {
                                                        onToggle(detail.id);
                                                        return;
                                                    }
                                                    if (currentQ < cap) {
                                                        onQuantityChange(
                                                            detail.id,
                                                            currentQ + 1
                                                        );
                                                    }
                                                }}
                                                disabled={
                                                    isSelected && currentQ >= cap
                                                }
                                                className={cn(
                                                    "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2",
                                                    "border-[color-mix(in_srgb,var(--color-api-second)_42%,var(--color-border-primary))] bg-white",
                                                    "dark:bg-[color-mix(in_srgb,var(--color-main)_18%,#13151c)] text-primary",
                                                    "transition-colors hover:border-[var(--color-api-second)]/80",
                                                    "disabled:cursor-not-allowed disabled:opacity-40"
                                                )}
                                                aria-label={t(
                                                    "product.increaseQuantity",
                                                    "Increase quantity"
                                                )}
                                            >
                                                <HiPlus className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                )}
                                {hasPriceColumn && (
                                    <td className="px-4 py-3 text-sm text-custom-primary">
                                        {formatPriceCell(detail, priceLineQty)}
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
