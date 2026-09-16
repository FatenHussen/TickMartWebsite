import { useForm } from "react-hook-form";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import EmailOrPhoneInput from "@/features/auth/components/EmailOrPhoneInput";
import InputField from "@/shared/ui/InputField";
import Button from "@/shared/ui/Button";
import Label from "@/shared/ui/Label";
import AuthLayout from "@/features/auth/layout/Auth-Layout";
import AuthBrand from "@/features/auth/components/AuthBrand";
import { detectEmailOrPhone } from "@/shared/lib/utils";
import { toInternationalPhone } from "@/features/auth/utils/countryDialCode";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { useAppSettings } from "@/features/account/hooks/useAppSettings";
import { paths } from "@/app/routes/path/paths";
import type { SignInFormValues } from "@/features/auth/types";

interface SignInFormData extends SignInFormValues {
    rememberMe?: boolean;
}

export default function SignIn() {
    const { t } = useTranslation();
    const { mutate: login, isPending } = useLogin();
    const { data: appSettings } = useAppSettings();
    const loginSettings = appSettings?.login;
    const loginImage = "/images/auth/seller.jpg";
    const [dialCode, setDialCode] = useState("+963");

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

        if (detectedType === "email" || data.emailOrPhone.includes("@")) {
            payload.email = data.emailOrPhone.trim();
        } else {
            payload.phone = toInternationalPhone(dialCode, data.emailOrPhone);
        }

        login(payload);
    };

    return (
        <AuthLayout
            leftPanel="image"
            leftImageSrc={loginImage}
            leftImageLink={loginSettings?.link}
            leftImageAlt={t("common.login")}
            useFormCard
        >
            <div className="space-y-3">
                <AuthBrand size="sm" />
                <div className="space-y-1.5 text-center">
                    <h1 className="text-2xl font-bold tracking-[-0.01em] text-stone-900 dark:text-white">
                        {t("auth.signInTitle")}
                    </h1>
                    <p className="text-sm text-stone-500 dark:text-zinc-400">
                        {t("auth.signInSubtitle")}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <EmailOrPhoneInput
                    name="emailOrPhone"
                    control={control}
                    label={t("auth.emailOrPhone")}
                    placeholder="0935931471"
                    onDialCodeChange={setDialCode}
                    error={errors.emailOrPhone}
                    required
                />

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
                    <p className="text-xs text-stone-500 dark:text-zinc-400">
                        {t("auth.passwordHelper")}
                    </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <Label className="flex cursor-pointer items-center gap-2 text-stone-800 dark:text-white">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-stone-300 text-primary focus:ring-primary"
                            {...register("rememberMe")}
                        />
                        {t("common.rememberMe")}
                    </Label>
                    <Link
                        to={paths.auth.jwt.forgotPassword}
                        className="font-medium text-primary hover:underline"
                    >
                        {t("common.forgotPassword")}
                    </Link>
                </div>

                <Button
                    type="submit"
                    isLoading={isPending}
                    fullWidth
                    variant="primary"
                    className="rounded-xl py-3 font-semibold"
                >
                    {t("common.login")}
                </Button>
            </form>

            <p className="text-center text-sm text-stone-500 dark:text-zinc-400">
                {t("common.dontHaveAccount")}{" "}
                <Link to={paths.auth.jwt.signUp} className="font-medium text-primary hover:underline">
                    {t("common.signUp")}
                </Link>
            </p>

            <p className="text-center text-sm text-stone-500 dark:text-zinc-400">
                {t("common.or")}{" "}
                <Link to={paths.client.home} className="font-medium text-primary hover:underline">
                    {t("auth.continueAsGuest")}
                </Link>
            </p>
        </AuthLayout>
    );
}
