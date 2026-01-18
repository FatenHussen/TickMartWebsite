import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import SideContentLayout from "@/layout/SideContentLayout";
import TrackOrderMap from "../components/TrackOrderMap";
import TrackOrderSidebar from "../components/TrackOrderSidebar";
import { mockTrackOrderData } from "../data/mockData";

export default function TrackOrder() {
  const { orderId } = useParams<{ orderId: string }>();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  // TODO: Fetch order data based on orderId
  // For now, using mock data
  const orderData = mockTrackOrderData;

  const handleCallDriver = () => {
    // TODO: Implement call driver functionality
    window.location.href = `tel:${orderData.driver.phoneNumber}`;
  };

  const handleNeedHelp = () => {
    // TODO: Navigate to help/support page
    console.log("Need help with order", orderId);
  };

  return (
    <div className="bg-custom-primary">
      <div className="page-container py-6" dir={isRTL ? "rtl" : "ltr"}>
        <SideContentLayout
          sidebar={
            <TrackOrderSidebar
              order={orderData}
              onCallDriver={handleCallDriver}
              onNeedHelp={handleNeedHelp}
            />
          }
          sidebarPosition="right"
          gapClassName="gap-6"
          columnTemplate="1fr 400px"
        >
          <TrackOrderMap order={orderData} />
        </SideContentLayout>
      </div>
    </div>
  );
}
