import type { TFunction } from "i18next";

type PointsRewardsErrorViewProps = {
    t: TFunction;
    isRTL: boolean;
};

export function PointsRewardsErrorView({ t, isRTL }: PointsRewardsErrorViewProps) {
    return (
        <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
            <div className="space-y-2 border-b border-custom-primary/10 pb-6">
                <h1 className="text-2xl font-bold text-custom-primary sm:text-3xl">
                    {t("account.pointsRewards.title")}
                </h1>
            </div>
            <div
                className="rounded-2xl border border-[var(--color-ui-red-200)] bg-[var(--color-ui-red-50)] p-6 text-center text-sm text-[var(--color-ui-red-800)] dark:border-[var(--color-ui-red-800)] dark:bg-[color-mix(in_srgb,var(--color-ui-red-900)_20%,transparent)] dark:text-[var(--color-ui-red-200)]"
                role="alert"
            >
                {t("account.pointsRewards.errorLoading") ?? "Failed to load points. Please try again."}
            </div>
        </div>
    );
}
