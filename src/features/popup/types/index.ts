// ─── Primitives ──────────────────────────────────────────────────────────────

export type LocalizedString = {
    ar?: string;
    en?: string;
};

export type Language = "ar" | "en";

// ─── Popup core ──────────────────────────────────────────────────────────────

export type PopupType = "modal" | "slide_in" | "full_screen" | (string & {});
export type PopupStatus = "active" | "inactive" | (string & {});

export type PopupContent = {
    headline?: LocalizedString | null;
    subheadline?: LocalizedString | null;
    description?: LocalizedString | null;
};

export type PopupButtons = {
    primary?: string | null;
    secondary?: string | null;
    url?: string | null;
};

export type PopupMediaType = "image" | "video" | (string & {});

export type PopupMedia = {
    type?: PopupMediaType | null;
    path?: string | null;
    alt?: LocalizedString | string | null;
    poster?: string | null; // video poster image
};

// ─── Form system ─────────────────────────────────────────────────────────────

export type PopupFormFieldType =
    | "text"
    | "email"
    | "phone"
    | "textarea"
    | "select"
    | "checkbox";

export type PopupFormFieldOption = {
    value: string;
    label: LocalizedString | string;
};

export type PopupFormFieldValidation = {
    min?: number;
    max?: number;
    pattern?: string;
    message?: LocalizedString | string;
};

export type PopupFormField = {
    name: string;
    type: PopupFormFieldType;
    label?: LocalizedString | string | null;
    placeholder?: LocalizedString | string | null;
    required?: boolean;
    validation?: PopupFormFieldValidation;
    options?: PopupFormFieldOption[]; // for select
    default_value?: string;
};

export type PopupForm = {
    enabled?: boolean;
    fields?: PopupFormField[];
    submit_url?: string | null;
    success_message?: LocalizedString | string | null;
};

// ─── Display / trigger / frequency ──────────────────────────────────────────

export type PopupDisplay = {
    pages?: string[];
    audience_type?: string;
};

export type PopupTriggerType =
    | "delay"
    | "scroll"
    | "exit_intent"
    | "exit"
    | "on_load"
    | "load"
    | (string & {});

export type PopupTrigger = {
    type?: PopupTriggerType;
    value?: number;
};

export type PopupFrequency = {
    /** Cooldown between impressions, in days (0 = no daily wait) */
    show_every?: number;
    /** Cap on total impressions for this campaign per user */
    max_impressions?: number;
    /** Don't show again today after first impression */
    once_per_day?: boolean;
};

// ─── Theme / colors ──────────────────────────────────────────────────────────

export type PopupColors = {
    main?: string | null;
    secondary?: string | null;
    text?: string | null;
    primary?: string | null;
    secondary_text?: string | null;
    main_color?: string | null;
    secondary_color?: string | null;
    text_color?: string | null;
    accent?: string | null;
    accent_color?: string | null;
    foreground?: string | null;
    font_color?: string | null;
    background?: string | null;
    bg_color?: string | null;
};

// ─── Entity scoping ──────────────────────────────────────────────────────────

export type PopupEntityContext = {
    product_id?: number;
    shop_id?: number;
    recipe_id?: number;
    basket_id?: number;
    shop_vendor_service_id?: number;
};

// ─── Attached entities ─────────────────────────────────────────────────────────

/**
 * Permissive shape for an entity attached to a campaign/promotion. The backend
 * serializes each entity with its own `AllResource`/`UserOneResource`, so field
 * names vary between models — we probe a handful of likely keys at flatten time.
 */
export type PopupEntityResource = {
    id: number;
    name?: LocalizedString | string | null;
    title?: LocalizedString | string | null;
    subtitle?: LocalizedString | string | null;
    description?: LocalizedString | string | null;
    image?: string | null;
    image_url?: string | null;
    logo_url?: string | null;
    media?: string | { path?: string | null } | null;
    rating?: number | null;
    is_restaurant?: boolean | null;
    is_service_provider?: boolean | null;
    [key: string]: unknown;
};

/**
 * A promotion attached to the campaign. Carries its own theme/end-date and may
 * itself relate to typed entity arrays. Field names are probed defensively.
 */
export type PopupPromotionResource = {
    id: number;
    name?: LocalizedString | string | null;
    title?: LocalizedString | string | null;
    main_color?: string | null;
    second_color?: string | null;
    main?: string | null;
    secondary?: string | null;
    end_date?: string | null;
    ends_at?: string | null;
    end_time?: string | null;
    products?: PopupEntityResource[];
    restaurants?: PopupEntityResource[];
    serviceProviders?: PopupEntityResource[];
    shops?: PopupEntityResource[];
    recipes?: PopupEntityResource[];
    baskets?: PopupEntityResource[];
    shop_vendor_services?: PopupEntityResource[];
    [key: string]: unknown;
};

/** Polymorphic entity kinds that a promotion popup can route to. */
export type PopupEntityType =
    | "product"
    | "shop"
    | "restaurant"
    | "service_provider"
    | "recipe"
    | "basket"
    | "shop_vendor_service";

/**
 * Normalized, render-ready item produced by flattening the nested
 * promotion/entity payload. Each item inherits its parent promotion's title,
 * theme colors, and end time.
 */
export type PromotionListItem = {
    /** `${entityType}:${entityId}` — stable React key and dedupe identity. */
    key: string;
    entityType: PopupEntityType;
    entityId: number;
    /** Already localized for the active language. */
    name: string;
    subtitle?: string;
    image?: string;
    rating?: number;
    /** Inherited from the parent promotion (or campaign title as fallback). */
    promotionTitle?: string;
    mainColor?: string | null;
    secondColor?: string | null;
    /** Inherited ISO 8601 end date driving the countdown. */
    endTime?: string | null;
};

// ─── Campaign ────────────────────────────────────────────────────────────────

export type PopupCampaign = {
    id: number;
    title: LocalizedString;
    slug: string;
    type: PopupType;
    status: PopupStatus;
    priority: number;
    content?: PopupContent;
    buttons?: PopupButtons;
    media?: PopupMedia;
    form?: PopupForm;
    display?: PopupDisplay;
    trigger?: PopupTrigger;
    frequency?: PopupFrequency;
    colors?: PopupColors;
    theme?: PopupColors;
    scoped_to_entities?: boolean;
    products?: PopupEntityResource[];
    restaurants?: PopupEntityResource[];
    serviceProviders?: PopupEntityResource[];
    shops?: PopupEntityResource[];
    recipes?: PopupEntityResource[];
    baskets?: PopupEntityResource[];
    shop_vendor_services?: PopupEntityResource[];
    promotions?: PopupPromotionResource[];
};

// ─── API shapes ──────────────────────────────────────────────────────────────

export type PopupActiveParams = PopupEntityContext & {
    page_type?: string;
    current_url?: string;
};

export type ActivePopupResponse = {
    data: PopupCampaign | null;
};

export type PopupTrackPayload = {
    page_type?: string;
    current_url?: string;
    referrer?: string;
};

export type PopupTrackDismissPayload = PopupTrackPayload & {
    reason?: "close_button" | "backdrop" | "escape" | "secondary_cta" | "timeout";
};

export type PopupFormSubmitPayload = {
    page_type?: string;
    current_url?: string;
    fields: Record<string, string | boolean>;
};

// ─── Page / route ────────────────────────────────────────────────────────────

export type PopupPageType =
    | "home"
    | "category"
    | "product_details"
    | "shop_details"
    | "recipe_details"
    | "basket_details"
    | "cart"
    | "account"
    | (string & {});

// ─── Queue ───────────────────────────────────────────────────────────────────

export type PopupQueueEntry = {
    popup: PopupCampaign;
    enqueuedAt: number;
};

// ─── Tracking event ──────────────────────────────────────────────────────────

export type PopupTrackEvent =
    | "view"
    | "click"
    | "dismiss"
    | "form_submit"
    | "form_error";

// ─── Theme resolved ──────────────────────────────────────────────────────────

export type PopupTheme = {
    main: string;
    secondary: string;
    text: string;
};

// ─── Close reason ────────────────────────────────────────────────────────────

export type PopupCloseReason =
    | "close_button"
    | "backdrop"
    | "escape"
    | "secondary_cta"
    | "primary_cta"
    | "form_submit";
