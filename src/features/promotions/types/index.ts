/** Localized strings from Spatie Translatable (`name`, `description`). */
export type UserPromotionLocalizedStrings = Record<string, string>;

/** API may return either a plain string or per-locale keys. */
export type UserPromotionTextField = string | UserPromotionLocalizedStrings;

export interface UserPromotion {
    id: number;
    name: UserPromotionTextField;
    description: UserPromotionTextField;
    type: string;
    is_active: boolean;
    position: string;
    created_at: string | null;
    page_slugs: string[];
}

export interface UserPromotionsApiEnvelope {
    status: boolean;
    message: string;
    data: UserPromotion[];
}
