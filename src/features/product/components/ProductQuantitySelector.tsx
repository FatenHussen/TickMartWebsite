import { HiMinus, HiPlus } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import Button from "@/shared/ui/Button";

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
    <div className={cn("flex items-center gap-3", className)}>
      {/* Quantity Selector */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDecrease}
          disabled={quantity <= min}
          className="h-10 w-10 rounded-lg p-0"
          aria-label="Decrease quantity"
        >
          <HiMinus className="h-5 w-5" />
        </Button>

        <span className="min-w-[2.5rem] text-center text-base font-semibold text-text-primary">
          {quantity}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleIncrease}
          disabled={max !== undefined && quantity >= max}
          className="h-10 w-10 rounded-lg p-0"
          aria-label="Increase quantity"
        >
          <HiPlus className="h-5 w-5" />
        </Button>
      </div>

      {/* Add To Cart Button */}
      {onAddToCart && (
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onAddToCart}
          className="ml-auto rounded-xl bg-gradient-to-r from-sky-400 to-sky-600 px-6 py-3 font-semibold text-white hover:from-sky-500 hover:to-sky-700"
        >
          {addToCartText}
        </Button>
      )}
    </div>
  );
}
