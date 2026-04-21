import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { getApiErrorMessage, getApiSuccessMessage } from "@/shared/lib/apiMessage";
import PackageCard from "../components/PackageCard";
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
    const hasActiveSubscription = !!currentPlanId;
    const packageCount = packages.length;

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
                    toast.success(
                        getApiSuccessMessage(res, t("packages.cancelSubscriptionSuccess")),
                    );
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
        <div dir={isRTL ? "rtl" : "ltr"} className="space-y-8">
            {/* Hero card */}
            <section className="relative overflow-hidden rounded-3xl border border-border-primary bg-gradient-to-br from-[var(--color-bg-accent-soft)] via-[var(--color-bg-surface)] to-[var(--color-bg-card)] p-6 shadow-[var(--shadow-card-neutral)] md:p-8">
                {/* Decorative orbs */}
                <span className="pointer-events-none absolute -end-20 -top-20 h-52 w-52 rounded-full bg-[var(--color-main)]/10 blur-3xl" />
                <span className="pointer-events-none absolute -bottom-20 -start-16 h-44 w-44 rounded-full bg-[var(--color-api-second)]/20 blur-3xl" />

                <div className="relative z-10">
                    <header className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-custom-primary">
                            {t("packages.myPackages")}
                        </h1>
                        <p className="max-w-2xl text-base leading-relaxed text-custom-secondary">
                            {t("packages.myPackagesDescription")}
                        </p>
                    </header>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        {/* Count badge */}
                        <span className="inline-flex items-center rounded-full border border-border-primary bg-custom-card px-3 py-1 text-sm font-medium text-custom-primary">
                            {packageCount} {t("packages.myPackages")}
                        </span>
                        {/* Status badge */}
                        <span className="inline-flex items-center rounded-full border border-[var(--color-api-second)]/40 bg-[var(--color-api-second)]/15 px-3 py-1 text-sm font-medium text-custom-primary">
                            {t(
                                hasActiveSubscription
                                    ? "packages.currentPlan"
                                    : "packages.noSubscription",
                            )}
                        </span>
                    </div>
                </div>
            </section>

            {/* Packages grid */}
            {packagesLoading ? (
                <div className="flex justify-center py-12">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            ) : packages.length > 0 ? (
                <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {packages.map((pkg) => (
                        <PackageCard
                            key={pkg.id}
                            package={pkg}
                            isCurrentPlan={pkg.id === currentPlanId}
                            hasActiveSubscription={hasActiveSubscription}
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
