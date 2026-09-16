import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type SectionTone = "default" | "danger";

interface ProfileSectionShellProps {
    children: ReactNode;
    className?: string;
    tone?: SectionTone;
}

export function ProfileSectionShell({
    children,
    className,
    tone = "default",
}: ProfileSectionShellProps) {
    const isDanger = tone === "danger";

    return (
        <section
            className={cn(
                "account-shell relative z-[1] overflow-hidden rounded-2xl border",
                "bg-[var(--color-bg-card)] border-[var(--color-border-primary)]",
                "shadow-[0_2px_12px_-4px_var(--color-shadow)]",
                isDanger && "border-[color-mix(in_srgb,var(--color-ui-red-500)_35%,var(--color-border-primary))]",
                className,
            )}
        >
            <div
                className={
                    isDanger
                        ? "h-1 w-full bg-[#c45c4a]"
                        : "h-1 w-full bg-[#ff9f00]"
                }
                aria-hidden
            />
            <div className="relative z-10 p-6 sm:p-8">{children}</div>
        </section>
    );
}
