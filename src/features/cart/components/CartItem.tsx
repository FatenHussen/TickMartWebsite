import type { CartItem as CartItemType } from "../types";

type CartItemProps = {
  item: CartItemType;
  onQuantityChange: (itemId: number | string, quantity: number) => void;
  onRemove: (itemId: number | string) => void;
};

export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    } else {
      onRemove(item.id);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-b-0">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-text-primary text-base">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
        )}
        {item.modifiers && item.modifiers.length > 0 && (
          <p className="text-sm text-gray-500 mt-0.5">
            {item.modifiers.join(", ")}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          {item.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {item.originalPrice}
            </span>
          )}
          <span className="font-semibold text-text-primary text-base">
            {item.price}
          </span>
        </div>

        {/* Quantity Selector and Remove */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
            <button
              type="button"
              onClick={handleDecrease}
              className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded-l-lg transition-colors"
              aria-label="Decrease quantity"
            >
              <span className="text-lg font-medium text-gray-600">−</span>
            </button>
            <span className="min-w-[2rem] text-center font-medium text-text-primary">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrease}
              className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded-r-lg transition-colors"
              aria-label="Increase quantity"
            >
              <span className="text-lg font-medium text-gray-600">+</span>
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => onRemove(item.id)}
            className="text-red-500 hover:text-red-600 text-sm font-medium"
          >
            Remove item
          </button>
        </div>
      </div>
    </div>
  );
}

