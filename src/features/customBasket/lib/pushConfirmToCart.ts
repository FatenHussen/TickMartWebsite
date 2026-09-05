import type { CartItem } from "@/features/cart/types";
import { useCartStore } from "@/store/cart";
import type { ConfirmCartItem, CustomBasketLine } from "../types";

export function buildCartItemsFromConfirm(
    cartItems: ConfirmCartItem[],
    draftItems: CustomBasketLine[],
): CartItem[] {
    const source = cartItems.length
        ? cartItems
        : draftItems.map((line) => ({
              shop_product_variant_id: line.shop_product_variant_id,
              quantity: line.quantity,
          }));

    return source.map((line) => {
        const draft = draftItems.find(
            (d) => d.shop_product_variant_id === line.shop_product_variant_id,
        );
        return {
            id: `spv-${line.shop_product_variant_id}`,
            name: draft?.product.name ?? "",
            image: draft?.product.image ?? "",
            price: draft?.original_price_formatted ?? "",
            quantity: line.quantity,
            subtotal: draft?.line_total_formatted ?? "",
            storeId: draft?.shop?.id ?? 0,
            shopId: draft?.shop?.id,
            shop_product_variant_id: line.shop_product_variant_id,
            store: draft?.shop?.name ?? draft?.product.brand?.name,
        };
    });
}

/** Merge confirm lines into the default cart, replacing recipe/basket carts. */
export function pushConfirmItemsToCart(lines: CartItem[]): "ok" | "replaced" {
    if (!lines.length) return "ok";
    const store = useCartStore.getState();
    let replaced: "ok" | "replaced" = "ok";
    if (store.items.length > 0 && store.cart_type !== "default") {
        store.clearCart();
        replaced = "replaced";
    }
    for (const line of lines) {
        store.addItem(line);
    }
    return replaced;
}
