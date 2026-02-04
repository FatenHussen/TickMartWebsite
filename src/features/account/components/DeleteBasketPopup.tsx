import { useTranslation } from "react-i18next";
import { HiTrash, HiShoppingCart, HiInformationCircle } from "react-icons/hi";
import Button from "@/shared/ui/Button";
import { BasePopup } from "@/shared/component";
import type { Basket } from "../types";

type DeleteBasketPopupProps = {
  isOpen: boolean;
  basket: Basket | null;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteBasketPopup({
  isOpen,
  basket,
  onClose,
  onConfirm,
}: DeleteBasketPopupProps) {
  const { t } = useTranslation();

  if (!basket) return null;

  const getScheduleTypeLabel = () => {
    return basket.scheduleType === "recurring"
      ? t("baskets.subscription")
      : t("baskets.oneTime");
  };

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={onClose}
      icon={
        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
          <HiTrash className="w-8 h-8 text-orange-500" />
        </div>
      }
      title={t("baskets.deletePopup.title")}
      description={t("baskets.deletePopup.description")}
      actions={
        <div className="space-y-3">
          <Button
            type="button"
            variant="primary"
            onClick={onConfirm}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium"
          >
            {t("baskets.deletePopup.confirmButton")}
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="w-full text-center text-sm text-teal-600 hover:text-teal-700 font-medium py-2"
          >
            {t("baskets.deletePopup.cancelButton")}
          </button>
        </div>
      }
    >
      {/* Basket Card Preview */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
            <HiShoppingCart className="w-5 h-5 text-teal-600" />
          </div>
          <div className="flex-1 min-w-0 text-start">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 truncate">
                {basket.name}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
                {getScheduleTypeLabel()}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {basket.nextDelivery
                ? `${t("baskets.nextDelivery")}: ${basket.nextDelivery}`
                : basket.scheduledFor
                ? `${t("baskets.scheduledFor")}: ${basket.scheduledFor}`
                : basket.scheduleInfo}
            </div>
          </div>
        </div>
      </div>

      {/* Warning Text */}
      <p className="text-xs text-gray-500 text-center mb-4">
        {t("baskets.deletePopup.warning")}
      </p>

      {/* Info Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
        <HiInformationCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
        <p className="text-xs text-yellow-800 text-start">
          {t("baskets.deletePopup.infoNote")}
        </p>
      </div>
    </BasePopup>
  );
}
