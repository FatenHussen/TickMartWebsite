import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { resolveLocalizedText } from "@/shared/lib/localizedText";
import { useAppSettings } from "./useAppSettings";
import type {
    QuickOrderSettings,
    QuickOrderLocalized,
    QuickOrderStep,
} from "../api/settingsApi";

export type ResolvedQuickOrderStep = {
    title: string;
    subtitle: string;
};

export type ResolvedQuickOrder = {
    isEnabled: boolean;
    /** Slugs where the section may render. Defaults to `["home"]`. */
    pageSlugs: string[];
    pageIds: number[];
    backgroundImage: string | null;
    backgroundColor: string | null;
    cardBackgroundColor: string | null;
    cardVariant: string;
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
    steps: ResolvedQuickOrderStep[];
    /** Section visibility for the current CMS / static page slug. */
    isVisibleOnPage: (pageSlug: string) => boolean;
};

function resolveCopy(value: QuickOrderLocalized, language: string): string {
    return resolveLocalizedText(value, language).trim();
}

function resolveSteps(
    steps: QuickOrderStep[] | null | undefined,
    language: string,
): ResolvedQuickOrderStep[] {
    if (!Array.isArray(steps) || steps.length === 0) return [];
    return steps
        .map((step) => {
            const title = resolveCopy(step.title, language);
            const description = resolveCopy(step.description, language);
            const subtitle =
                resolveCopy(step.subtitle, language) ||
                // API often sends body copy as `description` (not `subtitle`).
                (title ? description : "");
            return {
                title: title || description,
                subtitle,
            };
        })
        .filter((s) => s.title.length > 0);
}

function normalizePageSlugs(raw: QuickOrderSettings | null | undefined): string[] {
    const fromApi = Array.isArray(raw?.page_slugs)
        ? raw!.page_slugs!
              .map((s) => (typeof s === "string" ? s.trim().toLowerCase() : ""))
              .filter(Boolean)
        : [];
    return fromApi.length > 0 ? fromApi : ["home"];
}

function normalizePageIds(raw: QuickOrderSettings | null | undefined): number[] {
    if (!Array.isArray(raw?.page_ids)) return [];
    return raw.page_ids.filter((id): id is number => typeof id === "number" && Number.isFinite(id));
}

/**
 * Reads `settings.quick_order` and resolves localized copy for the active language.
 * - Header CTA: `is_enabled`
 * - Section: `is_enabled` AND current page in `page_slugs` (default `home`)
 * Missing `quick_order` defaults to enabled so older backends keep working.
 */
export function useQuickOrderSettings(): {
    quickOrder: ResolvedQuickOrder;
    isLoading: boolean;
    raw: QuickOrderSettings | null | undefined;
} {
    const { language } = useLanguage();
    const { data, isLoading } = useAppSettings();
    const raw = data?.quick_order;

    const quickOrder = useMemo((): ResolvedQuickOrder => {
        const isEnabled = raw?.is_enabled !== false;
        const pageSlugs = normalizePageSlugs(raw);
        const pageIds = normalizePageIds(raw);

        return {
            isEnabled,
            pageSlugs,
            pageIds,
            backgroundImage: raw?.background_image?.trim() || null,
            backgroundColor: raw?.background_color?.trim() || null,
            cardBackgroundColor: raw?.card_background_color?.trim() || null,
            cardVariant: (raw?.card_variant ?? "horizontal").toString(),
            badge: resolveCopy(raw?.badge, language),
            title: resolveCopy(raw?.title, language),
            subtitle: resolveCopy(raw?.subtitle, language),
            cta: resolveCopy(raw?.cta, language),
            steps: resolveSteps(raw?.steps, language),
            isVisibleOnPage: (pageSlug: string) => {
                if (!isEnabled) return false;
                const slug = pageSlug?.trim().toLowerCase();
                if (!slug) return false;
                return pageSlugs.includes(slug);
            },
        };
    }, [raw, language]);

    return { quickOrder, isLoading, raw };
}
