import type { CartItem } from "../types";

type OrderItemsTableProps = {
  items: CartItem[];
  onMoveToWishlist?: (itemId: number | string) => void;
};

export default function OrderItemsTable({
  items,
  onMoveToWishlist,
}: OrderItemsTableProps) {
  return (
    <div className="bg-custom-primary rounded-2xl border border-custom-secondary shadow-sm overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-custom-secondary bg-blue-off">
              <th className="text-left py-4 px-4 text-sm font-semibold text-custom-primary">
                Product
              </th>
              <th className="text-right py-4 px-4 text-sm font-semibold text-custom-primary">
                Price
              </th>
              <th className="text-center py-4 px-4 text-sm font-semibold text-custom-primary">
                Quantity
              </th>
              <th className="text-right py-4 px-4 text-sm font-semibold text-custom-primary">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-custom-secondary hover:bg-custom-hover transition-colors last:border-b-0"
              >
                {/* Product */}
                <td className="py-4 px-4">
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    <div className="w-20 h-20 rounded-lg bg-custom-tertiary overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-custom-primary text-base mb-1">
                        {item.name}
                      </h3>
                      <div className="text-sm text-custom-secondary space-y-0.5">
                        {item.category && item.store && (
                          <div>
                            {item.category} • {item.store}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {item.size && <span>{item.size}</span>}
                          {item.type && <span>• {item.type}</span>}
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-4 mt-2">
                        {onMoveToWishlist && (
                          <button
                            type="button"
                            onClick={() => onMoveToWishlist(item.id)}
                            className="text-sm font-medium text-custom-accent hover:underline"
                          >
                            Move to wishlist
                          </button>
                        )}
                        {item.hasFreeDelivery && (
                          <span
                            className="text-sm font-medium"
                            style={{ color: "var(--color-green)" }}
                          >
                            Free delivery
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="py-4 px-4">
                  <div className="text-right">
                    {item.originalPrice && (
                      <div className="text-sm text-custom-tertiary line-through mb-1">
                        {item.originalPrice}
                      </div>
                    )}
                    <div className="font-semibold text-custom-primary text-base">
                      {item.price}
                    </div>
                    {item.savingsText && (
                      <div
                        className="text-sm mt-1"
                        style={{ color: "var(--color-green)" }}
                      >
                        {item.savingsText}
                      </div>
                    )}
                  </div>
                </td>

                {/* Quantity */}
                <td className="py-4 px-4">
                  <div className="text-center font-medium text-custom-primary">
                    {item.quantity}
                  </div>
                </td>

                {/* Subtotal */}
                <td className="py-4 px-4">
                  <div className="text-right font-semibold text-custom-primary">
                    {item.subtotal}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
