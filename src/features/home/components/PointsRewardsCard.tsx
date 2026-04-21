import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Coins, Gift, Percent } from "lucide-react";
import { paths } from "@/app/routes/path/paths";
import { cn } from "@/shared/lib/utils";

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

  const viewDetailsButton = (
    <Link
      to={paths.account.pointsRewards}
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] px-4 py-2 text-xs font-semibold text-white shadow-md ring-1 ring-black/5 transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[#FFF9F5] sm:px-5 sm:text-sm dark:focus:ring-offset-bg-tertiary"
    >
      {t("home.viewDetails")}
    </Link>
  );

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <InfoTile
        bgImage="/images/points/points_1.jpeg"
        icon={
          <Coins
            className="h-5 w-5 text-white sm:h-6 sm:w-6"
            strokeWidth={2}
            aria-hidden
          />
        }
        title={t("home.yourPoints")}
        value={points.toLocaleString()}
        description={t("home.earnWhileYouShop")}
        action={viewDetailsButton}
      />

      <InfoTile
        bgImage="/images/points/points_2.jpeg"
        icon={
          <Gift
            className="h-5 w-5 text-white sm:h-6 sm:w-6"
            strokeWidth={2}
            aria-hidden
          />
        }
        title={t("home.rewards")}
        value={`${rewardsCount} ${t("home.available")}`}
        description={t("home.redeemExclusiveOffers")}
        action={viewDetailsButton}
      />

      <InfoTile
        bgImage="/images/points/points_3.jpeg"
        icon={
          <Percent
            className="h-5 w-5 text-white sm:h-6 sm:w-6"
            strokeWidth={2}
            aria-hidden
          />
        }
        title={t("home.activeSubscription")}
        value={subscriptionName ?? t("home.noActiveSubscription")}
        description={t("home.enjoyPremiumBenefits")}
        action={viewDetailsButton}
      />
    </div>
  );
}

interface InfoTileProps {
  bgImage?: string;
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  action?: React.ReactNode;
}

function InfoTile({
  bgImage,
  icon,
  title,
  value,
  description,
  action,
}: InfoTileProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-[200px] flex-col overflow-hidden rounded-3xl border border-stone-200/70 p-4 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] sm:min-h-[220px] sm:p-5",
        "bg-gradient-to-br from-[#FFFCF8] via-[#FFF7ED] to-[#FFF4E6]",
        "dark:border-white/10 dark:from-bg-tertiary dark:via-bg-tertiary dark:to-bg-primary dark:shadow-none dark:ring-1 dark:ring-white/10",
      )}
    >
      {bgImage && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[length:120%] bg-[position:90%_60%] bg-no-repeat opacity-[0.14] dark:opacity-[0.08]"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FFFCF8]/95 via-transparent to-[#FFF4E6]/90 dark:from-bg-tertiary/95 dark:to-bg-tertiary/90"
          />
        </>
      )}

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-start gap-3 sm:gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-md ring-2 ring-white/80 dark:ring-white/10"
            style={{
              background:
                "linear-gradient(135deg, var(--color-gradient-from) 0%, var(--color-gradient-to) 100%)",
            }}
          >
            {icon}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="mb-1 text-xs font-medium text-stone-500 sm:text-sm dark:text-custom-secondary">
              {title}
            </p>
            <p className="truncate text-lg font-bold tracking-tight text-stone-900 sm:text-xl dark:text-custom-primary">
              {value}
            </p>
          </div>
        </div>

        <div className="relative mt-auto flex flex-col gap-3 pt-6 sm:pt-8">
          <div className="flex items-end justify-between gap-3">
            <p className="min-w-0 flex-1 text-xs leading-relaxed text-stone-600 sm:text-sm dark:text-custom-secondary">
              {description}
            </p>
            {action}
          </div>
        </div>
      </div>
    </div>
  );
}
