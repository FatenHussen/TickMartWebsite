import { HiMinus, HiPlus, HiShoppingCart } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";

export type ProductQuantitySelectorProps = {
    quantity: number;
    min?: number;
    max?: number;
    onQuantityChange?: (quantity: number) => void;
    onAddToCart?: () => void;
    addToCartText?: string;
    /** Blocks the add-to-cart button (e.g. product not linked to a branch). */
    addToCartDisabled?: boolean;
    addToCartClassName?: string;
    className?: string;
};

export default function ProductQuantitySelector({
    quantity,
    min = 1,
    max,
    onQuantityChange,
    onAddToCart,
    addToCartText = "Add To Cart",
    addToCartDisabled = false,
    addToCartClassName,
    className,
}: ProductQuantitySelectorProps) {
    const handleDecrease = () => {
        if (quantity > min) onQuantityChange?.(quantity - 1);
    };

    const handleIncrease = () => {
        if (!max || quantity < max) onQuantityChange?.(quantity + 1);
    };

    return (
        <div className={cn("flex w-full flex-col gap-3 sm:flex-row sm:items-center", className)}>
            <div
                className={cn(
                    "inline-flex h-12 shrink-0 items-center rounded-xl border",
                    "border-[color-mix(in_srgb,var(--color-api-second)_28%,var(--color-border-primary))]",
                    "bg-custom-card dark:border-white/10",
                )}
            >
                <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={quantity <= min}
                    className="flex h-12 w-12 cursor-pointer items-center justify-center text-primary transition-colors hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/[0.06]"
                    aria-label="Decrease quantity"
                >
                    <HiMinus className="h-4 w-4" />
                </button>
                <span className="min-w-8 text-center text-base font-semibold tabular-nums text-text-primary">
                    {quantity}
                </span>
                <button
                    type="button"
                    onClick={handleIncrease}
                    disabled={max !== undefined && quantity >= max}
                    className="flex h-12 w-12 cursor-pointer items-center justify-center text-primary transition-colors hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/[0.06]"
                    aria-label="Increase quantity"
                >
                    <HiPlus className="h-4 w-4" />
                </button>
            </div>

            {onAddToCart && (
                <button
                    type="button"
                    onClick={onAddToCart}
                    disabled={addToCartDisabled}
                    className={cn(
                        "inline-flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6",
                        "text-base font-semibold text-white",
                        "transition-[background-color,transform] duration-200",
                        "hover:bg-[var(--color-primary-dark)]",
                        "active:scale-[0.99] focus:outline-none focus-visible:ring-2",
                        "focus-visible:ring-primary/40 focus-visible:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        addToCartClassName,
                    )}
                >
                    <HiShoppingCart className="h-5 w-5 shrink-0" aria-hidden />
                    {addToCartText}
                </button>
            )}
        </div>
    );
}
