import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { paths } from "@/app/routes/path/paths";
import {
  useScheduledBaskets,
  useDeleteScheduledBasket,
} from "../hooks/useScheduledBaskets";
import type { ScheduledBasketListItem } from "../types/scheduledBasket";
import DeleteBasketPopup from "../components/DeleteBasketPopup";
import { HiShoppingCart, HiTrash, HiCalendar } from "react-icons/hi";
import Button from "@/shared/ui/Button";

export default function MyBaskets() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const { data, isLoading, error } = useScheduledBaskets();
  const deleteBasketMutation = useDeleteScheduledBasket();

  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [basketToDelete, setBasketToDelete] =
    useState<ScheduledBasketListItem | null>(null);

  const baskets = data?.items ?? [];

  const handleViewDetails = (basketId: number) => {
    navigate(paths.account.basketDetails(basketId));
  };

  const handleDeleteClick = (basket: ScheduledBasketListItem) => {
    setBasketToDelete(basket);
    setDeletePopupOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (basketToDelete) {
      deleteBasketMutation.mutate(basketToDelete.id, {
        onSuccess: () => {
          setDeletePopupOpen(false);
          setBasketToDelete(null);
        },
      });
    }
  };

  const handleDeleteClose = () => {
    setDeletePopupOpen(false);
    setBasketToDelete(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {t("baskets.myBaskets")}
          </h1>
          <p className="text-sm text-gray-600">
            {t("baskets.myBasketsDescription")}
          </p>
        </div>
        <div className="flex items-center justify-center py-14">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {t("baskets.myBaskets")}
          </h1>
        </div>
        <div className="py-14 text-center text-red-500">
          {t("baskets.failedToLoad")}
        </div>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {t("baskets.myBaskets")}
        </h1>
        <p className="text-sm text-gray-600">
          {t("baskets.myBasketsDescription")}
        </p>
      </div>

      {/* Baskets List */}
      {baskets.length > 0 ? (
        <div className="space-y-4">
          {baskets.map((basket) => (
            <div
              key={basket.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header Row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Basket Image or Icon */}
                  {basket.image ? (
                    <img
                      src={basket.image}
                      alt={basket.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                      <HiShoppingCart className="w-6 h-6 text-amber-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {basket.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {basket.category}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  {t("baskets.scheduled")}
                </span>
              </div>

              {/* Content Row */}
              <div className="flex items-end justify-between gap-4 mb-4">
                <div className="space-y-1.5 text-sm text-gray-600">
                  <div>
                    {basket.num_varieties} {t("baskets.varieties")}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HiCalendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {t("baskets.nextDelivery")}: {basket.next_run_date}
                    </span>
                  </div>
                </div>

                <div
                  className={`shrink-0 space-y-1 ${isRTL ? "text-left" : "text-right"}`}
                >
                  {basket.discount_amount > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      {basket.original_price}
                    </span>
                  )}
                  <div className="font-bold text-lg text-gray-900">
                    {basket.final_price}
                  </div>
                  {basket.discount_amount > 0 && (
                    <div className="text-sm text-green-600 font-medium">
                      {t("baskets.youSave")} {basket.discount_amount} (
                      {basket.discount_value}
                      {basket.discount_type === "percentage" ? "%" : ""})
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Row */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => handleViewDetails(basket.id)}
                  className="bg-primary hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {t("baskets.viewBasketDetails")}
                </Button>

                <button
                  type="button"
                  onClick={() => handleDeleteClick(basket)}
                  className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600"
                >
                  <HiTrash className="w-4 h-4" />
                  {t("baskets.deleteBasket")}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-14 text-center text-gray-500">
          {t("baskets.noBasketsFound")}
        </div>
      )}

      {/* Delete Basket Popup */}
      {basketToDelete && (
        <DeleteBasketPopup
          isOpen={deletePopupOpen}
          basketName={basketToDelete.name}
          nextRunDate={basketToDelete.next_run_date}
          isDeleting={deleteBasketMutation.isPending}
          onClose={handleDeleteClose}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
