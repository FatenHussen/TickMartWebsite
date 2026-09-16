import { useForm } from "react-hook-form";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import EmailOrPhoneInput from "@/features/auth/components/EmailOrPhoneInput";
import Button from "@/shared/ui/Button";
import AuthLayout from "@/features/auth/layout/Auth-Layout";
import AuthBrand from "@/features/auth/components/AuthBrand";
import { useForgotPassword } from "@/features/auth/hooks/useAuth";
import { paths } from "@/app/routes/path/paths";
import { toInternationalPhone } from "@/features/auth/utils/countryDialCode";
import type { ForgotPasswordFormValues } from "@/features/auth/types";

export default function ForgotPassword() {
    const { t } = useTranslation();
    const { mutate: sendPasswordReset, isPending } = useForgotPassword();
    const [dialCode, setDialCode] = useState("+963");

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        defaultValues: { emailOrPhone: "" },
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        const payload: { email?: string; phone?: string } = {};
        if (data.emailOrPhone.includes("@")) payload.email = data.emailOrPhone.trim();
        else payload.phone = toInternationalPhone(dialCode, data.emailOrPhone);
        sendPasswordReset(payload);
    };

 return (
 <AuthLayout
 leftPanel="image"
 leftImageSrc="/images/auth/changePassword.jpg"
 leftImageAlt=""
 leftImageHeight="100vh"
 useFormCard
 maxWidth="auth"
 >
 <div className="space-y-6">
 <div className="text-center mb-10">
 <AuthBrand size="sm" className="mb-10" />

 <h1 className="text-2xl font-bold text-custom-primary">
 {t("auth.forgotPassword")}
 </h1>
 <p className="text-sm text-custom-secondary mt-3 max-w-sm mx-auto">
 {t("auth.forgotPasswordDescription")}
 </p>
 </div>

 <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
 <EmailOrPhoneInput
 name="emailOrPhone"
 control={control}
 label={t("auth.phoneOrEmail")}
 placeholder="0935931471"
 error={errors.emailOrPhone}
 required
 onDialCodeChange={setDialCode}
 />

 <Button
 type="submit"
 isLoading={isPending}
 fullWidth
 variant="primary"
 className="py-3 rounded-xl font-semibold"
 >
 {t("auth.sendVerifyCode")}
 </Button>

 <p className="text-center text-sm text-custom-secondary pt-2">
 {t("auth.goTo")}{""}
 <Link
 to={paths.auth.jwt.signIn}
 className="text-primary font-medium underline hover:no-underline"
 >
 {t("common.signIn")}
 </Link>
 </p>
 </form>
 </div>
 </AuthLayout>
 );
}
