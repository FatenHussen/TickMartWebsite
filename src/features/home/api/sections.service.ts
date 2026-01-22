import _axios from "@/app/middleware/interceptor";
import { endpoints } from "@/app/routes/path/paths";
import type { SectionsResponse } from "../types";

export const _SectionsApi = {
  getSections: async (pageSlug: string): Promise<SectionsResponse> => {
    const response = await _axios.get<SectionsResponse>(
      endpoints.sections.getByPage(pageSlug)
    );
    return response.data;
  },
};
