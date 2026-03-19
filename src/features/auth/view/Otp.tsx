import { useEffect, useState } from"react";
import { useTranslation } from"react-i18next";
import { Link, useNavigate } from"react-router-dom";
import OTPInput from"react-otp-input";
import type { InputHTMLAttributes } from"react";
import Button from"@/shared/ui/Button";
import AuthLayout from"@/features/auth/layout/Auth-Layout";
import { useOtpStore } from"@/store/otp";
import {
 useVerifyOtp,
 useSendOtp,
 useVerifyPassword,
 useForgotPassword,
} from"@/features/auth/hooks/useAuth";
import { paths } from"@/app/routes/path/paths";

const OTP_LENGTH = 5;

export default function Otp() {
 const { t } = useTranslation();
 const navigate = useNavigate();
 const [code, setCode] = useState("");
 const [timer, setTimer] = useState<number>(60);
 const email = useOtpStore((state) => state.email);
 const phone = useOtpStore((state) => state.phone);
 const isPasswordReset = useOtpStore((state) => state.isPasswordReset);

 const { mutate: verifyOtp, isPending: isPendingOtp } = useVerifyOtp();
 const { mutate: verifyPassword, isPending: isPendingPassword } =
 useVerifyPassword();
 const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();
 const { mutate: sendPassword, isPending: isSendingPassword } =
 useForgotPassword();

 const isPending = isPendingOtp || isPendingPassword;

 useEffect(() => {
 if (timer <= 0) return;
 const id = setInterval(() => setTimer((t) => t - 1), 1000);
 return () => clearInterval(id);
 }, [timer]);

 useEffect(() => {
 if (!email && !phone) {
 navigate(paths.auth.jwt.signUp);
 }
 }, [email, phone, navigate]);

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (code.length !== OTP_LENGTH) return;

 if (isPasswordReset) {
 verifyPassword(code);
 } else {
 verifyOtp(code);
 }
 };

 const handleResend = () => {
 if (timer > 0) return;

 if (isPasswordReset) {
 const payload: { email?: string; phone?: string } = {};
 if (email) payload.email = email;
 else if (phone) payload.phone = phone;

 sendPassword(payload, {
 onSuccess: () => {
 setTimer(60);
 setCode("");
 },
 });
 } else {
 sendOtp(undefined, {
 onSuccess: () => {
 setTimer(60);
 setCode("");
 },
 });
 }
 };

 const getMaskedContact = () => {
 if (email) {
 const [localPart, domain] = email.split("@");
 return `${localPart.slice(0, 2)}****@${domain}`;
 }
 if (phone) return `****${phone.slice(-4)}`;
 return"";
 };

 const formatTime = (seconds: number) => {
 const mins = Math.floor(seconds / 60);
 const secs = seconds % 60;
 return `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
 };

 return (
 <AuthLayout leftPanel="promo"useFormCard maxWidth="576">
 <form onSubmit={handleSubmit} className="flex flex-col gap-8">
 <div className="text-center space-y-2">
 <h1 className="text-xl font-bold text-custom-primary">
 {t("auth.enterVerificationCode")}
 </h1>
 <p className="text-sm text-custom-secondary">
 {t("auth.sentCodeTo")}
 </p>
 <p className="text-sm font-medium text-primary">
 {getMaskedContact()}
 </p>
 </div>

 <OTPInput
 value={code}
 onChange={(val: string) => setCode(val.slice(0, OTP_LENGTH))}
 numInputs={OTP_LENGTH}
 shouldAutoFocus
 inputType="tel"
 containerStyle="justify-center gap-3 flex"
 renderInput={(props: InputHTMLAttributes<HTMLInputElement>) => (
 <input
 {...props}
 className="!w-12 h-12 rounded-lg border border-custom-secondary bg-custom-card text-center text-lg font-semibold text-custom-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all [appearance:textfield]"
 />
 )}
 />

 <p className="text-center text-sm text-custom-secondary">
 {t("auth.resendCodeIn")}{""}
 <span className="font-semibold text-custom-primary">
 {formatTime(timer)}
 </span>
 </p>

 <div className="flex items-center justify-between text-sm">
 <Link
 to={paths.auth.jwt.signUp}
 className="text-primary font-medium hover:underline"
 >
 {t("auth.changeEmailPhone")}
 </Link>
 <button
 type="button"
 onClick={handleResend}
 disabled={
 timer > 0 ||
 isSendingOtp ||
 isSendingPassword ||
 (!email && !phone)
 }
 className="text-primary font-medium hover:underline disabled:text-custom-tertiary dark:disabled:text-custom-secondary disabled:cursor-not-allowed disabled:no-underline"
 >
 {isSendingOtp || isSendingPassword
 ? t("common.sending")
 : t("auth.resendCode")}
 </button>
 </div>

 <Button
 type="submit"
 fullWidth
 variant="primary"
 className="py-3 rounded-xl font-semibold shadow-md"
 isLoading={isPending}
 disabled={code.length !== OTP_LENGTH}
 >
 {t("common.verify")}
 </Button>
 </form>
 </AuthLayout>
 );
}
