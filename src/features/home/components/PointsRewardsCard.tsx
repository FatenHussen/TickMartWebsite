import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Coins, Gift, Percent } from "lucide-react";
import { paths } from "@/app/routes/path/paths";
import { cn } from "@/shared/lib/utils";
import {
  getPointsTileDarkCardStyle,
  getPointsTileDarkGradientOverlayStyle,
} from "../lib/infoCardsDarkGradients";

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
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  const viewDetailsButton = (
    <Link
      to={paths.account.pointsRewards}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ease-out focus:outline-none active:scale-[0.98] sm:px-5 sm:text-sm",
        isDarkTheme
          ? "border border-white/10 bg-gradient-to-br from-[color-mix(in_srgb,var(--color-primary)_34%,#1e1f28)] via-[color-mix(in_srgb,var(--color-primary)_14%,#15161d)] to-[#0c0d11] text-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)] hover:from-[color-mix(in_srgb,var(--color-primary)_42%,#1e1f28)] hover:via-[color-mix(in_srgb,var(--color-primary)_20%,#15161d)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_40%,transparent)] focus:ring-offset-2 focus:ring-offset-[#0B0B0C]"
          : "bg-gradient-to-b from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] text-white shadow-md ring-1 ring-black/5 hover:brightness-105 hover:shadow-lg focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_55%,transparent)] focus:ring-offset-2",
      )}
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
        isDarkTheme={isDarkTheme}
        darkVariant={0}
        bgImage="/images/points/points_1.jpeg"
        icon={<Coins className="h-5 w-5 text-white sm:h-6 sm:w-6" strokeWidth={2} aria-hidden />}
        title={t("home.yourPoints")}
        value={points.toLocaleString()}
        valueTone="accent"
        description={t("home.earnWhileYouShop")}
        action={viewDetailsButton}
      />
      <InfoTile
        isDarkTheme={isDarkTheme}
        darkVariant={1}
        bgImage="/images/points/points_2.jpeg"
        icon={<Gift className="h-5 w-5 text-white sm:h-6 sm:w-6" strokeWidth={2} aria-hidden />}
        title={t("home.rewards")}
        value={`${rewardsCount} ${t("home.available")}`}
        valueTone="neutral"
        description={t("home.redeemExclusiveOffers")}
        action={viewDetailsButton}
      />
      <InfoTile
        isDarkTheme={isDarkTheme}
        darkVariant={2}
        bgImage="/images/points/points_3.jpeg"
        icon={<Percent className="h-5 w-5 text-white sm:h-6 sm:w-6" strokeWidth={2} aria-hidden />}
        title={t("home.activeSubscription")}
        value={subscriptionName ?? t("home.noActiveSubscription")}
        valueTone={subscriptionName ? "muted" : "mutedEmpty"}
        description={t("home.enjoyPremiumBenefits")}
        action={viewDetailsButton}
      />
    </div>
  );
}

interface InfoTileProps {
  isDarkTheme?: boolean;
  /** Dark: which creative gradient set (0–2) */
  darkVariant?: 0 | 1 | 2;
  bgImage?: string;
  icon: React.ReactNode;
  title: string;
  value: string;
  /** Dark mode: accent = soft API tint (points); neutral = #fff; muted = subscription name; mutedEmpty = no subscription copy */
  valueTone?: "accent" | "neutral" | "muted" | "mutedEmpty";
  description: string;
  action?: React.ReactNode;
}

function InfoTile({
  isDarkTheme,
  darkVariant = 0,
  bgImage,
  icon,
  title,
  value,
  valueTone = "neutral",
  description,
  action,
}: InfoTileProps) {
  const darkCardStyle: CSSProperties | undefined = isDarkTheme
    ? getPointsTileDarkCardStyle(darkVariant)
    : undefined;

  const valueStyleDark: CSSProperties | undefined =
    isDarkTheme && valueTone === "accent"
      ? { color: "color-mix(in srgb, var(--color-primary) 48%, #ffffff 52%)" }
      : isDarkTheme && valueTone === "muted"
        ? { color: "#D4D4D8" }
        : isDarkTheme && valueTone === "mutedEmpty"
          ? { color: "#A1A1AA" }
          : undefined;

  const iconBadgeStyle: CSSProperties | undefined = isDarkTheme
    ? {
        background:
          "linear-gradient(145deg, color-mix(in srgb, var(--color-gradient-from) 64%, #1a1b22 36%) 0%, color-mix(in srgb, var(--color-gradient-to) 58%, #14151c 42%) 100%)",
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.15), 0 6px 20px -8px color-mix(in srgb, var(--color-primary) 22%, transparent)",
      }
    : {
        background:
          "linear-gradient(135deg, var(--color-gradient-from) 0%, var(--color-gradient-to) 100%)",
      };

  const lightCardStyle: CSSProperties = {};

  return (
    <div
      className={
        isDarkTheme
          ? "group relative flex min-h-[200px] flex-col overflow-hidden rounded-3xl p-5 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_28px_64px_-20px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.07)] sm:min-h-[220px]"
          : "group relative flex min-h-[200px] flex-col overflow-hidden rounded-3xl border border-stone-200/70 bg-gradient-to-br from-[#FFFCF8] via-[#FFF7ED] to-[#FFF4E6] p-4 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-md sm:min-h-[220px] sm:p-5"
      }
      style={isDarkTheme ? darkCardStyle : lightCardStyle}
    >
      {isDarkTheme && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
            style={getPointsTileDarkGradientOverlayStyle(darkVariant)}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
            style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)" }}
          />
        </>
      )}

      {/* Light only: decorative photos (dark omits — avoids muddy / noisy brown casts) */}
      {bgImage && !isDarkTheme && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[length:120%] bg-[position:90%_60%] bg-no-repeat opacity-[0.14]"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FFFCF8]/95 via-transparent to-[#FFF4E6]/90"
          />
        </>
      )}

      <div className="relative z-10 flex flex-1 flex-col">
        {/* Icon + Title row */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-md ring-1 ring-black/5 transition-all duration-500 ease-out group-hover:scale-105 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] dark:ring-1 dark:ring-white/[0.12] dark:group-hover:ring-white/[0.16]"
            style={iconBadgeStyle}
          >
            {icon}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="mb-1 text-xs font-medium text-stone-500 dark:text-[#A1A1AA] sm:text-sm">
              {title}
            </p>
            <p
              className="truncate text-lg font-bold tracking-tight text-stone-900 dark:text-white sm:text-xl"
              style={valueStyleDark}
            >
              {value}
            </p>
          </div>
        </div>

        {/* Description + action */}
        <div className="relative mt-auto flex flex-col gap-3 pt-6 sm:pt-8">
          <div className="flex items-end justify-between gap-3">
            <p className="min-w-0 flex-1 text-xs leading-relaxed text-stone-600 dark:text-[#A1A1AA] sm:text-sm">
              {description}
            </p>
            {action}
          </div>
        </div>
      </div>
    </div>
  );
}
