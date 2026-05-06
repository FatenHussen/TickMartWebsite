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

export type PopupTriggerType = "delay" | "scroll" | "exit" | "load" | (string & {});

export type PopupTrigger = {
    type?: PopupTriggerType;
    value?: number;
};

export type PopupFrequency = {
    /** Cooldown between impressions, in minutes */
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
    products?: unknown[];
    shops?: unknown[];
    recipes?: unknown[];
    baskets?: unknown[];
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
    | "product"
    | "cart"
    | "checkout"
    | "shop"
    | "recipe"
    | "basket"
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
