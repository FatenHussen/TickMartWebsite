import _axios from "@/app/middleware/interceptor";
import { QueryConfig } from "@/utils/queryKeys";
import type {
  Governorate,
  City,
  GovernoratesResponse,
  CitiesResponse,
} from "../types";

export type { Governorate, City, GovernoratesResponse, CitiesResponse };

export const _LocationApi = {
  getGovernorates: async (): Promise<GovernoratesResponse> => {
    const { url } = QueryConfig.GOVERNORATES;
    const res = await _axios.get<GovernoratesResponse>(url);
    return res.data;
  },

  getCities: async (governorateId: number): Promise<CitiesResponse> => {
    const { url } = QueryConfig.CITIES;
    const res = await _axios.get<CitiesResponse>(`${url}/${governorateId}`);
    return res.data;
  },
};
