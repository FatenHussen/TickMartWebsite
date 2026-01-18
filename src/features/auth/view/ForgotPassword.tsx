import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AuthLayout from "@/features/auth/layout/Auth-Layout";
import InputField from "@/shared/ui/InputField";
import Button from "@/shared/ui/Button";
import { useForgotPassword } from "@/features/auth/hooks/useAuth";
import { paths } from "@/app/routes/path/paths";
import { detectEmailOrPhone } from "@/shared/lib/utils";

type ForgotPasswordFormData = {
  emailOrPhone: string;
};

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { mutate: sendPasswordReset, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      emailOrPhone: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const detectedType = detectEmailOrPhone(data.emailOrPhone);

    // Prepare payload with either email or phone key
    const payload: { email?: string; phone?: string } = {};

    if (detectedType === "email") {
      payload.email = data.emailOrPhone;
    } else if (detectedType === "phone") {
      payload.phone = data.emailOrPhone;
    }

    sendPasswordReset(payload);
  };

  return (
    <AuthLayout
      title={t("auth.forgotPassword")}
      blurb={t("auth.forgotPasswordDescription")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label={t("auth.emailAddress") + " / " + t("auth.phoneNumber")}
          type="text"
          placeholder={t("auth.emailAddress") + " / " + t("auth.phoneNumber")}
          required
          {...register("emailOrPhone", {
            required: t("validation.required"),
            validate: (value) => {
              const detected = detectEmailOrPhone(value);
              if (!detected) {
                return t("validation.emailOrPhoneInvalid");
              }
              if (detected === "email") {
                const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                if (!emailPattern.test(value)) {
                  return t("validation.emailInvalid");
                }
              } else if (detected === "phone") {
                const digitCount = value.replace(/\D/g, "").length;
                if (digitCount < 6) {
                  return t("validation.phoneTooShort");
                }
              }
              return true;
            },
          })}
          error={errors.emailOrPhone}
        />

        <Button
          type="submit"
          isLoading={isPending}
          fullWidth
          variant="primary"
          className="mt-4"
        >
          {t("auth.sendResetCode")}
        </Button>

        <p className="mt-6 text-center text-xs text-slate-500">
          {t("auth.rememberPassword")}{" "}
          <Link
            to={paths.auth.jwt.signIn}
            className="text-sky-500 font-semibold hover:underline"
          >
            {t("common.signIn")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
