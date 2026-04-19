import { HiPencil, HiSparkles } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { API_SECOND_BUTTON_CLASS } from "./apiPaletteClasses";

interface ProfileSpotlightSectionProps {
    userName: string;
    title: string;
    subtitle: string;
    editProfileLabel: string;
    onToggleEditMode: () => void;
}

export function ProfileSpotlightSection({
    userName,
    title,
    subtitle,
    editProfileLabel,
    onToggleEditMode,
}: ProfileSpotlightSectionProps) {
    const { t } = useTranslation();
    const firstName = userName.trim().split(/\s+/)[0] || userName;

    return (
        <section
            className="relative z-10 overflow-hidden rounded-3xl border border-custom-primary/80 bg-custom-card shadow-[0_24px_60px_-12px_color-mix(in_srgb,var(--color-main)_12%,transparent)]"
            aria-labelledby="profile-spotlight-title"
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.97]"
                style={{
                    background: `
            radial-gradient(ellipse 90% 80% at 0% 0%, color-mix(in srgb, var(--color-main) 28%, transparent), transparent 55%),
            radial-gradient(ellipse 70% 60% at 100% 10%, color-mix(in srgb, var(--color-api-second) 35%, transparent), transparent 50%),
            radial-gradient(ellipse 50% 45% at 80% 100%, color-mix(in srgb, var(--color-main) 18%, transparent), transparent 55%),
            linear-gradient(165deg, var(--color-bg-card) 0%, color-mix(in srgb, var(--color-bg-card) 92%, var(--color-api-second)) 100%)
          `,
                }}
            />
            <div className="pointer-events-none absolute -right-16 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[var(--color-main)] opacity-[0.12] blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-[var(--color-api-second)] opacity-20 blur-3xl" />

            <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-custom-primary/60 bg-custom-primary/40 px-3 py-1 backdrop-blur-sm">
                        <HiSparkles
                            className="h-4 w-4 shrink-0 text-[var(--color-main)]"
                            aria-hidden
                        />
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-custom-secondary">
                            {t("account.profile.spotlightEyebrow")}
                        </span>
                    </div>

                    <div>
                        <h1
                            id="profile-spotlight-title"
                            className="text-2xl font-bold tracking-tight text-custom-primary sm:text-3xl"
                        >
                            {title}
                        </h1>
                        <p className="mt-1 max-w-xl text-sm leading-relaxed text-custom-secondary">
                            {subtitle}
                        </p>
                        <p className="mt-4 inline-flex flex-wrap items-baseline gap-2 text-base font-medium text-[var(--color-text)]">
                            <span className="text-custom-secondary font-normal">
                                {t("account.profile.spotlightGreetingPrefix")}
                            </span>
                            <span
                                className="rounded-lg px-2 py-0.5 font-semibold text-custom-primary"
                                style={{
                                    backgroundColor:
                                        "color-mix(in srgb, var(--color-api-second) 22%, transparent)",
                                }}
                            >
                                {firstName}
                            </span>
                            <span className="text-custom-secondary text-sm font-normal">
                                {t("account.profile.spotlightGreetingSuffix")}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0 lg:justify-end">
                    <button
                        type="button"
                        onClick={onToggleEditMode}
                        className={API_SECOND_BUTTON_CLASS}
                    >
                        <HiPencil className="h-4 w-4 shrink-0" aria-hidden />
                        {editProfileLabel}
                    </button>
                </div>
            </div>
        </section>
    );
}
