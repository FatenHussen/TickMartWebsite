import { useTranslation } from"react-i18next";
import { HiCheck } from"react-icons/hi";
import type { PackageApi } from"../types";
import { formatPackageDuration } from"../utils/formatPackageDuration";

type PackageCardProps = {
  package: PackageApi;
  isCurrentPlan?: boolean;
  hasActiveSubscription?: boolean;
  onSubscribe?: (packageId: number) => void;
  onCancel?: (packageId: number) => void;
  isCancelling?: boolean;
};

export default function PackageCard({
  package: pkg,
  isCurrentPlan = false,
  hasActiveSubscription = false,
  onSubscribe,
  onCancel,
  isCancelling = false,
}: PackageCardProps) {
 const { t } = useTranslation();

 const priceDisplay =
 pkg.price_formatted ?? `${pkg.currency_symbol ??""}${pkg.price}`;

 const duration = formatPackageDuration(pkg.duration_days, t);

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
 className="relative overflow-hidden rounded-lg flex flex-col h-full"
 style={
 isCurrentPlan
 ? {
 background:
"linear-gradient(135deg, #4A9FD4 0%, #2B7CB4 40%, #1A5A99 80%, #14487F 100%)",
 border:"2px solid transparent",
 boxShadow:"0 8px 10px 0 rgba(1, 105, 194, 0.2)",
 }
 : {
 background:
"linear-gradient(white, white) padding-box, linear-gradient(to bottom, #E4F0FB, #E5F3FF) border-box",
 border:"2px solid transparent",
 boxShadow:"0 8px 10px 0 rgba(1, 105, 194, 0.2)",
 }
 }
 >
 {/* Current Plan: circular arc rings overlay */}
 {isCurrentPlan && (
 <svg
 className="absolute inset-0 h-full w-full"
 viewBox="0 0 350 240"
 fill="none"
 preserveAspectRatio="xMidYMid slice"
 >
 <circle cx="310"cy="200"r="100"stroke="rgba(255,255,255,0.18)"strokeWidth="36"fill="none"/>
 <circle cx="310"cy="200"r="150"stroke="rgba(255,255,255,0.12)"strokeWidth="36"fill="none"/>
 <circle cx="310"cy="200"r="200"stroke="rgba(255,255,255,0.08)"strokeWidth="36"fill="none"/>
 <circle cx="310"cy="200"r="250"stroke="rgba(255,255,255,0.05)"strokeWidth="36"fill="none"/>
 </svg>
 )}

 <div className="relative flex flex-col gap-3 p-4">
 {/* Header: plan name + duration | Current Plan badge */}
 <div className="flex items-start justify-between">
 <div>
 <h3
 className={`text-lg font-bold ${
 isCurrentPlan ?"text-white":"text-custom-primary"
 }`}
 >
 {pkg.name}
 </h3>
 <p
 className={`mt-1 text-sm ${
 isCurrentPlan
 ?"text-blue-100/70"
 :"text-custom-secondary"
 }`}
 >
 {duration} {t("packages.durationSuffix")}
 </p>
 </div>
 {isCurrentPlan && (
 <span className="rounded-xl bg-custom-card/90 px-4 py-1.5 text-sm font-semibold text-blue-900 shadow-sm">
 {t("packages.currentPlan")}
 </span>
 )}
 </div>

 {/* Features list */}
 <ul className="flex flex-col gap-3">
 {features.map((text, i) => (
 <li key={i} className="flex items-center gap-2">
 <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-emerald-500">
 <HiCheck className="h-3 w-3 text-white"/>
 </span>
 <span
 className={`text-sm ${
 isCurrentPlan
 ?"text-white"
 :"text-custom-primary"
 }`}
 >
 {text}
 </span>
 </li>
 ))}
 </ul>

 {/* Price & Subscribe button */}
 <div className="mt-auto flex items-end justify-between pt-2">
 <div>
 <span
 className={`text-2xl font-bold ${
 isCurrentPlan ?"text-white":"text-custom-primary"
 }`}
 >
 {priceDisplay}
 </span>
 <span
 className={`text-sm ${
 isCurrentPlan
 ?"text-white/80"
 :"text-custom-secondary"
 }`}
 >
 /{t("packages.month")}
 </span>
 </div>
 {isCurrentPlan && onCancel && (
        <button
          type="button"
          onClick={() => onCancel(pkg.id)}
          disabled={isCancelling}
          className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: "#EF4444" }}
        >
          {isCancelling ? "..." : t("packages.cancelSubscription")}
        </button>
      )}
      {!isCurrentPlan && !hasActiveSubscription && (
        <button
          type="button"
          onClick={() => onSubscribe?.(pkg.id)}
          className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#38BDF8" }}
        >
          {t("packages.subscribe")}
        </button>
      )}
 </div>
 </div>
 </div>
 );
}
