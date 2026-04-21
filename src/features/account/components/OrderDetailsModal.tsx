import { useEffect, useState } from"react";
import { useTranslation } from"react-i18next";
import i18n from"@/i18n/config";
import { useLanguage } from"@/context/LanguageContext";
import {
 HiX,
 HiClipboardList,
 HiLocationMarker,
 HiCreditCard,
 HiPhone,
 HiUser,
 HiSparkles,
} from"react-icons/hi";
import { cn } from"@/shared/lib/utils";
import { useOrderDetail } from"../hooks/useOrderDetail";
import RatingFormModal from"./RatingFormModal";
import type { OrderDetailItem, OrderDetailVariantAttribute } from"../types/order";

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
 const locale = i18n.language ==="ar"?"ar":"en-GB";
 return d.toLocaleDateString(locale, {
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

function normalizeVariantAttributes(
 item: OrderDetailItem
): OrderDetailVariantAttribute[] {
 const attrs = item.variant_attributes;
 if (!attrs) return [];

 if (Array.isArray(attrs)) {
 return attrs
 .map((attr) => ({
 attribute: attr.attribute ?? attr.type,
 value: attr.value,
 }))
 .filter((attr) => attr.attribute && attr.value);
 }

 return Object.entries(attrs)
 .filter(([, value]) => value != null && value !=="")
 .map(([attribute, value]) => ({ attribute, value }));
}

function getAreaLabel(
 area?: string | { en?: string; ar?: string } | null
): string | null {
 if (!area) return null;
 if (typeof area ==="string") return area;
 return area.en ?? area.ar ?? null;
}

function DetailRow({
 label,
 value,
 icon,
 isRTL,
}: {
 label: string;
 value: string;
 icon: React.ReactNode;
 isRTL: boolean;
}) {
 return (
 <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-3 border border-white/80">
 <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-50 text-cyan-700">
 {icon}
 </div>
 <div className="min-w-0 flex-1">
 <p className="text-xs font-medium uppercase tracking-wide text-custom-secondary/80">
 {label}
 </p>
 <p className={cn("mt-1 text-sm font-semibold text-custom-primary", isRTL ?"text-left":"text-right sm:text-left")}>
 {value}
 </p>
 </div>
 </div>
 );
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

 const deliveryAddressParts = order?.user_address
 ? [
 order.user_address.label,
 order.user_address.street_name,
 order.user_address.building_number,
 order.user_address.floor_apartment,
 order.user_address.nearest_landmark,
 getAreaLabel(order.user_address.area),
 ].filter(Boolean)
 : [];

 const cardClassName =
 "rounded-[24px] border border-[#D9EEF4] bg-gradient-to-br from-white via-white to-[#F5FCFE] p-4 shadow-[0_12px_30px_rgba(44,128,144,0.08)]";

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
 className="relative w-full max-w-lg lg:max-w-xl h-full overflow-hidden bg-[#F8FCFD] shadow-2xl flex flex-col transition-transform duration-300 ease-out"
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
 className="shrink-0 px-6 py-5 text-white overflow-hidden"
 style={{
 background:"linear-gradient(135deg, #4CDAF6 0%, #2C8090 100%)",
 }}
 >
 <div className="absolute inset-0 opacity-20 pointer-events-none">
 <div className="absolute -top-12 -end-10 h-40 w-40 rounded-full bg-white/30 blur-2xl"/>
 <div className="absolute bottom-0 start-10 h-24 w-24 rounded-full bg-white/20 blur-xl"/>
 </div>
 <div className="flex items-start justify-between gap-4">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 rounded-xl bg-custom-card/20 flex items-center justify-center">
 <HiClipboardList className="w-6 h-6"/>
 </div>
 <div>
 <h2 className="text-lg font-bold">
 {t("orders.order")} #{order?.order_code ?? orderId}
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
 <>
 <div className="mt-4 flex flex-wrap items-center gap-2">
 <span
 className={cn(
 "px-3 py-1 rounded-full text-xs font-semibold shadow-sm",
 getStatusColor(order.status)
 )}
 >
 {t(`orders.${order.status ==="out_delivery"?"out_for_delivery": order.status}`)}
 </span>
 <span className="px-3 py-1 rounded-full text-xs bg-white/15 border border-white/20">
 {getCartTypeLabel(order.cart_type)}
 </span>
 {order.is_instant_delivery ? (
 <span className="px-3 py-1 rounded-full text-xs bg-white/15 border border-white/20 inline-flex items-center gap-1">
 <HiSparkles className="h-3.5 w-3.5"/>
 {t("orders.instantDelivery","Instant delivery")}
 </span>
 ) : null}
 </div>
 <div className="mt-5 grid grid-cols-3 gap-3">
 <div className="rounded-2xl bg-white/15 border border-white/15 px-3 py-3 backdrop-blur-sm">
 <p className="text-[11px] uppercase tracking-wide text-white/70">
 {t("orders.orderItems","Order items")}
 </p>
 <p className="mt-1 text-lg font-bold">{order.items.length}</p>
 </div>
 <div className="rounded-2xl bg-white/15 border border-white/15 px-3 py-3 backdrop-blur-sm">
 <p className="text-[11px] uppercase tracking-wide text-white/70">
 {t("orders.delivery","Delivery")}
 </p>
 <p className="mt-1 text-lg font-bold">
 {order.delivery_price === 0 ? t("orders.free","Free") : formatPrice(order.delivery_price)}
 </p>
 </div>
 <div className="rounded-2xl bg-white/15 border border-white/15 px-3 py-3 backdrop-blur-sm">
 <p className="text-[11px] uppercase tracking-wide text-white/70">
 {t("orders.total")}
 </p>
 <p className="mt-1 text-lg font-bold">{formatPrice(order.total)}</p>
 </div>
 </div>
 </>
 )}
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto">
 {isLoading ? (
 <div className="flex items-center justify-center py-20">
 <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#2C8090] border-t-transparent"/>
 </div>
 ) : order ? (
 <div className="p-6 space-y-6 bg-[radial-gradient(circle_at_top,_rgba(76,218,246,0.08),_transparent_30%)]">
 {/* Items */}
 <div className={cardClassName}>
 <h3 className="text-base font-semibold text-custom-primary mb-3 flex items-center gap-2">
 <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
 <HiClipboardList className="h-5 w-5"/>
 </span>
 {t("orders.orderItems","Order items")} ({order.items.length})
 </h3>
 <div className="space-y-3">
 {order.items.map((item) => {
 const productId = item.product_id ?? item.id;
  const variantAttributes = normalizeVariantAttributes(item);
 return (
 <div
 key={item.id}
 className="flex items-start gap-3 rounded-2xl border border-[#E6F3F7] bg-white p-4 shadow-sm"
 >
 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-50 text-cyan-700 font-bold">
 {item.quantity}
 </div>
 <div className="flex-1 min-w-0">
 <p className="font-medium text-custom-primary">
 {item.product_name}
 </p>
 {variantAttributes.length > 0 && (
 <div className="flex flex-wrap gap-2 mt-1">
 {variantAttributes.map((attr, i) => (
 <span
 key={i}
 className="text-xs px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100"
 >
 {attr.attribute}: {attr.value}
 </span>
 ))}
 </div>
 )}
 <p className="text-sm text-custom-secondary mt-1">{t("orders.qty")}: {item.quantity}</p>
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
 <div className={cn("shrink-0 rounded-2xl bg-[#F7FBFC] px-3 py-2 text-right", isRTL &&"text-left")}>
 <p className="font-semibold text-custom-primary">
 {formatPrice((item.final_price_with_extras ?? item.price) * item.quantity)}
 </p>
 <p className="text-xs text-custom-secondary">
 {formatPrice(item.final_price_with_extras ?? item.price)} each
 </p>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Summary */}
 <div
 className="rounded-[24px] p-5 shadow-[0_12px_30px_rgba(250,204,21,0.14)]"
 style={{
 background:"linear-gradient(180deg, #FFFDEB 0%, #FFF7B8 32%, #FFFCE7 100%)",
 border:"1px solid #F4E7A6",
 }}
 >
 <h3 className="text-base font-semibold text-custom-primary mb-4 flex items-center gap-2">
 <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/70 text-amber-600">
 <HiSparkles className="h-5 w-5"/>
 </span>
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
 {Number(order.promotion_discount ?? 0) > 0 && (
 <div className="flex justify-between text-green-600">
 <span>{t("orders.promotionDiscount","Promotion")}</span>
 <span>-{formatPrice(Number(order.promotion_discount))}</span>
 </div>
 )}
 {Number(order.subscription_discount ?? 0) > 0 && (
 <div className="flex justify-between text-green-600">
 <span>{t("orders.subscriptionDiscount","Subscription discount")}</span>
 <span>-{formatPrice(Number(order.subscription_discount))}</span>
 </div>
 )}
 {Number(order.coupon_discount_from_points ?? 0) > 0 && (
 <div className="flex justify-between text-green-600">
 <span>{t("orders.pointsDiscount","Points discount")}</span>
 <span>-{formatPrice(Number(order.coupon_discount_from_points))}</span>
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
 <div className="flex justify-between pt-4 mt-4 border-t border-amber-200">
 <span className="font-semibold text-custom-primary">
 {t("orders.total")}
 </span>
 <span
 className="text-lg font-bold"
 style={{ color:"#16A34A"}}
 >
 {formatPrice(order.total)}
 </span>
 </div>
 </div>
 </div>

 {/* Delivery details */}
 {order.user_address && (
 <div className={cardClassName}>
 <h3 className="text-base font-semibold text-custom-primary mb-4 flex items-center gap-2">
 <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
 <HiLocationMarker className="h-5 w-5"/>
 </span>
 {t("orders.deliveryDetails","Delivery details")}
 </h3>
 <div className="space-y-3 text-sm">
 <DetailRow
 label={t("orders.recipient","Recipient")}
 value={order.user.name}
 icon={<HiUser className="h-5 w-5"/>}
 isRTL={isRTL}
 />
 {(order.user.phone ?? order.user_address.contact_phone) && (
 <DetailRow
 label={t("orders.phone","Phone")}
 value={String(order.user.phone ?? order.user_address.contact_phone)}
 icon={<HiPhone className="h-5 w-5"/>}
 isRTL={isRTL}
 />
 )}
 {deliveryAddressParts.length > 0 && (
 <DetailRow
 label={t("orders.address","Address")}
 value={deliveryAddressParts.join(", ")}
 icon={<HiLocationMarker className="h-5 w-5"/>}
 isRTL={isRTL}
 />
 )}
 </div>
 </div>
 )}

 {/* Payment method */}
 {order.payment_method && (
 <div className={cardClassName}>
 <h3 className="text-base font-semibold text-custom-primary mb-4 flex items-center gap-2">
 <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
 <HiCreditCard className="h-5 w-5"/>
 </span>
 {t("orders.paymentMethod","Payment method")}
 </h3>
 <DetailRow
 label={t("orders.method","Method")}
 value={order.payment_method.name}
 icon={<HiCreditCard className="h-5 w-5"/>}
 isRTL={isRTL}
 />
 </div>
 )}

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
