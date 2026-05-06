import type { PaymentMethodOption } from "@/features/cart/types";
import { PremiumInlineLoader } from "@/shared/component/loading";
import { PaymentMethodOptionCard } from "./PaymentMethodOptionCard";

interface PaymentMethodOptionsListProps {
    methods: PaymentMethodOption[];
    isLoading: boolean;
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
                <PremiumInlineLoader size="sm" />
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
