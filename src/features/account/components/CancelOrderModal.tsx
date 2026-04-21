import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiTrash } from "react-icons/hi";
import BasePopup from "@/shared/component/BasePopup";
import { cn } from "@/shared/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import type { OrderStatus } from "@/features/cart/types";

type CancelOrderModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    orderId: string | number;
    status: OrderStatus;
    total: string;
    paymentMethod: string;
    storeLabel?: string;
    isLoading?: boolean;
};

function parseAmount(s: string): number {
    const num = parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
    return num;
}

function formatLikeTotal(value: number, totalDisplay: string): string {
    const t = totalDisplay.trim();
    if (t.includes("$")) {
        return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    }
    if (/syp|ل\.س/i.test(t)) {
        return `${value.toLocaleString()} SYP`;
    }
    if (/£/.test(t)) {
        return `£${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function CancelOrderModal({
    isOpen,
    onClose,
    onConfirm,
    orderId,
    status,
    total,
    paymentMethod,
    storeLabel = "Store",
    isLoading = false,
}: CancelOrderModalProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const [understood, setUnderstood] = useState(false);

    const isPreparing = status === "preparing";
    const isPending = status === "pending";

    const orderTotal = parseAmount(total);
    const feePercent = 10;
    const feeAmount = Math.round(orderTotal * (feePercent / 100));
    const refundAmount = Math.max(0, orderTotal - feeAmount);

    const feeDisplay =
        orderTotal > 0 ? `-${formatLikeTotal(feeAmount, total)}` : formatLikeTotal(0, total);
    const refundDisplay = formatLikeTotal(refundAmount, total);

    const handleConfirm = () => {
        if (isPreparing && !understood) return;
        onConfirm();
        onClose();
        setUnderstood(false);
    };

    const handleClose = () => {
        setUnderstood(false);
        onClose();
    };

    const statusLabel = isPending ? t("orders.pending") : t("orders.preparing");

    return (
        <BasePopup
            isOpen={isOpen}
            onClose={handleClose}
            maxWidth="md"
            contentClassName={cn("text-start", isRTL && "text-right")}
            icon={
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
                    <HiTrash className="h-6 w-6" aria-hidden />
                </div>
            }
            title={
                isPending
                    ? t("orders.cancelModal.title", "Cancel this order?")
                    : t("orders.cancelModal.titleWithFee", "Cancel this order with a fee?")
            }
            description={
                isPending
                    ? t(
                          "orders.cancelModal.descriptionPending",
                          "Are you sure you want to cancel this order? Because your order is still pending, it will be cancelled immediately with no fees.",
                      )
                    : t(
                          "orders.cancelModal.descriptionPreparing",
                          "The store has already started preparing your order. If you cancel now, a cancellation fee will be deducted from your refund. The rest of the amount will be refunded to your original payment method.",
                      )
            }
            actions={
                <div
                    className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"
                    dir={isRTL ? "rtl" : "ltr"}
                >
                    <button
                        type="button"
                        onClick={handleClose}
                        className="w-full rounded-lg border border-custom-primary bg-custom-card px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-custom-tertiary sm:w-auto"
                    >
                        {t("orders.cancelModal.keepOrder", "Keep order")}
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={(isPreparing && !understood) || isLoading}
                        className="w-full rounded-lg bg-error px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                        {isLoading
                            ? t("common.loading", "Loading...")
                            : isPending
                              ? t("orders.cancelModal.yesCancel", "Yes, cancel order")
                              : t("orders.cancelModal.yesCancelWithFee", "Yes, cancel!")}
                    </button>
                </div>
            }
        >
            <div className="space-y-4 text-start" dir={isRTL ? "rtl" : "ltr"}>
                {isPreparing && (
                    <>
                        <div className="rounded-lg border border-custom-primary bg-custom-tertiary/80 p-4 text-sm">
                            <table className="w-full border-collapse">
                                <tbody>
                                    <tr className="border-b border-custom-primary">
                                        <td className="py-2 pe-2 text-text-secondary">
                                            {t("orders.cancelModal.orderTotal", "Order total:")}
                                        </td>
                                        <td className="py-2 ps-2 text-end font-medium text-text-primary">
                                            {total}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-custom-primary">
                                        <td className="py-2 pe-2 text-text-secondary">
                                            {t(
                                                "orders.cancelModal.cancellationFee",
                                                "Cancellation fee (10%):",
                                            )}
                                        </td>
                                        <td className="py-2 ps-2 text-end font-medium text-error">
                                            {feeDisplay}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pe-2 font-medium text-text-primary">
                                            {t("orders.cancelModal.refundAmount", "Refund amount:")}
                                        </td>
                                        <td className="py-2 ps-2 text-end font-semibold text-success">
                                            {refundDisplay}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <label className="flex cursor-pointer items-start gap-2 text-sm text-text-secondary">
                            <input
                                type="checkbox"
                                checked={understood}
                                onChange={(e) => setUnderstood(e.target.checked)}
                                className="mt-0.5 h-4 w-4 shrink-0 rounded border-custom-secondary text-primary focus:ring-primary"
                            />
                            <span>
                                {t(
                                    "orders.cancelModal.understandCheckbox",
                                    "I understand that a cancellation fee will be applied and the remaining amount will be refunded.",
                                )}
                            </span>
                        </label>
                    </>
                )}

                <div className="rounded-lg border border-custom-primary bg-custom-tertiary/50 p-4 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium text-text-primary">
                            {t("orders.order")} #{orderId}
                        </span>
                        <span className="rounded-md bg-custom-card px-2 py-0.5 text-xs font-medium text-text-secondary ring-1 ring-custom-primary">
                            {statusLabel}
                        </span>
                    </div>
                    {isPending && (
                        <>
                            <p className="mt-2 text-text-secondary">{storeLabel}</p>
                            <p className="mt-1 font-medium text-text-primary">
                                {t("orders.cancelModal.totalLabel", "Total:")} {total}
                            </p>
                        </>
                    )}
                    <p className={cn("text-text-secondary", isPending ? "mt-2" : "mt-3")}>
                        {t("orders.payment")}:{" "}
                        <span className="text-text-primary">{paymentMethod}</span>
                    </p>
                </div>
            </div>
        </BasePopup>
    );
}
