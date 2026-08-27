import { useQuery, useQueryClient } from "@tanstack/react-query";
import { _CategoriesApi } from "@/features/home/api/categories.service";
import type { CategoryAttribute } from "@/features/product/types/categoryAttributes";
import { queryKeys } from "@/utils/queryKeys";

/**
 * Category attribute chips for product filters.
 *
 * The API returns the **root** category's attributes for any depth, and each
 * row carries `root_category_id`. We cache under that root so drilling within
 * the same tree does not refetch.
 *
 * Pass `knownRootId` (e.g. `trail[0]`) when the UI already knows the root —
 * the query key stays stable across the tree.
 */
export function useCategoryAttributes(
    categoryId: number | undefined,
    knownRootId?: number | null,
) {
    const queryClient = useQueryClient();
    const cacheId = knownRootId && knownRootId > 0 ? knownRootId : categoryId;

    return useQuery({
        queryKey: queryKeys.categories.attributesRoot(cacheId ?? 0),
        enabled: categoryId != null && categoryId > 0 && cacheId != null && cacheId > 0,
        staleTime: 1000 * 60 * 10,
        queryFn: async (): Promise<CategoryAttribute[]> => {
            const res = await _CategoriesApi.getCategoryAttributes(categoryId!);
            const data = res.data ?? [];
            const rootId =
                data.find((a) => a.root_category_id != null)?.root_category_id ??
                knownRootId ??
                categoryId!;

            if (rootId !== cacheId) {
                queryClient.setQueryData(
                    queryKeys.categories.attributesRoot(rootId),
                    data,
                );
            }
            return data;
        },
    });
}
