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
      className="rounded-xl border border-custom-primary bg-amber-50/90 p-4 shadow-sm dark:bg-slate-800/80 dark:ring-1 dark:ring-white/10 sm:p-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 lg:gap-8 w-full sm:w-auto">
          {/* Your Points */}
          <div className="flex items-center gap-3 flex-1 sm:flex-initial min-w-0 sm:min-w-[180px] lg:min-w-[220px]">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-300 sm:h-14 sm:w-14 dark:bg-yellow-500/35">
              <FaCoins className="text-xl text-yellow-900 sm:text-2xl dark:text-yellow-100" />
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-xs text-custom-secondary">{t("home.yourPoints")}</p>
              <p className="text-base font-bold text-custom-primary sm:text-lg">
                {points.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Rewards */}
          <div className="flex items-center gap-3 flex-1 sm:flex-initial min-w-0 sm:min-w-[180px] lg:min-w-[220px]">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-200 sm:h-14 sm:w-14 dark:bg-emerald-900/50">
              <HiGift className="text-xl text-green-700 sm:text-2xl dark:text-emerald-300" />
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-xs text-custom-secondary">{t("home.rewards")}</p>
              <p className="text-base font-bold text-custom-primary sm:text-lg">
                {rewardsCount} {t("home.available")}
              </p>
            </div>
          </div>

          {/* Active Subscription */}
          <div className="flex items-center gap-3 flex-1 sm:flex-initial min-w-0 sm:min-w-[180px] lg:min-w-[220px]">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-100 sm:h-14 sm:w-14 dark:bg-rose-900/45">
              <HiPercentBadge className="text-xl text-rose-600 sm:text-2xl dark:text-rose-300" />
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-xs text-custom-secondary">{t("home.activeSubscription")}</p>
              <p className="truncate text-base font-bold text-custom-primary sm:text-lg">
                {subscriptionName ?? "—"}
              </p>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <Link
          to={paths.account.pointsRewards}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-custom-accent px-5 py-2 text-sm font-semibold whitespace-nowrap text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] sm:w-auto dark:focus:ring-offset-slate-900"
        >
          {t("home.viewDetails")}
        </Link>
      </div>
    </div>
  );
}

