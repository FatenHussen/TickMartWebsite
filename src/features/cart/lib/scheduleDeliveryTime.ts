/** Clock time `HH:mm` with no seconds. Returns null when the value is missing or not a time. */
export function normalizeDeliveryTime(value: unknown): string | null {
    if (typeof value !== "string") return null;
    const match = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(value.trim());
    if (!match) return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours > 23 || minutes > 59) return null;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** Fields to send on create/update. Omits a missing time so old schedules stay without an invented hour. */
export function scheduledBasketTimingFields(source: {
    start_date?: string | null;
    delivery_time?: string | null;
}): { start_date?: string; delivery_time?: string } {
    const startDate = source.start_date?.trim();
    const deliveryTime = normalizeDeliveryTime(source.delivery_time);
    return {
        ...(startDate ? { start_date: startDate } : {}),
        ...(deliveryTime ? { delivery_time: deliveryTime } : {}),
    };
}
