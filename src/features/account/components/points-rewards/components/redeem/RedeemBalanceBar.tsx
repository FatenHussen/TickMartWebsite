import type { TFunction } from "i18next";
import { HiLightningBolt, HiSparkles } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";

type RedeemBalanceBarProps = {
    t: TFunction;
    userPoints: number;
    affordableCount: number;
    totalCount: number;
};

export function RedeemBalanceBar({
    t,
    userPoints,
    affordableCount,
    totalCount,
}: RedeemBalanceBarProps) {
    const pointsWord = t("account.pointsRewards.points");

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl",
                "bg-gradient-to-r from-primary-light/[0.10] via-custom-card to-[var(--color-ui-orange-100)]/35",
                "px-5 py-4 sm:px-6 sm:py-5",
                "shadow-[0_2px_4px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]",
                "dark:shadow-[0_2px_4px_rgba(0,0,0,0.4),0_10px_28px_rgba(0,0,0,0.45)]",
                "dark:to-[color-mix(in_srgb,var(--color-ui-orange-900)_15%,transparent)]",
            )}
        >
            <div className="pointer-events-none absolute -right-6 -top-10 h-32 w-32 rounded-full bg-primary-light/20 blur-3xl" />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-light to-[var(--color-ui-orange-500)] text-white shadow-lg shadow-primary-light/30">
                        <HiLightningBolt className="h-6 w-6" />
                    </span>
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-custom-secondary">
                            {t("account.pointsRewards.redeem.balanceBar.label", "Available balance")}
                        </p>
                        <p className="text-xl font-bold tabular-nums leading-tight text-custom-primary sm:text-2xl">
                            {userPoints.toLocaleString()}{" "}
                            <span className="text-sm font-semibold text-primary-light">{pointsWord}</span>
                        </p>
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 self-start rounded-2xl bg-white/80 px-4 py-2.5 text-sm shadow-md shadow-black/[0.05] dark:bg-custom-card/90 dark:shadow-black/30 sm:self-auto">
                    <HiSparkles className="h-4 w-4 shrink-0 text-primary-light" aria-hidden />
                    <span className="text-custom-secondary">
                        {t(
                            "account.pointsRewards.redeem.balanceBar.affordable",
                            "Ready to redeem now:",
                        )}
                    </span>
                    <span className="font-bold tabular-nums text-custom-primary">
                        {affordableCount}/{totalCount}
                    </span>
                </div>
            </div>
        </div>
    );
}
