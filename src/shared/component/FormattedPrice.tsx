import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import { parsePriceParts } from "@/shared/lib/formatApiPrice";

type FormattedPriceProps = {
    value: string;
    className?: string;
    /** Raised, slightly quieter currency glyph — use on the sale price. */
    prominent?: boolean;
    strikethrough?: boolean;
};

/**
 * Renders a money string in a stable LTR isolate so `$8.82` never flips to `8.82 $` in RTL.
 */
export default function FormattedPrice({
    value,
    className,
    prominent = false,
    strikethrough = false,
}: FormattedPriceProps) {
    const parts = parsePriceParts(value);

    const shell = (children: ReactNode) => (
        <span
            dir="ltr"
            className={cn(
                "inline-flex items-baseline tabular-nums",
                strikethrough && "line-through decoration-from-font",
                className,
            )}
        >
            {children}
        </span>
    );

    if (parts.kind === "raw") {
        return shell(parts.value);
    }

    const symbol = (
        <span
            className={cn(
                "font-bold",
                prominent
                    ? "text-[0.58em] font-extrabold leading-none opacity-80"
                    : "text-[0.85em] opacity-90",
                parts.symbolFirst ? "me-[0.14em]" : "ms-[0.14em]",
            )}
        >
            {parts.symbol}
        </span>
    );
    const amount = <span className="leading-none">{parts.amount}</span>;

    return shell(
        parts.symbolFirst ? (
            <>
                {symbol}
                {amount}
            </>
        ) : (
            <>
                {amount}
                {symbol}
            </>
        ),
    );
}
