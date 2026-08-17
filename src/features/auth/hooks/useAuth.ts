import { useMutation, useQuery, useQueryClient } from"@tanstack/react-query";
import { useNavigate } from"react-router-dom";
import { useEffect } from"react";
import { toast } from"sonner";
import { useTranslation } from"react-i18next";
import {
 _AuthApi,
 type LoginPayload,
 type RegisterPayload,
 type SellerRegisterPayload,
 type VerifyOtpPayload,
 type SendOtpPayload,
 type SendPasswordPayload,
 type VerifyPasswordPayload,
 type ResetPasswordPayload,
} from"../api/auth.service";
import { queryKeys } from"@/utils/queryKeys";
import { useOtpStore } from"@/store/otp";
import { useAuthStore } from"@/store/auth";
import { paths } from"@/app/routes/path/paths";
import { getApiErrorMessage, isApiToastHandled } from"@/shared/lib/apiMessage";

export function useLogin() {
 const qc = useQueryClient();
 const navigate = useNavigate();
 const { t } = useTranslation();
 const setAuth = useAuthStore((state) => state.setAuth);
 const logoutLocal = useAuthStore((state) => state.logoutLocal);

 return useMutation({
 mutationFn: (payload: LoginPayload) => _AuthApi.login(payload),
 onSuccess: (data) => {
 if (data.data.user && data.data.token) {
 setAuth(data.data.user, data.data.token);
 toast.success(t("auth.loginSuccess","تم تسجيل الدخول بنجاح"));
 }
 qc.invalidateQueries({ queryKey: queryKeys.auth.login() });
 navigate(paths.client.home);
 },
 onError: (err: any) => {
 console.error("[login] error:", err);
 if (!isApiToastHandled(err)) {
 const errorMessage = getApiErrorMessage(err, t("auth.loginError","فشل تسجيل الدخول"));
 toast.error(errorMessage);
 }
 logoutLocal();
 },
 });
}

export function useRegister() {
 const qc = useQueryClient();
 const navigate = useNavigate();
 const { t } = useTranslation();
 const setPhone = useOtpStore((state) => state.setPhone);

 return useMutation({
 mutationFn: (payload: RegisterPayload) => _AuthApi.register(payload),
 onSuccess: (_, variables) => {
 setPhone(variables.phone);

 toast.success(t("auth.registerSuccess","تم إنشاء الحساب بنجاح. يرجى التحقق من رمز OTP"));
 qc.invalidateQueries({ queryKey: [queryKeys.auth.register] });
 navigate(paths.auth.jwt.otp);
 },
 onError: (err: any) => {
 console.error("[register] error:", err);
 if (!isApiToastHandled(err)) {
 const errorMessage = getApiErrorMessage(err, t("auth.registerError","فشل إنشاء الحساب"));
 toast.error(errorMessage);
 }
 },
 });
}

export function useSellerRegister() {
 const qc = useQueryClient();
 const navigate = useNavigate();
 const { t } = useTranslation();

 return useMutation({
 mutationFn: (payload: SellerRegisterPayload) =>
 _AuthApi.sellerRegister(payload),
 onSuccess: () => {
 toast.success(t("auth.sellerRegisterSuccess"));
 qc.invalidateQueries({ queryKey: queryKeys.auth.sellerRegister() });
 navigate(paths.client.home);
 },
 onError: (err: any) => {
 console.error("[seller-register] error:", err);
 if (!isApiToastHandled(err)) {
 const errorMessage = getApiErrorMessage(err, t("auth.sellerRegisterError"));
 toast.error(errorMessage);
 }
 },
 });
}

export function useSendOtp() {
 const qc = useQueryClient();
 const { t } = useTranslation();
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
 toast.success(t("auth.otpSentSuccess","تم إرسال رمز التحقق بنجاح"));
 qc.invalidateQueries({ queryKey: queryKeys.auth.sendOtp() });
 },
 onError: (err: any) => {
 console.error("[send-otp] error:", err);
 if (!isApiToastHandled(err)) {
 const errorMessage = getApiErrorMessage(err, t("auth.otpSentError","فشل إرسال رمز التحقق"));
 toast.error(errorMessage);
 }
 },
 });
}

export function useVerifyOtp() {
 const qc = useQueryClient();
 const navigate = useNavigate();
 const { t } = useTranslation();
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
 toast.success(t("auth.otpVerifiedSuccess","تم التحقق بنجاح"));
 }

 clearOtp();
 qc.invalidateQueries({ queryKey: queryKeys.auth.verifyOtp() });
 navigate(paths.client.home);
 },
 onError: (err: any) => {
 console.error("[verify-otp] error:", err);
 if (!isApiToastHandled(err)) {
 const errorMessage = getApiErrorMessage(err, t("auth.otpVerifiedError","رمز التحقق غير صحيح"));
 toast.error(errorMessage);
 }
 logoutLocal();
 },
 });
}

export function useForgotPassword() {
 const qc = useQueryClient();
 const navigate = useNavigate();
 const { t } = useTranslation();
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

 toast.success(t("auth.passwordResetCodeSent","تم إرسال رمز إعادة تعيين كلمة المرور"));
 setIsPasswordReset(true);
 qc.invalidateQueries({ queryKey: queryKeys.auth.sendPassword() });
 navigate(paths.auth.jwt.otp);
 },
 onError: (err: any) => {
 console.error("[send-password] error:", err);
 if (!isApiToastHandled(err)) {
 const errorMessage = getApiErrorMessage(err, t("auth.passwordResetCodeError","فشل إرسال رمز إعادة التعيين"));
 toast.error(errorMessage);
 }
 },
 });
}

export function useVerifyPassword() {
 const qc = useQueryClient();
 const navigate = useNavigate();
 const { t } = useTranslation();
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
 toast.success(t("auth.passwordResetVerified","تم التحقق من رمز إعادة التعيين"));
 clearOtp();
 qc.invalidateQueries({ queryKey: [queryKeys.auth.verifyPassword] });
 navigate(paths.auth.jwt.changePassword);
 },
 onError: (err: any) => {
 console.error("[verify-password] error:", err);
 if (!isApiToastHandled(err)) {
 const errorMessage = getApiErrorMessage(err, t("auth.passwordResetVerifiedError","رمز التحقق غير صحيح"));
 toast.error(errorMessage);
 }
 },
 });
}

export function useResetPassword() {
 const qc = useQueryClient();
 const navigate = useNavigate();
 const { t } = useTranslation();

 return useMutation({
 mutationFn: (payload: ResetPasswordPayload) =>
 _AuthApi.resetPassword(payload),
 onSuccess: () => {
 toast.success(t("auth.passwordResetSuccess","تم إعادة تعيين كلمة المرور بنجاح"));
 qc.invalidateQueries({ queryKey: queryKeys.auth.resetPassword() });
 navigate(paths.auth.jwt.signIn);
 },
 onError: (err: any) => {
 console.error("[reset-password] error:", err);
 if (!isApiToastHandled(err)) {
 const errorMessage = getApiErrorMessage(err, t("auth.passwordResetError","فشل إعادة تعيين كلمة المرور"));
 toast.error(errorMessage);
 }
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
 mutationFn: async () => {
 logoutLocal();
 },
 onSuccess: () => {
 qc.clear();
 navigate(paths.auth.jwt.signIn);
 },
 });
}
