import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";
import type {
 Governorate,
 City,
 Area,
 Country,
 GovernoratesResponse,
 CitiesResponse,
 AreasResponse,
 CountriesResponse,
} from"../types";

export type {
 Governorate,
 City,
 Area,
 Country,
 GovernoratesResponse,
 CitiesResponse,
 AreasResponse,
 CountriesResponse,
};

export const _LocationApi = {
 getGovernorates: async (page?: number): Promise<GovernoratesResponse> => {
 const url = page
 ? `${apiRoutes.location.governorates}?page=${page}`
 : apiRoutes.location.governorates;
 const res = await _axios.get<GovernoratesResponse>(url);
 return res.data;
 },

 getCities: async (
 governorateId: number,
 page?: number,
 ): Promise<CitiesResponse> => {
 let url = `${apiRoutes.location.cities}?governorate_id=${governorateId}`;
 if (page) url += `&page=${page}`;
 const res = await _axios.get<CitiesResponse>(url);
 return res.data;
 },

 getAreas: async (cityId: number, page?: number): Promise<AreasResponse> => {
 let url = apiRoutes.location.areas(cityId);
 if (page) url += `&page=${page}`;
 const res = await _axios.get<AreasResponse>(url);
 return res.data;
 },

 getCountries: async (page?: number): Promise<CountriesResponse> => {
 const url = page
 ? `${apiRoutes.location.countries}?page=${page}`
 : apiRoutes.location.countries;
 const res = await _axios.get<CountriesResponse>(url);
 return res.data;
 },
};
