import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/features/cart/types";

function formatPrice(value: number): string {
  return `£${value.toFixed(2)}`;
}

function getLineId(item: Pick<CartItem, "productId" | "variantId">): string {
  const pid = item.productId ?? 0;
  const vid = item.variantId ?? "base";
  return `${pid}-${vid}`;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
  getItems: () => CartItem[];
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        set((state) => {
          const lineId = getLineId(item);
          const existingIndex = state.items.findIndex(
            (i) => getLineId(i) === lineId
          );
          if (existingIndex >= 0) {
            const existing = state.items[existingIndex];
            const num =
              existing.priceNumeric ??
              (parseFloat(String(existing.price).replace(/[^0-9.]/g, "")) || 0);
            const newQty = existing.quantity + item.quantity;
            const next = [...state.items];
            next[existingIndex] = {
              ...existing,
              quantity: newQty,
              subtotal: formatPrice(num * newQty),
              priceNumeric: num,
            };
            return { items: next };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (id: number | string) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      updateQuantity: (id: number | string, quantity: number) => {
        const qty = Math.max(1, quantity);
        set((state) => {
          const index = state.items.findIndex((i) => i.id === id);
          if (index < 0) return state;
          const item = state.items[index];
          const num =
            item.priceNumeric ??
            (parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0);
          const next = [...state.items];
          next[index] = {
            ...item,
            quantity: qty,
            subtotal: formatPrice(num * qty),
          };
          return { items: next };
        });
      },

      clearCart: () => set({ items: [] }),

      getItems: () => get().items,
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
