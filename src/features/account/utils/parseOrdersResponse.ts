import type { ApiDualCurrencies } from "@/shared/lib/formatApiPrice";
import {
    pickCurrencyFormatted,
    selectFormattedForCurrency,
} from "@/shared/lib/formatApiPrice";
import type {
    OrderDetailData,
    OrderDetailItem,
    OrderListItem,
    OrdersListPagination,
} from "../types/order";

export type OrdersListPage = {
    items: OrderListItem[];
    pagination: OrdersListPagination | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asOrderListItem(value: unknown): OrderListItem | null {
    if (!isRecord(value) || value.id == null) return null;
    return value as unknown as OrderListItem;
}

function parseItems(value: unknown): OrderListItem[] {
    if (!Array.isArray(value)) return [];
    return value.map(asOrderListItem).filter((item): item is OrderListItem => item != null);
}

function parsePagination(value: unknown): OrdersListPagination | null {
    if (!isRecord(value)) return null;
    const currentPage = Number(
        value.current_page ?? value.currentPage ?? (value as { current?: unknown }).current,
    );
    const lastPage = Number(
        value.last_page ?? value.lastPage ?? value.last_page_number,
    );
    if (!Number.isFinite(currentPage) || !Number.isFinite(lastPage)) return null;
    return {
        current_page: currentPage,
        last_page: lastPage,
        per_page: Number(value.per_page ?? value.perPage ?? 0) || 0,
        total: Number(value.total ?? 0) || 0,
    };
}

function looksLikeOrder(value: unknown): value is OrderListItem {
    if (!isRecord(value) || value.id == null) return false;
    return (
        value.order_code != null ||
        value.cart_type != null ||
        value.total_quantity != null ||
        value.status != null
    );
}

/**
 * GET /user/orders may return any of:
 * - `{ ok, msg, data: Order[] }` (current API)
 * - `{ data: { items, pagination } }`
 * - Laravel paginator `{ data: Order[], current_page, last_page }`
 * - a bare array
 */
export function parseOrdersListResponse(payload: unknown): OrdersListPage {
    try {
        if (payload == null) return { items: [], pagination: null };

        if (Array.isArray(payload)) {
            return { items: parseItems(payload), pagination: null };
        }

        if (!isRecord(payload)) return { items: [], pagination: null };

        const rootPagination =
            parsePagination(payload.pagination) ??
            parsePagination(payload.meta) ??
            parsePagination(payload);

        const inner = payload.data ?? payload.items;

        if (Array.isArray(inner)) {
            return { items: parseItems(inner), pagination: rootPagination };
        }

        if (looksLikeOrder(inner)) {
            return {
                items: [inner],
                pagination: rootPagination ?? {
                    current_page: 1,
                    last_page: 1,
                    per_page: 1,
                    total: 1,
                },
            };
        }

        if (isRecord(inner)) {
            const nested = inner.data ?? inner.items;
            const items = Array.isArray(nested)
                ? parseItems(nested)
                : looksLikeOrder(nested)
                  ? [nested]
                  : [];
            const pagination =
                parsePagination(inner.pagination) ??
                parsePagination(inner.meta) ??
                parsePagination(inner) ??
                rootPagination;
            return { items, pagination };
        }

        if (looksLikeOrder(payload)) {
            return {
                items: [payload],
                pagination: rootPagination ?? {
                    current_page: 1,
                    last_page: 1,
                    per_page: 1,
                    total: 1,
                },
            };
        }

        return { items: [], pagination: rootPagination };
    } catch {
        return { items: [], pagination: null };
    }
}

export function parseOrderDetail(payload: unknown): OrderDetailData | undefined {
    if (!isRecord(payload)) return undefined;

    const inner = payload.data;
    if (looksLikeOrder(inner) && !Array.isArray(inner)) {
        return inner as unknown as OrderDetailData;
    }
    if (looksLikeOrder(payload)) {
        return payload as unknown as OrderDetailData;
    }
    if (isRecord(inner) && looksLikeOrder(inner.data)) {
        return inner.data as unknown as OrderDetailData;
    }
    return undefined;
}

export function flattenOrderDetailItems(
    items: OrderDetailData["items"] | unknown,
): OrderDetailItem[] {
    if (!items) return [];
    if (Array.isArray(items)) {
        return items.filter((item): item is OrderDetailItem => isRecord(item));
    }
    if (!isRecord(items)) return [];

    return Object.values(items).flatMap((group) => {
        if (!group) return [];
        if (Array.isArray(group)) {
            return group.filter((item): item is OrderDetailItem => isRecord(item));
        }
        if (isRecord(group) && Array.isArray(group.items)) {
            return group.items.filter((item): item is OrderDetailItem =>
                isRecord(item),
            );
        }
        if (isRecord(group) && (group.product_name != null || group.id != null)) {
            return [group as unknown as OrderDetailItem];
        }
        return [];
    });
}

function numericAmount(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
        const parsed = Number(value.replace(/,/g, ""));
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
}

export function formatOrderMoney(
    source: {
        amount?: unknown;
        formatted?: string | null;
        currencies?: ApiDualCurrencies | null;
    },
    currencyCode: string | undefined,
    formatPrice: (amount: number) => string,
): string {
    const fromMap = pickCurrencyFormatted(source.currencies, currencyCode);
    if (fromMap) return fromMap;

    const formatted = source.formatted?.trim();
    if (formatted) return selectFormattedForCurrency(formatted, currencyCode);

    const amount = numericAmount(source.amount);
    if (amount != null) return formatPrice(amount);
    return formatPrice(0);
}
