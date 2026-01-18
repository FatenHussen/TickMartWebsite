import { Link } from "react-router-dom";
// import CartItemRow from "./CartItemRow";
import type { CartStoreGroup } from "../types";
import CartItemRow from "./CartItemRow";

type StoreGroupProps = {
  storeGroup: CartStoreGroup;
  onQuantityChange: (itemId: number | string, quantity: number) => void;
  onRemoveItem: (itemId: number | string) => void;
  onRemoveAllFromStore: (storeId: number | string) => void;
};

export default function StoreGroup({
  storeGroup,
  onQuantityChange,
  onRemoveItem,
  onRemoveAllFromStore,
}: StoreGroupProps) {
  const store = storeGroup.store;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
            {store.icon ? (
              <img
                src={store.icon}
                alt={store.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-500 font-semibold">
                {store.name?.slice(0, 1)?.toUpperCase()}
              </span>
            )}
          </div>

          {/* Title */}
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 leading-5 truncate">
              {store.name}
            </div>
            <div className="text-sm text-gray-500 leading-5 truncate">
              {store.type}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            to={`/store/${store.id}`}
            className="text-sm font-medium text-sky-600 hover:underline"
          >
            View store
          </Link>

          <button
            type="button"
            onClick={() => onRemoveAllFromStore(store.id)}
            className="text-sm font-medium text-rose-500 hover:text-rose-600"
          >
            Remove all from this store
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200" />

      {/* Items */}
      <div>
        {storeGroup.items.map((item, idx) => (
          <div key={item.id}>
            <CartItemRow
              item={item}
              onQuantityChange={onQuantityChange}
              onRemove={onRemoveItem}
            />
            {/* row divider (except last) */}
            {idx !== storeGroup.items.length - 1 && (
              <div className="h-px bg-gray-100 mx-5 sm:mx-6" />
            )}
          </div>
        ))}
      </div>

      {/* Footer / Summary */}
      <div className="px-5 sm:px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-gray-500">Store subtotal:</span>{" "}
              <span className="text-gray-700">{storeGroup.subtotal}</span>
            </div>

            <div>
              <span className="text-gray-500">Delivery:</span>{" "}
              <span
                className={
                  storeGroup.deliveryIsFree
                    ? "text-emerald-600 font-medium"
                    : "text-gray-700"
                }
              >
                {storeGroup.deliveryFee}
              </span>
            </div>
          </div>

          {/* Promo badge right */}
          {store.promotion ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
              {store.promotion}
            </span>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}
