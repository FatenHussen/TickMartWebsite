import { useTranslation } from "react-i18next";
import { Check, Clock } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import type { PackageApi, SubscriptionPaymentMethod } from "../types";
import {
  formatPackageDuration,
  formatPriceBillingSuffix,
} from "../utils/formatPackageDuration";

function resolveLocalizedName(
  name: string | { ar: string; en: string },
  lang: string,
): string {
  if (typeof name === "string") return name;
  return lang === "ar" ? name.ar : name.en;
}

type PackageCardProps = {
  package: PackageApi;
  isCurrentPlan?: boolean;
  hasActiveSubscription?: boolean;
  subscriptionStatus?: "active" | "pending" | string;
  paymentMethod?: SubscriptionPaymentMethod;
  onSubscribe?: (packageId: number) => void;
  onCancel?: (packageId: number) => void;
  isCancelling?: boolean;
};

export default function PackageCard({
  package: pkg,
  isCurrentPlan = false,
  hasActiveSubscription = false,
  subscriptionStatus,
  paymentMethod,
  onSubscribe,
  onCancel,
  isCancelling = false,
}: PackageCardProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const packageName = resolveLocalizedName(pkg.name, language);
  const priceDisplay =
    pkg.price_formatted ?? `${pkg.currency_symbol ?? ""}${pkg.price}`;

  const duration = formatPackageDuration(pkg.duration_days, t);
  const pricePeriodSuffix = formatPriceBillingSuffix(pkg.duration_days, t);

  const features = [
    t("packages.features.discountPercent", { percent: pkg.discount_percentage }),
    t("packages.features.freeDeliveriesCount", { count: pkg.free_delivery_count }),
    !pkg.monthly_orders_limit || pkg.monthly_orders_limit >= 999
      ? t("packages.features.unlimitedOrders")
      : t("packages.features.ordersUpTo", { count: pkg.monthly_orders_limit }),
    t("packages.features.bonusPointsCount", { count: pkg.points_bonus }),
  ];

  return (
    <div
      className={cn(
        "relative flex h-full min-w-0 w-full flex-col overflow-hidden rounded-xl",
        isCurrentPlan
          ? "package-current-plan"
          : "border border-border-primary shadow-[var(--shadow-card-neutral)]",
      )}
      style={
        isCurrentPlan
          ? {
              background:
                "linear-gradient(145deg, color-mix(in srgb, var(--color-main) 22%, white) 0%, color-mix(in srgb, var(--color-main) 12%, var(--color-bg-card)) 52%, color-mix(in srgb, var(--color-main) 28%, white) 100%)",
              border: "1px solid color-mix(in srgb, var(--color-main) 45%, transparent)",
              boxShadow:
                "0 18px 38px -14px color-mix(in srgb, var(--color-main) 48%, transparent), 0 8px 20px -12px color-mix(in srgb, var(--color-main) 36%, transparent)",
            }
          : {
              background:
                "linear-gradient(180deg, var(--color-bg-accent-soft) 0%, var(--color-bg-surface) 100%)",
            }
      }
    >
      {/* Active plan: light curved lines + soft corner arcs (Figma-style) */}
      {isCurrentPlan && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 400 300"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <path
            d="M-60 95 C70 75 150 115 270 88 S430 68 520 98"
            stroke="rgba(186,230,253,0.45)"
            strokeWidth="1.4"
            fill="none"
          />
          <path
            d="M-40 138 C90 118 190 158 310 132 S470 112 540 142"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.1"
            fill="none"
          />
          <path
            d="M-20 178 C110 158 230 198 350 172 S490 152 560 182"
            stroke="rgba(186,230,253,0.3)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M-10 218 C130 198 250 232 380 208 S510 188 580 218"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.9"
            fill="none"
          />
          <circle
            cx="318"
            cy="210"
            r="88"
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="30"
          />
          <circle
            cx="318"
            cy="210"
            r="136"
            fill="none"
            stroke="rgba(255,255,255,0.09)"
            strokeWidth="30"
          />
          <circle
            cx="318"
            cy="210"
            r="184"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="30"
          />
        </svg>
      )}

      <div className="relative flex flex-1 flex-col gap-4 p-5">
        {/* Header: title + duration (start) | Current Plan badge (end) — matches Figma */}
        {isCurrentPlan ? (
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 text-start">
              <h3 className="text-lg font-bold leading-tight text-[var(--color-api-second)]">
                {packageName}
              </h3>
              <p className="mt-1.5 text-sm leading-snug text-[var(--color-api-second)]/85">
                {duration} {t("packages.durationSuffix")}
              </p>
            </div>
            {subscriptionStatus === "pending" ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-amber-400/20 px-3 py-1.5 text-xs font-semibold leading-none text-amber-700 shadow-sm backdrop-blur-sm dark:bg-amber-400/15 dark:text-amber-300">
                <Clock className="h-3 w-3" />
                {t("packages.statusPending")}
              </span>
            ) : (
              <span className="shrink-0 rounded-lg bg-primary-light/35 px-3.5 py-1.5 text-center text-xs font-semibold leading-none text-[var(--color-api-second)] shadow-sm backdrop-blur-sm">
                {t("packages.currentPlan")}
              </span>
            )}
          </div>
        ) : (
          <div className="text-start">
            <h3 className="text-lg font-bold leading-tight text-custom-primary">
              {packageName}
            </h3>
            <p className="mt-1.5 text-sm leading-snug text-custom-secondary">
              {duration} {t("packages.durationSuffix")}
            </p>
          </div>
        )}

        <ul className="flex flex-col gap-2.5">
          {features.map((text, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[var(--color-success)]">
                <Check className="h-3 w-3 text-white" />
              </span>
              <span
                className={cn(
                  "text-sm leading-snug",
                  isCurrentPlan ? "text-[var(--color-api-second)]" : "text-custom-primary",
                )}
              >
                {text}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-1">
          {isCurrentPlan && onCancel ? (
            <div className="flex flex-col gap-4">
              <div className="min-w-0 text-start">
                <span className="text-2xl font-bold tabular-nums text-[var(--color-api-second)]">
                  {priceDisplay}
                </span>
                <span className="text-sm font-medium text-[var(--color-api-second)]/85">
                  {pricePeriodSuffix}
                </span>
              </div>

              {subscriptionStatus === "pending" && paymentMethod && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-300/40 bg-amber-400/10 px-3 py-2 dark:border-amber-400/20 dark:bg-amber-400/10">
                  {paymentMethod.icon ? (
                    <img
                      src={paymentMethod.icon}
                      alt={paymentMethod.name}
                      className="h-5 w-5 shrink-0 object-contain"
                    />
                  ) : null}
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                    {t("packages.awaitingPaymentVia", { method: paymentMethod.name })}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => onCancel(pkg.id)}
                disabled={isCancelling}
                className="w-full rounded-lg bg-[var(--color-api-second)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-api-second-hover)] disabled:opacity-60"
              >
                {isCancelling ? "..." : t("packages.cancelSubscription")}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div className="min-w-0 text-start">
                <span
                  className={cn(
                    "text-2xl font-bold tabular-nums",
                    isCurrentPlan ? "text-[var(--color-api-second)]" : "text-custom-primary",
                  )}
                >
                  {priceDisplay}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    isCurrentPlan ? "text-[var(--color-api-second)]/85" : "text-custom-secondary",
                  )}
                >
                  {pricePeriodSuffix}
                </span>
              </div>
              {!isCurrentPlan && !hasActiveSubscription && (
                <button
                  type="button"
                  onClick={() => onSubscribe?.(pkg.id)}
                  className="w-full shrink-0 rounded-lg bg-[var(--color-api-second)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-api-second-hover)] sm:w-auto"
                >
                  {t("packages.subscribe")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
