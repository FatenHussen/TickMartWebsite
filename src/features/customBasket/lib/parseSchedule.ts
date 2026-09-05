import type { ScheduleBadge, ScheduleItem } from "@/features/cart/types";
import { toStorageUrl } from "@/shared/lib/storageUrl";
import {
    asNumber,
    asRecord,
    asString,
    unwrapApiList,
    unwrapApiObject,
} from "./unwrapApi";

function parseDiscountType(
    raw: unknown,
): ScheduleItem["discount_type"] {
    const value = asString(raw);
    if (value === "percentage" || value === "fixed") return value;
    return null;
}

function parseBadges(raw: unknown): ScheduleBadge[] {
    if (!Array.isArray(raw)) return [];
    return raw
        .map((entry): ScheduleBadge | null => {
            const row = asRecord(entry);
            if (!row) return null;
            const name = asString(row.name);
            if (!name) return null;
            return {
                id: asNumber(row.id) ?? undefined,
                name,
                image: toStorageUrl(asString(row.image)) ?? asString(row.image),
                color: asString(row.color),
                type: asString(row.type),
                position: asString(row.position),
            };
        })
        .filter((b): b is ScheduleBadge => b != null);
}

/** Contract fields only: `image` and `images[]` as URL strings. No aliases. */
function parseImageList(raw: unknown, fallback?: string | null): string[] {
    const urls: string[] = [];
    if (Array.isArray(raw)) {
        for (const item of raw) {
            if (typeof item !== "string" || !item.trim()) continue;
            const url = toStorageUrl(item) ?? item;
            if (url) urls.push(url);
        }
    }
    if (fallback && !urls.includes(fallback)) {
        urls.unshift(fallback);
    }
    return urls;
}

export function parseScheduleItem(raw: unknown): ScheduleItem | null {
    const row = asRecord(raw);
    if (!row) return null;
    const id = asNumber(row.id);
    const name = asString(row.name);
    if (id == null || !name) return null;

    const image = toStorageUrl(asString(row.image)) ?? asString(row.image);
    const images = parseImageList(row.images, image);

    return {
        id,
        name,
        description: asString(row.description),
        interval_days: asNumber(row.interval_days) ?? 0,
        discount_type: parseDiscountType(row.discount_type),
        discount_value: asNumber(row.discount_value) ?? 0,
        is_active: row.is_active === false ? false : true,
        image,
        images,
        top_badges: parseBadges(row.top_badges),
        bottom_badges: parseBadges(row.bottom_badges),
    };
}

export function parseScheduleList(payload: unknown): ScheduleItem[] {
    return unwrapApiList(payload)
        .map(parseScheduleItem)
        .filter((item): item is ScheduleItem => item != null)
        .filter((item) => item.is_active !== false);
}

export function parseScheduleDetail(payload: unknown): ScheduleItem | null {
    const obj = unwrapApiObject(payload);
    if (!obj) return parseScheduleItem(payload);
    if (obj.item) return parseScheduleItem(obj.item);
    if (obj.schedule) return parseScheduleItem(obj.schedule);
    return parseScheduleItem(obj);
}
