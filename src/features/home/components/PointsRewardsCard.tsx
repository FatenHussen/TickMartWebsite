import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { HiGift, HiPercentBadge } from "react-icons/hi2";
import { FaCoins } from "react-icons/fa6";
import { paths } from "@/app/routes/path/paths";

interface PointsRewardsCardProps {
  points: number;
  rewardsCount: number;
  subscriptionName: string | null;
}

export default function PointsRewardsCard({
  points,
  rewardsCount,
  subscriptionName,
}: PointsRewardsCardProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div
      className="rounded-xl p-4 sm:p-6 shadow-sm"
      dir={isRTL ? "rtl" : "ltr"}
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
                {points.toLocaleString()}
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
                {rewardsCount} {t("home.available")}
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
                {subscriptionName ?? "—"}
              </p>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <Link
          to={paths.account.pointsRewards}
          className="inline-flex items-center justify-center gap-2 font-semibold rounded-lg px-5 py-2 text-sm w-full sm:w-auto whitespace-nowrap shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "white",
          }}
        >
          {t("home.viewDetails")}
        </Link>
      </div>
    </div>
  );
}

