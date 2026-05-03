import { HiMinus, HiPlus, HiShoppingCart } from "react-icons/hi";
import { cn } from"@/shared/lib/utils";

export type ProductQuantitySelectorProps = {
 quantity: number;
 min?: number;
 max?: number;
 onQuantityChange?: (quantity: number) => void;
 onAddToCart?: () => void;
 addToCartText?: string;
 className?: string;
};

export default function ProductQuantitySelector({
 quantity,
 min = 1,
 max,
 onQuantityChange,
 onAddToCart,
 addToCartText ="Add To Cart",
 className,
}: ProductQuantitySelectorProps) {
    const handleDecrease = () => {
        if (quantity > min) onQuantityChange?.(quantity - 1);
    };

    const handleIncrease = () => {
        if (!max || quantity < max) onQuantityChange?.(quantity + 1);
    };

    return (
        <div className={cn("flex flex-wrap items-center gap-4", className)}>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={quantity <= min}
                    className={cn(
                        "flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-2",
                        "border-[color-mix(in_srgb,var(--color-api-second)_42%,var(--color-border-primary))] bg-white dark:bg-[color-mix(in_srgb,var(--color-main)_18%,#13151c)] text-primary",
                        "transition-colors hover:border-[var(--color-api-second)]/80",
                        "hover:bg-[color-mix(in_srgb,var(--color-api-second)_10%,var(--color-bg-card))]",
                        "disabled:cursor-not-allowed disabled:opacity-40"
                    )}
                    aria-label="Decrease quantity"
                >
                    <HiMinus className="h-4 w-4" />
                </button>

                <span className="min-w-6 text-center text-base font-medium text-text-primary">
                    {quantity}
                </span>

                <button
                    type="button"
                    onClick={handleIncrease}
                    disabled={max !== undefined && quantity >= max}
                    className={cn(
                        "flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-2",
                        "border-[color-mix(in_srgb,var(--color-api-second)_42%,var(--color-border-primary))] bg-white dark:bg-[color-mix(in_srgb,var(--color-main)_18%,#13151c)] text-primary",
                        "transition-colors hover:border-[var(--color-api-second)]/80",
                        "hover:bg-[color-mix(in_srgb,var(--color-api-second)_10%,var(--color-bg-card))]",
                        "disabled:cursor-not-allowed disabled:opacity-40"
                    )}
                    aria-label="Increase quantity"
                >
                    <HiPlus className="h-4 w-4" />
                </button>
            </div>

            {onAddToCart && (
                <button
                    type="button"
                    onClick={onAddToCart}
                    className={cn(
                        "inline-flex h-10 min-w-[240px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary px-8",
                        "text-base font-semibold text-white",
                        "shadow-md shadow-[0_8px_28px_-6px_var(--color-shadow-accent)]",
                        "transition-[background-color,box-shadow,transform] duration-200",
                        "hover:border-primary/30 hover:bg-[var(--color-primary-dark)] hover:shadow-lg",
                        "active:scale-[0.99] focus:outline-none focus-visible:ring-2",
                        "focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                    )}
                >
                    <HiShoppingCart className="h-5 w-5 shrink-0" aria-hidden />
                    {addToCartText}
                </button>
            )}
        </div>
    );
}
