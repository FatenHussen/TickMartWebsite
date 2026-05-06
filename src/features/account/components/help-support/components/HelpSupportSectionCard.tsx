import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type HelpSupportSectionCardProps = {
    children: ReactNode;
};

export function HelpSupportSectionCard({ children }: HelpSupportSectionCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-3xl border border-transparent transition-shadow duration-300",
                "bg-gradient-to-b from-custom-card via-custom-card to-blue-off/[0.35]",
                "shadow-[0_1px_0_0_rgba(255,255,255,0.55)_inset,0_8px_32px_-8px_color-mix(in_srgb,var(--color-primary)_18%,transparent)]",
                "dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(16,17,20,0.75)] dark:bg-none dark:backdrop-blur-xl",
                "dark:shadow-[0_24px_72px_-28px_rgba(0,0,0,0.72),inset_0_1px_0_0_rgba(255,255,255,0.04)]",
                "after:pointer-events-none after:absolute after:inset-0 after:-z-0 after:rounded-3xl",
                "after:bg-[radial-gradient(900px_circle_at_100%_-20%,color-mix(in_srgb,var(--color-primary)_12%,transparent),transparent_55%)]",
                "dark:after:bg-[radial-gradient(780px_circle_at_92%_-10%,color-mix(in_srgb,var(--color-main)_8%,transparent),transparent_52%)]",
            )}
        >
            <div className="relative z-[2] p-6 sm:p-7">{children}</div>
        </div>
    );
}
