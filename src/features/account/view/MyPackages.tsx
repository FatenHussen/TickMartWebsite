import { useTranslation } from"react-i18next";
import { useLanguage } from"@/context/LanguageContext";
import { toast } from"sonner";
import { getApiErrorMessage, getApiSuccessMessage } from"@/shared/lib/apiMessage";
import PackageCard from"../components/PackageCard";
import {
  usePackages,
  useMySubscription,
  useSubscribe,
  useCancelSubscription,
} from "../hooks/usePackages";

export default function MyPackages() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { data: packages = [], isLoading: packagesLoading } = usePackages();
  const { data: mySubscription } = useMySubscription();
  const subscribeMutation = useSubscribe();
  const cancelMutation = useCancelSubscription();

  const currentPlanId = mySubscription?.package?.id ?? null;

  const handleSubscribe = (packageId: number) => {
 if (subscribeMutation.isPending) return;
 subscribeMutation.mutate(packageId, {
 onSuccess: (res) => {
 if (res.status) {
 toast.success(getApiSuccessMessage(res, t("packages.subscribe")));
 } else {
 toast.error(getApiSuccessMessage(res, t("common.subscriptionFailed")));
 }
 },
 onError: (err) => {
      toast.error(getApiErrorMessage(err, t("common.subscriptionFailed")));
    },
  });
  };

  const handleCancel = (packageId: number) => {
    if (cancelMutation.isPending) return;
    cancelMutation.mutate(packageId, {
      onSuccess: (res) => {
        if (res.status) {
          toast.success(getApiSuccessMessage(res, t("packages.cancelSubscriptionSuccess")));
        } else {
          toast.error(getApiSuccessMessage(res, t("common.subscriptionFailed")));
        }
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, t("common.subscriptionFailed")));
      },
    });
  };

  return (
 <div dir={isRTL ?"rtl":"ltr"}>
 <header className="mb-8 space-y-2">
 <h1 className="text-3xl font-bold tracking-tight text-custom-primary">
 {t("packages.myPackages")}
 </h1>
 <p className="max-w-2xl text-base leading-relaxed text-custom-secondary">
 {t("packages.myPackagesDescription")}
 </p>
 </header>

 {packagesLoading ? (
 <div className="flex justify-center py-12">
 <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"/>
 </div>
 ) : packages.length > 0 ? (
 <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
 {packages.map((pkg) => (
 <PackageCard
            key={pkg.id}
            package={pkg}
            isCurrentPlan={pkg.id === currentPlanId}
            hasActiveSubscription={!!currentPlanId}
            onSubscribe={handleSubscribe}
            onCancel={handleCancel}
            isCancelling={cancelMutation.isPending}
          />
 ))}
 </div>
 ) : (
 <p className="text-sm text-custom-secondary py-6">
 {t("packages.noSubscription")}
 </p>
 )}
 </div>
 );
}
