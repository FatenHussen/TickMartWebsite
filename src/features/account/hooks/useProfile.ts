import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { _ProfileApi } from "../api/profile.service";
import { queryKeys } from "@/utils/queryKeys";
import type {
  UpdateProfilePayload,
  UpdatePasswordPayload,
  UpdateEmailPayload,
  UpdatePhonePayload,
  VerifyProfilePayload,
} from "../types";

/**
 * Hook to fetch user profile
 */
export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile.details(),
    queryFn: () => _ProfileApi.getProfile(),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const qc = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      _ProfileApi.updateProfile(payload),
    onSuccess: () => {
      toast.success(t("account.profile.updateSuccess", "تم التحديث بنجاح"));
      qc.invalidateQueries({ queryKey: queryKeys.profile.details() });
      qc.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
    onError: (err: any) => {
      console.error("[update-profile] error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        t("account.profile.updateError", "فشل التحديث");
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook to update password
 */
export function useUpdatePassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: UpdatePasswordPayload) =>
      _ProfileApi.updatePassword(payload),
    onSuccess: () => {
      toast.success(
        t(
          "account.profile.passwordUpdateSuccess",
          "تم تغيير كلمة المرور بنجاح"
        )
      );
    },
    onError: (err: any) => {
      console.error("[update-password] error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        t("account.profile.passwordUpdateError", "فشل تغيير كلمة المرور");
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook to update email
 */
export function useUpdateEmail() {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UpdateEmailPayload) =>
      _ProfileApi.updateEmail(payload),
    onSuccess: () => {
      toast.success(
        t(
          "account.profile.emailUpdateSent",
          "تم إرسال رمز التحقق إلى البريد الجديد"
        )
      );
    },
    onError: (err: any) => {
      console.error("[update-email] error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        t("account.profile.emailUpdateError", "فشل تحديث البريد الإلكتروني");
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook to update phone
 */
export function useUpdatePhone() {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UpdatePhonePayload) =>
      _ProfileApi.updatePhone(payload),
    onSuccess: () => {
      toast.success(
        t(
          "account.profile.phoneUpdateSent",
          "تم إرسال رمز التحقق إلى الهاتف الجديد"
        )
      );
    },
    onError: (err: any) => {
      console.error("[update-phone] error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        t("account.profile.phoneUpdateError", "فشل تحديث رقم الهاتف");
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook to verify email or phone update
 */
export function useVerifyProfile() {
  const qc = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: VerifyProfilePayload) =>
      _ProfileApi.verifyProfile(payload),
    onSuccess: () => {
      toast.success(t("account.profile.verifySuccess", "تم التحقق بنجاح"));
      qc.invalidateQueries({ queryKey: queryKeys.profile.details() });
      qc.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
    onError: (err: any) => {
      console.error("[verify-profile] error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        t("account.profile.verifyError", "فشل التحقق");
      toast.error(errorMessage);
    },
  });
}
