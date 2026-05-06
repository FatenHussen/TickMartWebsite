import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type HelpSupportSectionHeaderProps = {
    icon: ReactNode;
    title: string;
    subtitle: string;
    /** Optional right-side control (e.g. primary CTA) */
    action?: ReactNode;
    className?: string;
};

export function HelpSupportSectionHeader({
    icon,
    title,
    subtitle,
    action,
    className,
}: HelpSupportSectionHeaderProps) {
    return (
        <div
            className={cn(
                "mb-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between",
                className
            )}
        >
            <div className="flex gap-4 min-w-0">
                <div
                    className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                        "bg-gradient-to-br from-primary/[0.2] to-[var(--color-api-second)]/[0.28]",
                        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.42),0_10px_36px_-10px_color-mix(in_srgb,var(--color-primary)_32%,transparent)]",
                        "dark:bg-[color-mix(in_srgb,var(--color-main)_10%,rgba(255,255,255,0.04))] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_0_28px_-8px_color-mix(in_srgb,var(--color-main)_22%,transparent)]",
                    )}
                >
                    {icon}
                </div>
                <div className="min-w-0 pt-0.5">
                    <h2 className="text-xl font-bold tracking-tight text-custom-primary dark:text-[#FFFFFF]">{title}</h2>
                    <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-custom-secondary dark:text-[#A1A1AA]">
                        {subtitle}
                    </p>
                </div>
            </div>
            {action ? <div className="shrink-0 sm:pt-0.5">{action}</div> : null}
        </div>
    );
}
