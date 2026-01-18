import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AuthLayout from "@/features/auth/layout/Auth-Layout";
import InputField from "@/shared/ui/InputField";
import Button from "@/shared/ui/Button";
import Label from "@/shared/ui/Label";
import { detectEmailOrPhone } from "@/shared/lib/utils";
import { useGovernorates, useCities } from "@/features/auth/hooks/useLocation";
import { useRegister } from "@/features/auth/hooks/useAuth";

type FormValues = {
  fullName: string;
  emailOrPhone: string;
  password: string;
  confirmPassword: string;
  governorate: string;
  city: string;
  agree: boolean;
};

export default function SignUp() {
  const { t } = useTranslation();
  const [role, setRole] = useState<"customer" | "marketer">("customer");
  const { mutate: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
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

  const onSubmit = async (data: FormValues) => {
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
      blurb={t("auth.orderFromStores")}
      features={[
        t("auth.orderFromNearby"),
        t("auth.collectPoints"),
        t("auth.manageOrders"),
      ]}
      ctaLabel={t("auth.getDiscount")}
      helper={t("auth.onFirstOrder")}
    >
      <div className="space-y-5">
        <div className="flex gap-2 rounded-full p-1 border border-primary/20 bg-blue-off transition-colors">
          <Button
            type="button"
            variant={role === "customer" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setRole("customer")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              role === "customer"
                ? "bg-primary text-white shadow-md"
                : "text-primary bg-transparent hover:bg-transparent"
            }`}
          >
            {t("common.customer")}
          </Button>
          <Button
            type="button"
            variant={role === "marketer" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setRole("marketer")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              role === "marketer"
                ? "bg-primary text-white shadow-md"
                : "text-primary bg-transparent hover:bg-transparent"
            }`}
          >
            {t("common.marketer")}
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            label={t("auth.fullName")}
            placeholder={t("auth.enterFullName")}
            required
            {...register("fullName", { required: t("validation.required") })}
            error={errors.fullName}
          />

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-custom-primary">
                {t("auth.governorate")}
              </Label>
              <select
                className="w-full rounded-lg border border-custom-secondary bg-custom-primary px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-custom-accent transition-colors"
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
              {errors.governorate ? (
                <p className="text-xs text-red-500">
                  {errors.governorate.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label className="block text-sm font-medium text-custom-primary">
                {t("auth.city")}
              </Label>
              <select
                className="w-full rounded-lg border border-custom-secondary bg-custom-primary px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-custom-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              {errors.city ? (
                <p className="text-xs text-red-500">{errors.city.message}</p>
              ) : null}
            </div>
          </div>

          <Label className="inline-flex items-center gap-2 text-xs text-custom-secondary cursor-pointer">
            <input
              type="checkbox"
              className="accent-custom-accent"
              {...register("agree", {
                validate: (v) => v || t("validation.acceptTerms"),
              })}
            />
            <span>
              {t("auth.agreeToTerms")}{" "}
              <span className="text-cyan-dark">{t("auth.termsOfService")}</span>{" "}
              {t("auth.and")}{" "}
              <span className="text-cyan-dark">{t("auth.privacyPolicy")}</span>
            </span>
          </Label>
          {errors.agree ? (
            <p className="text-xs text-red-500">{errors.agree.message}</p>
          ) : null}

          <Button
            type="submit"
            isLoading={isPending}
            fullWidth
            variant="primary"
            className="mt-2"
          >
            {t("common.signUp")}
          </Button>

          <p className="text-center text-xs text-slate-500">
            {t("common.alreadyHaveAccount")}{" "}
            <a
              className="text-cyan-dark font-semibold hover:underline"
              href="#"
            >
              {t("common.login")}
            </a>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
