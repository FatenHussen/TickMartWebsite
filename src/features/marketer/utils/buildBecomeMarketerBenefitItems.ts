import type { LucideIcon } from "lucide-react";
import { Sparkles, TrendingUp, Users } from "lucide-react";
import type { TFunction } from "i18next";

export interface BecomeMarketerBenefitItem {
    icon: LucideIcon;
    title: string;
    body: string;
}

export function buildBecomeMarketerBenefitItems(t: TFunction): BecomeMarketerBenefitItem[] {
    return [
        {
            icon: TrendingUp,
            title: t("marketer.heroBenefit1Title", "Grow your income"),
            body: t(
                "marketer.heroBenefit1Body",
                "Turn your network into rewards with a clear, fair structure.",
            ),
        },
        {
            icon: Users,
            title: t("marketer.heroBenefit2Title", "Built for creators"),
            body: t(
                "marketer.heroBenefit2Body",
                "Share Tikmool with people who trust your voice.",
            ),
        },
        {
            icon: Sparkles,
            title: t("marketer.heroBenefit3Title", "Quick onboarding"),
            body: t(
                "marketer.heroBenefit3Body",
                "Review the terms, tap agree, and we handle the rest.",
            ),
        },
    ];
}
