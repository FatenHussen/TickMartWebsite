import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import OTPInput from "react-otp-input";
import type { InputHTMLAttributes } from "react";
import AuthLayout from "@/features/auth/layout/Auth-Layout";
import Button from "@/shared/ui/Button";
import { useOtpStore } from "@/store/otp";
import {
  useVerifyOtp,
  useSendOtp,
  useVerifyPassword,
  useForgotPassword,
} from "@/features/auth/hooks/useAuth";

const OTP_LENGTH = 5;

export default function Otp() {
  const { t } = useTranslation();
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

  // Redirect if no email or phone is stored
  useEffect(() => {
    if (!email && !phone) {
      // You might want to redirect to sign-up page
      // navigate(paths.auth.jwt.signUp);
    }
  }, [email, phone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== OTP_LENGTH) return;

    // Use verifyPassword if it's password reset flow, otherwise use verifyOtp
    if (isPasswordReset) {
      verifyPassword(code);
    } else {
      verifyOtp(code);
    }
  };

  const handleResend = () => {
    if (timer > 0) return; // Prevent resend if timer is still running

    // Use sendPassword if it's password reset flow, otherwise use sendOtp
    if (isPasswordReset) {
      const payload: { email?: string; phone?: string } = {};
      if (email) {
        payload.email = email;
      } else if (phone) {
        payload.phone = phone;
      }

      sendPassword(payload, {
        onSuccess: () => {
          setTimer(60);
          setCode("");
        },
        onError: () => {
          // Handle error if needed
        },
      });
    } else {
      sendOtp(undefined, {
        onSuccess: () => {
          setTimer(60);
          setCode("");
        },
        onError: () => {
          // Handle error if needed
        },
      });
    }
  };

  // Mask email/phone for display
  const getMaskedContact = () => {
    if (email) {
      const [localPart, domain] = email.split("@");
      const maskedLocal = localPart.slice(0, 2) + "****";
      return `${maskedLocal}@${domain}`;
    }
    if (phone) {
      const last4 = phone.slice(-4);
      return `****${last4}`;
    }
    return "";
  };

  return (
    <AuthLayout
      title="App Everything"
      blurb="We sent a verification code to your email."
      illustration={
        <img
          src="https://i.ibb.co/6W58rtf/delivery-illustration.png"
          alt="Delivery illustration"
          className="w-full h-auto object-contain"
        />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-lg font-semibold text-slate-900">
            {t("auth.enterVerificationCode")}
          </h1>
          <p className="text-xs text-slate-500">
            {t("auth.sentCodeTo")}
            <span className="ml-1 font-semibold text-primary">
              {getMaskedContact()}
            </span>
          </p>
        </div>

        <OTPInput
          value={code}
          onChange={(val: string) => setCode(val.slice(0, OTP_LENGTH))}
          numInputs={OTP_LENGTH}
          shouldAutoFocus
          inputType="tel"
          containerStyle="justify-center gap-2 flex max-w-xs mx-auto"
          renderInput={(props: InputHTMLAttributes<HTMLInputElement>) => (
            <input
              {...props}
              className="h-12 w-14 rounded-lg border border-slate-200 text-center text-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary transition-colors [appearance:textfield]"
            />
          )}
        />

        <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-primary font-semibold hover:underline p-0 h-auto text-[11px]"
          >
            {t("auth.changeEmailPhone")}
          </Button>
          <span className="text-slate-400">|</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={
              timer > 0 ||
              isSendingOtp ||
              isSendingPassword ||
              (!email && !phone)
            }
            className="text-primary font-semibold disabled:text-slate-400 disabled:cursor-not-allowed p-0 h-auto text-[11px]"
          >
            {isSendingOtp || isSendingPassword
              ? t("common.submit")
              : timer > 0
              ? `${t("auth.resendCodeIn")} ${String(
                  Math.floor(timer / 60)
                ).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`
              : t("auth.resendCode")}
          </Button>
        </div>

        <Button
          type="submit"
          fullWidth
          variant="primary"
          className="mt-2"
          isLoading={isPending}
          disabled={code.length !== OTP_LENGTH}
        >
          {t("common.continue")}
        </Button>
      </form>
    </AuthLayout>
  );
}
