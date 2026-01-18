import _axios from "@/app/middleware/interceptor";
import { endpoints } from "@/app/routes/path/paths";
import type {
  Governorate,
  City,
  GovernoratesResponse,
  CitiesResponse,
} from "../types";

export type { Governorate, City, GovernoratesResponse, CitiesResponse };

export const _LocationApi = {
  getGovernorates: async (): Promise<GovernoratesResponse> => {
    const res = await _axios.get<GovernoratesResponse>(
      endpoints.location.governorates
    );
    return res.data;
  },

  getCities: async (governorateId: number): Promise<CitiesResponse> => {
    const res = await _axios.get<CitiesResponse>(
      `${endpoints.location.cities}/${governorateId}`
    );
    return res.data;
  },
};
