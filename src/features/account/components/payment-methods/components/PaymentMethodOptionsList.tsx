import type { PaymentMethodOption } from "@/features/cart/types";
import { PaymentMethodOptionCard } from "./PaymentMethodOptionCard";

interface PaymentMethodOptionsListProps {
    methods: PaymentMethodOption[];
    isLoading: boolean;
    /** Resolved selection: explicit choice or implicit default when empty. */
    effectiveSelectedId: string | undefined;
    defaultMethodId: string | undefined;
    defaultBadgeLabel: string;
    onSelectMethod: (methodId: string) => void;
}

export function PaymentMethodOptionsList({
    methods,
    isLoading,
    effectiveSelectedId,
    defaultMethodId,
    defaultBadgeLabel,
    onSelectMethod,
}: PaymentMethodOptionsListProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {methods.map((method) => {
                const isSelected = method.id === effectiveSelectedId;
                const isDefaultRow = method.id === defaultMethodId;

                return (
                    <PaymentMethodOptionCard
                        key={method.id}
                        method={method}
                        isSelected={isSelected}
                        showDefaultBadge={isDefaultRow}
                        defaultBadgeLabel={defaultBadgeLabel}
                        onSelect={onSelectMethod}
                    />
                );
            })}
        </div>
    );
}
