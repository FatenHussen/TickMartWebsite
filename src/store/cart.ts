import { create } from"zustand";
import { persist } from"zustand/middleware";
import type {
 CartItem,
 CartType,
 OrderPreviewItem,
} from"@/features/cart/types";
import {
 extrasLineKeyFromExtras,
 normalizeCartExtras,
} from"@/features/cart/utils/cartExtras";
import { cartItemsToPreviewOrderItems } from"@/features/cart/utils/orderLinePayload";

function formatPrice(value: number): string {
 return `£${value.toFixed(2)}`;
}

/** Distinguish cart lines that share variant + extras but differ by note. */
function noteLineSuffix(note?: string | null): string {
 const s = typeof note === "string" ? note.trim() : "";
 if (!s) return "";
 let h = 0;
 for (let i = 0; i < s.length; i++) {
 h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
 }
 return `-n${(h >>> 0).toString(36)}`;
}

function getLineId(
 item: Pick<
 CartItem,
 "productId"|"variantId"|"shop_product_variant_id"|"extras"|"note"
 >
): string {
 const nk = noteLineSuffix(item.note);
 if (item.shop_product_variant_id != null) {
 return `spv-${item.shop_product_variant_id}${extrasLineKeyFromExtras(item.extras)}${nk}`;
 }
 const pid = item.productId ?? 0;
 const vid = item.variantId ??"base";
 return `${pid}-${vid}${nk}`;
}

export interface AddRecipePayload {
 recipe_id: number;
 items: Array<{ shop_product_variant_id: number; quantity: number } & Partial<CartItem>>;
}

export interface AddBasketPayload {
 admin_basket_id: number;
 items: Array<{ shop_product_variant_id: number; quantity: number } & Partial<CartItem>>;
}

export interface AddScheduleBasketPayload {
 admin_schedule_basket_id: number;
 basket_schedule_id?: number;
 items: Array<{ shop_product_variant_id: number; quantity: number } & Partial<CartItem>>;
}

interface CartStore {
 items: CartItem[];
 cart_type: CartType;
 recipe_id?: number;
 admin_basket_id?: number;
 admin_schedule_basket_id?: number;
 basket_schedule_id?: number;
 addItem: (
 item: CartItem
 ) =>"success"|"wrong_cart_type"|"instant_delivery_mix";
 addRecipe: (payload: AddRecipePayload) => void;
 addBasket: (payload: AddBasketPayload) => void;
 addScheduleBasket: (payload: AddScheduleBasketPayload) => void;
 removeItem: (id: number | string) => void;
 updateQuantity: (id: number | string, quantity: number) => void;
 clearCart: () => void;
 getItems: () => CartItem[];
 getPreviewItems: () => OrderPreviewItem[];
}

export const useCartStore = create<CartStore>()(
 persist(
 (set, get) => ({
 items: [],
 cart_type:"default",
 recipe_id: undefined,
 admin_basket_id: undefined,
 admin_schedule_basket_id: undefined,
 basket_schedule_id: undefined,

 addItem: (
 item: CartItem
 ):"success"|"wrong_cart_type"|"instant_delivery_mix"=> {
 const state = get();
 const extrasNorm = normalizeCartExtras(item.extras);
 const itemToAdd: CartItem = {
 ...item,
 extras: extrasNorm,
 };

 if (state.items.length === 0) {
 set({
 items: [{ ...itemToAdd }],
 cart_type:"default",
 recipe_id: undefined,
 admin_basket_id: undefined,
 admin_schedule_basket_id: undefined,
 basket_schedule_id: undefined,
 });
 return"success";
 }

 if (state.cart_type !=="default") {
 return"wrong_cart_type";
 }

 const itemInstant = !!item.is_instant_delivery;
 const cartHasInstant = state.items.some((i) => !!i.is_instant_delivery);
 const cartHasNonInstant = state.items.some((i) => !i.is_instant_delivery);
 if (
 (itemInstant && cartHasNonInstant) ||
 (!itemInstant && cartHasInstant)
 ) {
 return"instant_delivery_mix";
 }

 set((s) => {
 const lineId = getLineId(itemToAdd);
 const existingIndex = s.items.findIndex((i) => getLineId(i) === lineId);
 if (existingIndex >= 0) {
 const existing = s.items[existingIndex];
 const num =
 existing.priceNumeric ??
 (parseFloat(String(existing.price).replace(/[^0-9.]/g,"")) || 0);
 const newQty = existing.quantity + itemToAdd.quantity;
 const next = [...s.items];
 next[existingIndex] = {
 ...existing,
 quantity: newQty,
 subtotal: formatPrice(num * newQty),
 priceNumeric: num,
 };
 return { items: next };
 }
 return { items: [...s.items, itemToAdd] };
 });
 return"success";
 },

 addRecipe: (payload: AddRecipePayload) => {
 const cartItems: CartItem[] = payload.items.map((it, idx) => {
 const { name, image, priceNumeric, quantity, shop_product_variant_id, storeId } = it;
 return {
 id: `recipe-${payload.recipe_id}-${idx}`,
 name: name ??"",
 image: image ??"",
 price: String(priceNumeric ?? 0),
 quantity,
 subtotal: String((priceNumeric ?? 0) * quantity),
 storeId: storeId ?? 0,
 shop_product_variant_id: shop_product_variant_id!,
 priceNumeric,
 };
 });
 set({
 items: cartItems,
 cart_type:"recipe",
 recipe_id: payload.recipe_id,
 admin_basket_id: undefined,
 admin_schedule_basket_id: undefined,
 basket_schedule_id: undefined,
 });
 },

 addBasket: (payload: AddBasketPayload) => {
 const cartItems: CartItem[] = payload.items.map((it, idx) => {
 const { name, image, priceNumeric, quantity, shop_product_variant_id, storeId } = it;
 return {
 id: `basket-${payload.admin_basket_id}-${idx}`,
 name: name ??"",
 image: image ??"",
 price: String(priceNumeric ?? 0),
 quantity,
 subtotal: String((priceNumeric ?? 0) * quantity),
 storeId: storeId ?? 0,
 shop_product_variant_id: shop_product_variant_id!,
 priceNumeric,
 };
 });
 set({
 items: cartItems,
 cart_type:"basket",
 recipe_id: undefined,
 admin_basket_id: payload.admin_basket_id,
 admin_schedule_basket_id: undefined,
 basket_schedule_id: undefined,
 });
 },

 addScheduleBasket: (payload: AddScheduleBasketPayload) => {
 const cartItems: CartItem[] = payload.items.map((it, idx) => {
 const { name, image, priceNumeric, quantity, shop_product_variant_id, storeId } = it;
 return {
 id: `schedule-basket-${payload.admin_schedule_basket_id}-${idx}`,
 name: name ??"",
 image: image ??"",
 price: String(priceNumeric ?? 0),
 quantity,
 subtotal: String((priceNumeric ?? 0) * quantity),
 storeId: storeId ?? 0,
 shop_product_variant_id: shop_product_variant_id!,
 priceNumeric,
 };
 });
 set({
 items: cartItems,
 cart_type:"schedule_admin_cart",
 recipe_id: undefined,
 admin_basket_id: undefined,
 admin_schedule_basket_id: payload.admin_schedule_basket_id,
 basket_schedule_id: payload.basket_schedule_id,
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
 (parseFloat(String(item.price).replace(/[^0-9.]/g,"")) || 0);
 const next = [...state.items];
 next[index] = {
 ...item,
 quantity: qty,
 subtotal: formatPrice(num * qty),
 };
 return { items: next };
 });
 },

 clearCart: () =>
 set({
 items: [],
 cart_type:"default",
 recipe_id: undefined,
 admin_basket_id: undefined,
 admin_schedule_basket_id: undefined,
 basket_schedule_id: undefined,
 }),

 getItems: () => get().items,

 getPreviewItems: (): OrderPreviewItem[] =>
 cartItemsToPreviewOrderItems(get().items),
 }),
 {
 name:"cart-storage",
 partialize: (state) => ({
 items: state.items,
 cart_type: state.cart_type,
 recipe_id: state.recipe_id,
 admin_basket_id: state.admin_basket_id,
 admin_schedule_basket_id: state.admin_schedule_basket_id,
 basket_schedule_id: state.basket_schedule_id,
 }),
 }
 )
);
