import { HiMinus, HiPlus } from"react-icons/hi";
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
                        "flex h-10 w-10 items-center justify-center rounded-md border border-[#DCE8EE] bg-white text-[#495666] transition-colors",
                        "hover:bg-[#F6FAFC]",
                        "disabled:opacity-40 disabled:cursor-not-allowed"
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
                        "flex h-10 w-10 items-center justify-center rounded-md border border-[#DCE8EE] bg-white text-[#495666] transition-colors",
                        "hover:bg-[#F6FAFC]",
                        "disabled:opacity-40 disabled:cursor-not-allowed"
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
                    className="h-10 min-w-[240px] rounded-md bg-gradient-to-b from-[#4FD4EA] to-[#2798B7] px-8 text-lg font-semibold text-white shadow-[0_10px_24px_rgba(39,152,183,0.18)] transition-all hover:from-[#42CBE3] hover:to-[#228DAA]"
                >
                    {addToCartText}
                </button>
            )}
        </div>
    );
}
