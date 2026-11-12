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
  getPointsTileLightCardStyle,
} from "../lib/infoCardsDarkGradients";

interface PointsRewardsCardProps {
  points: number;
  rewardsCount: number;
  subscriptionName: string | null;
}

type TileAccent = "points" | "rewards" | "subscription";

const ACCENT: Record<TileAccent, { badge: string; value: string }> = {
  points: {
    badge: "bg-[var(--color-primary)]",
    value: "text-[var(--color-primary)]",
  },
  rewards: {
    badge: "bg-[var(--color-trust)]",
    value: "text-[var(--color-trust)]",
  },
  subscription: {
    badge: "bg-[var(--color-success)]",
    value: "text-[var(--color-success)]",
  },
};

export default function PointsRewardsCard({
  points,
  rewardsCount,
  subscriptionName,
}: PointsRewardsCardProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  return (
    <div
      className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <InfoTile
        to={paths.account.pointsRewards}
        isDarkTheme={isDarkTheme}
        darkVariant={0}
        accent="points"
        imageSrc="/images/points/points_1.jpeg"
        icon={<Coins className="h-4 w-4 text-white sm:h-6 sm:w-6" strokeWidth={2} aria-hidden />}
        title={t("home.yourPoints")}
        value={points.toLocaleString()}
        description={t("home.earnWhileYouShop")}
      />
      <InfoTile
        to={paths.account.pointsRewards}
        isDarkTheme={isDarkTheme}
        darkVariant={1}
        accent="rewards"
        imageSrc="/images/points/points_2.jpeg"
        icon={<Gift className="h-4 w-4 text-white sm:h-6 sm:w-6" strokeWidth={2} aria-hidden />}
        title={t("home.rewards")}
        value={`${rewardsCount} ${t("home.available")}`}
        description={t("home.redeemExclusiveOffers")}
      />
      <InfoTile
        to={paths.account.packages}
        isDarkTheme={isDarkTheme}
        darkVariant={2}
        accent="subscription"
        imageSrc="/images/points/points_3.jpeg"
        icon={<Percent className="h-4 w-4 text-white sm:h-6 sm:w-6" strokeWidth={2} aria-hidden />}
        title={t("home.activeSubscription")}
        value={subscriptionName ?? t("home.noActiveSubscription")}
        description={t("home.enjoyPremiumBenefits")}
      />
    </div>
  );
}

interface InfoTileProps {
  to: string;
  isDarkTheme?: boolean;
  darkVariant?: 0 | 1 | 2;
  accent: TileAccent;
  imageSrc: string;
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}

function InfoTile({
  to,
  isDarkTheme,
  darkVariant = 0,
  accent,
  imageSrc,
  icon,
  title,
  value,
  description,
}: InfoTileProps) {
  const cardStyle: CSSProperties = isDarkTheme
    ? getPointsTileDarkCardStyle(darkVariant)
    : getPointsTileLightCardStyle(darkVariant);

  const tones = ACCENT[accent];

  return (
    <Link
      to={to}
      className={
        isDarkTheme
          ? "group relative flex min-h-[72px] overflow-hidden rounded-2xl transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_28px_64px_-20px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.07)] sm:min-h-[180px] sm:rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--color-primary)_40%,transparent)]"
          : "group relative flex min-h-[72px] overflow-hidden rounded-2xl transition-shadow hover:shadow-md sm:min-h-[180px] sm:rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--color-primary)_40%,transparent)]"
      }
      style={cardStyle}
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

      <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center p-3 sm:justify-start sm:p-5">
        <div className="flex items-center gap-3 sm:items-start sm:gap-4">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-md sm:h-12 sm:w-12 sm:rounded-2xl ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105 dark:ring-white/[0.12]",
              tones.badge,
            )}
          >
            {icon}
          </div>
          <div className="flex min-w-0 flex-1 items-baseline gap-2 sm:block sm:pt-0.5">
            <p className="shrink-0 text-xs font-medium text-stone-500 dark:text-[#E8E4DC]/75 sm:mb-1 sm:text-sm">
              {title}
            </p>
            <p
              className={cn(
                "truncate text-sm font-bold tracking-tight sm:text-xl",
                isDarkTheme ? "text-white" : tones.value,
              )}
            >
              {value}
            </p>
          </div>
        </div>

        <p className="relative mt-auto hidden min-w-0 pt-6 text-xs leading-relaxed text-stone-600 dark:text-[#E8E4DC]/80 sm:block sm:pt-8 sm:text-sm">
          {description}
        </p>
      </div>

      <div
        aria-hidden
        className="relative w-16 shrink-0 bg-cover bg-center sm:w-[7rem]"
        style={{ backgroundImage: `url(${imageSrc})` }}
      >
        <div
          className={cn(
            "absolute inset-0",
            isDarkTheme ? "bg-black/35" : "bg-[linear-gradient(to_left,transparent,rgb(251_246_238/0.35))] rtl:bg-[linear-gradient(to_right,transparent,rgb(251_246_238/0.35))]",
          )}
        />
      </div>
    </Link>
  );
}
