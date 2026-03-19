import { useTranslation } from"react-i18next";
import { useLanguage } from"@/context/LanguageContext";
import { HiLocationMarker } from"react-icons/hi";
import SideContentLayout from"@/layout/SideContentLayout";
import OrderStatusTimeline from"../components/OrderStatusTimeline";
import OrderItemsTable from"../components/OrderItemsTable";
import OrderSidebar from"../components/OrderSidebar";
import { useOrderDetails } from"../hooks/useOrderDetails";

const STATUS_LABELS: Record<string, string> = {
 pending:"Order received",
 preparing:"Preparing",
 out_for_delivery:"Out for Delivery",
 delivered:"Delivered",
};

export default function OrderDetails() {
 const { t } = useTranslation();
 const { isRTL } = useLanguage();
 const { order, isLoading, error, trackOnMap } = useOrderDetails();

 const handleMoveToWishlist = (itemId: number | string) => {
 console.log("Move to wishlist:", itemId);
 };

 if (isLoading || (!order && !error)) {
 return (
 <div className="page-container py-6">
 <div className="animate-pulse space-y-4">
 <div className="h-10 w-48 bg-custom-muted rounded"/>
 <div className="h-64 bg-custom-muted rounded-2xl"/>
 </div>
 </div>
 );
 }

 if (error || !order) {
 return (
 <div className="page-container py-6">
 <div className="text-center py-12">
 <p className="text-custom-secondary">
 {t("orders.orderNotFound","Order not found.")}
 </p>
 </div>
 </div>
 );
 }

 const statusLabel = STATUS_LABELS[order.status] ?? order.status;
 const canTrack =
 order.status !=="delivered"&&
 (order.status as string) !=="cancelled";

 console.log(order);
 

 return (
 <div className="bg-custom-primary">
 <div className="page-container py-6"dir={isRTL ?"rtl":"ltr"}>
 {/* Header: Order #, Status, ETA, Track Order button */}
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
 <div>
 {order.orderNumber ? (
 <h1 className="text-2xl sm:text-3xl font-bold text-custom-primary mb-1">
 Order #{order.orderNumber}
 </h1>
 ) : null}
 <div className="flex items-center gap-2 flex-wrap">
 <span
 className="w-2 h-2 rounded-full shrink-0"
 style={{
 backgroundColor:
 order.status ==="out_for_delivery"
 ?"#FFD700"
 : order.status ==="delivered"
 ?"#22C55E"
 : order.status ==="preparing"
 ?"#F59E0B"
 :"#94A3B8",
 }}
 />
 <span className="text-sm font-medium text-custom-primary">
 {statusLabel}
 </span>
 <span className="text-sm text-custom-secondary">
 ETA: {order.delivery.eta}
 </span>
 </div>
 </div>
 {canTrack && (
 <button
 type="button"
 onClick={trackOnMap}
 className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm whitespace-nowrap shrink-0"
 style={{
 background:"linear-gradient(90deg, #4CDAF6 0%, #2C8090 100%)",
 border:"1px solid rgba(255,255,255,0.3)",
 }}
 >
 <HiLocationMarker className="w-5 h-5"/>
 {t("orders.trackOrderOnMap","Track Order on Map")}
 </button>
 )}
 </div>

 <SideContentLayout
 sidebar={
 <OrderSidebar
 priceSummary={order.priceSummary}
 delivery={order.delivery}
 payment={order.payment}
 />
 }
 sidebarPosition="right"
 gapClassName="gap-6"
 columnTemplate="1fr 362px"
 >
 <div className="space-y-6">
 <OrderStatusTimeline currentStatus={order.status} />
 <OrderItemsTable
 items={order.items}
 onMoveToWishlist={handleMoveToWishlist}
 />
 </div>
 </SideContentLayout>
 </div>
 </div>
 );
}
