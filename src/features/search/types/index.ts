export type SearchResultType = "product" | "brand" | "shop" | "recipe";

export interface SearchResultItem {
    id: number;
    name: string;
    image: string | null;
}

export interface SearchResultWithType extends SearchResultItem {
    type: SearchResultType;
}

export interface SearchApiResponse {
    data: SearchResultItem[];
}
