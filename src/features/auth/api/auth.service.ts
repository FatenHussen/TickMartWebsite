import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";
import type {
 LoginPayload,
 LoginResponse,
 RegisterPayload,
 RegisterResponse,
 VerifyOtpPayload,
 VerifyOtpResponse,
 SendOtpPayload,
 SendOtpResponse,
 SendPasswordPayload,
 SendPasswordResponse,
 VerifyPasswordPayload,
 VerifyPasswordResponse,
 ResetPasswordPayload,
 ResetPasswordResponse,
 SellerRegisterPayload,
} from"../types";

export type {
 LoginPayload,
 LoginResponse,
 RegisterPayload,
 RegisterResponse,
 VerifyOtpPayload,
 VerifyOtpResponse,
 SendOtpPayload,
 SendOtpResponse,
 SendPasswordPayload,
 SendPasswordResponse,
 VerifyPasswordPayload,
 VerifyPasswordResponse,
 ResetPasswordPayload,
 ResetPasswordResponse,
 SellerRegisterPayload,
};

export const _AuthApi = {
 login: async (payload: LoginPayload): Promise<LoginResponse> => {
 const res = await _axios.post<LoginResponse>(apiRoutes.auth.login, payload);
 return res.data;
 },

 register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
 const res = await _axios.post<RegisterResponse>(
 apiRoutes.auth.register,
 payload,
 );
 return res.data;
 },

 sendOtp: async (payload: SendOtpPayload): Promise<SendOtpResponse> => {
 const res = await _axios.post<SendOtpResponse>(
 apiRoutes.auth.sendOtp,
 payload,
 );
 return res.data;
 },

 verifyOtp: async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
 const res = await _axios.post<VerifyOtpResponse>(
 apiRoutes.auth.verifyOtp,
 payload,
 );
 return res.data;
 },

 sendPassword: async (
 payload: SendPasswordPayload,
 ): Promise<SendPasswordResponse> => {
 const res = await _axios.post<SendPasswordResponse>(
 apiRoutes.auth.sendPassword,
 payload,
 );
 return res.data;
 },

 verifyPassword: async (
 payload: VerifyPasswordPayload,
 ): Promise<VerifyPasswordResponse> => {
 const res = await _axios.post<VerifyPasswordResponse>(
 apiRoutes.auth.verifyPassword,
 payload,
 );
 return res.data;
 },

 resetPassword: async (
 payload: ResetPasswordPayload,
 ): Promise<ResetPasswordResponse> => {
 const res = await _axios.post<ResetPasswordResponse>(
 apiRoutes.auth.resetPassword,
 payload,
 );
 return res.data;
 },

 me: async (): Promise<{ data: { user: LoginResponse["data"]["user"] } }> => {
 const res = await _axios.get<{
 data: { user: LoginResponse["data"]["user"] };
 }>(apiRoutes.auth.me);
 return res.data;
 },

 sellerRegister: async (
 payload: SellerRegisterPayload,
 ): Promise<RegisterResponse> => {
 const res = await _axios.post<RegisterResponse>(
 apiRoutes.auth.sellerRegister,
 payload,
 );
 return res.data;
 },

 logout: async (): Promise<{ data: { message?: string } }> => {
 const res = await _axios.post<{ data: { message?: string } }>(
 apiRoutes.auth.logout,
 );
 return res.data;
 },
};
