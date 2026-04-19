import type { TFunction } from "i18next";
import { HiExclamationCircle } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import { historySectionShellClass } from "../constants";
import { formatPointsRewardDate } from "../utils/formatPointsRewardDate";
import { SectionShell } from "./SectionShell";

const HOW_TO_EARN_BG = "/images/accounts/Expiry.jpeg";

type HowToEarnCardProps = {
    t: TFunction;
    expiry: string;
    earningRules: string[];
};

export function HowToEarnCard({ t, expiry, earningRules }: HowToEarnCardProps) {
    const rules =
        earningRules.length > 0
            ? earningRules
            : [
                  t("account.pointsRewards.howToEarn.placeOrders"),
                  t("account.pointsRewards.howToEarn.joinCampaigns"),
                  t("account.pointsRewards.howToEarn.usePackages"),
              ];

    return (
        <SectionShell
            className={cn(
                historySectionShellClass,
                "relative min-h-[240px] overflow-hidden sm:min-h-[260px]",
            )}
        >
            <div
                className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${HOW_TO_EARN_BG})` }}
                aria-hidden
            />
            <div
                className={cn(
                    "pointer-events-none absolute inset-0",
                    "bg-gradient-to-br from-[var(--color-bg-card)]/90 via-[var(--color-bg-card)]/78 to-[var(--color-ui-orange-100)]/28",
                    "dark:from-[var(--color-bg-card)]/92 dark:via-[var(--color-bg-card)]/82 dark:to-[color-mix(in_srgb,var(--color-ui-orange-900)_35%,transparent)]",
                )}
                aria-hidden
            />
            <div
                className="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full bg-primary-light/10 blur-3xl"
                aria-hidden
            />

            <div className="relative z-10">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-custom-secondary">
                    {t("account.pointsRewards.howToEarn.title")}
                </h2>

                {expiry ? (
                    <div
                        className={cn(
                            "mt-4 flex gap-3 rounded-xl bg-[var(--color-ui-orange-100)]/85 p-4 backdrop-blur-[2px]",
                            "shadow-[0_2px_8px_rgba(234,88,12,0.12),0_4px_16px_rgba(15,23,42,0.06)]",
                            "dark:bg-[color-mix(in_srgb,var(--color-ui-orange-900)_35%,transparent)]",
                            "dark:shadow-[0_2px_10px_rgba(0,0,0,0.35)]",
                        )}
                        role="status"
                    >
                        <HiExclamationCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-ui-orange-500)]" />
                        <p className="text-sm leading-relaxed text-[var(--color-ui-orange-900)] dark:text-[var(--color-ui-orange-200)]">
                            <span className="font-medium">
                                {t("account.pointsRewards.expiry.nextExpiry")}:{" "}
                            </span>
                            {formatPointsRewardDate(expiry)}
                        </p>
                    </div>
                ) : null}

                <ul className="mt-6 space-y-3">
                    {rules.map((rule, idx) => (
                        <li key={idx} className="flex gap-3 text-sm leading-relaxed text-custom-primary">
                            <span
                                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-light"
                                aria-hidden
                            />
                            <span>{rule}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </SectionShell>
    );
}
