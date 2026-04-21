import type { TFunction } from "i18next";
import { cn } from "@/shared/lib/utils";
import { historySectionShellClass } from "../constants";
import { getPointValueMultiplier } from "../utils/pointsRewardsMath";
import { SectionShell } from "./SectionShell";

const POINTS_HERO_BG = "/images/accounts/pointspts.jpeg";

type ValueShape = { point_value?: string; estimated_value_formatted?: string } | undefined;

type PointsBalanceCardProps = {
    t: TFunction;
    summaryLoading: boolean;
    points: number;
    value: ValueShape;
    nextReward: string;
    nextRewardThreshold: number | null;
    progressPercentage: number;
};

export function PointsBalanceCard({
    t,
    summaryLoading,
    points,
    value,
    nextReward,
    nextRewardThreshold,
    progressPercentage,
}: PointsBalanceCardProps) {
    const multiplier = getPointValueMultiplier(value);

    return (
        <SectionShell
            className={cn(
                historySectionShellClass,
                "relative min-h-[260px] overflow-hidden border border-[var(--color-ui-orange-300)]/40 sm:min-h-[280px]",
            )}
        >
            <div
                className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${POINTS_HERO_BG})` }}
                aria-hidden
            />
            <div
                className={cn(
                    "pointer-events-none absolute inset-0",
                    "bg-gradient-to-br from-[var(--color-ui-orange-50)]/92 via-[var(--color-ui-orange-100)]/88 to-[var(--color-bg-card)]/90",
                    "dark:from-[color-mix(in_srgb,var(--color-ui-orange-900)_28%,transparent)] dark:via-[color-mix(in_srgb,var(--color-ui-orange-900)_20%,transparent)] dark:to-[var(--color-bg-card)]/92",
                )}
                aria-hidden
            />
            <div className="pointer-events-none absolute -right-10 -top-16 h-36 w-36 rounded-full bg-primary-light/10 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-[var(--color-ui-orange-400)]/10 blur-3xl" aria-hidden />

            <div className="relative z-10">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-custom-secondary">
                    {t("account.pointsRewards.yourPoints.title")}
                </h2>

                {summaryLoading ? (
                    <div className="mt-6 flex h-36 items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <span className="h-10 w-10 animate-pulse rounded-full bg-primary-light/20" />
                            <p className="text-sm text-custom-secondary">
                                {t("common.loading") ?? "Loading..."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mt-4 flex flex-wrap items-end gap-2">
                            <span className="text-4xl font-bold tabular-nums tracking-tight text-custom-primary sm:text-5xl">
                                {points.toLocaleString()}
                            </span>
                            <span className="pb-1 text-lg font-semibold text-primary-light sm:text-xl">
                                {t("account.pointsRewards.points")}
                            </span>
                        </div>

                        <dl className="mt-5 space-y-2 text-sm text-custom-primary">
                            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                                <dt className="shrink-0 text-custom-secondary">
                                    {t("account.pointsRewards.pointValue")}
                                </dt>
                                <dd className="font-medium">
                                    {value?.point_value ??
                                        t("account.pointsRewards.pointValueFallback", { points: t("account.pointsRewards.points") })}
                                </dd>
                            </div>
                            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                                <dt className="shrink-0 text-custom-secondary">
                                    {t("account.pointsRewards.estimatedValue")}
                                </dt>
                                <dd className="font-medium">
                                    {value?.estimated_value_formatted ??
                                        t("account.pointsRewards.estimatedValueFallback", { value: (points * multiplier).toLocaleString() })}{" "}
                                    {t("account.pointsRewards.inRewards")}
                                </dd>
                            </div>
                        </dl>

                        {nextRewardThreshold != null && (
                            <div className="mt-6 space-y-2">
                                <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-ui-orange-200)]/70 dark:bg-[color-mix(in_srgb,var(--color-ui-orange-900)_35%,transparent)]">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-ui-orange-500)] to-[var(--color-ui-orange-600)] transition-[width] duration-500 ease-out"
                                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                    />
                                </div>
                                <p className="text-sm font-medium leading-snug text-custom-primary">
                                    {nextReward}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </SectionShell>
    );
}
