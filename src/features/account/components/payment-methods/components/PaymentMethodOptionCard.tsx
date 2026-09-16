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
    "border-[#ff9f00] bg-[color-mix(in_srgb,#ff9f00_10%,var(--color-bg-card))]";

const unselectedRowClassName =
    "border-[var(--color-border-primary)] bg-[var(--color-bg-card)] hover:border-[#ff9f00]/40";

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
                "cursor-pointer rounded-2xl border p-4 transition-all",
                isSelected ? selectedRowClassName : unselectedRowClassName,
            )}
            onClick={handleRowClick}
        >
            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f6efe4] dark:bg-[color-mix(in_srgb,#ff9f00_18%,#2A2622)]">
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
                    <span className="flex-shrink-0 rounded-full bg-cta px-3 py-1 text-xs font-semibold text-white">
                        {defaultBadgeLabel}
                    </span>
                ) : null}

                <div
                    className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                        isSelected
                            ? "border-[#ff9f00] bg-[#ff9f00]/15"
                            : "border-custom-secondary bg-custom-card",
                    )}
                    aria-hidden
                >
                    {isSelected ? (
                        <div className="h-3 w-3 rounded-full bg-[#ff9f00]" />
                    ) : null}
                </div>
            </div>
        </div>
    );
}
