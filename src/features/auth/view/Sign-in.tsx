import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AuthLayout from "@/features/auth/layout/Auth-Layout";
import InputField from "@/shared/ui/InputField";
import Button from "@/shared/ui/Button";
import Label from "@/shared/ui/Label";
import { detectEmailOrPhone } from "@/shared/lib/utils";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { paths } from "@/app/routes/path/paths";

type Role = "customer" | "marketer";
interface SignInFormData {
  emailOrPhone: string;
  password: string;
  rememberMe?: boolean;
}

function SignIn() {
  const { t } = useTranslation();
  const [role, setRole] = useState<Role>("customer");
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

    // Prepare payload with either email or phone key
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
    <AuthLayout
      title={t("auth.createAccount")}
      blurb={t("auth.orderFromStores")}
    >
      {/* top toggle Customer / Marketer */}
      <div className="flex justify-center mb-5">
        <div className="inline-flex rounded-full border border-sky-400/70 bg-sky-50/70 p-1 overflow-hidden">
          <Button
            type="button"
            variant={role === "customer" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setRole("customer")}
            className={`px-6 py-2 text-sm font-semibold rounded-full transition-all ${
              role === "customer"
                ? "bg-sky-500 text-white shadow-md"
                : "text-sky-600 bg-transparent hover:bg-transparent"
            }`}
          >
            {t("common.customer")}
          </Button>
          <Button
            type="button"
            variant={role === "marketer" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setRole("marketer")}
            className={`px-6 py-2 text-sm font-semibold rounded-full transition-all ${
              role === "marketer"
                ? "bg-sky-500 text-white shadow-md"
                : "text-sky-600 bg-transparent hover:bg-transparent"
            }`}
          >
            {t("common.marketer")}
          </Button>
        </div>
      </div>

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

        <div className="space-y-1">
          <InputField
            label={t("common.password")}
            type="password"
            placeholder={t("auth.createPassword")}
            required
            {...register("password", {
              required: t("validation.required"),
              minLength: {
                value: 8,
                message: t("validation.passwordTooShort"),
              },
            })}
            error={errors.password}
          />
          <p className="text-[11px] text-slate-400">
            {t("auth.passwordHelper")}
          </p>
        </div>

        {/* remember + forgot */}
        <div className="flex items-center justify-between text-xs mt-1">
          <Label className="inline-flex items-center gap-2 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              className="accent-sky-600"
              {...register("rememberMe")}
            />
            {t("common.rememberMe")}
          </Label>
          <Link
            to={paths.auth.jwt.forgotPassword}
            className="text-sky-500 font-semibold hover:underline"
          >
            {t("common.forgotPassword")}
          </Link>
        </div>

        <Button
          type="submit"
          isLoading={isPending}
          fullWidth
          variant="primary"
          className="mt-4"
        >
          {t("common.signIn")}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        {t("common.dontHaveAccount")}{" "}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-sky-500 font-semibold hover:underline p-0 h-auto text-xs"
        >
          {t("common.signUp")}
        </Button>
      </p>
    </AuthLayout>
  );
}

export default SignIn;
