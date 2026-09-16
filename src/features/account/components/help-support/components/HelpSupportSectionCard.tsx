import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type HelpSupportSectionCardProps = {
    children: ReactNode;
};

export function HelpSupportSectionCard({ children }: HelpSupportSectionCardProps) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-card)]",
                "shadow-[0_2px_12px_-4px_var(--color-shadow)]",
                "dark:border-[rgba(255,255,255,0.1)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.4)]",
            )}
        >
            <div className="p-5 sm:p-6">{children}</div>
        </div>
    );
}
