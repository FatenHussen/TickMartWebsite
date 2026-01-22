import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import type { CartItem } from "../types";

type OrderItemsTableProps = {
  items: CartItem[];
  onMoveToWishlist?: (itemId: number | string) => void;
  title?: string;
  showTitle?: boolean;
};

export default function OrderItemsTable({
  items,
  onMoveToWishlist,
  title = "Order Items",
  showTitle = true,
}: OrderItemsTableProps) {
  const { isRTL } = useLanguage();

  return (
    <div>
      {showTitle && (
        <h2 className="text-lg font-bold text-custom-primary mb-4">{title}</h2>
      )}
      <div className="bg-white rounded-xl border border-custom-secondary shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                style={{
                  background: "linear-gradient(90deg, #4CDAF6 0%, #2C8090 100%)",
                }}
              >
                <th
                  className={cn(
                    isRTL ? "text-right" : "text-left",
                    "py-3 px-4 text-xs font-bold text-white uppercase",
                  )}
                >
                  Product
                </th>
                <th className="py-3 px-4 text-xs font-bold text-white uppercase text-center">
                  Price
                </th>
                <th className="py-3 px-4 text-xs font-bold text-white uppercase text-center">
                  Quantity
                </th>
                <th
                  className={cn(
                    isRTL ? "text-left" : "text-right",
                    "py-3 px-4 text-xs font-bold text-white uppercase",
                  )}
                >
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <OrderItemRow
                  key={item.id}
                  item={item}
                  isRTL={isRTL}
                  onMoveToWishlist={onMoveToWishlist}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

type OrderItemRowProps = {
  item: CartItem;
  isRTL: boolean;
  onMoveToWishlist?: (itemId: number | string) => void;
};

function OrderItemRow({ item, isRTL, onMoveToWishlist }: OrderItemRowProps) {
  return (
    <tr className="border-b border-gray-100 last:border-b-0">
      {/* Product */}
      <td className="py-4 px-4">
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-50">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-custom-primary leading-tight">
              {item.name}
            </p>
            <p className="text-xs text-custom-secondary">
              {item.category} · {item.store}
            </p>
            <p className="text-xs text-custom-secondary">
              {item.size} | {item.type}
            </p>
            <div className="flex items-center gap-3 mt-1">
              {onMoveToWishlist && (
                <button
                  type="button"
                  onClick={() => onMoveToWishlist(item.id)}
                  className="text-xs hover:underline"
                  style={{ color: "#2C8090" }}
                >
                  Move to wishlist
                </button>
              )}
              {item.hasFreeDelivery && (
                <span className="text-xs" style={{ color: "#22C55E" }}>
                  Free delivery
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="py-4 px-4 text-center align-top">
        <div className="text-sm font-semibold text-custom-primary">
          {item.price}
        </div>
        {item.originalPrice && (
          <div className="text-xs line-through text-custom-secondary">
            {item.originalPrice}
          </div>
        )}
        {item.savingsText && (
          <div className="text-xs font-medium" style={{ color: "#22C55E" }}>
            {item.savingsText}
          </div>
        )}
      </td>

      {/* Quantity */}
      <td className="py-4 px-4 text-center align-top">
        <span className="text-sm text-custom-primary">{item.quantity}</span>
      </td>

      {/* Subtotal */}
      <td
        className={cn("py-4 px-4 align-top", isRTL ? "text-left" : "text-right")}
      >
        <span className="text-sm font-semibold text-custom-primary">
          {item.subtotal}
        </span>
      </td>
    </tr>
  );
}
