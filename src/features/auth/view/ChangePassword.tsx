import { useForm } from"react-hook-form";
import { useTranslation } from"react-i18next";
import InputField from"@/shared/ui/InputField";
import Button from"@/shared/ui/Button";
import AuthLayout from"@/features/auth/layout/Auth-Layout";
import { useResetPassword } from"@/features/auth/hooks/useAuth";
import type { ChangePasswordFormValues } from"@/features/auth/types";

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
 currentPassword:"",
 newPassword:"",
 confirmNewPassword:"",
 },
 });

 const onSubmit = async (data: ChangePasswordFormValues) => {
 resetPassword({
 new_password: data.newPassword,
 new_password_confirmation: data.confirmNewPassword,
 });
 };

 const leftContent = (
 <div className="max-w-lg">
 <img
 src="https://i.ibb.co/ZxYJK1q/security-illustration.png"
 alt="Security illustration"
 className="w-full h-auto"
 />
 </div>
 );

 return (
 <AuthLayout
 leftPanel="custom"
 leftContent={leftContent}
 maxWidth="md"
 >
 <div className="space-y-8">
 <div className="text-center">
 <div className="flex items-center justify-center gap-2 mb-6">
 <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
 <span className="text-white text-xl">🌀</span>
 </div>
 <span className="text-xl font-bold text-custom-primary">
 Tikmart
 </span>
 </div>

 <h1 className="text-2xl font-bold text-custom-primary">
 {t("auth.changePassword")}
 </h1>
 <p className="text-sm text-custom-secondary mt-2">
 {t("auth.changePasswordDescription")}
 </p>
 </div>

 <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
 <p className="text-[11px] text-custom-tertiary">
 {t("auth.passwordHelper")}
 </p>
 </div>

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
 </AuthLayout>
 );
}
