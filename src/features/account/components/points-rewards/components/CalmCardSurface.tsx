import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type CalmCardSurfaceProps = {
    children: ReactNode;
    className?: string;
    imageSrc: string;
};

export function CalmCardSurface({ children, className, imageSrc }: CalmCardSurfaceProps) {
    return (
        <div
            className={cn(
                "relative grid min-h-[280px] overflow-hidden bg-[var(--color-bg-card)] sm:grid-cols-[1fr_minmax(9.5rem,38%)]",
                className,
            )}
        >
            <div className="relative z-10 p-5 sm:p-6">{children}</div>
            <div
                className="relative min-h-[7.5rem] bg-cover bg-center bg-no-repeat sm:min-h-full"
                style={{ backgroundImage: `url(${imageSrc})` }}
                aria-hidden
            >
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(255_255_255/0.18),transparent_40%)] sm:bg-[linear-gradient(to_left,transparent_20%,rgb(255_255_255/0.12))] sm:rtl:bg-[linear-gradient(to_right,transparent_20%,rgb(255_255_255/0.12))] dark:bg-[linear-gradient(to_bottom,rgb(0_0_0/0.2),transparent_45%)]" />
            </div>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#ff9f00]" aria-hidden />
        </div>
    );
}
