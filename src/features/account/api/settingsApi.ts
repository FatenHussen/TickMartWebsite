import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";

export interface AppSettingsContact {
    phone: string;
    whatsapp: string;
    email: string;
}

export interface AppSettingsColorPalette {
    main_color?: string;
    text_color?: string;
    second_color?: string;
}

/** CMS copy for the home quick-order banner (may be plain or localized). */
export type QuickOrderLocalized =
    | string
    | { ar?: string | null; en?: string | null }
    | null
    | undefined;

export interface QuickOrderStep {
    title?: QuickOrderLocalized;
    subtitle?: QuickOrderLocalized;
    description?: QuickOrderLocalized;
    icon?: string | null;
}

export type QuickOrderCardVariant = "horizontal" | "vertical" | "square" | string;

/**
 * `data.quick_order` from `GET /user/settings`.
 * Header CTA follows `is_enabled`; the section follows `page_slugs` / `page_ids`.
 */
export interface QuickOrderSettings {
    is_enabled?: boolean;
    /** CMS page ids allowed to show the section (optional; prefer `page_slugs` on web). */
    page_ids?: number[] | null;
    /** Page builder slugs allowed to show the section (default: `["home"]`). */
    page_slugs?: string[] | null;
    background_image?: string | null;
    background_color?: string | null;
    card_background_color?: string | null;
    card_variant?: QuickOrderCardVariant | null;
    badge?: QuickOrderLocalized;
    title?: QuickOrderLocalized;
    subtitle?: QuickOrderLocalized;
    cta?: QuickOrderLocalized;
    steps?: QuickOrderStep[] | null;
}

export interface AppSettingsData {
    welcome?: { image?: string[]; text?: string };
    login?: { image?: string; link?: string };
    contact?: AppSettingsContact;
    color?: AppSettingsColorPalette;
    dark_color?: AppSettingsColorPalette;
    quick_order?: QuickOrderSettings | null;
}

export interface AppSettingsResponse {
    status: boolean;
    message: string;
    data: AppSettingsData;
}

export const settingsApi = {
    getSettings: async (): Promise<AppSettingsData> => {
        const res = await _axios.get<AppSettingsResponse>(apiRoutes.settings.get);
        return res.data?.data ?? {};
    },
};
