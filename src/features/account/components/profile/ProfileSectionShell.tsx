import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface ProfileSectionShellProps {
    children: ReactNode;
    className?: string;
}

export function ProfileSectionShell({ children, className }: ProfileSectionShellProps) {
    return (
        <section
            className={cn(
                "relative z-10 rounded-2xl border border-custom-primary bg-custom-card p-6 shadow-sm",
                className,
            )}
        >
            {children}
        </section>
    );
}
