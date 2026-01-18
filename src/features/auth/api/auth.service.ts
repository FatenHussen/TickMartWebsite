import _axios from "@/app/middleware/interceptor";
import { QueryConfig } from "@/utils/queryKeys";

export interface LoginPayload {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  city_id: number;
  governorate_id: number;
}

export interface LoginResponse {
  data: {
    user: {
      id: number;
      name: string;
      email?: string;
      phone?: string;
    };
  };
}

export interface RegisterResponse {
  data: {
    message?: string;
    [key: string]: any;
  };
}

export interface VerifyOtpPayload {
  email?: string;
  phone?: string;
  code: string;
}

export interface VerifyOtpResponse {
  data: {
    user: {
      id: number;
      name: string;
      email?: string;
      phone?: string;
    };
  };
}

export interface SendOtpPayload {
  email?: string;
  phone?: string;
}

export interface SendOtpResponse {
  data: {
    message?: string;
    [key: string]: any;
  };
}

export interface SendPasswordPayload {
  email?: string;
  phone?: string;
}

export interface SendPasswordResponse {
  data: {
    message?: string;
    [key: string]: any;
  };
}

export interface VerifyPasswordPayload {
  email?: string;
  phone?: string;
  code: string;
}

export interface VerifyPasswordResponse {
  data: {
    user: {
      id: number;
      name: string;
      email?: string;
      phone?: string;
    };
  };
}

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
