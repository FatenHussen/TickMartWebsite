import { DollarSign, Download, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TFunction } from "i18next";

export interface MarketerDashboardHeroBenefit {
    icon: LucideIcon;
    title: string;
    body: string;
}

export function buildMarketerDashboardHeroBenefits(t: TFunction): MarketerDashboardHeroBenefit[] {
    return [
        {
            icon: TrendingUp,
            title: t("marketer.dashboard.heroBenefit1Title", "Performance overview"),
            body: t(
                "marketer.dashboard.heroBenefit1Body",
                "See orders, sales, and commissions in one place.",
            ),
        },
        {
            icon: DollarSign,
            title: t("marketer.dashboard.heroBenefit2Title", "Earnings & balance"),
            body: t(
                "marketer.dashboard.heroBenefit2Body",
                "Track what you have earned and what you can withdraw.",
            ),
        },
        {
            icon: Download,
            title: t("marketer.dashboard.heroBenefit3Title", "Withdraw easily"),
            body: t(
                "marketer.dashboard.heroBenefit3Body",
                "Request a payout whenever you have available balance.",
            ),
        },
    ];
}
