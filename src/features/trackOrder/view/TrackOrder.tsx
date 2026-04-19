import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import SideContentLayout from "@/layout/SideContentLayout";
import TrackOrderMap from "../components/TrackOrderMap";
import TrackOrderSidebar from "../components/TrackOrderSidebar";
import { useTrackOrder } from "../hooks/useTrackOrder";
import { getSocket, joinOrderRoom, useOrderLocation } from "@/lib/socket";

export default function TrackOrder() {
    const { orderId } = useParams<{ orderId: string }>();
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const { data: orderData, isLoading, error } = useTrackOrder(orderId ?? null);

    const normalizedTrackStatus = orderData?.status
        ? String(orderData.status).toLowerCase().replace(/-/g, "_")
        : "";
    const showMap =
        normalizedTrackStatus === "out_for_delivery" ||
        normalizedTrackStatus === "out_delivery";

    const liveLocation = useOrderLocation(
        showMap && orderId ? orderId : null
    );

    useEffect(() => {
        if (!orderId || !orderData || !showMap) return;
        getSocket().then(() => {
            joinOrderRoom(Number(orderId));
        });
    }, [orderId, orderData, showMap]);

    const handleCallDriver = () => {
        if (orderData?.driver?.phoneNumber) {
            window.location.href = `tel:${orderData.driver.phoneNumber}`;
        }
    };

    const handleNeedHelp = () => {
        console.log("Need help with order", orderId);
    };

    if (isLoading) {
        return (
            <div className="bg-custom-primary">
                <div className="page-container py-6" dir={isRTL ? "rtl" : "ltr"}>
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-custom-accent border-t-transparent" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !orderData) {
        return (
            <div className="bg-custom-primary">
                <div className="page-container py-6" dir={isRTL ? "rtl" : "ltr"}>
                    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                        <p className="text-custom-secondary text-base">
                            {t("trackOrder.errorLoading", "Failed to load order details.")}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-custom-primary">
            <div className="page-container py-6" dir={isRTL ? "rtl" : "ltr"}>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-custom-primary mb-2">
                        {t("trackOrder.title")}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-custom-secondary">
                        <span>
                            {t("orders.order")} #{orderData.orderNumber}
                        </span>
                        <span>•</span>
                        <span>
                            {t("orders.status")}:{""}
                            <span className="font-medium" style={{ color: "#f97316" }}>
                                {t(`orders.${orderData.status}`)}
                            </span>
                        </span>
                        {orderData.eta && (
                            <>
                                <span>•</span>
                                <span>
                                    {t("trackOrder.eta")}: {orderData.eta}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {showMap ? (
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
                        <TrackOrderMap order={orderData} liveLocation={liveLocation} />
                    </SideContentLayout>
                ) : (
                    <div className="max-w-lg mx-auto w-full">
                        <TrackOrderSidebar
                            order={orderData}
                            onCallDriver={handleCallDriver}
                            onNeedHelp={handleNeedHelp}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
