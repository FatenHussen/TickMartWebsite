import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiTrash } from "react-icons/hi";
import BasePopup from "@/shared/component/BasePopup";
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
};

export default function CancelOrderModal({
  isOpen,
  onClose,
  onConfirm,
  orderId,
  status,
  total,
  paymentMethod,
  storeLabel = "Store",
}: CancelOrderModalProps) {
  const { t } = useTranslation();
  const [understood, setUnderstood] = useState(false);

  const isPreparing = status === "preparing";
  const isPending = status === "pending";

  // Parse total for fee calculation (e.g. "25,000 SYP" or "£42.96")
  const parseAmount = (s: string): number => {
    const num = parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
    return num;
  };
  const orderTotal = parseAmount(total);
  const feePercent = 10;
  const feeAmount = Math.round(orderTotal * (feePercent / 100));
  const refundAmount = orderTotal - feeAmount;

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

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="md"
      contentClassName="text-start"
      icon={
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <HiTrash className="w-8 h-8 text-red-500" />
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
              "Are you sure you want to cancel this order? Because your order is still pending, it will be cancelled immediately with no fees."
            )
          : t(
              "orders.cancelModal.descriptionPreparing",
              "The store has already started preparing your order. If you cancel now, a cancellation fee will be deducted from your refund. The rest of the amount will be refunded to your original payment method."
            )
      }
      actions={
        <div className="flex flex-col gap-4">
          {isPreparing && (
            <>
              <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    {t("orders.cancelModal.orderTotal", "Order total:")}
                  </span>
                  <span className="font-medium">{total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    {t("orders.cancelModal.cancellationFee", "Cancellation fee (10%):")}
                  </span>
                  <span className="text-red-600 font-medium">-{feeAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    {t("orders.cancelModal.refundAmount", "Refund amount:")}
                  </span>
                  <span className="text-green-600 font-medium">{refundAmount.toLocaleString()}</span>
                </div>
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={understood}
                  onChange={(e) => setUnderstood(e.target.checked)}
                  className="mt-1 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t(
                    "orders.cancelModal.understandCheckbox",
                    "I understand that a cancellation fee will be applied and the remaining amount will be refunded."
                  )}
                </span>
              </label>
            </>
          )}

          {isPending && (
            <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {t("orders.order")} #{orderId}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                  {t("orders.pending")}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{storeLabel}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {t("orders.cancelModal.totalLabel", "Total:")} {total}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {t("orders.payment")}: {paymentMethod}
              </p>
            </div>
          )}

          {isPreparing && (
            <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {t("orders.order")} #{orderId}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                  {t("orders.preparing")}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("orders.payment")}: {paymentMethod}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm"
            >
              {t("orders.cancelModal.keepOrder", "Keep order")}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isPreparing && !understood}
              className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending
                ? t("orders.cancelModal.yesCancel", "Yes, cancel order")
                : t("orders.cancelModal.yesCancelWithFee", "Yes, cancel!")}
            </button>
          </div>
        </div>
      }
    />
  );
}
