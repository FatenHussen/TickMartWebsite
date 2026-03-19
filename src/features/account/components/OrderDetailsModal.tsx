import { useEffect, useState } from"react";
import { useTranslation } from"react-i18next";
import { useLanguage } from"@/context/LanguageContext";
import { HiX, HiClipboardList } from"react-icons/hi";
import { cn } from"@/shared/lib/utils";
import { useOrderDetail } from"../hooks/useOrderDetail";
import RatingFormModal from"./RatingFormModal";

type OrderDetailsModalProps = {
 orderId: number | string | null;
 isOpen: boolean;
 onClose: () => void;
 onTrackOrder?: (orderId: number | string) => void;
 onAddComplaint?: (orderId: number | string) => void;
};

function formatPrice(value: number): string {
 return `£${value.toLocaleString()}`;
}

function formatDate(createdAt: string): string {
 try {
 const d = new Date(createdAt);
 return d.toLocaleDateString("en-GB", {
 day:"2-digit",
 month:"short",
 year:"numeric",
 hour:"2-digit",
 minute:"2-digit",
 });
 } catch {
 return createdAt;
 }
}

function getStatusColor(status: string): string {
 const map: Record<string, string> = {
 pending:"bg-amber-100 text-amber-800",
 preparing:"bg-yellow-100 text-yellow-800",
 out_delivery:"bg-sky-100 text-sky-800",
 out_for_delivery:"bg-sky-100 text-sky-800",
 delivered:"bg-green-100 text-green-800",
 cancelled:"bg-red-100 text-red-800",
 };
 return map[status] ??"bg-custom-tertiary text-custom-primary";
}

function getCartTypeLabel(cartType: string): string {
 if (cartType ==="admin_cart") return"Basket";
 if (cartType ==="recipe") return"Recipe";
 return"Products";
}

export default function OrderDetailsModal({
 orderId,
 isOpen,
 onClose,
 onTrackOrder,
 onAddComplaint,
}: OrderDetailsModalProps) {
 const { t } = useTranslation();
 const { isRTL } = useLanguage();
 const { data: order, isLoading } = useOrderDetail(orderId);
 const [isSlideReady, setIsSlideReady] = useState(false);
 const [rateModalOpen, setRateModalOpen] = useState(false);
 const [rateModalState, setRateModalState] = useState<{
 type:"product"|"delivery"|"order";
 productId?: number;
 orderId: number;
 } | null>(null);

 useEffect(() => {
 if (isOpen) {
 setIsSlideReady(false);
 const t = setTimeout(() => setIsSlideReady(true), 20);
 return () => clearTimeout(t);
 } else {
 setIsSlideReady(false);
 }
 }, [isOpen]);

 useEffect(() => {
 if (isOpen) {
 document.body.style.overflow ="hidden";
 } else {
 document.body.style.overflow ="unset";
 }
 return () => {
 document.body.style.overflow ="unset";
 };
 }, [isOpen]);

 useEffect(() => {
 const handleEscape = (e: KeyboardEvent) => {
 if (e.key ==="Escape") onClose();
 };
 if (isOpen) document.addEventListener("keydown", handleEscape);
 return () => document.removeEventListener("keydown", handleEscape);
 }, [isOpen, onClose]);

 if (!isOpen) return null;

 const isDelivered =
 order != null && String(order.status ??"").toLowerCase() ==="delivered";

 const canTrack =
 order && !isDelivered && String(order.status ??"").toLowerCase() !=="cancelled";

 return (
 <div
 className={cn(
"fixed inset-0 z-50 flex",
 isRTL ?"justify-start":"justify-end"
 )}
 >
 {/* Backdrop */}
 <div
 className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
 onClick={onClose}
 aria-hidden
 />

 {/* Drawer */}
 <div
 className="relative w-full max-w-lg lg:max-w-xl h-full bg-custom-card shadow-2xl flex flex-col transition-transform duration-300 ease-out"
 style={{
 transform: isSlideReady
 ?"translateX(0)"
 : isRTL
 ?"translateX(-100%)"
 :"translateX(100%)",
 }}
 dir={isRTL ?"rtl":"ltr"}
 >
 {/* Header */}
 <div
 className="shrink-0 px-6 py-5 text-white"
 style={{
 background:"linear-gradient(135deg, #4CDAF6 0%, #2C8090 100%)",
 }}
 >
 <div className="flex items-start justify-between gap-4">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 rounded-xl bg-custom-card/20 flex items-center justify-center">
 <HiClipboardList className="w-6 h-6"/>
 </div>
 <div>
 <h2 className="text-lg font-bold">
 {t("orders.order")} #{orderId}
 </h2>
 {order && (
 <p className="text-sm text-white/90 mt-0.5">
 {formatDate(order.created_at)}
 </p>
 )}
 </div>
 </div>
 <button
 type="button"
 onClick={onClose}
 className="p-2 rounded-lg hover:bg-custom-card/20 transition-colors"
 aria-label={t("common.close")}
 >
 <HiX className="w-6 h-6"/>
 </button>
 </div>
 {order && (
 <div className="mt-4 flex flex-wrap items-center gap-2">
 <span
 className={cn(
"px-3 py-1 rounded-full text-xs font-medium",
 getStatusColor(order.status)
 )}
 >
 {t(`orders.${order.status ==="out_delivery"?"out_for_delivery": order.status}`)}
 </span>
 <span className="px-3 py-1 rounded-full text-xs bg-custom-card/20">
 {getCartTypeLabel(order.cart_type)}
 </span>
 {order.is_instant_delivery ? (
 <span className="px-3 py-1 rounded-full text-xs bg-custom-card/20">
 {t("orders.instantDelivery","Instant delivery")}
 </span>
 ) : null}
 </div>
 )}
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto">
 {isLoading ? (
 <div className="flex items-center justify-center py-20">
 <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#2C8090] border-t-transparent"/>
 </div>
 ) : order ? (
 <div className="p-6 space-y-6">
 {/* Items */}
 <div>
 <h3 className="text-base font-semibold text-custom-primary mb-3">
 {t("orders.orderItems","Order items")} ({order.total_quantity})
 </h3>
 <div className="rounded-xl border border-custom-primary overflow-hidden">
 {order.items.map((item) => {
 const productId = item.product_id ?? item.id;
 return (
 <div
 key={item.id}
 className="flex items-start gap-3 p-4 border-b border-custom-primary last:border-b-0"
 >
 <div className="flex-1 min-w-0">
 <p className="font-medium text-custom-primary">
 {item.product_name}
 </p>
 {item.variant_attributes?.length > 0 && (
 <div className="flex flex-wrap gap-2 mt-1">
 {item.variant_attributes.map((attr, i) => (
 <span
 key={i}
 className="text-xs px-2 py-0.5 rounded bg-custom-tertiary text-custom-secondary"
 >
 {attr.attribute}: {attr.value}
 </span>
 ))}
 </div>
 )}
 <p className="text-sm text-custom-secondary mt-1">
 {t("orders.qty")}: {item.quantity}
 </p>
 {isDelivered && (
 <button
 type="button"
 onClick={() => {
 setRateModalState({
 type:"product",
 productId,
 orderId: order.id,
 });
 setRateModalOpen(true);
 }}
 className="mt-2 text-sm text-cyan-600 hover:text-cyan-700 font-medium"
 >
 {t("account.myReviews.rateProduct","قيم هذا المنتج")}
 </button>
 )}
 </div>
 <div className={cn("shrink-0 text-right", isRTL &&"text-left")}>
 <p className="font-semibold text-custom-primary">
 {formatPrice(item.price * item.quantity)}
 </p>
 <p className="text-xs text-custom-secondary">
 {formatPrice(item.price)} each
 </p>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Summary */}
 <div
 className="rounded-xl p-4"
 style={{
 background:"linear-gradient(180deg, #FBFBE4 0%, #FFFAB6 30%)",
 border:"1px solid #E5E7EB",
 }}
 >
 <h3 className="text-base font-semibold text-custom-primary mb-3">
 {t("orders.summary","Summary")}
 </h3>
 <div className="space-y-2 text-sm">
 <div className="flex justify-between">
 <span className="text-custom-secondary">{t("orders.subtotal","Subtotal")}</span>
 <span className="font-medium">{formatPrice(order.subtotal)}</span>
 </div>
 {order.basket_discount > 0 && (
 <div className="flex justify-between text-green-600">
 <span>{t("orders.basketDiscount","Basket discount")}</span>
 <span>-{formatPrice(order.basket_discount)}</span>
 </div>
 )}
 {order.coupon_discount != null && order.coupon_discount > 0 && (
 <div className="flex justify-between text-green-600">
 <span>{t("orders.couponDiscount","Coupon")}</span>
 <span>-{formatPrice(order.coupon_discount)}</span>
 </div>
 )}
 <div className="flex justify-between">
 <span className="text-custom-secondary">
 {t("orders.delivery","Delivery")}
 </span>
 <span className="font-medium">
 {order.delivery_price === 0
 ? t("orders.free","Free")
 : formatPrice(order.delivery_price)}
 </span>
 </div>
 <div className="flex justify-between pt-3 mt-3 border-t border-custom-secondary">
 <span className="font-semibold text-custom-primary">
 {t("orders.total")}
 </span>
 <span
 className="text-lg font-bold"
 style={{ color:"#16A34A"}}
 >
 {formatPrice(order.total + (order.delivery_price || 0))}
 </span>
 </div>
 </div>
 </div>

 {/* Rate delivery & order + Add complaint (delivered only) */}
 {isDelivered && (
 <div className="flex flex-col gap-2">
 <button
 type="button"
 onClick={() => {
 setRateModalState({
 type:"delivery",
 orderId: order.id,
 });
 setRateModalOpen(true);
 }}
 className="w-full py-2.5 rounded-xl font-medium border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 text-sm"
 >
 {t("orders.rateDelivery","قيم التوصيل")}
 </button>
 <button
 type="button"
 onClick={() => {
 setRateModalState({
 type:"order",
 orderId: order.id,
 });
 setRateModalOpen(true);
 }}
 className="w-full py-2.5 rounded-xl font-medium border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 text-sm"
 >
 {t("orders.rateOrder","قيم تجربة الطلب")}
 </button>
 {onAddComplaint && (
 <button
 type="button"
 onClick={() => onAddComplaint(order.id)}
 className="w-full py-2.5 rounded-xl font-medium border-2 border-amber-500 text-amber-600 hover:bg-amber-50 text-sm"
 >
 {t("orders.addComplaint","تقديم شكوى")}
 </button>
 )}
 </div>
 )}

 {/* Actions */}
 <div className="flex flex-col gap-2">
 {canTrack && onTrackOrder && (
 <button
 type="button"
 onClick={() => onTrackOrder(order.id)}
 className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
 style={{
 background:"linear-gradient(135deg, #4CDAF6 0%, #2C8090 100%)",
 }}
 >
 {t("orders.trackOrder")}
 </button>
 )}
 <button
 type="button"
 onClick={onClose}
 className="w-full py-3 rounded-xl font-medium border-2 border-custom-primary text-custom-primary hover:bg-custom-light"
 >
 {t("common.close")}
 </button>
 </div>
 </div>
 ) : (
 <div className="py-20 text-center text-custom-secondary">
 {t("orders.noOrderFound","Order not found")}
 </div>
 )}
 </div>
 </div>

 {rateModalState && (
 <RatingFormModal
 isOpen={rateModalOpen}
 onClose={() => {
 setRateModalOpen(false);
 setRateModalState(null);
 }}
 onSuccess={() => {
 setRateModalOpen(false);
 setRateModalState(null);
 }}
 mode="create"
 rateableType={rateModalState.type}
 rateableId={
 rateModalState.type ==="product"&& rateModalState.productId != null
 ? rateModalState.productId
 : rateModalState.orderId
 }
 orderId={rateModalState.orderId}
 />
 )}
 </div>
 );
}
