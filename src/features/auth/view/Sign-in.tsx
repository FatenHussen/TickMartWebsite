import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import InputField from "@/shared/ui/InputField";
import Button from "@/shared/ui/Button";
import Label from "@/shared/ui/Label";
import { detectEmailOrPhone } from "@/shared/lib/utils";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { paths } from "@/app/routes/path/paths";
import type { SignInFormValues } from "@/features/auth/types";

interface SignInFormData extends SignInFormValues {
  rememberMe?: boolean;
}

function SignIn() {
  const { t } = useTranslation();
  const { mutate: login, isPending } = useLogin();

  const {
    register,
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
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex bg-cyan-50 flex-col">
        {/* Header */}
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">T</span>
            </div>
            <span className="text-lg font-semibold text-gray-800">
              App Everything
            </span>
          </div>
        </div>

        {/* Illustration */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="max-w-md">
            <img
              src="https://i.ibb.co/6W58rtf/delivery-illustration.png"
              alt="Delivery illustration"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Promo Card */}
        <div className="p-8">
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-orange-100 flex items-center justify-center overflow-hidden">
                <span className="text-3xl">🍝</span>
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-orange-500 font-medium uppercase tracking-wider">
                  Sponsored
                </p>
                <h3 className="text-sm font-bold text-gray-900 mt-1">
                  Get 30% Off Your First Order!
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Enjoy exclusive deals from top restaurants. Limited time offer
                  for new customers.
                </p>
                <button className="text-xs text-cyan-500 font-semibold mt-2 hover:underline">
                  View offer →
                </button>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-4">
              Manage ad campaigns from your dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email or Phone */}
            <InputField
              label={t("auth.emailOrPhone")}
              type="text"
              placeholder="your.email@example.com / 09xxxxxxxx"
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

            {/* Password */}
            <div className="space-y-1">
              <InputField
                label={t("common.password")}
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: t("validation.required"),
                  minLength: {
                    value: 8,
                    message: t("validation.passwordTooShort"),
                  },
                })}
                error={errors.password}
              />
              <p className="text-[11px] text-gray-400">
                {t("auth.passwordHelper")}
              </p>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <Label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500"
                  {...register("rememberMe")}
                />
                {t("common.rememberMe")}
              </Label>
              <Link
                to={paths.auth.jwt.forgotPassword}
                className="text-cyan-500 font-medium hover:underline"
              >
                {t("common.forgotPassword")}
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={isPending}
              fullWidth
              variant="primary"
              className="py-3 rounded-full font-semibold"
            >
              {t("common.login")}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-500">
            {t("common.dontHaveAccount")}{" "}
            <Link
              to={paths.auth.jwt.signUp}
              className="text-cyan-500 font-semibold hover:underline"
            >
              {t("common.signUp")}
            </Link>
          </p>

          {/* Continue as Guest */}
          <p className="text-center text-sm">
            <span className="text-gray-400">{t("common.or")} </span>
            <Link
              to={paths.client.home}
              className="text-cyan-500 font-medium hover:underline"
            >
              {t("auth.continueAsGuest")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
