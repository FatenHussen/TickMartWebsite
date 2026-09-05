import type { ScheduleItem } from "@/features/cart/types";
import { toStorageUrl } from "@/shared/lib/storageUrl";
import type {
    CustomBasketLine,
    CustomBasketState,
    CustomBasketSummary,
    ConfirmCartItem,
    ConfirmCustomBasketResult,
} from "../types";
import { parseScheduleItem } from "./parseSchedule";
import {
    asNumber,
    asRecord,
    asString,
    unwrapApiObject,
} from "./unwrapApi";

function formatVariantLabel(raw: unknown): string {
    if (!raw) return "";
    if (Array.isArray(raw)) {
        return raw.map((v) => asString(v)).filter(Boolean).join(" · ");
    }
    const rec = asRecord(raw);
    if (!rec) return asString(raw) ?? "";
    if (Array.isArray(rec.name)) {
        return rec.name.map((v) => asString(v)).filter(Boolean).join(" · ");
    }
    if (Array.isArray(rec.attributes)) {
        return rec.attributes
            .map((attr) => {
                const a = asRecord(attr);
                return asString(a?.value) ?? asString(a?.name);
            })
            .filter(Boolean)
            .join(" · ");
    }
    return asString(rec.name) ?? "";
}

function parseProductImage(raw: unknown): string {
    if (typeof raw === "string") return toStorageUrl(raw) ?? raw;
    const rec = asRecord(raw);
    if (!rec) return "";
    const path =
        asString(rec.path) ??
        asString(rec.url) ??
        asString(rec.image) ??
        asString(rec.thumbnail);
    return toStorageUrl(path) ?? path ?? "";
}

function parseLine(raw: unknown): CustomBasketLine | null {
    const row = asRecord(raw);
    if (!row) return null;
    const id = asNumber(row.id);
    const qty = asNumber(row.quantity) ?? 1;
    const productRec = asRecord(row.product) ?? {};
    const shopRec = asRecord(row.shop);
    const brandRec = asRecord(productRec.brand);
    const spv =
        asNumber(row.shop_product_variant_id) ??
        asNumber(row.shop_product_variant) ??
        asNumber(asRecord(row.variant)?.id) ??
        asNumber(row.variant_id);

    if (id == null || spv == null) return null;

    const productName =
        asString(productRec.name) ?? asString(row.name) ?? "";
    const image =
        parseProductImage(productRec.image) ||
        parseProductImage(row.image) ||
        parseProductImage(productRec.thumbnail);

    return {
        id,
        quantity: qty,
        unit: asString(row.unit),
        shop_product_variant_id: spv,
        original_price_formatted:
            asString(row.original_price_formatted) ??
            asString(row.line_total_formatted) ??
            asString(row.price_formatted),
        line_total_formatted:
            asString(row.line_total_formatted) ??
            asString(row.original_price_formatted),
        variantLabel: formatVariantLabel(row.variant ?? row.variant_name),
        product: {
            id: asNumber(productRec.id) ?? undefined,
            name: productName,
            image,
            brand: brandRec
                ? {
                      id: asNumber(brandRec.id) ?? undefined,
                      name: asString(brandRec.name) ?? undefined,
                  }
                : null,
        },
        shop: shopRec
            ? {
                  id: asNumber(shopRec.id) ?? undefined,
                  name: asString(shopRec.name) ?? undefined,
              }
            : null,
    };
}

function emptySummary(): CustomBasketSummary {
    return {
        items_count: 0,
        total_quantity: 0,
        original_price_formatted: null,
        discount_value: null,
        discount_type: null,
        savings_formatted: null,
        final_price_formatted: null,
    };
}

function parseSummary(raw: unknown): CustomBasketSummary {
    const row = asRecord(raw);
    if (!row) return emptySummary();
    return {
        items_count: asNumber(row.items_count) ?? 0,
        total_quantity: asNumber(row.total_quantity) ?? 0,
        original_price_formatted: asString(row.original_price_formatted),
        discount_value: asNumber(row.discount_value),
        discount_type:
            asString(row.discount_type) === "percentage" ||
            asString(row.discount_type) === "fixed"
                ? (asString(row.discount_type) as "percentage" | "fixed")
                : null,
        savings_formatted: asString(row.savings_formatted),
        final_price_formatted:
            asString(row.final_price_formatted) ??
            asString(row.total_formatted),
    };
}

export function parseCustomBasket(
    payload: unknown,
    fallbackSchedule?: ScheduleItem | null,
): CustomBasketState {
    const obj = unwrapApiObject(payload) ?? asRecord(payload) ?? {};
    const basket = asRecord(obj.basket) ?? obj;
    const itemsRaw = Array.isArray(basket.items)
        ? basket.items
        : Array.isArray(obj.items)
          ? obj.items
          : [];
    const schedule =
        parseScheduleItem(obj.schedule ?? basket.schedule) ??
        fallbackSchedule ??
        null;
    const items = itemsRaw
        .map(parseLine)
        .filter((line): line is CustomBasketLine => line != null);

    const summary = parseSummary(obj.summary ?? basket.summary);
    if (!asRecord(obj.summary ?? basket.summary)) {
        summary.items_count = items.length;
        summary.total_quantity = items.reduce((sum, i) => sum + i.quantity, 0);
    }

    const isDraftRaw = basket.is_draft ?? obj.is_draft;
    const is_draft = isDraftRaw === false ? false : true;

    return { schedule, items, summary, is_draft };
}

function parseCartItem(raw: unknown): ConfirmCartItem | null {
    const row = asRecord(raw);
    if (!row) return null;
    const spv = asNumber(row.shop_product_variant_id);
    const qty = asNumber(row.quantity);
    if (spv == null || qty == null || qty <= 0) return null;
    return { shop_product_variant_id: spv, quantity: qty };
}

export function parseConfirmResult(payload: unknown): ConfirmCustomBasketResult {
    const obj = unwrapApiObject(payload) ?? asRecord(payload) ?? {};
    const rawList =
        (Array.isArray(obj.cart_items) && obj.cart_items) ||
        (Array.isArray(asRecord(obj.data)?.cart_items) &&
            (asRecord(obj.data)?.cart_items as unknown[])) ||
        [];
    const scheduledRaw = obj.scheduled ?? asRecord(obj.data)?.scheduled;
    const nextRun = asString(obj.next_run_date) ?? asString(asRecord(obj.data)?.next_run_date);
    return {
        cart_items: rawList
            .map(parseCartItem)
            .filter((i): i is ConfirmCartItem => i != null),
        scheduled: scheduledRaw === true,
        next_run_date: nextRun,
        raw: payload,
    };
}
