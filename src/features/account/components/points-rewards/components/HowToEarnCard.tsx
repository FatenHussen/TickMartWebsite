import type { TFunction } from "i18next";
import { Gift } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import { historySectionShellClass } from "../constants";
import { formatPointsRewardDate } from "../utils/formatPointsRewardDate";
import { CalmCardSurface } from "./CalmCardSurface";
import { SectionShell } from "./SectionShell";

type HowToEarnCardProps = {
    t: TFunction;
    expiry: string;
    earningRules: string[];
};

export function HowToEarnCard({ t, expiry, earningRules }: HowToEarnCardProps) {
    const { language } = useLanguage();
    const rules =
        earningRules.length > 0
            ? earningRules
            : [
                  t("account.pointsRewards.howToEarn.placeOrders"),
                  t("account.pointsRewards.howToEarn.joinCampaigns"),
                  t("account.pointsRewards.howToEarn.usePackages"),
              ];

    const dateLocale = language === "ar" ? "ar-SA" : "en-GB";

    return (
        <SectionShell
            className={cn(historySectionShellClass, "overflow-hidden bg-transparent p-0")}
        >
            <CalmCardSurface imageSrc="/images/points/points_2.jpeg">
            <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold text-custom-primary">
                    {t("account.pointsRewards.howToEarn.title")}
                </h2>
                <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff9f00]"
                    aria-hidden
                >
                    <Gift className="h-5 w-5 text-white" strokeWidth={2} />
                </span>
            </div>

            {expiry ? (
                <p
                    className="mt-4 rounded-lg bg-[color-mix(in_srgb,#ff9f00_10%,transparent)] px-3 py-2.5 text-sm text-custom-primary"
                    role="status"
                >
                    <span className="font-medium">
                        {t("account.pointsRewards.expiry.nextExpiry")}:{" "}
                    </span>
                    {formatPointsRewardDate(expiry, dateLocale)}
                </p>
            ) : null}

            <ul className="mt-5 space-y-2.5">
                {rules.map((rule, idx) => (
                    <li key={idx} className="flex gap-3 text-sm leading-relaxed text-custom-primary">
                        <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff9f00]"
                            aria-hidden
                        />
                        <span>{rule}</span>
                    </li>
                ))}
            </ul>
            </CalmCardSurface>
        </SectionShell>
    );
}
