import { cn } from "@/shared/lib/utils";
import type { CategoryDetail } from "../types/productDetails";

export interface CategoryDetailsTableProps {
    details: CategoryDetail[];
    className?: string;
}

export default function CategoryDetailsTable({
    details,
    className,
}: CategoryDetailsTableProps) {
    if (!details || details.length === 0) {
        return null;
    }

    return (
        <div
            className={cn(
                "overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--color-api-second)_18%,var(--color-border-primary))] bg-custom-card dark:border-white/[0.08]",
                className,
            )}
        >
            <dl className="divide-y divide-black/6 dark:divide-white/8">
                {details.map((detail) => (
                    <div
                        key={detail.id}
                        className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] items-baseline gap-x-4 gap-y-1 px-4 py-3.5 transition-colors hover:bg-[color-mix(in_srgb,var(--color-api-second)_5%,transparent)] sm:px-5 sm:py-4 dark:hover:bg-white/[0.025]"
                    >
                        <dt className="min-w-0 text-sm font-medium text-custom-secondary">
                            {detail.name}
                        </dt>
                        <dd className="min-w-0 text-end text-sm font-semibold tracking-tight text-text-primary sm:text-[0.9375rem]">
                            {detail.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
