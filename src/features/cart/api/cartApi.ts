import _axios from "@/app/middleware/interceptor";
import { useAuthStore } from "@/store/auth";
import { apiRoutes } from "@/utils/apiRoutes";

export type ServerCartItem = {
    shop_product_variant_id: number;
    quantity: number;
};

/** POST `/user/cart/items` — no price from the client. Guests skip the call. */
export async function postCartItems(items: ServerCartItem[]): Promise<void> {
    const token = useAuthStore.getState().token;
    if (!token || items.length === 0) return;
    await Promise.all(
        items.map((item) =>
            _axios.post(apiRoutes.cart.items, {
                shop_product_variant_id: item.shop_product_variant_id,
                quantity: item.quantity,
            }),
        ),
    );
}

/** Fire-and-forget: local cart + `POST /orders` stay the checkout path. */
export function postCartItemsSafe(items: ServerCartItem[]): void {
    void postCartItems(items).catch(() => undefined);
}
