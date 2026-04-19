import type { IconType } from "react-icons";
import { HiSparkles, HiTrendingUp, HiUsers } from "react-icons/hi";
import type { TFunction } from "i18next";

export interface BecomeMarketerBenefitItem {
    icon: IconType;
    title: string;
    body: string;
}

export function buildBecomeMarketerBenefitItems(t: TFunction): BecomeMarketerBenefitItem[] {
    return [
        {
            icon: HiTrendingUp,
            title: t("marketer.heroBenefit1Title", "Grow your income"),
            body: t(
                "marketer.heroBenefit1Body",
                "Turn your network into rewards with a clear, fair structure.",
            ),
        },
        {
            icon: HiUsers,
            title: t("marketer.heroBenefit2Title", "Built for creators"),
            body: t(
                "marketer.heroBenefit2Body",
                "Share Tikmool with people who trust your voice.",
            ),
        },
        {
            icon: HiSparkles,
            title: t("marketer.heroBenefit3Title", "Quick onboarding"),
            body: t(
                "marketer.heroBenefit3Body",
                "Review the terms, tap agree, and we handle the rest.",
            ),
        },
    ];
}
