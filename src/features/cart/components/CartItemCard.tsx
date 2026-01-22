import { HiMinus, HiPlus, HiTrash } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import Badge from "@/shared/component/Badge";
import type { CartItem } from "../types";

type CartItemCardProps = {
  item: CartItem;
  onQuantityChange: (itemId: number | string, quantity: number) => void;
  onRemove: (itemId: number | string) => void;
  onMoveToWishlist?: (itemId: number | string) => void;
};

export default function CartItemCard({
  item,
  onQuantityChange,
  onRemove,
  onMoveToWishlist,
}: CartItemCardProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const handleDecrease = () => {
    onQuantityChange(item.id, Math.max(1, item.quantity - 1));
  };

  const handleIncrease = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  return (
    <div className="bg-transparent rounded-2xl  border border-summary p-4 relative" dir={isRTL ? "rtl" : "ltr"}>
      {/* Delete button - top right */}
      <button
        onClick={() => onRemove(item.id)}
        className="absolute top-3 right-3 text-red-500 hover:text-red-600 transition-colors z-10"
        aria-label="Remove item"
      >
        <HiTrash className="w-5 h-5" />
      </button>

      <div className="flex gap-4 pr-8">
        {/* Product Image */}
        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-white">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-bold flex items-center justify-center">
              <span className="text-gray-light text-xs">No image</span>
            </div>
          )}
        </div>

        {/* Product Details - Middle Section */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-custom-primary mb-1">{item.name}</h3>
          {item.description && (
            <p className="text-sm text-custom-secondary mb-2">{item.description}</p>
          )}
          
          {/* Tags */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-800">
              Fresh
            </span>
            {item.id === 1 && (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-100 text-orange-800">
                Best seller
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mb-4">
            {item.originalPrice && (
              <span className="text-sm text-custom-secondary line-through mr-2">
                {item.originalPrice}
              </span>
            )}
            <span className="text-xl font-bold text-custom-primary">{item.price}</span>
            {item.savingsText && (
              <p className="text-sm text-green-600 mt-1 font-medium">{item.savingsText}</p>
            )}
          </div>
        </div>

        {/* Quantity Selector and Save for Later - Right Section */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-300 rounded-lg bg-white">
            <button
              onClick={handleDecrease}
              className="p-2 hover:bg-gray-50 transition-colors"
              aria-label="Decrease quantity"
            >
              <HiMinus className="w-4 h-4 text-custom-primary" />
            </button>
            <span className="px-4 py-2 text-custom-primary font-medium min-w-[2rem] text-center border-x border-gray-300">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="p-2 hover:bg-gray-50 transition-colors"
              aria-label="Increase quantity"
            >
              <HiPlus className="w-4 h-4 text-custom-primary" />
            </button>
          </div>
          
          {/* Save for later */}
          <button
            onClick={() => onMoveToWishlist?.(item.id)}
            className="text-sm text-primary-light hover:underline whitespace-nowrap"
          >
            Save for later
          </button>
        </div>
      </div>
    </div>
  );
}
