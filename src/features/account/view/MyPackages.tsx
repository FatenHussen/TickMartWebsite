import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import PackageCard from "../components/PackageCard";
import {
  usePackages,
  useMySubscription,
  useSubscribe,
} from "../hooks/usePackages";
import type { PackageApi } from "../types";
import type { SubscriptionPackage } from "../types";

function mapApiPackageToUi(
  p: PackageApi,
  isCurrentPlan: boolean,
  t: (key: string) => string,
): SubscriptionPackage {
  const features: SubscriptionPackage["features"] = [
    { id: "1", text: `${p.monthly_orders_limit} orders/month` },
    { id: "2", text: `${p.free_delivery_count} free deliveries` },
    { id: "3", text: `${p.discount_percentage}% discount` },
    { id: "4", text: `${p.points_bonus} bonus points` },
  ];
  return {
    id: String(p.id),
    name: p.name,
    duration: `${p.duration_days} ${t("packages.days")}`,
    price: p.price,
    currency: "",
    features,
    isCurrentPlan: isCurrentPlan,
    isFeatured: isCurrentPlan,
  };
}

export default function MyPackages() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { data: packages = [], isLoading: packagesLoading } = usePackages();
  const { data: mySubscription } = useMySubscription();
  const subscribeMutation = useSubscribe();

  const uiPackages = useMemo(
    () =>
      packages.map((p) =>
        mapApiPackageToUi(p, (mySubscription?.package?.id ?? 0) === p.id, t),
      ),
    [packages, mySubscription?.package?.id, t],
  );

  const handleSubscribe = (packageId: number | string) => {
    if (subscribeMutation.isPending) return;
    const id =
      typeof packageId === "string" ? parseInt(packageId, 10) : packageId;
    if (Number.isNaN(id)) return;
    subscribeMutation.mutate(id, {
      onSuccess: (res) => {
        if (res.status) {
          toast.success(res.message || t("packages.subscribe"));
        } else {
          toast.error(res.message || "Subscription failed");
        }
      },
      onError: () => {
        toast.error("Subscription failed");
      },
    });
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {t("packages.myPackages")}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("packages.myPackagesDescription")}
        </p>
      </div>

      {/* My current subscription */}
      {mySubscription && mySubscription.status === "active" && (
        <div className="mb-8 rounded-2xl border border-primary/30 bg-primary/5 p-5 dark:bg-primary/10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {t("packages.mySubscription")} — {t("packages.activeSubscription")}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {mySubscription.package.name} • {mySubscription.package.price} /{" "}
            {t("packages.month")}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-gray-700 dark:text-gray-300">
              {t("packages.remainingOrders")}: {mySubscription.remaining_orders}
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              {t("packages.remainingFreeDeliveries")}:{" "}
              {mySubscription.remaining_free_deliveries}
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              {t("packages.startDate")}: {mySubscription.start_date}
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              {t("packages.endDate")}: {mySubscription.end_date}
            </span>
          </div>
        </div>
      )}

      {/* {!subscriptionLoading && !mySubscription && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {t("packages.noSubscription")}
        </p>
      )} */}

      {/* Packages Grid */}
      {packagesLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
        </div>
      ) : uiPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {uiPackages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              onSubscribe={handleSubscribe}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-6">
          {t("packages.noSubscription")}
        </p>
      )}
    </div>
  );
}
