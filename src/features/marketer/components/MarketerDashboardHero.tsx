import { Download, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MARKETER_SPOTLIGHT_BACKGROUND_STYLE } from "@/features/marketer/constants/marketerSpotlightBackground";
import { API_SECOND_DASHBOARD_BTN } from "@/features/marketer/constants/apiSecondClasses";
import type { MarketerDashboardHeroBenefit } from "@/features/marketer/utils/buildMarketerDashboardHeroBenefits";

interface MarketerDashboardHeroProps {
    benefitItems: MarketerDashboardHeroBenefit[];
    availableBalance: number;
    onRequestWithdraw: () => void;
}

export function MarketerDashboardHero({
    benefitItems,
    availableBalance,
    onRequestWithdraw,
}: MarketerDashboardHeroProps) {
    const { t } = useTranslation();

    const canRequestWithdraw = availableBalance > 0;

    return (
        <section
            className="relative z-0 overflow-hidden rounded-2xl border border-custom-primary/80 bg-custom-card shadow-[0_20px_50px_-14px_color-mix(in_srgb,var(--color-main)_14%,transparent)]"
            aria-labelledby="marketer-dashboard-hero-title"
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.98]"
                style={MARKETER_SPOTLIGHT_BACKGROUND_STYLE}
            />
            <div className="pointer-events-none absolute -right-14 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-[var(--color-main)] opacity-[0.11] blur-3xl" />
            <div className="pointer-events-none absolute -left-8 bottom-0 h-36 w-36 rounded-full bg-[var(--color-api-second)] opacity-[0.22] blur-3xl" />

            <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-2 rounded-full border border-custom-primary/55 bg-custom-primary/35 px-3 py-1.5 backdrop-blur-sm">
                        <Sparkles className="h-4 w-4 shrink-0 text-[var(--color-main)]" aria-hidden />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-api-second)]">
                            {t("marketer.dashboard.heroEyebrow", "Your dashboard")}
                        </span>
                    </div>
                    <h1
                        id="marketer-dashboard-hero-title"
                        className="mt-5 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
                    >
                        {t("marketer.dashboard.title", "Marketer Dashboard")}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-api-second)]">
                        {t("marketer.dashboard.subtitle", "Track your performance and earnings")}
                    </p>

                    <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                        {benefitItems.map(({ icon: Icon, title, body }) => (
                            <li
                                key={title}
                                className="rounded-xl border border-custom-primary/50 bg-custom-card/60 p-3 shadow-sm backdrop-blur-[2px]"
                            >
                                <div
                                    className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--color-api-second)_18%,var(--color-bg-card))] text-[var(--color-main)] ring-1 ring-[color-mix(in_srgb,var(--color-api-second)_35%,transparent)]"
                                    aria-hidden
                                >
                                    <Icon className="h-4 w-4" />
                                </div>
                                <p className="text-xs font-semibold text-[var(--color-api-second)]">{title}</p>
                                <p className="mt-0.5 text-[11px] leading-relaxed text-text-secondary">{body}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {canRequestWithdraw && (
                    <button
                        type="button"
                        onClick={onRequestWithdraw}
                        className={`${API_SECOND_DASHBOARD_BTN} w-full shrink-0 lg:w-auto lg:self-start`}
                    >
                        <Download className="h-5 w-5 shrink-0" aria-hidden />
                        {t("marketer.dashboard.requestWithdraw", "Request Withdraw")}
                    </button>
                )}
            </div>
        </section>
    );
}
