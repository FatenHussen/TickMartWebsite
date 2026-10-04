export type SearchResultType = "product" | "brand" | "shop" | "recipe";

export interface SearchResultItem {
    id: number;
    name: string | { ar?: string | null; en?: string | null };
    image: string | null;
    thumbnail?: string | null;
}

export interface SearchResultWithType extends SearchResultItem {
    type: SearchResultType;
}

export interface SearchApiResponse {
    data: SearchResultItem[];
}
