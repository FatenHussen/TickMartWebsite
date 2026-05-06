import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AuthLayout from "@/features/auth/layout/Auth-Layout";
import AuthRoleToggle from "@/features/auth/components/AuthRoleToggle";
import EmailOrPhoneInput from "@/features/auth/components/EmailOrPhoneInput";
import InputField from "@/shared/ui/InputField";
import Button from "@/shared/ui/Button";
import Label from "@/shared/ui/Label";
import { detectEmailOrPhone } from "@/shared/lib/utils";
import { _LocationApi } from "@/features/auth/api/location.service";
import { useInfiniteSelect } from "@/shared/hooks/useInfiniteSelect";
import type { Governorate, City } from "@/features/auth/types";
import { useRegister } from "@/features/auth/hooks/useAuth";
import { paths } from "@/app/routes/path/paths";
import type { SignUpFormValues, UserRole } from "@/features/auth/types";

type CustomerSignUpProps = {
    role: UserRole;
    setRole: (r: UserRole) => void;
};

export default function CustomerSignUp({ role, setRole }: CustomerSignUpProps) {
    const { t } = useTranslation();
    const { mutate: registerUser, isPending } = useRegister();
    const selectClasses =
        "w-full appearance-none rounded-lg border border-custom-secondary bg-custom-card px-4 py-2.5 pe-10 text-sm text-custom-primary transition-colors focus:border-[var(--color-main)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-main)_22%,transparent)]";
    const disabledSelectClasses =
        `${selectClasses} disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-custom-light`;

    const {
        register,
        control,
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

    const govId =
        selectedGovernorateId &&
            selectedGovernorateId !== "" &&
            selectedGovernorateId !== "0"
            ? Number(selectedGovernorateId)
            : null;

    const {
        options: governorateOptions,
        handleScroll: handleGovScroll,
        isFetchingNextPage: isFetchingMoreGov,
    } = useInfiniteSelect<Governorate>({
        queryKey: ["location", "governorates", "select"],
        fetchFn: async (page) => {
            const res = await _LocationApi.getGovernorates(page);
            return res.data;
        },
        mapToOption: (gov) => ({
            value: String(gov.id),
            label: typeof gov.name === "string" ? gov.name : String(gov.name),
        }),
    });

    const {
        options: cityOptions,
        isLoading: isLoadingCities,
        handleScroll: handleCityScroll,
        isFetchingNextPage: isFetchingMoreCities,
    } = useInfiniteSelect<City>({
        queryKey: ["location", "cities", "select", govId],
        fetchFn: async (page) => {
            const res = await _LocationApi.getCities(govId!, page);
            const data = res.data;
            if (data && typeof data === "object" && "items" in data) {
                return data as unknown as { items: City[]; pagination: { current_page: number; last_page: number; per_page: number; total: number } };
            }
            if (Array.isArray(data)) {
                return { items: data as City[], pagination: null };
            }
            return { items: [], pagination: null };
        },
        mapToOption: (city) => ({
            value: String(city.id),
            label: typeof city.name === "string" ? city.name : String(city.name),
        }),
        enabled: !!govId,
    });

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
            leftPanel="signup"
            title={t("auth.createAccount")}
            features={[
                t("auth.orderFromNearby"),
                t("auth.collectPoints"),
                t("auth.manageOrders"),
            ]}
            ctaLabel={t("auth.getDiscount")}
            helper={t("auth.onFirstOrder")}
            useFormCard
            maxWidth="auth"
        >
            <div className="w-full min-w-0 space-y-6">
                <div className="flex w-full justify-center">
                    <AuthRoleToggle role={role} setRole={setRole} t={t} />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full min-w-0 space-y-4">
                    <div className="space-y-1.5">
                        <InputField
                            label={t("auth.fullName")}
                            placeholder={t("auth.enterFullName")}
                            required
                            {...register("fullName", { required: t("validation.required") })}
                            error={errors.fullName}
                        />
                    </div>

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
                    </div>

                    <div className="space-y-1.5">
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
                    </div>

                    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="min-w-0 space-y-1.5">
                            <Label className="block text-sm font-medium text-custom-primary">
                                {t("auth.governorate")}
                                <span className="text-red-500 dark:text-red-400 ms-0.5">*</span>
                            </Label>
                            <div className="relative">
                                <select
                                    className={selectClasses}
                                    onScroll={handleGovScroll}
                                    {...register("governorate", {
                                        required: t("validation.selectGovernorate"),
                                        validate: (v) =>
                                            (v !== "" && v !== "0") || t("validation.selectGovernorate"),
                                    })}
                                >
                                    <option value="">{t("auth.selectGovernorate")}</option>
                                    {governorateOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                    {isFetchingMoreGov && (
                                        <option value="" disabled>
                                            {t("common.loading")}
                                        </option>
                                    )}
                                </select>
                                <svg
                                    className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-custom-tertiary"
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

                        <div className="min-w-0 space-y-1.5">
                            <Label className="block text-sm font-medium text-custom-primary">
                                {t("auth.city")}
                                <span className="text-red-500 dark:text-red-400 ms-0.5">*</span>
                            </Label>
                            <div className="relative">
                                <select
                                    className={disabledSelectClasses}
                                    disabled={
                                        !selectedGovernorateId ||
                                        selectedGovernorateId === "" ||
                                        selectedGovernorateId === "0" ||
                                        isLoadingCities
                                    }
                                    onScroll={handleCityScroll}
                                    {...register("city", {
                                        required: t("validation.selectCity"),
                                        validate: (v) =>
                                            (v !== "" && v !== "0") || t("validation.selectCity"),
                                    })}
                                >
                                    <option value="">{t("auth.selectCity")}</option>
                                    {cityOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                    {isFetchingMoreCities && (
                                        <option value="" disabled>
                                            {t("common.loading")}
                                        </option>
                                    )}
                                </select>
                                <svg
                                    className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-custom-tertiary"
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

                    <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 rounded border-custom-secondary text-primary focus:ring-primary"
                            {...register("agree", {
                                validate: (v) => v || t("validation.acceptTerms"),
                            })}
                        />
                        <span className="text-sm text-custom-primary">
                            {t("auth.agreeToTerms")}{""}
                            <Link
                                to="/terms"
                                className="text-primary font-medium hover:underline"
                            >
                                {t("auth.termsOfService")}
                            </Link>{""}
                            {t("auth.and")}{""}
                            <Link
                                to="/privacy"
                                className="text-primary font-medium hover:underline"
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

                    <Button
                        type="submit"
                        isLoading={isPending}
                        fullWidth
                        variant="primary"
                        className="py-3 rounded-xl font-semibold"
                    >
                        {t("common.signUp")}
                    </Button>

                    <div className="text-center space-y-1 pt-1">
                        <p className="text-sm text-custom-secondary">
                            {t("common.alreadyHaveAccount")}{" "}
                            <Link
                                to={paths.auth.jwt.signIn}
                                className="text-primary font-medium hover:underline"
                            >
                                {t("common.login")}
                            </Link>
                        </p>
                        <p className="text-sm text-custom-secondary">
                            {t("common.or")}{" "}
                            <Link
                                to={paths.client.home}
                                className="text-primary font-medium hover:underline"
                            >
                                {t("auth.continueAsGuest")}
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}
