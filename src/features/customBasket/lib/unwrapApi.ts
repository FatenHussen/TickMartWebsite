/** Pull `data` out of `{ success, data }` / `{ status, data }` envelopes. */
export function unwrapApiData(payload: unknown): unknown {
    if (!payload || typeof payload !== "object") return payload;
    const root = payload as Record<string, unknown>;
    if ("data" in root) return root.data;
    return payload;
}

export function unwrapApiList(payload: unknown): unknown[] {
    const data = unwrapApiData(payload);
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") {
        const d = data as Record<string, unknown>;
        if (Array.isArray(d.items)) return d.items;
        if (Array.isArray(d.data)) return d.data;
    }
    return [];
}

export function unwrapApiObject(
    payload: unknown,
): Record<string, unknown> | null {
    const data = unwrapApiData(payload);
    if (data && typeof data === "object" && !Array.isArray(data)) {
        return data as Record<string, unknown>;
    }
    return null;
}

export function asRecord(value: unknown): Record<string, unknown> | null {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value as Record<string, unknown>;
    }
    return null;
}

export function asString(value: unknown): string | null {
    if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed.length ? trimmed : null;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
        return String(value);
    }
    return null;
}

export function asNumber(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
        const n = Number(value);
        return Number.isFinite(n) ? n : null;
    }
    return null;
}
