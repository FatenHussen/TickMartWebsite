import { useMemo } from "react";
import { useQueries, type UseQueryResult } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { _CategoriesApi } from "../api/categoriesApi";
import type { ApiCategory, CategoriesResponse, CategoryChild } from "../types";

/**
 * Short enough that a dashboard delete/create shows up after a quick revisit,
 * but long enough that walking back up the trail is usually a cache hit.
 */
const LEVEL_STALE_TIME = 30_000;

export type CategoryLevel = {
    /** `undefined` for the root level. */
    parentId: number | undefined;
    parent: ApiCategory | null;
    items: ApiCategory[];
    isLoading: boolean;
    /** True when the API could not serve this level and we fell back to `parent.children`. */
    isDegraded: boolean;
};

function toApiCategory(child: CategoryChild): ApiCategory {
    return {
        id: child.id,
        name: child.name,
        icon: child.icon ?? null,
        main_color: child.main_color ?? null,
        second_color: child.second_color ?? null,
        mainColor: child.mainColor ?? null,
        secondColor: child.secondColor ?? null,
        children: child.children ?? [],
    };
}

/**
 * A trail id the local level list cannot confirm. It is still browsed — only its
 * label/colors are unknown until `/categories/{id}/page` answers.
 */
function unresolvedCategory(id: number): ApiCategory {
    return { id, name: "", icon: null, children: [] };
}

/**
 * `?parent_id=` is supported by the route builder but has never been exercised
 * against the backend, so a level is only trusted when the response actually
 * looks like the children of `parent`. Otherwise we degrade to the `children[]`
 * the parent already carries — names only, no icons, and no deeper drilling.
 */
function resolveLevelItems(
    parent: ApiCategory | null,
    apiItems: ApiCategory[] | undefined,
    rootIds: Set<number>,
    isError: boolean,
): { items: ApiCategory[]; isDegraded: boolean } {
    const declared = parent?.children ?? [];

    if (!isError && apiItems && apiItems.length > 0) {
        const declaredIds = new Set(declared.map((child) => child.id));
        const echoesParent = parent != null && apiItems.some((c) => c.id === parent.id);
        // An id belongs to exactly one node in a tree: an all-roots response
        // means the server ignored `parent_id` and returned the top-level list.
        const looksLikeRootList =
            rootIds.size > 0 && apiItems.every((c) => rootIds.has(c.id));
        const matchesDeclared =
            declaredIds.size === 0 || apiItems.some((c) => declaredIds.has(c.id));

        if (!echoesParent && !looksLikeRootList && matchesDeclared) {
            return { items: apiItems, isDegraded: false };
        }
    }

    return { items: declared.map(toApiCategory), isDegraded: true };
}

/**
 * Resolves every level of a drill-down trail in parallel.
 *
 * `[undefined, ...trail]` — the root level is queried with no filters at all,
 * which is why no `enabled` guard is needed: `parent_id: undefined` is never sent.
 */
export function useCategoryLevels(trail: number[]) {
    const parentIds = useMemo<(number | undefined)[]>(
        () => [undefined, ...trail],
        [trail],
    );

    const results = useQueries({
        queries: parentIds.map((parentId) => ({
            // The root shares the plain key with useCategories(), so the sidebar,
            // the home strip and this hook all read one cache entry.
            queryKey:
                parentId == null
                    ? queryKeys.categories.list()
                    : queryKeys.categories.list({ parent_id: parentId }),
            queryFn: () =>
                _CategoriesApi.getCategories(
                    parentId == null ? undefined : { parent_id: parentId },
                ),
            select: (response: CategoriesResponse) => response.data.items,
            staleTime: LEVEL_STALE_TIME,
            refetchOnWindowFocus: true,
            refetchOnMount: "always",
        })),
        // The queries array is dynamic, so annotate rather than let TS chase the
        // per-index tuple inference (which loops back through this hook's return).
    }) as UseQueryResult<ApiCategory[], Error>[];

    return useMemo(() => {
        const rootItems: ApiCategory[] = results[0]?.data ?? [];
        const rootIds = new Set(rootItems.map((c) => c.id));

        const levels: CategoryLevel[] = [];
        /** One entry per trail id, so crumb index === depth even when a level is unknown. */
        const breadcrumb: ApiCategory[] = [];
        let parent: ApiCategory | null = null;

        for (let i = 0; i < parentIds.length; i++) {
            const result = results[i];
            const isLoading = Boolean(result?.isPending);
            // Explicit `let` bindings: `parent` feeds `items` and `items` feeds the
            // next `parent`, which TS reads as a circular initializer otherwise.
            let items: ApiCategory[];
            let isDegraded: boolean;
            if (i === 0) {
                items = rootItems;
                isDegraded = false;
            } else {
                const resolved = resolveLevelItems(
                    parent,
                    result?.data,
                    rootIds,
                    Boolean(result?.isError),
                );
                items = resolved.items;
                isDegraded = resolved.isDegraded;
            }

            levels.push({ parentId: parentIds[i], parent, items, isLoading, isDegraded });

            if (i >= trail.length) break;

            // The id in the URL is authoritative and is never trimmed here: the
            // products endpoint accepts a category at any depth, while this level
            // list can legitimately fail to contain it — the root list is
            // paginated, `?parent_id=` may degrade to name-only `children[]`, and
            // nav-menu/section links deep-link straight to a subcategory.
            const next: ApiCategory | null =
                items.find((c) => c.id === trail[i]) ?? null;
            breadcrumb.push(next ?? unresolvedCategory(trail[i]));
            parent = next;
        }

        const current = levels[levels.length - 1];
        const deepest = breadcrumb[breadcrumb.length - 1];

        return {
            levels,
            rootCategories: rootItems,
            rootLoading: Boolean(results[0]?.isPending),
            breadcrumb,
            /** Deepest trail node — null until this level list actually resolves it. */
            currentNode: deepest?.name ? deepest : null,
            currentChildren: current?.items ?? [],
            currentLoading: Boolean(current?.isLoading),
            currentDegraded: Boolean(current?.isDegraded),
        };
    }, [results, parentIds, trail]);
}
