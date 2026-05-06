import type { ReactNode } from "react";

type AddressFormCardProps = {
    children: ReactNode;
};

export function AddressFormCard({ children }: AddressFormCardProps) {
    return (
        <div
            className="overflow-hidden rounded-3xl border border-custom-primary/80 bg-custom-card shadow-[0_24px_60px_-12px_color-mix(in_srgb,var(--color-main)_12%,transparent)] transition-shadow duration-300 dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(16,17,20,0.75)] dark:shadow-[0_24px_80px_-28px_rgba(0,0,0,0.72),inset_0_1px_0_0_rgba(255,255,255,0.04)] dark:backdrop-blur-xl dark:hover:shadow-[0_28px_90px_-26px_rgba(0,0,0,0.78),inset_0_1px_0_0_rgba(255,255,255,0.05)]"
        >
            {children}
        </div>
    );
}
