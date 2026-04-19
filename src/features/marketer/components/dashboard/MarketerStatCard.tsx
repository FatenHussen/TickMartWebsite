import type { ElementType } from "react";

export interface MarketerStatCardProps {
    icon: ElementType;
    label: string;
    value: string | number;
    color: string;
    subLabel?: string;
}

export function MarketerStatCard({ icon: Icon, label, value, color, subLabel }: MarketerStatCardProps) {
    return (
        <div className="flex items-start gap-4 rounded-2xl border border-custom-primary bg-custom-card p-5 shadow-sm">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0">
                <p className="mb-1 truncate text-sm text-text-secondary">{label}</p>
                <p className="text-xl font-bold text-text-primary">{value}</p>
                {subLabel && <p className="mt-0.5 text-xs text-text-secondary">{subLabel}</p>}
            </div>
        </div>
    );
}
