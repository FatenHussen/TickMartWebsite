import _axios from "@/app/middleware/interceptor";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { apiRoutes } from "@/utils/apiRoutes";
import type { CartItem } from "@/features/cart/types";

export type ServerCartItem = {
    shop_product_variant_id: number;
    quantity: number;
    note?: string;
};

export type UpdateCartItemPayload = {
    quantity: number;
    note?: string;
};

const silent = { skipErrorToast: true, skipSuccessToast: true } as const;

function cartItemBody(item: ServerCartItem) {
    const note = item.note?.trim();
    return {
        shop_product_variant_id: item.shop_product_variant_id,
        quantity: item.quantity,
        ...(note ? { note: note.slice(0, 500) } : {}),
    };
}

export function toServerCartItem(item: CartItem): ServerCartItem | null {
    if (item.shop_product_variant_id == null) return null;
    const note = item.note?.trim();
    return {
        shop_product_variant_id: item.shop_product_variant_id,
        quantity: item.quantity,
        ...(note ? { note: note.slice(0, 500) } : {}),
    };
}

/** GET `/user/cart` — token required. */
export async function getCart<T = unknown>(): Promise<T | null> {
    const token = useAuthStore.getState().token;
    if (!token) return null;
    const response = await _axios.get<T>(apiRoutes.cart.get, silent);
    return response.data;
}

/** POST `/user/cart/items` — no price from the client. Guests skip the call. */
export async function postCartItems(items: ServerCartItem[]): Promise<void> {
    const token = useAuthStore.getState().token;
    if (!token || items.length === 0) return;
    await Promise.all(
        items.map((item) =>
            _axios.post(apiRoutes.cart.items, cartItemBody(item), silent),
        ),
    );
}

/** PUT `/user/cart/items/{id}` `{ quantity, note? }` */
export async function updateCartItem(
    id: number | string,
    payload: UpdateCartItemPayload,
): Promise<void> {
    const token = useAuthStore.getState().token;
    if (!token) return;
    const note = payload.note?.trim();
    await _axios.put(
        apiRoutes.cart.item(id),
        {
            quantity: payload.quantity,
            ...(note ? { note: note.slice(0, 500) } : {}),
        },
        silent,
    );
}

/** DELETE `/user/cart/items/{id}` */
export async function deleteCartItem(id: number | string): Promise<void> {
    const token = useAuthStore.getState().token;
    if (!token) return;
    await _axios.delete(apiRoutes.cart.item(id), silent);
}

/** Fire-and-forget: local cart + `POST /orders` stay the checkout path. */
export function postCartItemsSafe(items: ServerCartItem[]): void {
    void postCartItems(items).catch(() => undefined);
}

/**
 * After login / OTP, push the guest local cart to `POST /user/cart/items`.
 * Logout already clears the local cart, so this only runs for guest → auth.
 */
export function syncLocalCartToServer(): void {
    const items = useCartStore
        .getState()
        .items.map(toServerCartItem)
        .filter((item): item is ServerCartItem => item != null);
    postCartItemsSafe(items);
}
