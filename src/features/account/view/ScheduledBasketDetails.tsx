import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { paths } from "@/app/routes/path/paths";
import ProductItemsTable, {
  type ProductItemData,
} from "@/shared/component/table/ProductItemsTable";
import Button from "@/shared/ui/Button";
import { HiClock, HiCalendar, HiTrash } from "react-icons/hi2";
import {
  useScheduledBasketDetails,
  useUpdateScheduledBasket,
  useDeleteScheduledBasket,
} from "../hooks/useScheduledBaskets";
import DeleteBasketPopup from "../components/DeleteBasketPopup";

export default function ScheduledBasketDetails() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const basketId = parseInt(id || "0", 10);

  const {
    data: basket,
    isLoading,
    error,
  } = useScheduledBasketDetails(basketId);

  const updateMutation = useUpdateScheduledBasket();
  const deleteMutation = useDeleteScheduledBasket();

  // Editable state
  const [editedName, setEditedName] = useState<string | null>(null);
  const [editedNextRunDate, setEditedNextRunDate] = useState<string | null>(
    null
  );
  const [itemQuantities, setItemQuantities] = useState<
    Record<number, number>
  >({});
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);

  // Derived values
  const basketName = editedName ?? basket?.name ?? "";
  const nextRunDate = editedNextRunDate ?? basket?.next_run_date ?? "";

  // Convert basket items to ProductItemData format
  const productItems = useMemo<ProductItemData[]>(() => {
    if (!basket) return [];
    return basket.items.map((item) => {
      const quantity = itemQuantities[item.id] ?? item.quantity;
      const subtotal = item.price * quantity;

      return {
        id: item.id,
        name: item.product.name,
        image: item.product.image,
        quantity: quantity,
        unit_price: item.price,
        subtotal: subtotal,
        can_adjust: true,
        min_quantity: 1,
        max_quantity: 999,
        variant: item.variant?.name,
      };
    });
  }, [basket, itemQuantities]);

  // Calculate totals
  const subtotal = useMemo(() => {
    return productItems.reduce((sum, item) => sum + item.subtotal, 0);
  }, [productItems]);

  const totalQuantity = useMemo(() => {
    return productItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [productItems]);

  const scheduleDiscount = useMemo(() => {
    if (!basket?.schedule) return 0;
    if (basket.schedule.discount_type === "percentage") {
      return (subtotal * basket.schedule.discount_value) / 100;
    }
    return basket.schedule.discount_value;
  }, [basket?.schedule, subtotal]);

  const total = subtotal - scheduleDiscount;

  // Handle quantity change
  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    setItemQuantities((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));
  };

  // Handle save
  const handleSave = () => {
    if (!basket) return;

    const items = basket.items.map((item) => ({
      id: item.id,
      product_id: item.product.id,
      shop_product_variant_id: item.id,
      quantity: itemQuantities[item.id] ?? item.quantity,
    }));

    updateMutation.mutate({
      id: basket.id,
      payload: {
        name: basketName,
        next_run_date: nextRunDate,
        items,
      },
    });
  };

  // Handle delete
  const handleDeleteConfirm = () => {
    if (!basket) return;
    deleteMutation.mutate(basket.id, {
      onSuccess: () => {
        setDeletePopupOpen(false);
        navigate(paths.account.baskets);
      },
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex items-center justify-center py-14">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !basket) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"}>
        <div className="text-center py-14">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t("baskets.basketNotFound")}
          </h2>
          <p className="text-gray-500 mb-4">
            {t("baskets.basketNotFoundDescription")}
          </p>
          <Button
            onClick={() => navigate(paths.account.baskets)}
            variant="primary"
          >
            {t("common.back")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Basket Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Editable Name */}
            <input
              type="text"
              value={basketName}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-lg font-bold text-gray-900 border-b-2 border-transparent hover:border-gray-300 focus:border-cyan-500 focus:outline-none bg-transparent transition-colors px-1 py-0.5"
            />
            {/* Active Badge */}
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                basket.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {basket.is_active
                ? t("baskets.active")
                : t("baskets.paused")}
            </span>
            {/* Category */}
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {basket.category}
            </span>
          </div>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => setDeletePopupOpen(true)}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition"
          >
            <HiTrash className="w-4 h-4" />
            {t("baskets.deleteBasket")}
          </button>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-cyan-600">
              {productItems.length}
            </span>
            <span>{t("checkout.items")}</span>
          </div>
          <div className="flex items-center gap-2">
            <HiClock className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{t("baskets.nextDelivery")}:</span>
            <input
              type="date"
              value={nextRunDate}
              onChange={(e) => setEditedNextRunDate(e.target.value)}
              className="text-gray-900 border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Schedule Info */}
      {basket.schedule && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center shrink-0">
              <HiCalendar className="w-4 h-4 text-cyan-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                {basket.schedule.name}
              </h4>
              <p className="text-sm text-gray-600">
                {t("baskets.every")} {basket.schedule.interval_days}{" "}
                {t("baskets.days")}
                {basket.schedule.discount_value > 0 && (
                  <span className="text-green-600 font-medium">
                    {" "}
                    &bull; {basket.schedule.discount_value}
                    {basket.schedule.discount_type === "percentage"
                      ? "%"
                      : ""}{" "}
                    {t("baskets.discountExtra")}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Info */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-gray-600">{t("baskets.subtotal")}:</span>
              <span className="font-bold text-gray-900 ml-2">
                {subtotal.toFixed(2)}
              </span>
            </div>
            {scheduleDiscount > 0 && (
              <div>
                <span className="text-gray-600">
                  {t("baskets.scheduleDiscount")}:
                </span>
                <span className="font-bold text-red-600 ml-2">
                  -{scheduleDiscount.toFixed(2)}
                </span>
              </div>
            )}
            <div>
              <span className="text-gray-600">{t("baskets.total")}:</span>
              <span className="font-bold text-cyan-600 text-lg ml-2">
                {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        {scheduleDiscount > 0 && (
          <p className="text-sm text-green-600 font-medium">
            {t("baskets.youSave")} {scheduleDiscount.toFixed(2)} (
            {basket.schedule.discount_value}
            {basket.schedule.discount_type === "percentage" ? "%" : ""})
          </p>
        )}
      </div>

      {/* Products Table */}
      <div className="mb-4">
        <ProductItemsTable
          items={productItems}
          onQuantityChange={handleQuantityChange}
          showCompanyColumn={false}
          showVariantColumn={true}
          showActionColumn={false}
          currencySymbol=""
        />
      </div>

      {/* Summary Section */}
      <div className="bg-cyan-50 border-2 border-cyan-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-bold text-gray-900">
              {t("baskets.orderSummary")}
            </span>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">
                {productItems.length} {t("baskets.totalItems")}
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">
                {t("recipes.quantity")}: {totalQuantity}
              </span>
            </div>
          </div>
          <div className={isRTL ? "text-left" : "text-right"}>
            <div className="text-sm text-gray-600">
              {t("baskets.subtotal")}: {subtotal.toFixed(2)}
            </div>
            <div className="text-lg font-bold text-cyan-600">
              {t("baskets.total")}: {total.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-12 py-3 text-lg font-semibold rounded-lg w-full md:w-auto"
          size="lg"
        >
          {updateMutation.isPending
            ? t("common.loading")
            : t("common.save")}
        </Button>
      </div>

      {/* Delete Basket Popup */}
      <DeleteBasketPopup
        isOpen={deletePopupOpen}
        basketName={basket.name}
        nextRunDate={basket.next_run_date}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeletePopupOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
