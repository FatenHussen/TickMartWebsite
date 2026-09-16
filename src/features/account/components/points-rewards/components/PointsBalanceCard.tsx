import type { TFunction } from "i18next";
import { Coins } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { historySectionShellClass } from "../constants";
import { getPointValueMultiplier } from "../utils/pointsRewardsMath";
import { CalmCardSurface } from "./CalmCardSurface";
import { SectionShell } from "./SectionShell";

type ValueShape = { point_value?: string; estimated_value_formatted?: string } | undefined;

type PointsBalanceCardProps = {
    t: TFunction;
    summaryLoading: boolean;
    points: number;
    value: ValueShape;
    nextRewardThreshold: number | null;
    progressPercentage: number;
};

export function PointsBalanceCard({
    t,
    summaryLoading,
    points,
    value,
    nextRewardThreshold,
    progressPercentage,
}: PointsBalanceCardProps) {
    const multiplier = getPointValueMultiplier(value);

    return (
        <SectionShell
            className={cn(historySectionShellClass, "overflow-hidden bg-transparent p-0")}
        >
            <CalmCardSurface imageSrc="/images/points/points_1.jpeg">
            <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold text-custom-primary">
                    {t("account.pointsRewards.yourPoints.title")}
                </h2>
                <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff9f00]"
                    aria-hidden
                >
                    <Coins className="h-5 w-5 text-white" strokeWidth={2} />
                </span>
            </div>

            {summaryLoading ? (
                <div className="mt-6 flex h-36 items-center justify-center">
                    <p className="text-sm text-custom-secondary">{t("common.loading") ?? "Loading..."}</p>
                </div>
            ) : (
                <>
                    <div className="mt-5 flex flex-wrap items-end gap-2">
                        <span className="text-4xl font-bold tabular-nums tracking-tight text-custom-primary sm:text-[2.75rem]">
                            {points.toLocaleString()}
                        </span>
                        <span className="pb-1 text-base font-medium text-[#ff9f00]">
                            {t("account.pointsRewards.points")}
                        </span>
                    </div>

                    <dl className="mt-5 space-y-2.5 border-t border-[color-mix(in_srgb,#ff9f00_18%,transparent)] pt-4 text-sm">
                        <div className="flex items-baseline justify-between gap-3">
                            <dt className="text-custom-secondary">{t("account.pointsRewards.pointValue")}</dt>
                            <dd className="font-medium text-custom-primary">
                                {value?.point_value ??
                                    t("account.pointsRewards.pointValueFallback", {
                                        points: t("account.pointsRewards.points"),
                                    })}
                            </dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-3">
                            <dt className="text-custom-secondary">{t("account.pointsRewards.estimatedValue")}</dt>
                            <dd className="text-end font-medium text-custom-primary">
                                {value?.estimated_value_formatted ??
                                    t("account.pointsRewards.estimatedValueFallback", {
                                        value: (points * multiplier).toLocaleString(),
                                    })}{" "}
                                {t("account.pointsRewards.inRewards")}
                            </dd>
                        </div>
                    </dl>

                    {nextRewardThreshold != null && (
                        <div className="mt-5 space-y-2">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,#ff9f00_16%,transparent)]">
                                <div
                                    className="h-full rounded-full bg-[#ff9f00] transition-[width] duration-500 ease-out"
                                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                />
                            </div>
                            <p className="text-sm text-custom-secondary">
                                {t("account.pointsRewards.nextRewardAt", {
                                    count: nextRewardThreshold,
                                })}
                            </p>
                        </div>
                    )}
                </>
                )}
            </CalmCardSurface>
        </SectionShell>
    );
}
