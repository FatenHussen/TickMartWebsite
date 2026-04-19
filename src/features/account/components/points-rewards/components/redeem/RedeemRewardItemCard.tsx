import type { TFunction } from "i18next";
import { HiCheckCircle, HiLockClosed } from "react-icons/hi";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { redeemApiSecondButtonClass } from "../../constants";
import type { RewardCategory, RewardItem } from "../../types";

type RedeemRewardItemCardProps = {
    t: TFunction;
    item: RewardItem;
    userPoints: number;
};

const CATEGORY_THEME: Record<
    RewardCategory,
    { iconWrap: string; chip: string }
> = {
    discount: {
        iconWrap: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
        chip: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
    },
    delivery: {
        iconWrap: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
        chip: "bg-sky-500/15 text-sky-800 dark:text-sky-200",
    },
    gift: {
        iconWrap: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
        chip: "bg-amber-500/15 text-amber-900 dark:text-amber-200",
    },
};

export function RedeemRewardItemCard({ t, item, userPoints }: RedeemRewardItemCardProps) {
    const Icon = item.icon;
    const theme = CATEGORY_THEME[item.category];

    const canAfford = userPoints >= item.cost;
    const progress = Math.min(100, (userPoints / item.cost) * 100);
    const pointsNeeded = Math.max(0, item.cost - userPoints);
    const pointsWord = t("account.pointsRewards.points");

    const isDisabled = !item.isAvailable || !canAfford || item.isPending || !item.onAction;

    return (
        <article
            className={cn(
                "group flex flex-col rounded-2xl bg-custom-card p-5 sm:p-6",
                "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_16px_rgba(15,23,42,0.06)]",
                "dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_6px_20px_rgba(0,0,0,0.35)]",
                "transition-all duration-300 ease-out",
                "hover:-translate-y-0.5",
                "hover:shadow-[0_4px_8px_rgba(15,23,42,0.06),0_12px_28px_rgba(15,23,42,0.10)]",
                "dark:hover:shadow-[0_4px_10px_rgba(0,0,0,0.45),0_16px_36px_rgba(0,0,0,0.45)]",
                !canAfford && "opacity-95",
            )}
        >
            <div className="flex items-start gap-4">
                <div
                    className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14",
                        theme.iconWrap,
                    )}
                    aria-hidden
                >
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="text-base font-bold leading-snug text-custom-primary sm:text-lg">
                        {item.title}
                    </h3>
                    {item.description ? (
                        <p className="text-sm leading-relaxed text-custom-secondary line-clamp-2">
                            {item.description}
                        </p>
                    ) : null}
                </div>

                <span
                    className={cn(
                        "hidden shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex",
                        theme.chip,
                    )}
                    title={item.rewardLabel}
                >
                    {item.rewardLabel}
                </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-custom-muted/40 p-4 sm:grid-cols-2 sm:items-center">
                <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-custom-secondary">
                        {t("account.pointsRewards.redeem.itemCard.cost", "Cost")}
                    </p>
                    <p className="text-base font-bold tabular-nums text-custom-primary">
                        {item.costLabel}
                    </p>
                    {item.detailLabel ? (
                        <p className="text-xs text-custom-secondary">{item.detailLabel}</p>
                    ) : null}
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-custom-secondary">
                            {t("account.pointsRewards.redeem.itemCard.yourBalance", "Your balance")}
                        </p>
                        <p
                            className={cn(
                                "text-xs font-semibold tabular-nums",
                                canAfford ? "text-emerald-700 dark:text-emerald-400" : "text-custom-secondary",
                            )}
                        >
                            {Math.min(userPoints, item.cost).toLocaleString()} / {item.cost.toLocaleString()}
                        </p>
                    </div>
                    <div
                        className="h-2 w-full overflow-hidden rounded-full bg-custom-card"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={item.cost}
                        aria-valuenow={Math.min(userPoints, item.cost)}
                    >
                        <div
                            className={cn(
                                "h-full rounded-full transition-[width] duration-500 ease-out",
                                canAfford
                                    ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                                    : "bg-gradient-to-r from-primary-light/70 to-[var(--color-ui-orange-500)]/70",
                            )}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p
                        className={cn(
                            "flex items-center gap-1 text-xs font-medium",
                            canAfford ? "text-emerald-700 dark:text-emerald-400" : "text-custom-secondary",
                        )}
                    >
                        {canAfford ? (
                            <>
                                <HiCheckCircle className="h-3.5 w-3.5" />
                                {t("account.pointsRewards.redeem.itemCard.eligible", "Ready to redeem")}
                            </>
                        ) : (
                            <>
                                <HiLockClosed className="h-3.5 w-3.5" />
                                {pointsNeeded.toLocaleString()}{" "}
                                {t(
                                    "account.pointsRewards.redeem.itemCard.morePointsToUnlock",
                                    `more ${pointsWord} to unlock`,
                                )}
                            </>
                        )}
                    </p>
                </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span
                    className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold sm:hidden",
                        theme.chip,
                    )}
                >
                    {item.rewardLabel}
                </span>
                <Button
                    variant="primary"
                    size="sm"
                    disabled={isDisabled}
                    onClick={item.onAction}
                    className={cn(
                        redeemApiSecondButtonClass,
                        "rounded-xl px-5 py-2.5 sm:ms-auto sm:w-auto",
                        "w-full",
                    )}
                >
                    {item.isPending ? t("common.loadingShort") : item.actionLabel}
                </Button>
            </div>
        </article>
    );
}
