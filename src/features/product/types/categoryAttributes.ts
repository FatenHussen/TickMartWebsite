import type { LocalizedTextValue } from "@/shared/lib/localizedText";

export type CategoryAttributeUiType = "square" | "color" | "circle";

export interface CategoryAttributeValue {
    id: number;
    name: LocalizedTextValue;
}

export interface CategoryAttribute {
    id: number;
    category_id?: number;
    /** Same for every node in the tree — use as the React Query cache key. */
    root_category_id?: number | null;
    name: LocalizedTextValue;
    type: CategoryAttributeUiType | string;
    values: CategoryAttributeValue[];
}

export interface CategoryAttributesResponse {
    status: boolean;
    message: string;
    data: CategoryAttribute[];
}
