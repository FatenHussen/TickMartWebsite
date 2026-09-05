import { cn } from "@/shared/lib/utils";
import { HiMinus, HiPlus } from "react-icons/hi";
import { useTranslation } from "react-i18next";

type QtyStepperProps = {
    value: number;
    min?: number;
    max?: number;
    onChange: (value: number) => void;
    disabled?: boolean;
};

export default function QtyStepper({
    value,
    min = 1,
    max,
    onChange,
    disabled = false,
}: QtyStepperProps) {
    const { t } = useTranslation();
    return (
        <div
            className={cn(
                "inline-flex h-9 items-center rounded-full border border-[color-mix(in_srgb,var(--color-primary)_18%,var(--color-border-primary))] bg-white dark:border-white/10 dark:bg-[#121316]",
            )}
        >
            <button
                type="button"
                disabled={disabled || value <= min}
                aria-label={t("product.decreaseQuantity", "Decrease")}
                onClick={() => onChange(Math.max(min, value - 1))}
                className="grid h-9 w-9 place-items-center rounded-full text-primary transition hover:bg-primary/10 disabled:opacity-30"
            >
                <HiMinus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-7 text-center text-sm font-semibold tabular-nums text-custom-primary dark:text-white">
                {value}
            </span>
            <button
                type="button"
                disabled={disabled || (max != null && value >= max)}
                aria-label={t("product.increaseQuantity", "Increase")}
                onClick={() =>
                    onChange(max != null ? Math.min(max, value + 1) : value + 1)
                }
                className="grid h-9 w-9 place-items-center rounded-full text-primary transition hover:bg-primary/10 disabled:opacity-30"
            >
                <HiPlus className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}
