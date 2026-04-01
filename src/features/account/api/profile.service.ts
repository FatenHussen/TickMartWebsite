import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";
import type {
 ProfileResponse,
 UpdateProfilePayload,
 UpdatePasswordPayload,
 UpdateEmailPayload,
 UpdatePhonePayload,
 VerifyProfilePayload,
 GenericApiResponse,
} from"../types";

export const _ProfileApi = {
 /**
 * Get user profile
 */
 getProfile: async (): Promise<ProfileResponse> => {
 const response = await _axios.get<ProfileResponse>(apiRoutes.profile.get);
 return response.data;
 },

 /**
 * Update user profile (name, image, city_id)
 */
 updateProfile: async (
 payload: UpdateProfilePayload
 ): Promise<GenericApiResponse> => {
 const formData = new FormData();
 formData.append("name", payload.name);
 formData.append("city_id", String(payload.city_id));
 
 if (payload.image instanceof File) {
 formData.append("image", payload.image);
 }

 const response = await _axios.post<GenericApiResponse>(
 apiRoutes.profile.update,
 formData,
 {
 headers: {
"Content-Type":"multipart/form-data",
 },
 }
 );
 return response.data;
 },

 /**
 * Update password
 */
 updatePassword: async (
 payload: UpdatePasswordPayload
 ): Promise<GenericApiResponse> => {
 const response = await _axios.post<GenericApiResponse>(
 apiRoutes.profile.updatePassword,
 payload
 );
 return response.data;
 },

 /**
 * Update email
 */
 updateEmail: async (
 payload: UpdateEmailPayload
 ): Promise<GenericApiResponse> => {
 const response = await _axios.post<GenericApiResponse>(
 apiRoutes.profile.updateEmail,
 payload
 );
 return response.data;
 },

 /**
 * Update phone
 */
 updatePhone: async (
 payload: UpdatePhonePayload
 ): Promise<GenericApiResponse> => {
 const response = await _axios.post<GenericApiResponse>(
 apiRoutes.profile.updatePhone,
 payload
 );
 return response.data;
 },

 /**
 * Verify email or phone update
 */
 verifyProfile: async (
 payload: VerifyProfilePayload
 ): Promise<GenericApiResponse> => {
 const response = await _axios.post<GenericApiResponse>(
 apiRoutes.profile.verify,
 payload
 );
 return response.data;
 },

 deleteAccount: async (): Promise<GenericApiResponse> => {
 const response = await _axios.post<GenericApiResponse>(
 apiRoutes.profile.deleteAccount
 );
 return response.data;
 },
};
