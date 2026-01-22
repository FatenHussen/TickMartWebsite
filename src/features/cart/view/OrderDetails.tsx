import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import SideContentLayout from "@/layout/SideContentLayout";
import OrderStatusTimeline from "../components/OrderStatusTimeline";
import OrderItemsTable from "../components/OrderItemsTable";
import OrderSidebar from "../components/OrderSidebar";
import { mockOrderDetails } from "../data/mockData";
import type { OrderDetails as OrderDetailsType } from "../types";

export default function OrderDetails() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const order: OrderDetailsType = mockOrderDetails;

  const handleMoveToWishlist = (itemId: number | string) => {
    console.log("Move to wishlist:", itemId);
  };

  const handleTrackOnMap = () => {
    console.log("Track order on map");
  };

  return (
    <div className="bg-custom-primary">
      <div className="page-container py-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-custom-primary mb-2">
            {t("orders.orderDetails")}
          </h1>
        </div>

        <SideContentLayout
          sidebar={
            <OrderSidebar
              priceSummary={order.priceSummary}
              delivery={order.delivery}
              payment={order.payment}
              onTrackOnMap={handleTrackOnMap}
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
