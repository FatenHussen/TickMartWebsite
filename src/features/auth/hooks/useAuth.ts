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
} from "../api/auth.service";
import { QueryConfig } from "@/utils/queryKeys";
import { useOtpStore } from "@/store/otp";
import { useAuthStore } from "@/store/auth";
import { paths } from "@/app/routes/path/paths";

export function useLogin() {
  const { key } = QueryConfig.LOGIN;
  const qc = useQueryClient();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useMutation({
    mutationFn: (payload: LoginPayload) => _AuthApi.login(payload),
    onSuccess: (data) => {
      // Backend sets HttpOnly cookie automatically
      // We only update local state with user data

      if (data.data.user) {
        setUser(data.data.user);
        setAuthenticated(true);
      }
      qc.invalidateQueries({ queryKey: [key] });
      navigate(paths.client.home);
    },
    onError: (err) => {
      console.error("[login] error:", err);
      setAuthenticated(false);
      setUser(null);
    },
  });
}

export function useRegister() {
  const { key } = QueryConfig.REGISTER;
  const qc = useQueryClient();
  const navigate = useNavigate();
  const setEmail = useOtpStore((state) => state.setEmail);
  const setPhone = useOtpStore((state) => state.setPhone);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => _AuthApi.register(payload),
    onSuccess: (_, variables) => {
      // Store email or phone in Zustand store
      if (variables.email) {
        setEmail(variables.email);
      } else if (variables.phone) {
        setPhone(variables.phone);
      }

      qc.invalidateQueries({ queryKey: [key] });

      // Navigate to OTP page
      navigate(paths.auth.jwt.otp);
    },
    onError: (err) => {
      console.error("[register] error:", err);
    },
  });
}

export function useVerifyOtp() {
  const { key } = QueryConfig.VERIFY_OTP;
  const qc = useQueryClient();
  const navigate = useNavigate();
  const email = useOtpStore((state) => state.email);
  const phone = useOtpStore((state) => state.phone);
  const clearOtp = useOtpStore((state) => state.clear);
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useMutation({
    mutationFn: (code: string) => {
      const payload: VerifyOtpPayload = {
        code,
      };

      if (email) {
        payload.email = email;
      } else if (phone) {
        payload.phone = phone;
      }

      return _AuthApi.verifyOtp(payload);
    },
    onSuccess: (data) => {
      // Backend sets HttpOnly cookie automatically
      // We only update local state with user data
      if (data.data.user) {
        setUser(data.data.user);
        setAuthenticated(true);
      }

      clearOtp();
      qc.invalidateQueries({ queryKey: [key] });

      // Navigate to home after successful verification
      navigate(paths.client.home);
    },
    onError: (err) => {
      console.error("[verify-otp] error:", err);
      setAuthenticated(false);
      setUser(null);
    },
  });
}

export function useSendOtp() {
  const { key } = QueryConfig.SEND_OTP;
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
      qc.invalidateQueries({ queryKey: [key] });
    },
    onError: (err) => {
      console.error("[send-otp] error:", err);
    },
  });
}

export function useForgotPassword() {
  const { key } = QueryConfig.SEND_PASSWORD;
  const qc = useQueryClient();
  const navigate = useNavigate();
  const setEmail = useOtpStore((state) => state.setEmail);
  const setPhone = useOtpStore((state) => state.setPhone);
  const setIsPasswordReset = useOtpStore((state) => state.setIsPasswordReset);

  return useMutation({
    mutationFn: (payload: SendPasswordPayload) =>
      _AuthApi.sendPassword(payload),
    onSuccess: (_, variables) => {
      // Store email or phone in Zustand store for OTP page
      if (variables.email) {
        setEmail(variables.email);
      } else if (variables.phone) {
        setPhone(variables.phone);
      }

      // Mark as password reset flow
      setIsPasswordReset(true);

      qc.invalidateQueries({ queryKey: [key] });
      // Navigate to OTP page after sending password reset code
      navigate(paths.auth.jwt.otp);
    },
    onError: (err) => {
      console.error("[send-password] error:", err);
    },
  });
}

export function useVerifyPassword() {
  const { key } = QueryConfig.VERIFY_PASSWORD;
  const qc = useQueryClient();
  const navigate = useNavigate();
  const email = useOtpStore((state) => state.email);
  const phone = useOtpStore((state) => state.phone);
  const clearOtp = useOtpStore((state) => state.clear);
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useMutation({
    mutationFn: (code: string) => {
      const payload: VerifyPasswordPayload = {
        code,
      };

      if (email) {
        payload.email = email;
      } else if (phone) {
        payload.phone = phone;
      }

      return _AuthApi.verifyPassword(payload);
    },
    onSuccess: (data) => {
      // Backend sets HttpOnly cookie automatically
      // We only update local state with user data
      if (data.data.user) {
        setUser(data.data.user);
        setAuthenticated(true);
      }

      clearOtp();
      qc.invalidateQueries({ queryKey: [key] });

      // Navigate to home after successful verification
      navigate(paths.client.home);
    },
    onError: (err) => {
      console.error("[verify-password] error:", err);
      setAuthenticated(false);
      setUser(null);
    },
  });
}

/**
 * Hook to fetch current authenticated user
 * Uses HttpOnly cookie automatically via withCredentials
 */
export function useMe() {
  const { key } = QueryConfig.ME;
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const logoutLocal = useAuthStore((state) => state.logoutLocal);

  const query = useQuery({
    queryKey: [key],
    queryFn: async () => {
      const response = await _AuthApi.me();
      return response.data.user;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Handle success/error with useEffect (React Query v5 removed onSuccess/onError)
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

/**
 * Hook to logout user
 * Backend clears HttpOnly cookie via Set-Cookie expiration
 */
export function useLogout() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const logoutLocal = useAuthStore((state) => state.logoutLocal);

  return useMutation({
    mutationFn: () => _AuthApi.logout(),
    onSuccess: () => {
      // Clear local auth state
      logoutLocal();
      // Invalidate all queries
      qc.clear();
      // Navigate to login
      navigate(paths.auth.jwt.signIn);
    },
    onError: (err) => {
      console.error("[logout] error:", err);
      // Even if logout fails, clear local state
      logoutLocal();
      qc.clear();
      navigate(paths.auth.jwt.signIn);
    },
  });
}
