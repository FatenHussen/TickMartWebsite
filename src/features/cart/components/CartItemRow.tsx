import { HiMinus, HiPlus } from "react-icons/hi";

type CartItemRowProps = {
  item: {
    id: number | string;
    name: string;
    description?: string; // مثل "1 kg pack" أو "1 liter"
    image?: string;
    price: string; // "$4.99"
    oldPrice?: string; // "$3.99" optional
    savingsText?: string; // "You save $0.50" optional
    quantity: number;
  };
  onQuantityChange: (itemId: number | string, quantity: number) => void;
  onRemove: (itemId: number | string) => void;
};

export default function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
}: CartItemRowProps) {
  const dec = () => onQuantityChange(item.id, Math.max(1, item.quantity - 1));
  const inc = () => onQuantityChange(item.id, item.quantity + 1);

  return (
    <div className="px-5 sm:px-6 py-4 flex items-center gap-4">
      {/* Image */}
      <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>

      {/* Title / meta */}
      <div className="min-w-0 flex-1">
        <div className="font-medium text-gray-900 leading-5 truncate">
          {item.name}
        </div>
        {item.description ? (
          <div className="text-sm text-gray-500 leading-5 truncate">
            {item.description}
          </div>
        ) : null}
      </div>

      {/* Price */}
      <div className="w-24 text-right shrink-0">
        <div className="font-semibold text-gray-900 leading-5">
          {item.price}
        </div>
        {item.oldPrice ? (
          <div className="text-sm text-gray-400 line-through leading-5">
            {item.oldPrice}
          </div>
        ) : null}
        {item.savingsText ? (
          <div className="text-xs text-emerald-600 leading-5 mt-1">
            {item.savingsText}
          </div>
        ) : null}
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={dec}
          className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50"
          aria-label="Decrease quantity"
        >
          <HiMinus className="w-4 h-4 text-gray-600" />
        </button>

        <div className="w-6 text-center text-sm font-medium text-gray-800">
          {item.quantity}
        </div>

        <button
          type="button"
          onClick={inc}
          className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50"
          aria-label="Increase quantity"
        >
          <HiPlus className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="text-sm font-medium text-rose-500 hover:text-rose-600 shrink-0"
      >
        Remove item
      </button>
    </div>
  );
}
