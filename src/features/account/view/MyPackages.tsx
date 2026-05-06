import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { getApiErrorMessage, getApiSuccessMessage } from "@/shared/lib/apiMessage";
import { PremiumInlineLoader } from "@/shared/component/loading";
import { usePaymentMethods } from "@/features/cart/hooks/usePaymentMethods";
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
    const { methods: paymentMethods, isLoading: methodsLoading } = usePaymentMethods();
    const subscribeMutation = useSubscribe();
    const cancelMutation = useCancelSubscription();

    const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);

    const currentPlanId = mySubscription?.package?.id ?? null;
    const hasActiveSubscription = !!currentPlanId;
    const packageCount = packages.length;

    const handleSubscribe = (packageId: number) => {
        if (subscribeMutation.isPending) return;
        if (!selectedMethodId) {
            toast.error(t("packages.selectPaymentMethod"));
            return;
        }
        subscribeMutation.mutate(
            { packageId, paymentMethodId: selectedMethodId },
            {
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
            },
        );
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
            <section className="account-shell relative overflow-hidden rounded-3xl border border-[var(--color-border-primary)] bg-gradient-to-br from-[var(--color-bg-accent-soft)] via-[var(--color-bg-surface)] to-[var(--color-bg-card)] p-6 shadow-[0_4px_24px_-8px_var(--color-shadow)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.04)] md:p-8">
                <span className="pointer-events-none absolute -end-20 -top-20 h-52 w-52 rounded-full bg-[var(--color-main)] opacity-10 blur-3xl" aria-hidden />
                <span className="pointer-events-none absolute -bottom-20 -start-16 h-44 w-44 rounded-full bg-[var(--color-api-second)] opacity-[0.12] blur-3xl" aria-hidden />

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
                        <span className="inline-flex items-center rounded-full border border-border-primary bg-custom-card px-3 py-1 text-sm font-medium text-custom-primary">
                            {packageCount} {t("packages.myPackages")}
                        </span>
                        <span className="inline-flex items-center rounded-full border border-[var(--color-border-accent-light)] bg-[color-mix(in_srgb,var(--color-api-second)_10%,transparent)] px-3 py-1 text-sm font-medium text-custom-primary">
                            {t(
                                hasActiveSubscription
                                    ? "packages.currentPlan"
                                    : "packages.noSubscription",
                            )}
                        </span>
                    </div>
                </div>
            </section>

            {/* Payment method selector — only shown when no active subscription */}
            {!hasActiveSubscription && (
                <section className="rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-surface)] p-5">
                    <p className="mb-3 text-sm font-semibold text-custom-primary">
                        {t("packages.selectPaymentMethod")}
                    </p>
                    {methodsLoading ? (
                        <div className="flex items-center gap-2 text-sm text-custom-secondary">
                            <PremiumInlineLoader size="sm" />
                        </div>
                    ) : paymentMethods.length === 0 ? (
                        <p className="text-sm text-custom-secondary">{t("common.noPaymentMethods")}</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {paymentMethods.map((method) => {
                                const id = Number(method.id);
                                const isSelected = selectedMethodId === id;
                                return (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setSelectedMethodId(id)}
                                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                                            isSelected
                                                ? "border-[var(--color-api-second)] bg-[color-mix(in_srgb,var(--color-api-second)_12%,transparent)] text-[var(--color-api-second)]"
                                                : "border-[var(--color-border-primary)] bg-[var(--color-bg-card)] text-custom-primary hover:border-[var(--color-api-second)]"
                                        }`}
                                    >
                                        {method.name}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}

            {/* Packages grid */}
            {packagesLoading ? (
                <div className="flex justify-center py-12">
                    <PremiumInlineLoader size="md" />
                </div>
            ) : packages.length > 0 ? (
                <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {packages.map((pkg) => (
                        <PackageCard
                            key={pkg.id}
                            package={pkg}
                            isCurrentPlan={pkg.id === currentPlanId}
                            hasActiveSubscription={hasActiveSubscription}
                            subscriptionStatus={pkg.id === currentPlanId ? mySubscription?.status : undefined}
                            paymentMethod={pkg.id === currentPlanId ? mySubscription?.payment_method : undefined}
                            onSubscribe={handleSubscribe}
                            onCancel={handleCancel}
                            isCancelling={cancelMutation.isPending}
                        />
                    ))}
                </div>
            ) : (
                <p className="py-6 text-sm text-custom-secondary">
                    {t("packages.noSubscription")}
                </p>
            )}
        </div>
    );
}
