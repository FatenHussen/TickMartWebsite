import { Pencil, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
    ADDRESS_FORM_HERO_BACKDROP_STYLE,
} from "../address-form/constants";
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
            className="account-shell relative z-10 overflow-hidden rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-card)] shadow-[0_2px_12px_-4px_var(--color-shadow)]"
            aria-labelledby="profile-spotlight-title"
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.97] dark:hidden"
                style={ADDRESS_FORM_HERO_BACKDROP_STYLE}
            />

            <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-custom-primary/60 bg-custom-primary/40 px-3 py-1 dark:border-white/12 dark:bg-[#2A2622]">
                        <Sparkles
                            className="h-4 w-4 shrink-0 text-[var(--color-main)] dark:text-[#ff9f00]"
                            aria-hidden
                        />
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-custom-secondary dark:text-[#C9C2B6]">
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
                        <p className="mt-4 inline-flex flex-wrap items-baseline gap-2 text-base font-medium text-[var(--color-text)] dark:text-[#F3EFE8]">
                            <span className="font-normal text-custom-secondary dark:text-[#C9C2B6]">
                                {t("account.profile.spotlightGreetingPrefix")}
                            </span>
                            <span className="rounded-lg bg-[#ff9f00]/15 px-2 py-0.5 font-semibold text-custom-primary dark:text-[#F3EFE8]">
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
                        <Pencil className="h-4 w-4 shrink-0" aria-hidden />
                        {editProfileLabel}
                    </button>
                </div>
            </div>
        </section>
    );
}
