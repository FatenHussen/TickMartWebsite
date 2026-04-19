import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type HelpSupportSectionCardProps = {
    children: ReactNode;
};

export function HelpSupportSectionCard({ children }: HelpSupportSectionCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-3xl",
                "bg-gradient-to-b from-custom-card via-custom-card to-blue-off/[0.35] dark:to-primary/[0.06]",
                "shadow-[0_1px_0_0_rgba(255,255,255,0.55)_inset,0_8px_32px_-8px_color-mix(in_srgb,var(--color-primary)_18%,transparent)]",
                "dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_16px_48px_-14px_color-mix(in_srgb,var(--color-primary)_26%,transparent)]",
                "after:pointer-events-none after:absolute after:inset-0 after:-z-0 after:rounded-3xl",
                "after:bg-[radial-gradient(900px_circle_at_100%_-20%,color-mix(in_srgb,var(--color-primary)_12%,transparent),transparent_55%)]",
                "dark:after:bg-[radial-gradient(800px_circle_at_100%_0%,color-mix(in_srgb,var(--color-primary)_14%,transparent),transparent_50%)]"
            )}
        >
            <div className="relative z-[2] p-6 sm:p-7">{children}</div>
        </div>
    );
}
