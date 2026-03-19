import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";
import type {
 CurrenciesListResponse,
 MyCurrencyResponse,
 UpdateCurrencyPayload,
 GenericApiResponse,
} from"../types";

export const _CurrencyApi = {
 /**
 * Get list of available currencies
 */
 getCurrencies: async (page?: number): Promise<CurrenciesListResponse> => {
 const url = page
 ? `${apiRoutes.currencies.list}?page=${page}`
 : apiRoutes.currencies.list;
 const response = await _axios.get<CurrenciesListResponse>(url);
 return response.data;
 },

 /**
 * Get user's selected currency
 */
 getMyCurrency: async (): Promise<MyCurrencyResponse> => {
 const response = await _axios.get<MyCurrencyResponse>(
 apiRoutes.currencies.myCurrency
 );
 return response.data;
 },

 /**
 * Update user's currency
 */
 updateCurrency: async (
 payload: UpdateCurrencyPayload
 ): Promise<GenericApiResponse> => {
 const response = await _axios.post<GenericApiResponse>(
 apiRoutes.currencies.updateCurrency,
 payload
 );
 return response.data;
 },
};
