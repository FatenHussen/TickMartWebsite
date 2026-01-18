import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AuthLayout from "@/features/auth/layout/Auth-Layout";
import InputField from "@/shared/ui/InputField";
import Button from "@/shared/ui/Button";
import Label from "@/shared/ui/Label";
import { detectEmailOrPhone } from "@/shared/lib/utils";
import { useGovernorates, useCities } from "@/features/auth/hooks/useLocation";
import { useRegister } from "@/features/auth/hooks/useAuth";
import { paths } from "@/app/routes/path/paths";
import type { SignUpFormValues, UserRole } from "@/features/auth/types";

export default function SignUp() {
  const { t } = useTranslation();
  const [role, setRole] = useState<UserRole>("customer");
  const { mutate: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      fullName: "",
      emailOrPhone: "",
      password: "",
      confirmPassword: "",
      governorate: "",
      city: "",
      agree: false,
    },
  });

  const selectedGovernorateId = watch("governorate");

  const { data: governorates = [] } = useGovernorates();
  const { data: cities = [], isLoading: isLoadingCities } = useCities(
    selectedGovernorateId &&
      selectedGovernorateId !== "" &&
      selectedGovernorateId !== "0"
      ? Number(selectedGovernorateId)
      : null
  );

  // Reset city when governorate changes
  useEffect(() => {
    setValue("city", "");
  }, [selectedGovernorateId, setValue]);

  const onSubmit = async (data: SignUpFormValues) => {
    const detectedType = detectEmailOrPhone(data.emailOrPhone);

    // Prepare payload with either email or phone key
    const payload: {
      name: string;
      password: string;
      city_id: number;
      governorate_id: number;
      email?: string;
      phone?: string;
    } = {
      name: data.fullName,
      password: data.password,
      city_id: Number(data.city),
      governorate_id: Number(data.governorate),
    };

    if (detectedType === "email") {
      payload.email = data.emailOrPhone;
    } else if (detectedType === "phone") {
      payload.phone = data.emailOrPhone;
    }

    registerUser(payload);
  };

  return (
    <AuthLayout
      title={t("auth.createAccount")}
      features={[
        t("auth.orderFromNearby"),
        t("auth.collectPoints"),
        t("auth.manageOrders"),
      ]}
      ctaLabel={t("auth.getDiscount")}
      helper={t("auth.onFirstOrder")}
    >
      <div className="space-y-5">
        {/* Role Toggle - Customer / Seller */}
        <div className="flex rounded-full p-1 bg-gray-100">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-all ${
              role === "customer"
                ? "bg-primary text-white shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {t("common.customer")}
          </button>
          <button
            type="button"
            onClick={() => setRole("seller")}
            className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-all ${
              role === "seller"
                ? "bg-primary text-white shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {t("common.seller")}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <InputField
            label={t("auth.fullName")}
            placeholder={t("auth.enterFullName")}
            required
            {...register("fullName", { required: t("validation.required") })}
            error={errors.fullName}
          />

          {/* Email or Phone */}
          <InputField
            label={t("auth.emailOrPhone")}
            type="text"
            placeholder="your.email@example.com / 09xxxxxxxx"
            required
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
            helperText={t("auth.passwordHelper")}
          />

          {/* Confirm Password */}
          <InputField
            label={t("common.confirmPassword")}
            type="password"
            placeholder={t("auth.reEnterPassword")}
            required
            {...register("confirmPassword", {
              required: t("validation.required"),
              validate: (v) =>
                v === watch("password") || t("validation.passwordsDoNotMatch"),
            })}
            error={errors.confirmPassword}
          />

          {/* Governorate & City */}
          <div className="grid grid-cols-2 gap-3">
            {/* Governorate */}
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                {t("auth.governorate")}
                <span className="text-red-500 ms-0.5">*</span>
              </Label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pe-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  {...register("governorate", {
                    required: t("validation.selectGovernorate"),
                    validate: (v) =>
                      (v !== "" && v !== "0") ||
                      t("validation.selectGovernorate"),
                  })}
                >
                  <option value="">{t("auth.selectGovernorate")}</option>
                  {governorates.map((governorate) => (
                    <option key={governorate.id} value={String(governorate.id)}>
                      {governorate.name}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {errors.governorate && (
                <p className="text-xs text-red-500">
                  {errors.governorate.message}
                </p>
              )}
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                {t("auth.city")}
                <span className="text-red-500 ms-0.5">*</span>
              </Label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pe-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
                  disabled={
                    !selectedGovernorateId ||
                    selectedGovernorateId === "" ||
                    selectedGovernorateId === "0" ||
                    isLoadingCities
                  }
                  {...register("city", {
                    required: t("validation.selectCity"),
                    validate: (v) =>
                      (v !== "" && v !== "0") || t("validation.selectCity"),
                  })}
                >
                  <option value="">{t("auth.selectCity")}</option>
                  {cities.map((city) => (
                    <option key={city.id} value={String(city.id)}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {errors.city && (
                <p className="text-xs text-red-500">{errors.city.message}</p>
              )}
            </div>
          </div>

          {/* Terms Agreement */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register("agree", {
                validate: (v) => v || t("validation.acceptTerms"),
              })}
            />
            <span className="text-xs text-gray-600">
              {t("auth.agreeToTerms")}{" "}
              <Link
                to="/terms"
                className="text-primary font-medium hover:underline"
              >
                {t("auth.termsOfService")}
              </Link>{" "}
              {t("auth.and")}{" "}
              <Link
                to="/privacy"
                className="text-primary font-medium hover:underline"
              >
                {t("auth.privacyPolicy")}
              </Link>
            </span>
          </label>
          {errors.agree && (
            <p className="text-xs text-red-500">{errors.agree.message}</p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isPending}
            fullWidth
            variant="primary"
            className="mt-4 py-3 rounded-full font-semibold"
          >
            {t("common.signUp")}
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500">
            {t("common.alreadyHaveAccount")}{" "}
            <Link
              to={paths.auth.jwt.signIn}
              className="text-primary font-semibold hover:underline"
            >
              {t("common.login")}
            </Link>
          </p>

          {/* Continue as Guest */}
          <p className="text-center text-sm">
            <span className="text-gray-400">{t("common.or")} </span>
            <Link
              to={paths.client.home}
              className="text-primary font-medium hover:underline"
            >
              {t("auth.continueAsGuest")}
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
