import type {
    ApiFormattedMoney,
    CartCheckout,
    DeliveryChoice,
} from "../types";

const EMPTY_MONEY: ApiFormattedMoney = {
    amount: 0,
    currency: "",
    symbol: "",
    formatted: "",
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function readAmount(value: unknown): number {
    if (value == null || value === "") return Number.NaN;
    const amount = Number(value);
    return Number.isFinite(amount) ? amount : Number.NaN;
}

function readMoney(value: unknown): ApiFormattedMoney {
    if (!isRecord(value)) return { ...EMPTY_MONEY };
    const formatted = typeof value.formatted === "string" ? value.formatted : "";
    const amount = readAmount(value.amount);
    return {
        amount: Number.isFinite(amount) ? amount : 0,
        currency: typeof value.currency === "string" ? value.currency : "",
        symbol: typeof value.symbol === "string" ? value.symbol : "",
        formatted,
    };
}

/** `null` hides the line. A present object keeps amount `NaN` when the API omitted it. */
function readOptionalMoney(value: unknown): ApiFormattedMoney | null {
    if (value == null || value === "") return null;
    if (!isRecord(value)) return null;
    const formatted = typeof value.formatted === "string" ? value.formatted : "";
    return {
        amount: readAmount(value.amount),
        currency: typeof value.currency === "string" ? value.currency : "",
        symbol: typeof value.symbol === "string" ? value.symbol : "",
        formatted,
    };
}

function readBool(value: unknown, fallback: boolean): boolean {
    if (typeof value === "boolean") return value;
    if (value === 1 || value === "1" || value === "true") return true;
    if (value === 0 || value === "0" || value === "false") return false;
    return fallback;
}

function readHours(value: unknown): number | null {
    if (value == null || value === "") return null;
    const hours = Number(value);
    return Number.isFinite(hours) ? hours : null;
}

function readText(value: unknown): string | null {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
}

/** Accept `checkout` at the root or under `data`. */
export function extractCartCheckout(payload: unknown): unknown {
    if (!isRecord(payload)) return null;
    if (payload.checkout != null) return payload.checkout;
    if (isRecord(payload.data) && payload.data.checkout != null) {
        return payload.data.checkout;
    }
    return null;
}

export function normalizeCartCheckout(raw: unknown): CartCheckout | null {
    if (!isRecord(raw)) return null;

    const hasSignal =
        raw.can_checkout != null ||
        raw.min_order_amount != null ||
        raw.delivery_min_hours != null ||
        raw.delivery_max_hours != null ||
        raw.delivery_price != null ||
        raw.instant_only != null ||
        raw.message != null;

    if (!hasSignal) return null;

    const deliveryError = readText(raw.delivery_error);
    const canCheckout = readBool(raw.can_checkout, true) && !deliveryError;

    return {
        source: typeof raw.source === "string" ? raw.source : "",
        shop_id: raw.shop_id == null || raw.shop_id === "" ? null : Number(raw.shop_id),
        min_order_amount: readMoney(raw.min_order_amount),
        subtotal: readMoney(raw.subtotal),
        remaining_amount: readMoney(raw.remaining_amount),
        can_checkout: canCheckout,
        delivery_min_hours: readHours(raw.delivery_min_hours),
        delivery_max_hours: readHours(raw.delivery_max_hours),
        earliest_delivery_at:
            typeof raw.earliest_delivery_at === "string" ? raw.earliest_delivery_at.trim() : "",
        delivery_price: readOptionalMoney(raw.delivery_price),
        instant_only: readBool(raw.instant_only, false),
        fulfillment: readText(raw.fulfillment),
        message: readText(raw.message),
        delivery_error: deliveryError,
    };
}

/**
 * Delivery-price line under the cart.
 * Amount `0` is free. `null` hides the line.
 */
export function formatCheckoutDeliveryPrice(
    price: ApiFormattedMoney | null | undefined,
    freeLabel: string,
): string | null {
    if (price == null) return null;
    if (price.amount === 0) return freeLabel;
    const formatted = price.formatted.trim();
    return formatted || null;
}

/** Message to show when checkout is blocked. The API string is shown as returned. */
export function checkoutBlockMessage(checkout: CartCheckout | null | undefined): string | null {
    if (!checkout || checkout.can_checkout) return null;
    return checkout.message || checkout.delivery_error || null;
}

/** Minimum-order block hides the delivery picker. A delivery error keeps it visible. */
export function isMinimumOrderBlock(checkout: CartCheckout | null | undefined): boolean {
    return Boolean(checkout && !checkout.can_checkout && !checkout.delivery_error);
}

/** Parse `Y-m-d H:i` (or `Y-m-dTH:i`) as a local date. */
export function parseApiDateTime(value: string | null | undefined): Date | null {
    if (!value) return null;
    const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
    if (!match) return null;
    const [, year, month, day, hour, minute] = match;
    const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        0,
        0,
    );
    return Number.isNaN(date.getTime()) ? null : date;
}

export function formatApiDateTime(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function toDateInputValue(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function toTimeInputValue(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function isBeforeEarliest(
    scheduled: string | null | undefined,
    earliest: string | null | undefined,
): boolean {
    const selected = parseApiDateTime(scheduled);
    const limit = parseApiDateTime(earliest);
    if (!selected || !limit) return false;
    return selected.getTime() < limit.getTime();
}

export function deliveryChoiceToSend(
    choice: DeliveryChoice,
    scheduledDeliveryAt: string | null | undefined,
    earliestDeliveryAt: string | null | undefined,
): { delivery_choice: DeliveryChoice; scheduled_delivery_at?: string; is_instant_delivery: boolean } {
    const scheduled =
        choice === "scheduled" &&
        scheduledDeliveryAt &&
        !isBeforeEarliest(scheduledDeliveryAt, earliestDeliveryAt)
            ? scheduledDeliveryAt
            : null;

    if (scheduled) {
        return {
            delivery_choice: "scheduled",
            scheduled_delivery_at: scheduled,
            is_instant_delivery: false,
        };
    }

    return {
        delivery_choice: "asap",
        is_instant_delivery: true,
    };
}
