import { HiSparkles } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { MARKETER_SPOTLIGHT_BACKGROUND_STYLE } from "@/features/marketer/constants/marketerSpotlightBackground";
import type { BecomeMarketerBenefitItem } from "@/features/marketer/utils/buildBecomeMarketerBenefitItems";

interface BecomeMarketerHeroProps {
    benefitItems: BecomeMarketerBenefitItem[];
}

export function BecomeMarketerHero({ benefitItems }: BecomeMarketerHeroProps) {
    const { t } = useTranslation();

    return (
        <section
            className="relative z-0 mb-8 overflow-hidden rounded-2xl border border-custom-primary/80 bg-custom-card shadow-[0_20px_50px_-14px_color-mix(in_srgb,var(--color-main)_14%,transparent)]"
            aria-labelledby="become-marketer-hero-title"
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.98]"
                style={MARKETER_SPOTLIGHT_BACKGROUND_STYLE}
            />
            <div className="pointer-events-none absolute -right-14 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-[var(--color-main)] opacity-[0.11] blur-3xl" />
            <div className="pointer-events-none absolute -left-8 bottom-0 h-36 w-36 rounded-full bg-[var(--color-api-second)] opacity-[0.22] blur-3xl" />

            <div className="relative p-6 sm:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-custom-primary/55 bg-custom-primary/35 px-3 py-1.5 backdrop-blur-sm">
                    <HiSparkles
                        className="h-4 w-4 shrink-0 text-[var(--color-main)]"
                        aria-hidden
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-api-second)]">
                        {t("marketer.heroEyebrow", "Marketer program")}
                    </span>
                </div>

                <h1
                    id="become-marketer-hero-title"
                    className="mt-5 text-2xl font-bold tracking-tight text-custom-primary sm:text-3xl"
                >
                    {t("marketer.title") || "Become a marketer"}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-api-second)]">
                    {t("marketer.subtitle") ||
                        "Please review and accept the terms before joining the marketer program."}
                </p>

                <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                    {benefitItems.map(({ icon: Icon, title, body }) => (
                        <li
                            key={title}
                            className="rounded-xl border border-custom-primary/50 bg-custom-card/60 p-4 shadow-sm backdrop-blur-[2px]"
                        >
                            <div
                                className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-api-second)_18%,var(--color-bg-card))] text-[var(--color-main)] ring-1 ring-[color-mix(in_srgb,var(--color-api-second)_35%,transparent)]"
                                aria-hidden
                            >
                                <Icon className="h-5 w-5" />
                            </div>
                            <p className="text-sm font-semibold text-[var(--color-api-second)]">{title}</p>
                            <p className="mt-1 text-xs leading-relaxed text-custom-secondary">{body}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
