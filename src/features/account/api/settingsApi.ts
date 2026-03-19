import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";

export interface AppSettingsContact {
 phone: string;
 whatsapp: string;
 email: string;
}

export interface AppSettingsData {
 welcome?: { image?: string[]; text?: string };
 login?: { image?: string; link?: string };
 contact?: AppSettingsContact;
 color?: {
 main_color?: string;
 text_color?: string;
 second_color?: string;
 };
}

export interface AppSettingsResponse {
 status: boolean;
 message: string;
 data: AppSettingsData;
}

export const settingsApi = {
 getSettings: async (): Promise<AppSettingsData> => {
 const res = await _axios.get<AppSettingsResponse>(apiRoutes.settings.get);
 return res.data?.data ?? {};
 },
};
