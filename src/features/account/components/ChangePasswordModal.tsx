import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import BasePopup from "@/shared/component/BasePopup";
import InputField from "@/shared/ui/InputField";
import Button from "@/shared/ui/Button";
import { useUpdatePassword } from "../hooks/useProfile";
import type { UpdatePasswordPayload } from "../types";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const { t } = useTranslation();
  const { mutate: updatePassword, isPending } = useUpdatePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UpdatePasswordPayload>();

  const newPassword = watch("new_password");

  const onSubmit = (data: UpdatePasswordPayload) => {
    updatePassword(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={handleClose}
      title={t("account.profile.changePassword", "تغيير كلمة المرور")}
      maxWidth="md"
      className="dark:bg-gray-800"
      contentClassName="text-start"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        {/* Old Password */}
        <InputField
          label={t("account.profile.oldPassword", "كلمة المرور الحالية")}
          type="password"
          placeholder={t(
            "account.profile.enterOldPassword",
            "أدخل كلمة المرور الحالية"
          )}
          error={errors.old_password}
          {...register("old_password", {
            required: t("validation.required", "هذا الحقل مطلوب"),
            minLength: {
              value: 8,
              message: t("validation.minLength", "8 أحرف على الأقل"),
            },
          })}
          className="bg-gray-50 dark:bg-gray-700 dark:text-white"
        />

        {/* New Password */}
        <InputField
          label={t("account.profile.newPassword", "كلمة المرور الجديدة")}
          type="password"
          placeholder={t(
            "account.profile.enterNewPassword",
            "أدخل كلمة المرور الجديدة"
          )}
          error={errors.new_password}
          {...register("new_password", {
            required: t("validation.required", "هذا الحقل مطلوب"),
            minLength: {
              value: 8,
              message: t("validation.minLength", "8 أحرف على الأقل"),
            },
          })}
          className="bg-gray-50 dark:bg-gray-700 dark:text-white"
        />

        {/* Confirm New Password */}
        <InputField
          label={t(
            "account.profile.confirmNewPassword",
            "تأكيد كلمة المرور الجديدة"
          )}
          type="password"
          placeholder={t(
            "account.profile.enterConfirmNewPassword",
            "أعد إدخال كلمة المرور الجديدة"
          )}
          error={errors.new_password_confirmation}
          {...register("new_password_confirmation", {
            required: t("validation.required", "هذا الحقل مطلوب"),
            validate: (value) =>
              value === newPassword ||
              t("validation.passwordMismatch", "كلمات المرور غير متطابقة"),
          })}
          className="bg-gray-50 dark:bg-gray-700 dark:text-white"
        />

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleClose}
            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {t("common.cancel", "إلغاء")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isPending}
          >
            {t("common.save", "حفظ")}
          </Button>
        </div>
      </form>
    </BasePopup>
  );
}
