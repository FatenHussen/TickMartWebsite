import type { Area } from "@/features/auth/types";
import type { PaginatedData } from "@/shared/hooks/useInfiniteSelect";

/**
 * Normalizes areas API payloads (array or `{ items }`) for infinite select — same logic as the legacy form.
 */
export function parseAreasPageForSelect(data: unknown): PaginatedData<Area> {
    if (data == null) return { items: [], pagination: null };
    if (Array.isArray(data)) {
        return { items: data as Area[], pagination: null };
    }
    if (typeof data === "object" && data !== null && "items" in data) {
        const parsed = data as {
            items: Area[];
            pagination?: PaginatedData<Area>["pagination"];
        };
        return {
            items: parsed.items,
            pagination: parsed.pagination ?? null,
        };
    }
    return { items: [], pagination: null };
}
