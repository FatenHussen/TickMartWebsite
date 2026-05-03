import { useState, useMemo, useEffect } from"react";
import { useParams, useNavigate } from"react-router-dom";
import { useTranslation } from"react-i18next";
import { toast } from"sonner";
import { useLanguage } from"@/context/LanguageContext";
import { paths } from"@/app/routes/path/paths";
import { useSchedules } from"@/features/cart/hooks/useSchedules";
import type { ScheduleItem } from"@/features/cart/types";
import ProductItemsTable, {
 type ProductItemData,
} from"@/shared/component/table/ProductItemsTable";
import BasePopup from"@/shared/component/BasePopup";
import { Button, Select } from"@/shared/ui";
import { HiClock, HiCalendar, HiTrash, HiPlus } from"react-icons/hi2";
import {
 useScheduledBasketDetails,
 useUpdateScheduledBasket,
 useDeleteScheduledBasket,
} from"../hooks/useScheduledBaskets";
import DeleteBasketPopup from"../components/DeleteBasketPopup";
import AddProductModal from"../components/AddProductModal";
import type {
 ScheduledBasketExtraItem,
 ScheduledBasketSchedule,
} from"../types/scheduledBasket";

export default function ScheduledBasketDetails() {
 const { t } = useTranslation();
 const { isRTL } = useLanguage();
 const { id } = useParams<{ id: string }>();
 const navigate = useNavigate();
 const basketId = parseInt(id ||"0", 10);

 const {
 data: basket,
 isLoading,
 error,
 } = useScheduledBasketDetails(basketId);

 const updateMutation = useUpdateScheduledBasket();
 const deleteMutation = useDeleteScheduledBasket();
 const { items: scheduleItems = [], isLoading: isSchedulesLoading } =
 useSchedules();

 // Editable state
 const [editedName, setEditedName] = useState<string | null>(null);
 /** Local override when user picks another schedule from the list */
 const [editedScheduleId, setEditedScheduleId] = useState<number | null>(
 null
 );
 const [itemQuantities, setItemQuantities] = useState<
 Record<number, number>
 >({});
 const [deletePopupOpen, setDeletePopupOpen] = useState(false);
 const [showExtrasPopup, setShowExtrasPopup] = useState(false);
 const [showAddProductModal, setShowAddProductModal] = useState(false);
 const [addedExtras, setAddedExtras] = useState<ScheduledBasketExtraItem[]>(
 []
 );

 useEffect(() => {
 setEditedName(null);
 setEditedScheduleId(null);
 }, [basketId]);

 // Derived values
 const basketName = editedName ?? basket?.name ??"";
 const selectedScheduleId =
 editedScheduleId ?? basket?.schedule?.id ?? null;

 const effectiveSchedule = useMemo<
 ScheduleItem | ScheduledBasketSchedule | null
 >(() => {
 if (!basket) return null;
 if (selectedScheduleId == null) return basket.schedule ?? null;
 const fromList = scheduleItems.find((s) => s.id === selectedScheduleId);
 return fromList ?? basket.schedule ?? null;
 }, [basket, scheduleItems, selectedScheduleId]);

 const scheduleSelectOptions = useMemo(
 () =>
 scheduleItems
 .filter((s) => s.is_active !== false)
 .map((s) => ({
 value: s.id,
 label:
 s.discount_value > 0
 ? `${s.name} (${s.discount_value}${
 s.discount_type ==="percentage"?"%": ""
 } ${t("baskets.discountExtra")})`
 : s.name,
 })),
 [scheduleItems, t]
 );

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
 const unitAfter =
 item.price_after_discount ?? item.price ?? 0;
 const subtotal = unitAfter * quantity;
 const priceLineFormatted =
 quantity === item.quantity &&
 item.price_after_discount_formatted
 ? item.price_after_discount_formatted
 : undefined;
 return {
 id: item.id,
 name: item.product.name,
 image: item.product.image,
 quantity: quantity,
 unit_price: unitAfter,
 subtotal: subtotal,
 priceLineFormatted,
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
 (v) => !(typeof v ==="string"&& v.startsWith("#"))
 )
 : undefined,
 };
 });
 return [...baseItems, ...extraItems];
 }, [basket, itemQuantities, addedExtras]);

 // Calculate totals (API lines use original_price vs price_after_discount; avoid double-applying schedule %)
 const subtotalBeforeDiscount = useMemo(() => {
 if (!basket) return 0;
 let sum = 0;
 for (const item of basket.items) {
 const qty = itemQuantities[item.id] ?? item.quantity;
 const orig =
 item.original_price ?? item.price ?? item.price_after_discount ?? 0;
 sum += orig * qty;
 }
 for (const extra of addedExtras) {
 const qty = itemQuantities[extra.id] ?? extra.quantity ?? 1;
 sum += extra.unit_price * qty;
 }
 return sum;
 }, [basket, itemQuantities, addedExtras]);

 const totalAfterDiscount = useMemo(
 () =>
 productItems.reduce(
 (sum, item) =>
 sum + (Number.isFinite(item.subtotal) ? item.subtotal : 0),
 0
 ),
 [productItems]
 );

 const scheduleDiscountAmount = useMemo(
 () => Math.max(0, subtotalBeforeDiscount - totalAfterDiscount),
 [subtotalBeforeDiscount, totalAfterDiscount]
 );

 const totalQuantity = useMemo(() => {
 return productItems.reduce((sum, item) => sum + item.quantity, 0);
 }, [productItems]);

 const currencySymbol = basket?.items[0]?.currency_symbol ??"$";

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
 const resolvedScheduleId = selectedScheduleId ?? basket.schedule?.id;
 if (resolvedScheduleId == null) {
 toast.error(t("baskets.selectSchedule"));
 return;
 }

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
 schedule_id: resolvedScheduleId,
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
 <div dir={isRTL ?"rtl":"ltr"}>
 <div className="flex items-center justify-center py-14">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
 </div>
 </div>
 );
 }

 // Error state
 if (error || !basket) {
 return (
 <div dir={isRTL ?"rtl":"ltr"}>
 <div className="text-center py-14">
 <h2 className="text-xl font-bold text-custom-primary mb-2">
 {t("baskets.basketNotFound")}
 </h2>
 <p className="text-custom-secondary mb-4">
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
 <div dir={isRTL ?"rtl":"ltr"} className="space-y-4">
 {/* Basket Header */}
 <div
 className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--color-api-second)_22%,var(--color-border-primary))] bg-[linear-gradient(135deg,var(--color-bg-card)_0%,color-mix(in_srgb,var(--color-api-second)_8%,var(--color-bg-card))_100%)] p-5 shadow-[0_10px_30px_-18px_color-mix(in_srgb,var(--color-api-second)_45%,transparent)]"
 >
 <div
 className="pointer-events-none absolute -end-16 -top-20 h-40 w-40 rounded-full bg-[var(--color-api-second)] opacity-[0.1] blur-3xl"
 aria-hidden
 />
 <div className="relative flex items-center justify-between mb-3">
 <div className="flex items-center gap-3 flex-wrap">
 {/* Editable Name */}
 <input
 type="text"
 value={basketName}
 onChange={(e) => setEditedName(e.target.value)}
 className="text-lg font-bold text-custom-primary border-b-2 border-transparent hover:border-[color-mix(in_srgb,var(--color-api-second)_45%,transparent)] focus:border-[var(--color-api-second)] focus:outline-none bg-transparent transition-colors px-1 py-0.5"
 />
 {/* Active Badge */}
 <span
 className={`px-3 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${
 basket.is_active
 ?"bg-[color-mix(in_srgb,var(--color-success)_18%,var(--color-bg-card))] text-[var(--color-success)] ring-[color-mix(in_srgb,var(--color-success)_35%,transparent)]"
 :"bg-custom-tertiary text-custom-secondary ring-[var(--color-border-primary)]"
 }`}
 >
 {basket.is_active
 ? t("baskets.active")
 : t("baskets.paused")}
 </span>
 {basket.category && (
 <span className="px-3 py-1 bg-[color-mix(in_srgb,var(--color-main)_15%,var(--color-bg-card))] text-[var(--color-main)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-main)_30%,transparent)] text-xs font-medium rounded-full">
 {basket.category}
 </span>
 )}
 </div>

 {/* Delete Button */}
 <button
 type="button"
 onClick={() => setDeletePopupOpen(true)}
 className="flex items-center gap-1.5 text-sm text-[var(--color-error)] hover:text-[var(--color-error-light)] transition"
 >
 <HiTrash className="w-4 h-4"/>
 {t("baskets.deleteBasket")}
 </button>
 </div>

 <div className="relative flex items-center gap-6 text-sm text-custom-secondary">
 <div className="flex items-center gap-2">
 <span className="font-semibold text-[var(--color-api-second)]">
 {productItems.length}
 </span>
 <span>{t("checkout.items")}</span>
 </div>
 <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
 <div className="flex items-center gap-2 shrink-0">
 <HiClock className="w-4 h-4 text-custom-tertiary"/>
 <span className="font-medium whitespace-nowrap">
 {t("baskets.nextDelivery")}:
 </span>
 <span className="text-custom-primary">
 {basket.next_run_date ||"—"}
 </span>
 </div>
 <div className="w-full sm:w-72 max-w-full">
 <Select
 label={t("baskets.selectSchedule")}
 options={scheduleSelectOptions}
 value={selectedScheduleId ??""}
 onChange={(e) =>
 setEditedScheduleId(
 e.target.value ? Number(e.target.value) : null
 )
 }
 disabled={isSchedulesLoading || scheduleSelectOptions.length === 0}
 className="!mb-0"
 />
 </div>
 </div>
 </div>
 </div>

 {/* Schedule Info (reflects selected schedule from dropdown) */}
 {effectiveSchedule && (
 <div className="rounded-2xl border border-[var(--color-border-primary)] bg-custom-card p-4 shadow-sm">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-[color-mix(in_srgb,var(--color-api-second)_18%,var(--color-bg-card))] ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-api-second)_35%,transparent)] flex items-center justify-center shrink-0">
 <HiCalendar className="w-5 h-5 text-[var(--color-api-second)]"/>
 </div>
 <div>
 <h4 className="font-semibold text-custom-primary">
 {effectiveSchedule.name}
 </h4>
 <p className="text-sm text-custom-secondary">
 {t("baskets.every")} {effectiveSchedule.interval_days}{""}
 {t("baskets.days")}
 {effectiveSchedule.discount_value > 0 && (
 <span className="text-[var(--color-success)] font-medium">
 {""}
 &bull; {effectiveSchedule.discount_value}
 {effectiveSchedule.discount_type ==="percentage"
 ?"%"
 :""}{""}
 {t("baskets.discountExtra")}
 </span>
 )}
 </p>
 </div>
 </div>
 </div>
 )}

 {/* Pricing Info */}
 <div className="rounded-2xl border border-[var(--color-border-primary)] bg-custom-card p-4 shadow-sm">
 <div className="flex items-center justify-between text-sm mb-2">
 <div className="flex items-center gap-4 flex-wrap">
 <div>
 <span className="text-custom-secondary">{t("baskets.subtotal")}:</span>
 <span className="font-bold text-custom-primary ml-2">
 {currencySymbol}
 {subtotalBeforeDiscount.toFixed(2)}
 </span>
 </div>
 {scheduleDiscountAmount > 0 && (
 <div>
 <span className="text-custom-secondary">
 {t("baskets.scheduleDiscount")}:
 </span>
 <span className="font-bold text-[var(--color-error)] ml-2">
 -{currencySymbol}
 {scheduleDiscountAmount.toFixed(2)}
 </span>
 </div>
 )}
 <div>
 <span className="text-custom-secondary">{t("baskets.total")}:</span>
 <span className="font-bold text-[var(--color-api-second)] text-lg ml-2">
 {currencySymbol}
 {totalAfterDiscount.toFixed(2)}
 </span>
 </div>
 </div>
 </div>
 {scheduleDiscountAmount > 0 && effectiveSchedule && (
 <p className="text-sm text-[var(--color-success)] font-medium">
 {t("baskets.youSave")} {currencySymbol}
 {scheduleDiscountAmount.toFixed(2)} (
 {effectiveSchedule.discount_value}
 {effectiveSchedule.discount_type ==="percentage"?"%":""})
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
 currencySymbol={currencySymbol}
 />
 </div>

 {/* Summary Section */}
 <div className="rounded-2xl border-2 border-[color-mix(in_srgb,var(--color-api-second)_28%,var(--color-border-primary))] bg-[color-mix(in_srgb,var(--color-api-second)_8%,var(--color-bg-card))] p-4 shadow-[0_8px_24px_-16px_color-mix(in_srgb,var(--color-api-second)_35%,transparent)]">
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div className="flex items-center gap-6 flex-wrap">
 <span className="font-bold text-custom-primary">
 {t("baskets.orderSummary")}
 </span>
 <div className="flex items-center gap-2 text-sm text-custom-secondary">
 <span>
 {productItems.length} {t("baskets.totalItems")}
 </span>
 <span className="text-custom-tertiary">|</span>
 <span>
 {t("recipes.quantity")}: {totalQuantity}
 </span>
 </div>
 </div>
 <div className="flex items-center gap-4 flex-wrap">
 <div className={isRTL ?"text-left":"text-right"}>
 <div className="text-sm text-custom-secondary">
 {t("baskets.subtotal")}: {currencySymbol}
 {subtotalBeforeDiscount.toFixed(2)}
 </div>
 <div className="text-lg font-bold text-[var(--color-api-second)]">
 {t("baskets.total")}: {currencySymbol}
 {totalAfterDiscount.toFixed(2)}
 </div>
 </div>
 <div className="flex items-center gap-2 flex-wrap">
 {availableExtras.length > 0 && (
 <Button
 onClick={() => setShowExtrasPopup(true)}
 className="flex items-center gap-2 !bg-[var(--color-api-second)] hover:!bg-[var(--color-api-second-hover)] !text-white px-4 py-2 rounded-lg text-sm font-medium shrink-0 shadow-[0_6px_18px_-10px_color-mix(in_srgb,var(--color-api-second)_55%,transparent)]"
 >
 <HiPlus className="w-4 h-4"/>
 {t("baskets.addMoreItems")}
 </Button>
 )}
 <Button
 onClick={() => setShowAddProductModal(true)}
 className="flex items-center gap-2 !bg-[var(--color-api-second)] hover:!bg-[var(--color-api-second-hover)] !text-white px-4 py-2 rounded-lg text-sm font-medium shrink-0 shadow-[0_6px_18px_-10px_color-mix(in_srgb,var(--color-api-second)_55%,transparent)]"
 >
 <HiPlus className="w-4 h-4"/>
 {t("baskets.addProduct")}
 </Button>
 </div>
 </div>
 </div>
 </div>

 {/* Save Button */}
 <div className="flex justify-center pt-2">
 <Button
 onClick={handleSave}
 disabled={updateMutation.isPending}
 className="!bg-[var(--color-api-second)] hover:!bg-[var(--color-api-second-hover)] !text-white px-12 py-3 text-lg font-semibold rounded-xl w-full md:w-auto shadow-[0_10px_28px_-14px_color-mix(in_srgb,var(--color-api-second)_55%,transparent)]"
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
 className="w-full !bg-[var(--color-api-second)] hover:!bg-[var(--color-api-second-hover)] !text-white"
 size="lg"
 >
 {t("common.close")}
 </Button>
 }
 >
 <div className="max-h-[50vh] overflow-y-auto">
 {availableExtras.length === 0 ? (
 <p className="text-center text-custom-secondary py-8">
 {t("baskets.noExtrasAvailable")}
 </p>
 ) : (
 <div className="space-y-3">
 {availableExtras.map((extra) => (
 <div
 key={extra.id}
 className="flex items-center gap-4 p-3 border border-[var(--color-border-primary)] rounded-xl hover:border-[color-mix(in_srgb,var(--color-api-second)_50%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-api-second)_10%,var(--color-bg-card))] transition cursor-pointer group"
 onClick={() => handleAddExtra(extra)}
 >
 <img
 src={extra.product.image}
 alt={extra.product.name}
 className="w-14 h-14 rounded-lg object-cover shrink-0"
 />
 <div className="flex-1 min-w-0">
 <h4 className="font-semibold text-custom-primary text-sm truncate">
 {extra.product.name}
 </h4>
 {extra.variant && extra.variant.length > 0 && (
 <span className="text-xs text-custom-secondary">
 {extra.variant
 .filter((v) => !(typeof v ==="string"&& v.startsWith("#")))
 .join(",")}
 </span>
 )}
 <p className="text-sm font-bold text-[var(--color-api-second)] mt-1">
 {extra.unit_price.toFixed(2)}
 </p>
 </div>
 <button
 className="w-9 h-9 rounded-full bg-[var(--color-api-second)] hover:bg-[var(--color-api-second-hover)] text-white flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_4px_14px_-6px_color-mix(in_srgb,var(--color-api-second)_55%,transparent)]"
 onClick={(e) => {
 e.stopPropagation();
 handleAddExtra(extra);
 }}
 >
 <HiPlus className="w-5 h-5"/>
 </button>
 </div>
 ))}
 </div>
 )}
 </div>
 </BasePopup>

 {/* Add Product Modal */}
 <AddProductModal
 isOpen={showAddProductModal}
 onClose={() => setShowAddProductModal(false)}
 basket={basket}
 scheduleId={selectedScheduleId ?? basket.schedule!.id}
 addedExtras={addedExtras}
 itemQuantities={itemQuantities}
 updateMutation={updateMutation}
 />

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
