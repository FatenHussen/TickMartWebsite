import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { queryKeys } from "@/utils/queryKeys";
import {
    normalizeSectionLocalization,
    resolveLocalizableFields,
} from "@/shared/lib/sectionLocalization";
import { _CategoriesApi } from "../api/categoriesApi";
import type { CategoryPageFilters } from "../api/categoriesApi";
import type { ApiCategory, CategoryChild, CategoryPageData } from "../types";

/**
 * The category-page endpoint documents `name`/`title` as `{ ar, en }` objects,
 * while every consumer (and the shared sections renderer) expects resolved
 * strings — `resolveLocalizableFields` converts only the object values and
 * leaves plain strings alone.
 */
function normalizeChild(child: CategoryChild, language: string): CategoryChild {
    return {
        ...resolveLocalizableFields(child, language),
        children: child.children?.map((c) => normalizeChild(c, language)),
    };
}

function normalizeCategory(category: ApiCategory, language: string): ApiCategory {
    return {
        ...resolveLocalizableFields(category, language),
        children: (category.children ?? []).map((c) => normalizeChild(c, language)),
    };
}

/**
 * Page for a single category (any level): the category itself (with `children`)
 * plus admin-configured sections in the exact shape the generic sections
 * endpoint uses — feed them straight to ApiSectionsRenderer.
 *
 * `filters` are the listing's active product filters. They belong in the query
 * key as well as the request: the page's `type: "api"` sections resolve their
 * items through the same product query, so a filter change has to re-fetch this
 * endpoint or the sections stay stuck on unfiltered items.
 */
export function useCategoryPage(
    categoryId: number | undefined,
    filters?: CategoryPageFilters,
) {
    const { i18n } = useTranslation();
    const language = i18n.language || "en";

    return useQuery({
        queryKey: queryKeys.categories.page(categoryId, filters),
        queryFn: () => _CategoriesApi.getCategoryPage(categoryId as number, filters),
        enabled: categoryId != null,
        select: (response): CategoryPageData => ({
            category: normalizeCategory(response.data.category, language),
            sections: (response.data.sections ?? []).map((section) =>
                normalizeSectionLocalization(section, language)
            ),
        }),
    });
}
