import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { dashboardCardClass } from "../constants";

type SectionShellProps = {
    children: ReactNode;
    className?: string;
    padding?: "md" | "lg";
};

const paddingClass = {
    md: "p-5 sm:p-6",
    lg: "p-6 sm:p-8",
};

export function SectionShell({
    children,
    className,
    padding = "md",
}: SectionShellProps) {
    return (
        <section
            className={cn(
                dashboardCardClass,
                paddingClass[padding],
                className,
            )}
        >
            {children}
        </section>
    );
}
