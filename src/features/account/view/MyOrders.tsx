import { useEffect, useMemo, useState } from"react";
import { useNavigate } from"react-router-dom";
import { useTranslation } from"react-i18next";
import i18n from"@/i18n/config";
import { useLanguage } from"@/context/LanguageContext";
import { useCurrency } from"@/context/CurrencyContext";
import { Search } from "lucide-react";
import { cn } from"@/shared/lib/utils";
import { useMutation, useQueryClient } from"@tanstack/react-query";
import { toast } from"sonner";
import OrderCard from"@/features/cart/components/OrderCard";
import OrderDetailsModal from"../components/OrderDetailsModal";
import ComplaintFormModal from"../components/ComplaintFormModal";
import CancelOrderModal from"../components/CancelOrderModal";
import { useOrdersInfinite } from"../hooks/useOrders";
import { useInfiniteScroll } from"@/shared/hooks/useInfiniteScroll";
import { _OrderApi } from"@/features/cart/api/orderApi";
import { queryKeys } from"@/utils/queryKeys";
import { paths } from"@/app/routes/path/paths";
import type { OrderStatus } from"@/features/cart/types";
import type { Order } from"@/features/cart/types";
import type { OrderListItem } from"../types/order";

function formatOrderDate(createdAt: string): string {
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

function toOrderStatus(apiStatus: string): OrderStatus {
 if (apiStatus ==="out_delivery") return"out_for_delivery";
 if (
 [
"pending",
"preparing",
"out_for_delivery",
"delivered",
"cancelled",
 ].includes(apiStatus)
 ) {
 return apiStatus as OrderStatus;
 }
 return"pending";
}

function mapOrderToCard(item: OrderListItem, formatPrice: (n: number) => string): Order {
 const status = toOrderStatus(item.status);
 const cartTypeLabel =
 item.cart_type ==="admin_cart"
 ? i18n.t("orders.cartType.basket")
 : item.cart_type ==="recipe"
 ? i18n.t("orders.cartType.recipe")
 : i18n.t("orders.cartType.products");

 const itemCountLabel =
 item.total_quantity === 1
 ? i18n.t("orders.itemCountOne", { count: item.total_quantity })
 : i18n.t("orders.itemCountOther", { count: item.total_quantity });

 return {
 id: item.id,
 orderNumber: item.order_code ?? String(item.id),
 dateTime: formatOrderDate(item.created_at),
 status,
 items: [
 {
 name: itemCountLabel,
 category:"",
 store: cartTypeLabel,
 quantity: item.total_quantity,
 price: formatPrice(item.total),
 },
 ],
 additionalInfo: undefined,
 deliveryAddress: undefined,
 total: formatPrice(item.total_with_delivery),
 paymentMethod:"—",
 actions: {
 viewDetails: true,
 trackOrder: status !=="delivered"&& status !=="cancelled",
 reorder: status ==="delivered"|| status ==="cancelled",
 addComplaint: status ==="delivered",
 },
 };
}

export default function MyOrders() {
 const { t } = useTranslation();
 const { isRTL } = useLanguage();
 const { formatPrice } = useCurrency();
 const navigate = useNavigate();
 const [searchQuery, setSearchQuery] = useState("");
 const [activeFilter, setActiveFilter] = useState<OrderStatus |"all">("all");
 const [sortBy, setSortBy] = useState("newest");
 const [selectedOrderId, setSelectedOrderId] = useState<
 number | string | null
 >(null);
 const [complaintModalOpen, setComplaintModalOpen] = useState(false);
 const [complaintOrderId, setComplaintOrderId] = useState<number | string | null>(null);
 const [cancelOrder, setCancelOrder] = useState<Order | null>(null);

 const {
 data: ordersData,
 isLoading,
 isFetchingNextPage,
 hasNextPage,
 fetchNextPage,
 } = useOrdersInfinite(activeFilter);

 const observerTarget = useInfiniteScroll({
 onLoadMore: fetchNextPage,
 hasMore: hasNextPage,
 isLoading: isFetchingNextPage,
 threshold: 300,
 });

 // Fallback: trigger load more on window scroll near bottom (e.g. when scroll is in main document)
 useEffect(() => {
 if (!hasNextPage || isFetchingNextPage) return;
 const threshold = 400;
 const handleScroll = () => {
 const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
 const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
 if (distanceFromBottom < threshold) fetchNextPage();
 };
 window.addEventListener("scroll", handleScroll, { passive: true });
 return () => window.removeEventListener("scroll", handleScroll);
 }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

 const filteredOrders = useMemo(() => {
 // Status is now filtered server-side via useOrdersInfinite(activeFilter)
 let orders = ordersData.map((item) => mapOrderToCard(item, formatPrice));

 if (searchQuery.trim()) {
 const q = searchQuery.toLowerCase();
 orders = orders.filter(
 (o) =>
 o.orderNumber.toLowerCase().includes(q) ||
 o.items.some(
 (i) =>
 i.name.toLowerCase().includes(q) ||
 i.store.toLowerCase().includes(q),
 ),
 );
 }

 if (sortBy ==="newest") {
 orders = [...orders].sort((a, b) => {
 return Number(b.id) > Number(a.id) ? 1 : -1;
 });
 } else if (sortBy ==="oldest") {
 orders = [...orders].sort((a, b) => {
 return Number(a.id) > Number(b.id) ? 1 : -1;
 });
 } else if (sortBy ==="amount_high") {
 orders = [...orders].sort((a, b) => {
 const numA = parseFloat(a.total.replace(/[^0-9.]/g,"")) || 0;
 const numB = parseFloat(b.total.replace(/[^0-9.]/g,"")) || 0;
 return numB - numA;
 });
 } else if (sortBy ==="amount_low") {
 orders = [...orders].sort((a, b) => {
 const numA = parseFloat(a.total.replace(/[^0-9.]/g,"")) || 0;
 const numB = parseFloat(b.total.replace(/[^0-9.]/g,"")) || 0;
 return numA - numB;
 });
 }

 return orders;
 }, [ordersData, activeFilter, searchQuery, sortBy, formatPrice]);

 const handleViewDetails = (orderId: number | string) => {
 setSelectedOrderId(orderId);
 };

 const handleCardClick = (orderId: number | string, e: React.MouseEvent) => {
 if ((e.target as HTMLElement).closest("button")) return;
 setSelectedOrderId(orderId);
 };

 const handleTrackOrder = (orderId: number | string) => {
 navigate(paths.client.trackOrder.replace(":orderId", String(orderId)));
 };

 const queryClient = useQueryClient();

 const cancelMutation = useMutation({
 mutationFn: (orderId: number | string) => _OrderApi.cancelOrder(orderId),
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() });
 toast.success(t("orders.cancelSuccess","Order cancelled successfully"));
 setCancelOrder(null);
 },
 onError: () => {
 toast.error(t("orders.cancelFailed","Failed to cancel order"));
 },
 });

 const reorderMutation = useMutation({
 mutationFn: (orderId: number | string) => _OrderApi.reorder(orderId),
 onSuccess: ({ id }) => {
 queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() });
 toast.success(t("orders.reorderSuccess","Order placed successfully"));
 navigate(paths.client.trackOrder.replace(":orderId", String(id)));
 },
 onError: () => {
 toast.error(t("orders.reorderFailed","Failed to reorder"));
 },
 });

 const handleReorder = (orderId: number | string) => {
 reorderMutation.mutate(orderId);
 };

 const handleAddComplaint = (orderId: number | string) => {
 setComplaintOrderId(orderId);
 setComplaintModalOpen(true);
 };

 const handleCancelOrder = (order: Order) => {
 setCancelOrder(order);
 };

 const handleCancelOrderConfirm = () => {
 if (!cancelOrder) return;
 cancelMutation.mutate(cancelOrder.id);
 };

 const filterButtons: { value: OrderStatus |"all"; label: string }[] = [
 { value:"all", label: t("orders.all") },
 { value:"pending", label: t("orders.pending") },
 { value:"preparing", label: t("orders.preparing") },
 { value:"out_for_delivery", label: t("orders.out_for_delivery") },
 { value:"delivered", label: t("orders.delivered") },
 { value:"cancelled", label: t("orders.cancelled") },
 ];

 const sortOptions = [
 { value:"newest", label: t("orders.newest") },
 { value:"oldest", label: t("orders.oldest") },
 { value:"amount_high", label: t("orders.amountHighToLow") },
 { value:"amount_low", label: t("orders.amountLowToHigh") },
 ];

 return (
 <div className="space-y-6"dir={isRTL ?"rtl":"ltr"}>
 <div className="mb-8">
 <h1 className="text-2xl font-bold text-text-primary mb-2">
 {t("orders.myOrders")}
 </h1>
 <p className="text-text-secondary text-sm">
 {t("orders.myOrdersDescription")}
 </p>
 </div>

 <div className="flex flex-col lg:flex-row gap-4 mb-6">
 <div className="flex-1">
 <div className="relative">
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary"/>
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder={t("orders.searchPlaceholder")}
 className="w-full pl-10 pr-4 py-3 rounded-xl border border-custom-primary bg-custom-card text-custom-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
 />
 </div>
 </div>
 <div className="lg:w-auto">
 <select
 value={sortBy}
 onChange={(e) => setSortBy(e.target.value)}
 className="px-4 py-3 rounded-xl border border-custom-primary bg-custom-card text-custom-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
 >
 {sortOptions.map((option) => (
 <option key={option.value} value={option.value}>
 {t("orders.sortBy")}: {option.label}
 </option>
 ))}
 </select>
 </div>
 </div>

 <div className="flex flex-wrap gap-2 mb-6">
 {filterButtons.map((filter) => (
 <button
 key={filter.value}
 onClick={() => setActiveFilter(filter.value)}
 className={cn(
"px-4 py-2 rounded-lg text-sm font-medium transition-all",
 activeFilter === filter.value
 ?"bg-primary text-white"
 :"bg-custom-card text-text-secondary border border-custom-primary hover:border-primary",
 )}
 >
 {filter.label}
 </button>
 ))}
 </div>

 {isLoading ? (
 <div className="py-14 text-center text-text-secondary">
 {t("common.loading")}
 </div>
 ) : filteredOrders.length === 0 ? (
 <div className="py-14 text-center text-text-secondary">
 {t("orders.noOrdersFound")}
 </div>
 ) : (
 <>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                role="button"
                tabIndex={0}
                onClick={(e) => handleCardClick(order.id, e)}
                onKeyDown={(e) =>
                  e.key ==="Enter"&&
                  handleCardClick(order.id, e as unknown as React.MouseEvent)
                }
                className="group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] rounded-3xl"
              >
 <OrderCard
 key={order.id}
 orderNumber={order.orderNumber}
 status={order.status}
 dateTime={order.dateTime}
 items={order.items}
 additionalInfo={order.additionalInfo}
 deliveryAddress={order.deliveryAddress}
 total={order.total}
 paymentMethod={order.paymentMethod}
 refundStatus={order.refundStatus}
 onViewDetails={() => handleViewDetails(order.id)}
 onTrackOrder={
 order.actions.trackOrder
 ? () => handleTrackOrder(order.id)
 : undefined
 }
 onReorder={
 order.actions.reorder
 ? () => handleReorder(order.id)
 : undefined
 }
 onAddComplaint={
 order.actions.addComplaint
 ? () => handleAddComplaint(order.id)
 : undefined
 }
 onCancelOrder={
 order.status ==="pending"|| order.status ==="preparing"
 ? () => handleCancelOrder(order)
 : undefined
 }
 />
 </div>
 ))}
 </div>

 <div ref={observerTarget} className="h-4"aria-hidden />
 {isFetchingNextPage && (
 <div className="py-4 text-center text-text-secondary text-sm">
 {t("common.loading")}
 </div>
 )}
 </>
 )}

 <OrderDetailsModal
 orderId={selectedOrderId}
 isOpen={selectedOrderId != null}
 onClose={() => setSelectedOrderId(null)}
 onTrackOrder={(id) => {
 setSelectedOrderId(null);
 navigate(paths.client.trackOrder.replace(":orderId", String(id)));
 }}
 onAddComplaint={(id) => {
 setSelectedOrderId(null);
 setComplaintOrderId(id);
 setComplaintModalOpen(true);
 }}
 />

 <ComplaintFormModal
 isOpen={complaintModalOpen}
 onClose={() => {
 setComplaintModalOpen(false);
 setComplaintOrderId(null);
 }}
 onSuccess={() => {
 setComplaintModalOpen(false);
 setComplaintOrderId(null);
 }}
 prefillOrderId={complaintOrderId}
 />

 {cancelOrder && (
 <CancelOrderModal
 isOpen={!!cancelOrder}
 onClose={() => !cancelMutation.isPending && setCancelOrder(null)}
 onConfirm={handleCancelOrderConfirm}
 orderId={cancelOrder.orderNumber}
 status={cancelOrder.status}
 total={cancelOrder.total}
 paymentMethod={cancelOrder.paymentMethod}
 storeLabel={cancelOrder.items[0]?.store}
 isLoading={cancelMutation.isPending}
 />
 )}
 </div>
 );
}
