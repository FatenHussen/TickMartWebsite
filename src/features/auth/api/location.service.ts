import _axios from "@/app/middleware/interceptor";
import { QueryConfig } from "@/utils/queryKeys";

export interface Governorate {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
}

export interface GovernoratesResponse {
  data: Governorate[];
}

export interface CitiesResponse {
  data: City[];
  message?: string;
}

export const _LocationApi = {
  getGovernorates: async (): Promise<GovernoratesResponse> => {
    const { url } = QueryConfig.GOVERNORATES;
    const res = await _axios.get<GovernoratesResponse>(url);
    return res.data;
  },

  getCities: async (governorateId: number): Promise<CitiesResponse> => {
    const { url } = QueryConfig.CITIES;
    const res = await _axios.get<CitiesResponse>(url, {
      params: {
        governorate_id: governorateId,
      },
    });
    return res.data;
  },
};
