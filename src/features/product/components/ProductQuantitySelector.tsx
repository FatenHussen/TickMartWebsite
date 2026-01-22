import { HiMinus, HiPlus } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";

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
  addToCartText = "Add To Cart",
  className,
}: ProductQuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > min) onQuantityChange?.(quantity - 1);
  };

  const handleIncrease = () => {
    if (!max || quantity < max) onQuantityChange?.(quantity + 1);
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* Quantity Selector - Bordered design */}
      <div className="flex items-center border border-primary-light rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={quantity <= min}
          className={cn(
            "h-10 w-10 flex items-center justify-center text-primary-light transition-colors",
            "hover:bg-primary-light/10",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          aria-label="Decrease quantity"
        >
          <HiMinus className="h-4 w-4" />
        </button>

        <span className="min-w-12 text-center text-base font-semibold text-text-primary">
          {quantity}
        </span>

        <button
          type="button"
          onClick={handleIncrease}
          disabled={max !== undefined && quantity >= max}
          className={cn(
            "h-10 w-10 flex items-center justify-center text-primary-light transition-colors",
            "hover:bg-primary-light/10",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          aria-label="Increase quantity"
        >
          <HiPlus className="h-4 w-4" />
        </button>
      </div>

      {/* Add To Cart Button - Gradient cyan */}
      {onAddToCart && (
        <button
          type="button"
          onClick={onAddToCart}
          className="flex-1 h-10 rounded-full bg-linear-to-r from-cyan-400 to-cyan-500 px-8 font-semibold text-white transition-all hover:from-cyan-500 hover:to-cyan-600 hover:shadow-lg"
        >
          {addToCartText}
        </button>
      )}
    </div>
  );
}
