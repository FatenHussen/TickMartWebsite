import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type MyReviewCardShellProps = {
    children: ReactNode;
    className?: string;
};

/**
 * Decorative wrapper for each review row on the My reviews page (compact cards).
 * Gradient mesh, soft glow, and leading accent — no outer border (shadow only).
 */
export default function MyReviewCardShell({
    children,
    className,
}: MyReviewCardShellProps) {
    return (
        <article
            className={cn(
                "group relative overflow-hidden rounded-2xl",
                "bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-api-second)_10%,var(--color-bg-card))_0%,var(--color-bg-card)_48%,color-mix(in_srgb,var(--color-main)_8%,var(--color-bg-card))_100%)]",
                "border border-[var(--color-border-primary)]",
                "shadow-[0_4px_20px_-8px_rgba(0,0,0,0.15)] dark:shadow-[0_6px_24px_-6px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)]",
                "transition-[transform,box-shadow] duration-300 ease-out",
                "hover:-translate-y-0.5 hover:shadow-[0_8px_32px_-8px_color-mix(in_srgb,var(--color-api-second)_18%,rgba(0,0,0,0.3))]",
                className,
            )}
        >
            <div
                className="pointer-events-none absolute -end-10 -top-14 h-36 w-36 rounded-full bg-[var(--color-api-second)] opacity-[0.08] blur-3xl transition-opacity duration-500 group-hover:opacity-[0.12]"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute -bottom-12 -start-8 h-28 w-40 rounded-full bg-[var(--color-main)] opacity-[0.05] blur-3xl"
                aria-hidden
            />

            <div
                className={cn(
                    "pointer-events-none absolute start-0 top-4 bottom-4 w-[3px] rounded-full",
                    "bg-gradient-to-b from-[var(--color-api-second)] via-[var(--color-main)] to-[var(--color-api-second)]",
                    "opacity-90 shadow-[0_0_12px_color-mix(in_srgb,var(--color-api-second)_45%,transparent)]",
                )}
                aria-hidden
            />

            <div className="relative px-4 py-4 ps-6 sm:px-6 sm:py-5 sm:ps-7">
                {children}
            </div>
        </article>
    );
}
