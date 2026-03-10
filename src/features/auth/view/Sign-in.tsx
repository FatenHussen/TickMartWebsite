import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import EmailOrPhoneInput from "@/features/auth/components/EmailOrPhoneInput";
import InputField from "@/shared/ui/InputField";
import Button from "@/shared/ui/Button";
import Label from "@/shared/ui/Label";
import AuthLayout from "@/features/auth/layout/Auth-Layout";
import { detectEmailOrPhone } from "@/shared/lib/utils";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { paths } from "@/app/routes/path/paths";
import type { SignInFormValues } from "@/features/auth/types";

interface SignInFormData extends SignInFormValues {
  rememberMe?: boolean;
}

export default function SignIn() {
  const { t } = useTranslation();
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: {
      emailOrPhone: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    const detectedType = detectEmailOrPhone(data.emailOrPhone);

    const payload: { password: string; email?: string; phone?: string } = {
      password: data.password,
    };

    if (detectedType === "email") {
      payload.email = data.emailOrPhone;
    } else if (detectedType === "phone") {
      payload.phone = data.emailOrPhone;
    }

    login(payload);
  };

  return (
    <AuthLayout leftPanel="promo" useFormCard maxWidth="576">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="space-y-1.5">
          <EmailOrPhoneInput
            name="emailOrPhone"
            control={control}
            label={t("auth.emailOrPhone")}
            placeholder="your.email@example.com / +963xxxxxxxxx"
            error={errors.emailOrPhone}
            required
          />
        </div>

        <div className="space-y-1.5">
          <InputField
            label={t("common.password")}
            type="password"
            placeholder="**********"
            {...register("password", {
              required: t("validation.required"),
              minLength: {
                value: 2,
                message: t("validation.passwordTooShort"),
              },
            })}
            error={errors.password}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("auth.passwordHelper")}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary dark:bg-gray-700"
              {...register("rememberMe")}
            />
            {t("common.rememberMe")}
          </Label>
          <Link
            to={paths.auth.jwt.forgotPassword}
            className="text-primary font-medium hover:underline"
          >
            {t("common.forgotPassword")}
          </Link>
        </div>

        <Button
          type="submit"
          isLoading={isPending}
          fullWidth
          variant="primary"
          className="py-3 rounded-xl font-semibold"
        >
          {t("common.login")}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        {t("common.dontHaveAccount")}{" "}
        <Link
          to={paths.auth.jwt.signUp}
          className="text-primary font-medium hover:underline"
        >
          {t("common.signUp")}
        </Link>
      </p>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        {t("common.or")}{" "}
        <Link
          to={paths.client.home}
          className="text-primary font-medium hover:underline"
        >
          {t("auth.continueAsGuest")}
        </Link>
      </p>
    </AuthLayout>
  );
}
