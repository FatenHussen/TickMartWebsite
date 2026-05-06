import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type SectionTone = "default" | "danger";

interface ProfileSectionShellProps {
    children: ReactNode;
    className?: string;
    /** `danger` adds a red-tinted accent strip and orbs (e.g. logout). */
    tone?: SectionTone;
}

/**
 * Profile card shell. Surfaces API `second_color` via `--color-bg-card`,
 * `--color-bg-secondary` (see themeColors / useThemeFromApi).
 */
export function ProfileSectionShell({
    children,
    className,
    tone = "default",
}: ProfileSectionShellProps) {
    const isDanger = tone === "danger";

    return (
        <section
            className={cn(
                "account-shell relative z-[1] overflow-hidden rounded-3xl border transition-shadow duration-300",
                "bg-gradient-to-br from-[var(--color-bg-card)] via-[color-mix(in_srgb,var(--color-bg-secondary)_45%,var(--color-bg-card))] to-[var(--color-bg-secondary)]",
                "border-[var(--color-border-primary)]",
                "shadow-[0_4px_24px_-8px_var(--color-shadow)] dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(16,17,20,0.75)] dark:bg-none dark:shadow-[0_20px_56px_-26px_rgba(0,0,0,0.68),inset_0_1px_0_0_rgba(255,255,255,0.04)] dark:backdrop-blur-xl",
                className,
            )}
        >
            <div
                className={
                    isDanger
                        ? "h-1 w-full bg-gradient-to-r from-[var(--color-ui-red-500)]/90 via-[color-mix(in_srgb,var(--color-ui-red-400)_45%,transparent)] to-transparent dark:from-[color-mix(in_srgb,var(--color-ui-red-500)_55%,transparent)] dark:via-[color-mix(in_srgb,var(--color-ui-red-500)_18%,transparent)]"
                        : "h-1 w-full bg-gradient-to-r from-primary via-[color-mix(in_srgb,var(--color-primary-light)_55%,var(--color-bg-secondary))] to-[var(--color-bg-secondary)] dark:from-[color-mix(in_srgb,var(--color-main)_45%,transparent)] dark:via-[color-mix(in_srgb,var(--color-api-second)_28%,transparent)] dark:to-transparent"
                }
                aria-hidden
            />
            <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                aria-hidden
            >
                {isDanger ? (
                    <>
                        <div className="absolute -end-20 -top-20 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--color-ui-red-500)_14%,var(--color-bg-secondary))] blur-3xl dark:opacity-40" />
                        <div className="absolute -bottom-16 -start-12 h-44 w-44 rounded-full bg-[color-mix(in_srgb,var(--color-ui-red-500)_8%,var(--color-bg-secondary))] blur-2xl dark:opacity-35" />
                        <div className="absolute inset-0 bg-gradient-to-br from-[color-mix(in_srgb,var(--color-ui-red-500)_8%,var(--color-bg-card))] via-transparent to-[color-mix(in_srgb,var(--color-bg-secondary)_28%,var(--color-bg-card))] dark:opacity-50" />
                    </>
                ) : (
                    <>
                        <div className="absolute -end-20 -top-20 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_16%,var(--color-bg-secondary))] blur-3xl dark:bg-[color-mix(in_srgb,var(--color-main)_8%,transparent)] dark:opacity-60" />
                        <div className="absolute -bottom-16 -start-12 h-44 w-44 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_9%,var(--color-bg-secondary))] blur-2xl dark:bg-[color-mix(in_srgb,var(--color-api-second)_6%,transparent)] dark:opacity-50" />
                        <div className="absolute inset-0 bg-gradient-to-br from-[color-mix(in_srgb,var(--color-primary)_6%,var(--color-bg-card))] via-transparent to-[color-mix(in_srgb,var(--color-bg-secondary)_14%,transparent)] dark:from-[color-mix(in_srgb,var(--color-main)_4%,rgba(16,17,20,0.5))] dark:via-transparent dark:to-transparent" />
                    </>
                )}
            </div>
            <div className="relative z-10 p-6 sm:p-8">{children}</div>
        </section>
    );
}
