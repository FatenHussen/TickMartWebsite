import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { SectionsResponse } from "../types";

export const _SectionsApi = {
  getSections: async (pageSlug: string): Promise<SectionsResponse> => {
    const response = await _axios.get<SectionsResponse>(
      apiRoutes.sections.getByPage(pageSlug),
    );
    return response.data;
  },
};
