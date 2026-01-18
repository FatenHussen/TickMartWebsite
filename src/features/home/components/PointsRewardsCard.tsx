import { useTranslation } from "react-i18next";
import { HiGift, HiPercentBadge } from "react-icons/hi2";
import { FaCoins } from "react-icons/fa6";
import Button from "@/shared/ui/Button";

export default function PointsRewardsCard() {
  const { t } = useTranslation();

  return (
    <div
      className="rounded-xl p-4 sm:p-6 shadow-sm"
      style={{
        backgroundColor: "#fef9e7", // Light yellow background like image
      }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 lg:gap-8 w-full sm:w-auto">
          {/* Your Points */}
          <div className="flex items-center gap-3 flex-1 sm:flex-initial min-w-0 sm:min-w-[180px] lg:min-w-[220px]">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "#fde047", // Bright yellow like image
              }}
            >
              <FaCoins className="text-xl sm:text-2xl text-slate-900" />
            </div>
            <div className="min-w-0">
              <p className="text-xs mb-1" style={{ color: "#6b7280" }}>
                {t("home.yourPoints")}
              </p>
              <p className="text-base sm:text-lg font-bold" style={{ color: "#1a1a1a" }}>
                2,450
              </p>
            </div>
          </div>

          {/* Rewards */}
          <div className="flex items-center gap-3 flex-1 sm:flex-initial min-w-0 sm:min-w-[180px] lg:min-w-[220px]">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "#bbf7d0", // Light green like image
              }}
            >
              <HiGift className="text-xl sm:text-2xl" style={{ color: "#16a34a" }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs mb-1" style={{ color: "#6b7280" }}>
                {t("home.rewards")}
              </p>
              <p className="text-base sm:text-lg font-bold" style={{ color: "#1a1a1a" }}>
                5 {t("home.available")}
              </p>
            </div>
          </div>

          {/* Active Subscription */}
          <div className="flex items-center gap-3 flex-1 sm:flex-initial min-w-0 sm:min-w-[180px] lg:min-w-[220px]">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "#fce7f3", // Light pink like image
              }}
            >
              <HiPercentBadge
                className="text-xl sm:text-2xl"
                style={{ color: "#dc2626" }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs mb-1" style={{ color: "#6b7280" }}>
                {t("home.activeSubscription")}
              </p>
              <p className="text-base sm:text-lg font-bold truncate" style={{ color: "#1a1a1a" }}>
                Premium plus
              </p>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <Button
          variant="primary"
          size="sm"
          className="w-full sm:w-auto whitespace-nowrap shrink-0"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "white",
          }}
        >
          {t("home.viewDetails")}
        </Button>
      </div>
    </div>
  );
}

