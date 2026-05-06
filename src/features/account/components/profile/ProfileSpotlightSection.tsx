import { Pencil, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import {
    ADDRESS_FORM_HERO_BACKDROP_STYLE,
    ADDRESS_PAGES_DARK_HERO_BACKDROP_STYLE,
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
            className="account-shell relative z-10 overflow-hidden rounded-3xl border border-[var(--color-border-primary)] bg-[var(--color-bg-card)] shadow-[0_4px_24px_-8px_var(--color-shadow)] transition-shadow duration-300 dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(16,17,20,0.75)] dark:shadow-[0_28px_88px_-32px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.04)] dark:backdrop-blur-xl"
            aria-labelledby="profile-spotlight-title"
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.97] dark:hidden"
                style={ADDRESS_FORM_HERO_BACKDROP_STYLE}
            />
            <div
                className="pointer-events-none absolute inset-0 hidden dark:block"
                style={ADDRESS_PAGES_DARK_HERO_BACKDROP_STYLE}
            />
            <div className="pointer-events-none absolute -right-16 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[var(--color-main)] opacity-[0.08] blur-3xl dark:opacity-[0.045]" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-[var(--color-api-second)] opacity-[0.08] blur-3xl dark:opacity-[0.05]" />

            <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-custom-primary/60 bg-custom-primary/40 px-3 py-1 backdrop-blur-sm dark:border-[rgba(255,255,255,0.08)] dark:bg-[rgba(255,255,255,0.04)]">
                        <Sparkles
                            className="h-4 w-4 shrink-0 text-[var(--color-main)] dark:text-[color-mix(in_srgb,var(--color-main)_58%,#a1a1aa)]"
                            aria-hidden
                        />
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-custom-secondary dark:text-[#71717A]">
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
                        <p className="mt-4 inline-flex flex-wrap items-baseline gap-2 text-base font-medium text-[var(--color-text)] dark:text-[#E4E4E7]">
                            <span className="font-normal text-custom-secondary dark:text-[#A1A1AA]">
                                {t("account.profile.spotlightGreetingPrefix")}
                            </span>
                            <span className="rounded-lg bg-[color-mix(in_srgb,var(--color-api-second)_22%,transparent)] px-2 py-0.5 font-semibold text-custom-primary dark:bg-[color-mix(in_srgb,var(--color-api-second)_14%,rgba(255,255,255,0.04))] dark:text-[#FFFFFF] dark:ring-1 dark:ring-[color-mix(in_srgb,var(--color-api-second)_22%,transparent)]">
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
                        className={cn(
                            API_SECOND_BUTTON_CLASS,
                            "dark:shadow-[0_12px_36px_-18px_color-mix(in_srgb,var(--color-api-second)_35%,transparent)] dark:ring-1 dark:ring-white/[0.06]",
                        )}
                    >
                        <Pencil className="h-4 w-4 shrink-0" aria-hidden />
                        {editProfileLabel}
                    </button>
                </div>
            </div>
        </section>
    );
}
