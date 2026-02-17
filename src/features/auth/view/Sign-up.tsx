import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AuthLayout from "@/features/auth/layout/Auth-Layout";
import InputField from "@/shared/ui/InputField";
import Button from "@/shared/ui/Button";
import Label from "@/shared/ui/Label";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { HiOutlinePhotograph } from "react-icons/hi";
import { detectEmailOrPhone } from "@/shared/lib/utils";
import { useGovernorates, useCities } from "@/features/auth/hooks/useLocation";
import { useRegister, useSellerRegister } from "@/features/auth/hooks/useAuth";
import { paths } from "@/app/routes/path/paths";
import type {
  SignUpFormValues,
  SellerSignUpFormValues,
  UserRole,
} from "@/features/auth/types";

// ─── Role Toggle (shared between customer & seller) ────────────────────────
function RoleToggle({
  role,
  setRole,
  t,
}: {
  role: UserRole;
  setRole: (r: UserRole) => void;
  t: (key: string) => string;
}) {
  return (
    <div className="relative z-30 flex rounded-full p-1 bg-gray-100 dark:bg-gray-800">
      <button
        type="button"
        onClick={() => setRole("customer")}
        className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-all ${
          role === "customer"
            ? "bg-primary text-white shadow-sm"
            : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
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
            : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
        }`}
      >
        {t("common.seller")}
      </button>
    </div>
  );
}

// ─── Seller Sign-Up Form ────────────────────────────────────────────────────
function SellerSignUpForm({
  role,
  setRole,
}: {
  role: UserRole;
  setRole: (r: UserRole) => void;
}) {
  const { t } = useTranslation();
  const { mutate: sellerRegister, isPending } = useSellerRegister();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SellerSignUpFormValues>({
    defaultValues: {
      emailOrPhone: "",
      password: "",
      confirmPassword: "",
      sellerName: "",
      storeName: "",
      storeAddress: "",
      commercialRegisterNumber: "",
      commercialRegisterDate: "",
      gender: "",
      country: "",
      storeCity: "",
    },
  });

  const onSubmit = (data: SellerSignUpFormValues) => {
    const detectedType = detectEmailOrPhone(data.emailOrPhone);

    // Convert date from format 2/4/2026 to ISO format 2026-04-02
    const formatDate = (dateString: string): string => {
      if (!dateString) return "";
      // If already in ISO format (YYYY-MM-DD), return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      // If in format M/D/YYYY or DD/MM/YYYY, convert to ISO
      const parts = dateString.split("/");
      if (parts.length === 3) {
        const [month, day, year] = parts;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
      return dateString;
    };

    const payload: {
      password: string;
      seller_name: string;
      store_name: string;
      address: string;
      commercial_register_number: string;
      commercial_register_date: string;
      gender: string;
      country: string;
      email?: string;
      phone?: string;
    } = {
      password: data.password,
      seller_name: data.sellerName,
      store_name: data.storeName,
      address: data.storeAddress,
      commercial_register_number: data.commercialRegisterNumber,
      commercial_register_date: formatDate(data.commercialRegisterDate),
      gender: data.gender,
      country: data.country,
    };

    if (detectedType === "email") {
      payload.email = data.emailOrPhone;
    } else if (detectedType === "phone") {
      payload.phone = data.emailOrPhone;
    }

    sellerRegister(payload);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const selectClasses =
    "w-full appearance-none rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 pe-10 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  return (
    <div className="relative min-h-screen grid lg:grid-cols-2 bg-white dark:bg-gray-900">
      {/* Theme and Language toggles */}
      <div className="absolute top-3 end-3 z-20 flex gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* Left Side - Store Image (full height, hidden on mobile) */}
      <div className="hidden lg:block lg:sticky lg:top-0 lg:h-screen">
        <img
          src="/images/auth/seller.jpg"
          alt="Store"
          className="w-full h-full object-cover opacity-95 dark:opacity-70"
        />
      </div>

      {/* Right Side - Seller Form */}
      <div className="flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 lg:py-10 bg-white dark:bg-gray-900 min-h-screen">
        <div className="w-full max-w-lg mx-auto space-y-4">
          {/* Role Toggle */}
          <RoleToggle role={role} setRole={setRole} t={t} />

          {/* Heading */}
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            {t("auth.createSellerAccount")}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
            {/* Email or Phone */}
            <InputField
              label={t("auth.emailOrPhone")}
              type="text"
              placeholder="your.email@example.com / 09xxxxxxxx"
              required
              maxLength={255}
              {...register("emailOrPhone", {
                required: t("validation.required"),
                validate: (value) => {
                  const detected = detectEmailOrPhone(value);
                  if (!detected) return t("validation.emailOrPhoneInvalid");
                  if (detected === "email") {
                    const emailPattern =
                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                    if (!emailPattern.test(value))
                      return t("validation.emailInvalid");
                  } else if (detected === "phone") {
                    if (value.replace(/\D/g, "").length < 6)
                      return t("validation.phoneTooShort");
                  }
                  return true;
                },
              })}
              error={errors.emailOrPhone}
            />

            {/* Password + Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <InputField
                label={t("common.password")}
                type="password"
                placeholder="••••••••"
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
              <InputField
                label={t("common.confirmPassword")}
                type="password"
                placeholder="••••••••"
                required
                {...register("confirmPassword", {
                  required: t("validation.required"),
                  validate: (v) =>
                    v === watch("password") ||
                    t("validation.passwordsDoNotMatch"),
                })}
                error={errors.confirmPassword}
              />
            </div>

            <p className="text-[10px] text-gray-400 dark:text-gray-500 -mt-1!">
              {t("auth.passwordHelper")}
            </p>

            {/* Seller Full Name */}
            <InputField
              label={t("auth.sellerFullName")}
              placeholder={t("auth.enterSellerName")}
              required
              maxLength={255}
              {...register("sellerName", {
                required: t("validation.required"),
              })}
              error={errors.sellerName}
            />

            {/* Store Name + Store Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <InputField
                label={t("auth.storeName")}
                placeholder={t("auth.enterStoreName")}
                required
                maxLength={255}
                {...register("storeName", {
                  required: t("validation.required"),
                })}
                error={errors.storeName}
              />
              <InputField
                label={t("auth.storeAddress")}
                placeholder={t("auth.enterStoreAddress")}
                required
                maxLength={500}
                {...register("storeAddress", {
                  required: t("validation.required"),
                })}
                error={errors.storeAddress}
              />
            </div>

            {/* Gender + Commercial Reg Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Gender */}
              <div className="space-y-1">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("auth.gender")}
                  <span className="text-red-500 dark:text-red-400 ms-0.5">
                    *
                  </span>
                </Label>
                <div className="relative">
                  <select
                    className={selectClasses}
                    {...register("gender", {
                      required: t("validation.required"),
                    })}
                  >
                    <option value="">{t("auth.selectGender")}</option>
                    <option value="male">{t("auth.male")}</option>
                    <option value="female">{t("auth.female")}</option>
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
                {errors.gender && (
                  <p className="text-xs text-red-500 dark:text-red-400">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <InputField
                label={t("auth.commercialRegNumber")}
                placeholder={t("auth.enterCommercialRegNumber")}
                required
                maxLength={100}
                {...register("commercialRegisterNumber", {
                  required: t("validation.required"),
                })}
                error={errors.commercialRegisterNumber}
              />
            </div>

            {/* Commercial Register Date */}
            <InputField
              label={t("auth.commercialRegisterDate")}
              type="date"
              required
              {...register("commercialRegisterDate", {
                required: t("validation.required"),
              })}
              error={errors.commercialRegisterDate}
            />

            {/* Store Country + Store City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <InputField
                label={t("auth.storeCountry")}
                placeholder={t("auth.enterStoreCountry")}
                required
                maxLength={100}
                {...register("country", {
                  required: t("validation.required"),
                })}
                error={errors.country}
              />
              <InputField
                label={t("auth.storeCity")}
                placeholder={t("auth.enterStoreCity")}
                required
                maxLength={100}
                {...register("storeCity", {
                  required: t("validation.required"),
                })}
                error={errors.storeCity}
              />
            </div>

            {/* Store Image Upload */}
            <div className="space-y-1">
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("auth.storeImageUpload")}
              </Label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 text-center hover:border-primary/40 transition-colors"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mx-auto h-12 w-12 rounded-lg object-cover"
                  />
                ) : (
                  <HiOutlinePhotograph className="mx-auto h-7 w-7 text-gray-400 dark:text-gray-500" />
                )}
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                  {t("auth.uploadStoreLogo")}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                  {t("auth.uploadHint")}
                </p>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={isPending}
              fullWidth
              variant="primary"
              className="mt-3! py-2.5 rounded-full font-semibold"
            >
              {t("auth.createStoreAccount")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Customer Sign-Up Form ──────────────────────────────────────────────────
function CustomerSignUpForm({
  role,
  setRole,
}: {
  role: UserRole;
  setRole: (r: UserRole) => void;
}) {
  const { t } = useTranslation();
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
      : null,
  );

  // Reset city when governorate changes
  useEffect(() => {
    setValue("city", "");
  }, [selectedGovernorateId, setValue]);

  const onSubmit = async (data: SignUpFormValues) => {
    const detectedType = detectEmailOrPhone(data.emailOrPhone);

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
        {/* Role Toggle */}
        <RoleToggle role={role} setRole={setRole} t={t} />

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Governorate */}
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("auth.governorate")}
                <span className="text-red-500 dark:text-red-400 ms-0.5">*</span>
              </Label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 pe-10 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
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
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.governorate.message}
                </p>
              )}
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("auth.city")}
                <span className="text-red-500 dark:text-red-400 ms-0.5">*</span>
              </Label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 pe-10 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-700"
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
                  {(cities ?? []).map((city: { id: number; name: string }) => (
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
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.city.message}
                </p>
              )}
            </div>
          </div>

          {/* Terms Agreement */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary dark:text-cyan-400 focus:ring-primary dark:bg-gray-700"
              {...register("agree", {
                validate: (v) => v || t("validation.acceptTerms"),
              })}
            />
            <span className="text-xs text-gray-600 dark:text-gray-300">
              {t("auth.agreeToTerms")}{" "}
              <Link
                to="/terms"
                className="text-primary dark:text-cyan-400 font-medium hover:underline"
              >
                {t("auth.termsOfService")}
              </Link>{" "}
              {t("auth.and")}{" "}
              <Link
                to="/privacy"
                className="text-primary dark:text-cyan-400 font-medium hover:underline"
              >
                {t("auth.privacyPolicy")}
              </Link>
            </span>
          </label>
          {errors.agree && (
            <p className="text-xs text-red-500 dark:text-red-400">
              {errors.agree.message}
            </p>
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
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            {t("common.alreadyHaveAccount")}{" "}
            <Link
              to={paths.auth.jwt.signIn}
              className="text-primary dark:text-cyan-400 font-semibold hover:underline"
            >
              {t("common.login")}
            </Link>
          </p>

          {/* Continue as Guest */}
          <p className="text-center text-sm">
            <span className="text-gray-400 dark:text-gray-500">
              {t("common.or")}{" "}
            </span>
            <Link
              to={paths.client.home}
              className="text-primary dark:text-cyan-400 font-medium hover:underline"
            >
              {t("auth.continueAsGuest")}
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

// ─── Main Sign-Up Page ──────────────────────────────────────────────────────
export default function SignUp() {
  const [role, setRole] = useState<UserRole>("customer");

  if (role === "seller") {
    return <SellerSignUpForm role={role} setRole={setRole} />;
  }

  return <CustomerSignUpForm role={role} setRole={setRole} />;
}
