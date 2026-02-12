import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type {
  Governorate,
  City,
  Area,
  GovernoratesResponse,
  CitiesResponse,
  AreasResponse,
} from "../types";

export type {
  Governorate,
  City,
  Area,
  GovernoratesResponse,
  CitiesResponse,
  AreasResponse,
};

export const _LocationApi = {
  getGovernorates: async (): Promise<GovernoratesResponse> => {
    const res = await _axios.get<GovernoratesResponse>(
      apiRoutes.location.governorates,
    );
    return res.data;
  },

  getCities: async (governorateId: number): Promise<CitiesResponse> => {
    const res = await _axios.get<CitiesResponse>(
      `${apiRoutes.location.cities}?governorate_id=${governorateId}`,
    );
    return res.data;
  },

  getAreas: async (cityId: number): Promise<AreasResponse> => {
    const res = await _axios.get<AreasResponse>(
      apiRoutes.location.areas(cityId),
    );
    return res.data;
  },
};
