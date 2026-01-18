import { useTranslation } from "react-i18next";
import { HiCheck, HiTruck } from "react-icons/hi2";
import { BsBoxSeam } from "react-icons/bs";
import Button from "@/shared/ui/Button";

export default function OrderTrackingCard() {
  const { t } = useTranslation();

  return (
    <div className="bg-green-50 rounded-xl p-4 sm:p-6 shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 mb-1">
            {t("home.orderNumber")}
          </p>
          <p className="text-xs text-slate-600 break-words">
            {t("home.outForDelivery")}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 whitespace-nowrap shrink-0"
        >
          {t("home.trackOrder")}
        </Button>
      </div>

      {/* Progress Tracker */}
      <div className="relative w-full">
        <div className="flex items-start justify-between gap-2 sm:gap-4 md:gap-6 overflow-x-auto pb-2">
          {/* Pending Stage */}
          <div className="flex flex-col items-center shrink-0 flex-1 min-w-[80px] sm:min-w-[100px] md:min-w-[120px] lg:min-w-[130px] relative">
            <div className="flex flex-col items-center w-full">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 relative z-10"
                style={{
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
                }}
              >
                <HiCheck className="text-lg sm:text-xl text-white" />
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-900 mb-1 text-center">
                {t("home.pending")}
              </p>
              <p className="text-[9px] sm:text-xs text-slate-600 text-center px-1 leading-tight">
                {t("home.orderReceived")}
              </p>
            </div>
            {/* Connecting line to next */}
            <div
              className="hidden sm:block absolute top-5 sm:top-6 left-full w-full h-0.5 -translate-x-1/2 z-0"
              style={{
                backgroundColor: "#60a5fa",
                width: "calc(100% + 1rem)",
              }}
            />
          </div>

          {/* Preparing Stage */}
          <div className="flex flex-col items-center shrink-0 flex-1 min-w-[80px] sm:min-w-[100px] md:min-w-[120px] lg:min-w-[130px] relative">
            <div className="flex flex-col items-center w-full">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 relative z-10"
                style={{
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
                }}
              >
                <HiCheck className="text-lg sm:text-xl text-white" />
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-900 mb-1 text-center">
                {t("home.preparing")}
              </p>
              <p className="text-[9px] sm:text-xs text-slate-600 text-center px-1 leading-tight">
                {t("home.storePreparing")}
              </p>
            </div>
            {/* Connecting line to next */}
            <div
              className="hidden sm:block absolute top-5 sm:top-6 left-full w-full h-0.5 -translate-x-1/2 z-0"
              style={{
                backgroundColor: "#fbbf24",
                width: "calc(100% + 1rem)",
              }}
            />
          </div>

          {/* Out for Delivery Stage (Current) */}
          <div className="flex flex-col items-center shrink-0 flex-1 min-w-[80px] sm:min-w-[100px] md:min-w-[120px] lg:min-w-[130px] relative">
            <div className="flex flex-col items-center w-full">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 relative z-10 border-2"
                style={{
                  backgroundColor: "#fbbf24",
                  borderColor: "#ffffff",
                }}
              >
                <HiTruck className="text-lg sm:text-xl text-white" />
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-900 mb-1 text-center">
                {t("home.outForDeliveryTitle")}
              </p>
              <p className="text-[9px] sm:text-xs text-slate-600 text-center px-1 leading-tight">
                {t("home.driverOnWay")}
              </p>
            </div>
            {/* Connecting line to next */}
            <div
              className="hidden sm:block absolute top-5 sm:top-6 left-full w-full h-0.5 -translate-x-1/2 z-0"
              style={{
                backgroundColor: "#d1d5db",
                width: "calc(100% + 1rem)",
              }}
            />
          </div>

          {/* Delivered Stage (Future) */}
          <div className="flex flex-col items-center shrink-0 flex-1 min-w-[80px] sm:min-w-[100px] md:min-w-[120px] lg:min-w-[130px]">
            <div className="flex flex-col items-center w-full">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 relative z-10"
                style={{
                  backgroundColor: "#e5e7eb",
                }}
              >
                <div className="relative flex items-center justify-center">
                  <BsBoxSeam
                    className="text-sm sm:text-base"
                    style={{ color: "#6b7280" }}
                  />
                  <HiCheck
                    className="absolute -bottom-0.5 -right-0.5 text-[8px] sm:text-[10px] bg-white rounded-full p-0.5"
                    style={{ color: "#6b7280" }}
                  />
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 mb-1 text-center">
                {t("home.delivered")}
              </p>
              <p className="text-[9px] sm:text-xs text-slate-400 text-center px-1 leading-tight">
                {t("home.orderDelivered")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

