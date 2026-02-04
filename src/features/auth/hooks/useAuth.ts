import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  _AuthApi,
  type LoginPayload,
  type RegisterPayload,
  type VerifyOtpPayload,
  type SendOtpPayload,
  type SendPasswordPayload,
  type VerifyPasswordPayload,
  type ResetPasswordPayload,
} from "../api/auth.service";
import { queryKeys } from "@/utils/queryKeys";
import { useOtpStore } from "@/store/otp";
import { useAuthStore } from "@/store/auth";
import { paths } from "@/app/routes/path/paths";

export function useLogin() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const logoutLocal = useAuthStore((state) => state.logoutLocal);

  return useMutation({
    mutationFn: (payload: LoginPayload) => _AuthApi.login(payload),
    onSuccess: (data) => {
      if (data.data.user && data.data.token) {
        setAuth(data.data.user, data.data.token);
      }
      qc.invalidateQueries({ queryKey: queryKeys.auth.login() });
      navigate(paths.client.home);
    },
    onError: (err) => {
      console.error("[login] error:", err);
      logoutLocal();
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const setEmail = useOtpStore((state) => state.setEmail);
  const setPhone = useOtpStore((state) => state.setPhone);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => _AuthApi.register(payload),
    onSuccess: (_, variables) => {
      if (variables.email) {
        setEmail(variables.email);
      } else if (variables.phone) {
        setPhone(variables.phone);
      }

      qc.invalidateQueries({ queryKey: [queryKeys.auth.register] });
      navigate(paths.auth.jwt.otp);
    },
    onError: (err) => {
      console.error("[register] error:", err);
    },
  });
}

export function useSendOtp() {
  const qc = useQueryClient();
  const email = useOtpStore((state) => state.email);
  const phone = useOtpStore((state) => state.phone);

  return useMutation({
    mutationFn: () => {
      const payload: SendOtpPayload = {};

      if (email) {
        payload.email = email;
      } else if (phone) {
        payload.phone = phone;
      }

      return _AuthApi.sendOtp(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.auth.sendOtp() });
    },
    onError: (err) => {
      console.error("[send-otp] error:", err);
    },
  });
}

export function useVerifyOtp() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const email = useOtpStore((state) => state.email);
  const phone = useOtpStore((state) => state.phone);
  const clearOtp = useOtpStore((state) => state.clear);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logoutLocal = useAuthStore((state) => state.logoutLocal);

  return useMutation({
    mutationFn: (code: string) => {
      const payload: VerifyOtpPayload = { code };

      if (email) {
        payload.email = email;
      } else if (phone) {
        payload.phone = phone;
      }

      return _AuthApi.verifyOtp(payload);
    },
    onSuccess: (data) => {
      if (data.data.user && data.data.token) {
        setAuth(data.data.user, data.data.token);
      }

      clearOtp();
      qc.invalidateQueries({ queryKey: queryKeys.auth.verifyOtp() });
      navigate(paths.client.home);
    },
    onError: (err) => {
      console.error("[verify-otp] error:", err);
      logoutLocal();
    },
  });
}

export function useForgotPassword() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const setEmail = useOtpStore((state) => state.setEmail);
  const setPhone = useOtpStore((state) => state.setPhone);
  const setIsPasswordReset = useOtpStore((state) => state.setIsPasswordReset);

  return useMutation({
    mutationFn: (payload: SendPasswordPayload) =>
      _AuthApi.sendPassword(payload),
    onSuccess: (_, variables) => {
      if (variables.email) {
        setEmail(variables.email);
      } else if (variables.phone) {
        setPhone(variables.phone);
      }

      setIsPasswordReset(true);
      qc.invalidateQueries({ queryKey: queryKeys.auth.sendPassword() });
      navigate(paths.auth.jwt.otp);
    },
    onError: (err) => {
      console.error("[send-password] error:", err);
    },
  });
}

export function useVerifyPassword() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const email = useOtpStore((state) => state.email);
  const phone = useOtpStore((state) => state.phone);
  const clearOtp = useOtpStore((state) => state.clear);

  return useMutation({
    mutationFn: (code: string) => {
      const payload: VerifyPasswordPayload = { code };

      if (email) {
        payload.email = email;
      } else if (phone) {
        payload.phone = phone;
      }

      return _AuthApi.verifyPassword(payload);
    },
    onSuccess: () => {
      clearOtp();
      qc.invalidateQueries({ queryKey: [queryKeys.auth.verifyPassword] });
      navigate(paths.auth.jwt.changePassword);
    },
    onError: (err) => {
      console.error("[verify-password] error:", err);
    },
  });
}

export function useResetPassword() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      _AuthApi.resetPassword(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.auth.resetPassword() });
      navigate(paths.auth.jwt.signIn);
    },
    onError: (err) => {
      console.error("[reset-password] error:", err);
    },
  });
}

export function useMe() {
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const logoutLocal = useAuthStore((state) => state.logoutLocal);
  const token = useAuthStore((state) => state.token);

  const query = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const response = await _AuthApi.me();
      return response.data.user;
    },
    enabled: !!token, // Only fetch if token exists
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setUser(query.data);
      setAuthenticated(true);
    } else if (query.isError) {
      logoutLocal();
    }
  }, [
    query.isSuccess,
    query.isError,
    query.data,
    setUser,
    setAuthenticated,
    logoutLocal,
  ]);

  return query;
}

export function useLogout() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const logoutLocal = useAuthStore((state) => state.logoutLocal);

  return useMutation({
    mutationFn: () => _AuthApi.logout(),
    onSuccess: () => {
      logoutLocal();
      qc.clear();
      navigate(paths.auth.jwt.signIn);
    },
    onError: (err) => {
      console.error("[logout] error:", err);
      logoutLocal();
      qc.clear();
      navigate(paths.auth.jwt.signIn);
    },
  });
}
