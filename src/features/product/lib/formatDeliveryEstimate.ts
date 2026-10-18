import type { TFunction } from "i18next";
import {
    resolveLocalizedText,
    type LocalizedTextValue,
} from "@/shared/lib/localizedText";

export type DeliveryWindowHours = { min: number; max: number };

/**
 * Pull min/max hours out of API delivery strings such as `12-48 ساعة`
 * or `25 hours`. Returns null when the value is free-form text.
 */
export function parseDeliveryWindowHours(
    raw: string,
): DeliveryWindowHours | null {
    const normalized = raw
        .trim()
        .replace(/[–—]/g, "-")
        .replace(/\s+/g, " ");

    const range = normalized.match(
        /^(\d+(?:\.\d+)?)\s*[-\/]\s*(\d+(?:\.\d+)?)\s*(?:ساعة|ساعات|hours?|hrs?|h)?$/i,
    );
    if (range) {
        const min = Number(range[1]);
        const max = Number(range[2]);
        if (Number.isFinite(min) && Number.isFinite(max)) {
            return { min, max };
        }
    }

    const single = normalized.match(
        /^(\d+(?:\.\d+)?)\s*(?:ساعة|ساعات|hours?|hrs?|h)$/i,
    );
    if (single) {
        const hours = Number(single[1]);
        if (Number.isFinite(hours)) {
            return { min: hours, max: hours };
        }
    }

    return null;
}

/**
 * Display label for product `delivery_time` / `time_prepare`.
 * Re-formats known hour windows with i18n so English UI does not keep Arabic units.
 */
export function formatDeliveryEstimateLabel(
    value: LocalizedTextValue,
    language: string,
    t: TFunction,
): string | null {
    const text = resolveLocalizedText(value, language).trim();
    if (!text) return null;

    const window = parseDeliveryWindowHours(text);
    if (!window) return text;

    if (window.min === window.max) {
        return t("cart.deliveryWindowSame", "{{hours}} hours", {
            hours: window.min,
        });
    }

    return t("cart.deliveryWindow", "{{min}}–{{max}} hours", {
        min: window.min,
        max: window.max,
    });
}
