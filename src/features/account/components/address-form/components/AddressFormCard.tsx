import type { ReactNode } from "react";

type AddressFormCardProps = {
    children: ReactNode;
};

export function AddressFormCard({ children }: AddressFormCardProps) {
    return (
        <div className="overflow-hidden rounded-3xl border border-custom-primary/80 bg-custom-card shadow-[0_24px_60px_-12px_color-mix(in_srgb,var(--color-main)_12%,transparent)]">
            {children}
        </div>
    );
}
