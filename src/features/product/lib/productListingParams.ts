import type { ProductsFilters } from "@/features/home/api/products.service";

const SORT_VALUES = [
    "price_desc",
    "price_asc",
    "newest",
    "oldest",
    "rating",
] as const;

const TYPE_VALUES = [
    "new",
    "trend",
    "top_rated",
    "offers",
    "recommended",
    "for_you",
    "search_based",
    "most_popular",
    "latest_flash_sale",
] as const;

function parseSortBy(v: string | null): ProductsFilters["sort_by"] | undefined {
    if (!v) return undefined;
    return (SORT_VALUES as readonly string[]).includes(v)
        ? (v as ProductsFilters["sort_by"])
        : undefined;
}

function parseType(v: string | null): ProductsFilters["type"] | undefined {
    if (!v) return undefined;
    return (TYPE_VALUES as readonly string[]).includes(v)
        ? (v as ProductsFilters["type"])
        : undefined;
}

function parseBool(v: string | null): boolean | undefined {
    if (v === null || v === "") return undefined;
    if (v === "1" || v === "true") return true;
    if (v === "0" || v === "false") return false;
    return undefined;
}

function parseIntOpt(v: string | null): number | undefined {
    if (v === null || v === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
}

/** Build filters from URL search params (shareable product listing URLs). */
export function parseProductListingParams(searchParams: URLSearchParams): ProductsFilters {
    const attrKeys = ["attribute_values[]", "attribute_values"];
    let attribute_values: number[] | undefined;
    for (const key of attrKeys) {
        const raw = searchParams.getAll(key);
        if (raw.length) {
            attribute_values = raw
                .map((s) => Number(s))
                .filter((n) => Number.isFinite(n));
            break;
        }
    }

    return {
        category_id: parseIntOpt(searchParams.get("category_id")),
        shop_id: parseIntOpt(searchParams.get("shop_id")),
        brand_id: parseIntOpt(searchParams.get("brand_id")),
        price_min: parseIntOpt(searchParams.get("price_min")),
        price_max: parseIntOpt(searchParams.get("price_max")),
        country: searchParams.get("country")?.trim() || undefined,
        type: parseType(searchParams.get("type")),
        search: searchParams.get("search")?.trim() || undefined,
        sort_by: parseSortBy(searchParams.get("sort_by")),
        is_free_delivery: parseBool(searchParams.get("is_free_delivery")),
        is_instant_delivery: parseBool(searchParams.get("is_instant_delivery")),
        on_sale: parseBool(searchParams.get("on_sale")),
        in_stock_only: parseBool(searchParams.get("in_stock_only")),
        ...(attribute_values?.length ? { attribute_values } : {}),
    };
}

function appendBool(params: URLSearchParams, key: string, v: boolean | undefined) {
    if (v === true) params.set(key, "true");
}

/** Serialize filters to query string (omit undefined / false flags). */
export function serializeProductListingParams(f: ProductsFilters): string {
    const params = new URLSearchParams();

    if (f.category_id != null) params.set("category_id", String(f.category_id));
    if (f.shop_id != null) params.set("shop_id", String(f.shop_id));
    if (f.brand_id != null) params.set("brand_id", String(f.brand_id));
    if (f.price_min != null) params.set("price_min", String(f.price_min));
    if (f.price_max != null) params.set("price_max", String(f.price_max));
    if (f.country) params.set("country", f.country.trim());
    if (f.type) params.set("type", f.type);
    if (f.search) params.set("search", f.search.trim());
    if (f.sort_by) params.set("sort_by", f.sort_by);

    appendBool(params, "is_free_delivery", f.is_free_delivery === true);
    appendBool(params, "is_instant_delivery", f.is_instant_delivery === true);
    appendBool(params, "on_sale", f.on_sale === true);
    appendBool(params, "in_stock_only", f.in_stock_only === true);

    f.attribute_values?.forEach((id) =>
        params.append("attribute_values[]", String(id))
    );

    return params.toString();
}
