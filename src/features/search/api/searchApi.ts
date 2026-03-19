import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { SearchApiResponse, SearchResultType } from "../types";

export const searchApi = {
    /**
     * Search by type (product, brand, shop, recipe)
     * GET user/search?type=...&search=...
     */
    search: async (
        type: SearchResultType,
        search: string
    ): Promise<SearchApiResponse["data"]> => {
        const response = await _axios.get<SearchApiResponse>(
            apiRoutes.search.list(type, search)
        );
        return response.data?.data ?? [];
    },

    /**
     * Search all types in parallel, returns merged results with type labels
     */
    searchAll: async (
        search: string
    ): Promise<Array<{ id: number; name: string; image: string | null; type: SearchResultType }>> => {
        const types: SearchResultType[] = ["product", "brand", "shop", "recipe"];
        const results = await Promise.all(
            types.map(async (type) => {
                const items = await searchApi.search(type, search);
                return items.map((item) => ({ ...item, type }));
            })
        );
        return results.flat();
    },
};
