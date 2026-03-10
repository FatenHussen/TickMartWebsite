import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import PackageCard from "../components/PackageCard";
import { usePackages, useMySubscription, useSubscribe } from "../hooks/usePackages";

export default function MyPackages() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { data: packages = [], isLoading: packagesLoading } = usePackages();
  const { data: mySubscription } = useMySubscription();
  const subscribeMutation = useSubscribe();

  const currentPlanId = mySubscription?.package?.id ?? null;

  const handleSubscribe = (packageId: number) => {
    if (subscribeMutation.isPending) return;
    subscribeMutation.mutate(packageId, {
      onSuccess: (res) => {
        if (res.status) {
          toast.success(res.message || t("packages.subscribe"));
        } else {
          toast.error(res.message || t("common.subscriptionFailed"));
        }
      },
      onError: () => {
        toast.error(t("common.subscriptionFailed"));
      },
    });
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t("packages.myPackages")}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("packages.myPackagesDescription")}
        </p>
      </div>

      {packagesLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
        </div>
      ) : packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              isCurrentPlan={pkg.id === currentPlanId}
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
