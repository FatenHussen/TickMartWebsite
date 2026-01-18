import _axios from "@/app/middleware/interceptor";
import { endpoints } from "@/app/routes/path/paths";
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
} from "../types";

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
};

export const _AuthApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const res = await _axios.post<LoginResponse>(endpoints.auth.login, payload);
    return res.data;
  },

  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const res = await _axios.post<RegisterResponse>(
      endpoints.auth.register,
      payload
    );
    return res.data;
  },

  sendOtp: async (payload: SendOtpPayload): Promise<SendOtpResponse> => {
    const res = await _axios.post<SendOtpResponse>(
      endpoints.auth.sendOtp,
      payload
    );
    return res.data;
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    const res = await _axios.post<VerifyOtpResponse>(
      endpoints.auth.verifyOtp,
      payload
    );
    return res.data;
  },

  sendPassword: async (
    payload: SendPasswordPayload
  ): Promise<SendPasswordResponse> => {
    const res = await _axios.post<SendPasswordResponse>(
      endpoints.auth.sendPassword,
      payload
    );
    return res.data;
  },

  verifyPassword: async (
    payload: VerifyPasswordPayload
  ): Promise<VerifyPasswordResponse> => {
    const res = await _axios.post<VerifyPasswordResponse>(
      endpoints.auth.verifyPassword,
      payload
    );
    return res.data;
  },

  resetPassword: async (
    payload: ResetPasswordPayload
  ): Promise<ResetPasswordResponse> => {
    const res = await _axios.post<ResetPasswordResponse>(
      endpoints.auth.resetPassword,
      payload
    );
    return res.data;
  },

  me: async (): Promise<{ data: { user: LoginResponse["data"]["user"] } }> => {
    const res = await _axios.get<{
      data: { user: LoginResponse["data"]["user"] };
    }>(endpoints.auth.me);
    return res.data;
  },

  logout: async (): Promise<{ data: { message?: string } }> => {
    const res = await _axios.post<{ data: { message?: string } }>(
      endpoints.auth.logout
    );
    return res.data;
  },
};
