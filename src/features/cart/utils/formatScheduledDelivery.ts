/** Admin-set `scheduled_delivery_at` (`YYYY-MM-DD HH:mm`). Empty when missing. */
export function formatScheduledDeliveryAt(
    value: string | null | undefined,
    locale: string,
): string | null {
    if (value == null) return null;
    const trimmed = String(value).trim();
    if (!trimmed || trimmed.toLowerCase() === "null") return null;

    const normalized = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return trimmed;

    const loc = locale.toLowerCase().startsWith("ar") ? "ar" : "en";
    return new Intl.DateTimeFormat(loc, {
        weekday: "long",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}
