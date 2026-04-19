import type { City } from "@/features/auth/types";
import type { PaginatedData } from "@/shared/hooks/useInfiniteSelect";

/**
 * Normalizes cities API payloads (array or `{ items, pagination }`) for infinite select.
 */
export function parseCitiesPageResponse(data: unknown): PaginatedData<City> {
    if (data == null) return { items: [], pagination: null };
    if (Array.isArray(data)) {
        return { items: data as City[], pagination: null };
    }
    if (typeof data === "object" && "items" in data) {
        const d = data as {
            items: City[];
            pagination: PaginatedData<City>["pagination"];
        };
        return {
            items: d.items,
            pagination: d.pagination ?? null,
        };
    }
    return { items: [], pagination: null };
}
