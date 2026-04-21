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
                "relative z-[1] overflow-hidden rounded-2xl border border-custom-primary shadow-sm",
                "bg-gradient-to-br from-[var(--color-bg-card)] via-[color-mix(in_srgb,var(--color-bg-secondary)_45%,var(--color-bg-card))] to-[var(--color-bg-secondary)]",
                className,
            )}
        >
            <div
                className={
                    isDanger
                        ? "h-1.5 w-full bg-gradient-to-r from-[var(--color-ui-red-500)] via-[color-mix(in_srgb,var(--color-ui-red-400)_75%,var(--color-bg-secondary))] to-[var(--color-bg-secondary)]"
                        : "h-1.5 w-full bg-gradient-to-r from-primary via-[color-mix(in_srgb,var(--color-primary-light)_55%,var(--color-bg-secondary))] to-[var(--color-bg-secondary)]"
                }
                aria-hidden
            />
            <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                aria-hidden
            >
                {isDanger ? (
                    <>
                        <div className="absolute -top-20 -end-20 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--color-ui-red-500)_14%,var(--color-bg-secondary))] blur-3xl" />
                        <div className="absolute -bottom-16 -start-12 h-44 w-44 rounded-full bg-[color-mix(in_srgb,var(--color-ui-red-500)_8%,var(--color-bg-secondary))] blur-2xl" />
                        <div className="absolute inset-0 bg-gradient-to-br from-[color-mix(in_srgb,var(--color-ui-red-500)_8%,var(--color-bg-card))] via-transparent to-[color-mix(in_srgb,var(--color-bg-secondary)_28%,var(--color-bg-card))]" />
                    </>
                ) : (
                    <>
                        <div className="absolute -top-20 -end-20 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_16%,var(--color-bg-secondary))] blur-3xl" />
                        <div className="absolute -bottom-16 -start-12 h-44 w-44 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_9%,var(--color-bg-secondary))] blur-2xl" />
                        <div className="absolute inset-0 bg-gradient-to-br from-[color-mix(in_srgb,var(--color-primary)_6%,var(--color-bg-card))] via-transparent to-[color-mix(in_srgb,var(--color-bg-secondary)_14%,transparent)]" />
                    </>
                )}
            </div>
            <div className="relative z-10 p-6 sm:p-8">{children}</div>
        </section>
    );
}
