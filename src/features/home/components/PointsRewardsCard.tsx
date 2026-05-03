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
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] px-4 py-2 text-xs font-semibold text-white shadow-md ring-1 ring-black/5 transition-all duration-300 ease-out hover:brightness-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[#FFF9F5] active:scale-[0.98] sm:px-5 sm:text-sm dark:shadow-[0_4px_20px_-8px_color-mix(in_srgb,var(--color-primary)_28%,transparent)] dark:ring-white/10 dark:hover:shadow-[0_8px_28px_-6px_color-mix(in_srgb,var(--color-primary)_38%,transparent)] dark:focus:ring-offset-bg-tertiary"
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
        "group relative flex min-h-[200px] flex-col overflow-hidden rounded-3xl border border-stone-200/70 p-4 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] sm:min-h-[220px] sm:p-5",
        "bg-gradient-to-br from-[#FFFCF8] via-[#FFF7ED] to-[#FFF4E6]",
        // Dark: softer light pool + gentle depth; smooth hover lift
        "dark:border-white/[0.07] dark:shadow-[0_22px_56px_-20px_rgba(0,0,0,0.48),inset_0_1px_0_0_rgba(255,255,255,0.05)] dark:ring-1 dark:ring-white/[0.05]",
        "dark:bg-[radial-gradient(125%_90%_at_50%_-8%,color-mix(in_srgb,var(--color-primary)_14%,transparent)_0%,transparent_58%),linear-gradient(172deg,color-mix(in_srgb,var(--color-bg-card)_100%,#0c0c0c)_0%,var(--color-bg-primary)_50%,color-mix(in_srgb,var(--color-bg-tertiary)_96%,var(--color-api-second)_4%)_100%)]",
        "dark:transition-[transform,box-shadow] dark:duration-500 dark:ease-[cubic-bezier(0.22,1,0.36,1)]",
        "dark:hover:-translate-y-0.5 dark:hover:shadow-[0_28px_64px_-22px_rgba(0,0,0,0.52),inset_0_1px_0_0_rgba(255,255,255,0.07)]",
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
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FFFCF8]/95 via-transparent to-[#FFF4E6]/90 dark:from-[color-mix(in_srgb,var(--color-bg-primary)_70%,transparent)] dark:via-transparent dark:to-[color-mix(in_srgb,var(--color-bg-tertiary)_78%,color-mix(in_srgb,var(--color-primary)_8%,transparent)))]"
          />
        </>
      )}

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-start gap-3 sm:gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-md ring-2 ring-white/80 transition-shadow duration-500 ease-out dark:shadow-[0_0_32px_-10px_color-mix(in_srgb,var(--color-primary)_34%,transparent)] dark:ring-white/12 dark:group-hover:shadow-[0_0_38px_-8px_color-mix(in_srgb,var(--color-primary)_42%,transparent)]"
            style={{
              background:
                "linear-gradient(135deg, var(--color-gradient-from) 0%, var(--color-gradient-to) 100%)",
            }}
          >
            {icon}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="info-home-tile-title mb-1 text-xs font-medium text-stone-500 sm:text-sm">
              {title}
            </p>
            <p className="info-home-tile-value truncate text-lg font-bold tracking-tight text-stone-900 sm:text-xl">
              {value}
            </p>
          </div>
        </div>

        <div className="relative mt-auto flex flex-col gap-3 pt-6 sm:pt-8">
          <div className="flex items-end justify-between gap-3">
            <p className="info-home-tile-desc min-w-0 flex-1 text-xs leading-relaxed text-stone-600 sm:text-sm">
              {description}
            </p>
            {action}
          </div>
        </div>
      </div>
    </div>
  );
}
