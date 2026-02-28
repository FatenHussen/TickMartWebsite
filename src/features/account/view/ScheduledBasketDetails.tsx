import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { paths } from "@/app/routes/path/paths";
import ProductItemsTable, {
  type ProductItemData,
} from "@/shared/component/table/ProductItemsTable";
import BasePopup from "@/shared/component/BasePopup";
import Button from "@/shared/ui/Button";
import { HiClock, HiCalendar, HiTrash, HiPlus } from "react-icons/hi2";
import {
  useScheduledBasketDetails,
  useUpdateScheduledBasket,
  useDeleteScheduledBasket,
} from "../hooks/useScheduledBaskets";
import DeleteBasketPopup from "../components/DeleteBasketPopup";
import type { ScheduledBasketExtraItem } from "../types/scheduledBasket";

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
  const [showExtrasPopup, setShowExtrasPopup] = useState(false);
  const [addedExtras, setAddedExtras] = useState<ScheduledBasketExtraItem[]>(
    []
  );

  // Derived values
  const basketName = editedName ?? basket?.name ?? "";
  const nextRunDate = editedNextRunDate ?? basket?.next_run_date ?? "";

  // Available extras (exclude already added)
  const availableExtras = useMemo(() => {
    const addedIds = new Set(addedExtras.map((e) => e.id));
    return (basket?.extras ?? []).filter((e) => !addedIds.has(e.id));
  }, [basket?.extras, addedExtras]);

  // Convert basket items + added extras to ProductItemData format
  const productItems = useMemo<ProductItemData[]>(() => {
    if (!basket) return [];
    const baseItems = basket.items.map((item) => {
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
    const extraItems = addedExtras.map((extra) => {
      const quantity = itemQuantities[extra.id] ?? extra.quantity ?? 1;
      const subtotal = extra.unit_price * quantity;
      return {
        id: extra.id,
        name: extra.product.name,
        image: extra.product.image,
        quantity: quantity,
        unit_price: extra.unit_price,
        subtotal: subtotal,
        can_adjust: true,
        min_quantity: 1,
        max_quantity: 999,
        variant: Array.isArray(extra.variant)
          ? extra.variant.filter(
              (v) => !(typeof v === "string" && v.startsWith("#"))
            )
          : undefined,
      };
    });
    return [...baseItems, ...extraItems];
  }, [basket, itemQuantities, addedExtras]);

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

  // Handle removing an added extra (only for items in addedExtras)
  const handleRemoveItem = (itemId: number) => {
    const isExtra = addedExtras.some((e) => e.id === itemId);
    if (!isExtra) return;
    setAddedExtras((prev) => prev.filter((e) => e.id !== itemId));
    setItemQuantities((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  // Handle adding an extra from popup
  const handleAddExtra = (extra: ScheduledBasketExtraItem) => {
    setAddedExtras((prev) => [...prev, extra]);
    setItemQuantities((prev) => ({
      ...prev,
      [extra.id]: extra.quantity ?? 1,
    }));
    setShowExtrasPopup(false);
  };

  // Handle save
  const handleSave = () => {
    if (!basket) return;

    const existingItems = basket.items.map((item) => ({
      product_id: item.product.id,
      shop_product_variant_id: item.shop_product_variant_id ?? item.id,
      quantity: itemQuantities[item.id] ?? item.quantity,
    }));
    const newItems = addedExtras.map((extra) => ({
      product_id: extra.product.id,
      shop_product_variant_id: extra.shop_product_variant_id,
      quantity: itemQuantities[extra.id] ?? extra.quantity ?? 1,
    }));

    updateMutation.mutate(
      {
        id: basket.id,
        payload: {
          name: basketName,
          next_run_date: nextRunDate,
          items: [...existingItems, ...newItems],
        },
      },
      {
        onSuccess: () => {
          toast.success(t("baskets.savedSuccessfully"));
        },
      }
    );
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
          onRemoveItem={addedExtras.length > 0 ? handleRemoveItem : undefined}
          showCompanyColumn={false}
          showVariantColumn={true}
          showActionColumn={addedExtras.length > 0}
          currencySymbol=""
        />
      </div>

      {/* Summary Section */}
      <div className="bg-cyan-50 dark:bg-cyan-900/20 border-2 border-cyan-200 dark:border-cyan-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {t("baskets.orderSummary")}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>
                {productItems.length} {t("baskets.totalItems")}
              </span>
              <span className="text-gray-400">|</span>
              <span>
                {t("recipes.quantity")}: {totalQuantity}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={isRTL ? "text-left" : "text-right"}>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t("baskets.subtotal")}: {subtotal.toFixed(2)}
              </div>
              <div className="text-lg font-bold text-cyan-600">
                {t("baskets.total")}: {total.toFixed(2)}
              </div>
            </div>
            {availableExtras.length > 0 && (
              <Button
                onClick={() => setShowExtrasPopup(true)}
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium shrink-0"
              >
                <HiPlus className="w-4 h-4" />
                {t("baskets.addMoreItems")}
              </Button>
            )}
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

      {/* Extras Popup */}
      <BasePopup
        isOpen={showExtrasPopup}
        onClose={() => setShowExtrasPopup(false)}
        title={t("baskets.addMoreItems")}
        maxWidth="lg"
        contentClassName="!text-start p-6"
        actions={
          <Button
            onClick={() => setShowExtrasPopup(false)}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            size="lg"
          >
            {t("common.close")}
          </Button>
        }
      >
        <div className="max-h-[50vh] overflow-y-auto">
          {availableExtras.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              {t("baskets.noExtrasAvailable")}
            </p>
          ) : (
            <div className="space-y-3">
              {availableExtras.map((extra) => (
                <div
                  key={extra.id}
                  className="flex items-center gap-4 p-3 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-cyan-300 dark:hover:border-cyan-600 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/20 transition cursor-pointer group"
                  onClick={() => handleAddExtra(extra)}
                >
                  <img
                    src={extra.product.image}
                    alt={extra.product.name}
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                      {extra.product.name}
                    </h4>
                    {extra.variant && extra.variant.length > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {extra.variant
                          .filter((v) => !(typeof v === "string" && v.startsWith("#")))
                          .join(", ")}
                      </span>
                    )}
                    <p className="text-sm font-bold text-cyan-600 mt-1">
                      {extra.unit_price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    className="w-9 h-9 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddExtra(extra);
                    }}
                  >
                    <HiPlus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </BasePopup>

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
