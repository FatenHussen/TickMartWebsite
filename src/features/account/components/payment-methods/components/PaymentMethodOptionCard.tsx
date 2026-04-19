import type { PaymentMethodOption } from "@/features/cart/types";
import { cn } from "@/shared/lib/utils";

interface PaymentMethodOptionCardProps {
    method: PaymentMethodOption;
    isSelected: boolean;
    showDefaultBadge: boolean;
    defaultBadgeLabel: string;
    onSelect: (methodId: string) => void;
}

const selectedRowClassName =
    "border-[var(--color-api-second)] shadow-sm bg-[color-mix(in_srgb,var(--color-api-second)_14%,var(--color-bg-card))]";

const unselectedRowClassName =
    "border-custom-primary bg-custom-card hover:border-[color-mix(in_srgb,var(--color-api-second)_38%,var(--color-border-primary))]";

export function PaymentMethodOptionCard({
    method,
    isSelected,
    showDefaultBadge,
    defaultBadgeLabel,
    onSelect,
}: PaymentMethodOptionCardProps) {
    const handleRowClick = () => {
        onSelect(method.id);
    };

    return (
        <div
            className={cn(
                "cursor-pointer rounded-2xl border-2 p-4 transition-all",
                isSelected ? selectedRowClassName : unselectedRowClassName,
            )}
            onClick={handleRowClick}
        >
            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-custom-light">
                    {method.icon ? (
                        <img
                            src={method.icon}
                            alt={method.name}
                            className="h-full w-full object-contain"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-custom-muted" />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold leading-tight text-text-primary">
                        {method.name}
                    </p>
                    {method.description ? (
                        <p className="mt-0.5 text-sm text-text-secondary">
                            {method.description}
                        </p>
                    ) : null}
                </div>

                {showDefaultBadge ? (
                    <span className="flex-shrink-0 rounded-full bg-[var(--color-api-second)] px-3 py-1 text-xs font-semibold text-white shadow-sm ring-1 ring-[color-mix(in_srgb,var(--color-api-second)_55%,transparent)]">
                        {defaultBadgeLabel}
                    </span>
                ) : null}

                <div
                    className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                        isSelected
                            ? "border-[var(--color-api-second)] bg-[color-mix(in_srgb,var(--color-api-second)_12%,var(--color-bg-card))]"
                            : "border-custom-secondary bg-custom-card",
                    )}
                    aria-hidden
                >
                    {isSelected ? (
                        <div className="h-3 w-3 rounded-full bg-[var(--color-api-second)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-bg-card)_90%,transparent)]" />
                    ) : null}
                </div>
            </div>
        </div>
    );
}
