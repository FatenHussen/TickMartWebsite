export type CategoryAttributeUiType = "square" | "color" | "circle";

export interface CategoryAttributeValue {
    id: number;
    name: string;
}

export interface CategoryAttribute {
    id: number;
    name: string;
    type: CategoryAttributeUiType;
    values: CategoryAttributeValue[];
}

export interface CategoryAttributesResponse {
    status: boolean;
    message: string;
    data: CategoryAttribute[];
}
