import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import InputField from "@/shared/ui/InputField";
import Button from "@/shared/ui/Button";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useResetPassword } from "@/features/auth/hooks/useAuth";
import type { ChangePasswordFormValues } from "@/features/auth/types";

export default function ChangePassword() {
  const { t } = useTranslation();
  const { mutate: resetPassword, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    resetPassword({
      new_password: data.newPassword,
      new_password_confirmation: data.confirmNewPassword,
    });
  };

  return (
    <div className="relative min-h-screen grid lg:grid-cols-2 bg-white dark:bg-gray-900">
      {/* Theme and Language toggles */}
      <div className="absolute top-4 end-4 z-20 flex gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* Left Side - Illustration */}
      <div className="hidden lg:flex bg-gray-100 dark:bg-gray-800 items-center justify-center p-8">
        <div className="max-w-lg">
          <img
            src="https://i.ibb.co/ZxYJK1q/security-illustration.png"
            alt="Security illustration"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center px-6 py-12 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🌀</span>
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white">Tikmool</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("auth.changePassword")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {t("auth.changePasswordDescription")}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Current Password */}
            <InputField
              label={t("auth.currentPassword")}
              type="password"
              placeholder={t("auth.writeCurrentPassword")}
              required
              {...register("currentPassword", {
                required: t("validation.required"),
              })}
              error={errors.currentPassword}
            />

            {/* New Password */}
            <div className="space-y-1">
              <InputField
                label={t("auth.newPassword")}
                type="password"
                placeholder={t("auth.createPassword")}
                required
                {...register("newPassword", {
                  required: t("validation.required"),
                  minLength: {
                    value: 8,
                    message: t("validation.passwordTooShort"),
                  },
                })}
                error={errors.newPassword}
              />
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                {t("auth.passwordHelper")}
              </p>
            </div>

            {/* Confirm New Password */}
            <InputField
              label={t("auth.confirmNewPassword")}
              type="password"
              placeholder={t("auth.reEnterNewPassword")}
              required
              {...register("confirmNewPassword", {
                required: t("validation.required"),
                validate: (value) =>
                  value === watch("newPassword") ||
                  t("validation.passwordsDoNotMatch"),
              })}
              error={errors.confirmNewPassword}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={isPending}
              fullWidth
              variant="primary"
              className="py-3 rounded-full font-semibold mt-6"
            >
              {t("auth.changePassword")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
