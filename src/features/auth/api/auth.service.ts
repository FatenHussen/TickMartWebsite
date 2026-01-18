import _axios from "@/app/middleware/interceptor";
import { QueryConfig } from "@/utils/queryKeys";
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
};

export const _AuthApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { url } = QueryConfig.LOGIN;
    const res = await _axios.post<LoginResponse>(url, payload);
    return res.data;
  },

  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const { url } = QueryConfig.REGISTER;
    const res = await _axios.post<RegisterResponse>(url, payload);
    return res.data;
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    const { url } = QueryConfig.VERIFY_OTP;
    const res = await _axios.post<VerifyOtpResponse>(url, payload);
    return res.data;
  },

  sendOtp: async (payload: SendOtpPayload): Promise<SendOtpResponse> => {
    const { url } = QueryConfig.SEND_OTP;
    const res = await _axios.post<SendOtpResponse>(url, payload);
    return res.data;
  },

  sendPassword: async (
    payload: SendPasswordPayload
  ): Promise<SendPasswordResponse> => {
    const { url } = QueryConfig.SEND_PASSWORD;
    const res = await _axios.post<SendPasswordResponse>(url, payload);
    return res.data;
  },

  verifyPassword: async (
    payload: VerifyPasswordPayload
  ): Promise<VerifyPasswordResponse> => {
    const { url } = QueryConfig.VERIFY_PASSWORD;
    const res = await _axios.post<VerifyPasswordResponse>(url, payload);
    return res.data;
  },

  me: async (): Promise<{ data: { user: LoginResponse["data"]["user"] } }> => {
    const { url } = QueryConfig.ME;
    const res = await _axios.get<{
      data: { user: LoginResponse["data"]["user"] };
    }>(url);
    return res.data;
  },

  logout: async (): Promise<{ data: { message?: string } }> => {
    const { url } = QueryConfig.LOGOUT;
    const res = await _axios.post<{ data: { message?: string } }>(url);
    return res.data;
  },
};
