export type LocalizedString = {
    ar?: string;
    en?: string;
};

export type PopupType = "modal" | "slide_in" | "full_screen" | string;
export type PopupStatus = "active" | string;

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

export type PopupMediaType = "image" | "video" | string;

export type PopupMedia = {
    type?: PopupMediaType | null;
    path?: string | null;
};

export type PopupForm = {
    enabled?: boolean;
    fields?: string[];
};

export type PopupDisplay = {
    pages?: string[];
    audience_type?: string;
};

export type PopupTriggerType = "delay" | "scroll" | "exit" | "load" | string;

export type PopupTrigger = {
    type?: PopupTriggerType;
    value?: number;
};

export type PopupFrequency = {
    /** Cooldown between impressions, in minutes */
    show_every?: number;
    /** Cap on impressions for this campaign for one user */
    max_impressions?: number;
};

export type PopupColors = {
    main?: string | null;
    secondary?: string | null;
    text?: string | null;
    primary?: string | null;
    secondary_text?: string | null;
    main_color?: string | null;
    secondary_color?: string | null;
    text_color?: string | null;
};

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
};

export type ActivePopupResponse = {
    data: PopupCampaign | null;
};

export type PopupTrackPayload = {
    page_type?: string;
    current_url?: string;
    referrer?: string;
};

export type PopupPageType =
    | "home"
    | "category"
    | "product"
    | "cart"
    | "checkout"
    | "shop"
    | "recipe"
    | "account"
    | (string & {});
