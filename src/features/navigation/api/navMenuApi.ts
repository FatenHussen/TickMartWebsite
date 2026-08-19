import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { NavMenuItem, NavMenuResponse } from "../types";

export const navMenuApi = {
    /**
     * Enabled items only, already ordered by the API — kept in arrival order.
     *
     * `language` overrides the interceptor's `Accept-Language`. On a language
     * switch this query's key changes and it refetches from a child effect,
     * which runs before `LanguageProvider` has told i18next about the new
     * language — so the header is pinned here rather than inferred.
     */
    getNavMenu: async (language?: string): Promise<NavMenuItem[]> => {
        const res = await _axios.get<NavMenuResponse>(apiRoutes.navMenu.list, {
            headers: language ? { "Accept-Language": language } : undefined,
        });
        return Array.isArray(res.data?.data) ? res.data.data : [];
    },
};
