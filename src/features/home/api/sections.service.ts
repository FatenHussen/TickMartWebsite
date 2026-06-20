import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";
import type { UserProductListFilters } from"@/utils/apiRoutes";
import type { SectionsResponse } from"../types";

export type SectionsFilters = Omit<UserProductListFilters, "page" | "per_page">;

export const _SectionsApi = {
 getSections: async (
 pageSlug: string,
 filters?: SectionsFilters,
 ): Promise<SectionsResponse> => {
 const response = await _axios.get<SectionsResponse>(
 apiRoutes.sections.getByPage(pageSlug, filters),
 );
 return response.data;
 },
};
