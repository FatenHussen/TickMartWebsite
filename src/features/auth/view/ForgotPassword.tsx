import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import InputField from "@/shared/ui/InputField";
import Button from "@/shared/ui/Button";
import { useForgotPassword } from "@/features/auth/hooks/useAuth";
import { paths } from "@/app/routes/path/paths";
import { detectEmailOrPhone } from "@/shared/lib/utils";
import type { ForgotPasswordFormValues } from "@/features/auth/types";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { mutate: sendPasswordReset, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      emailOrPhone: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    const detectedType = detectEmailOrPhone(data.emailOrPhone);

    const payload: { email?: string; phone?: string } = {};

    if (detectedType === "email") {
      payload.email = data.emailOrPhone;
    } else if (detectedType === "phone") {
      payload.phone = data.emailOrPhone;
    }

    sendPasswordReset(payload);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Image */}
      <div className="hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800"
          alt="Fashion store"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🌀</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Tikmool</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              {t("auth.forgotPassword")}
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              {t("auth.forgotPasswordDescription")}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <InputField
              label={t("common.email")}
              type="text"
              placeholder="example@gmail.com"
              {...register("emailOrPhone", {
                required: t("validation.required"),
                validate: (value) => {
                  const detected = detectEmailOrPhone(value);
                  if (!detected) {
                    return t("validation.emailOrPhoneInvalid");
                  }
                  if (detected === "email") {
                    const emailPattern =
                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
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

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={isPending}
              fullWidth
              variant="primary"
              className="py-3 rounded-full font-semibold"
            >
              {t("auth.sendVerifyCode")}
            </Button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-500">
              {t("auth.goTo")}{" "}
              <Link
                to={paths.auth.jwt.signIn}
                className="text-cyan-500 font-semibold hover:underline"
              >
                {t("common.signIn")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
