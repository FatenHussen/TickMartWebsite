import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import OTPInput from "react-otp-input";
import type { InputHTMLAttributes } from "react";
import Button from "@/shared/ui/Button";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useOtpStore } from "@/store/otp";
import {
  useVerifyOtp,
  useSendOtp,
  useVerifyPassword,
  useForgotPassword,
} from "@/features/auth/hooks/useAuth";
import { paths } from "@/app/routes/path/paths";

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
      const maskedLocal = localPart.slice(0, 2) + "****";
      return `${maskedLocal}@${domain}`;
    }
    if (phone) {
      const last4 = phone.slice(-4);
      return `****${last4}`;
    }
    return "";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="relative min-h-screen grid lg:grid-cols-2 bg-white dark:bg-gray-900">
      {/* Theme and Language toggles */}
      <div className="absolute top-4 end-4 z-20 flex gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* Left Side - Illustration */}
      <div className="hidden lg:flex bg-cyan-50 dark:bg-gray-800 flex-col">
        {/* Header */}
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">T</span>
            </div>
            <span className="text-lg font-semibold text-gray-800 dark:text-white">
              {t("auth.appEverything")}
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
          <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-5">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center overflow-hidden">
                <span className="text-3xl">🍝</span>
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-orange-500 dark:text-orange-400 font-medium uppercase tracking-wider">
                  {t("auth.sponsored")}
                </p>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                  {t("auth.get30Off")}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                  {t("auth.enjoyExclusiveDeals")}
                </p>
                <button className="text-xs text-cyan-500 dark:text-cyan-400 font-semibold mt-2 hover:underline">
                  {t("auth.viewOffer")}
                </button>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-4">
              {t("auth.manageCampaigns")}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - OTP Form */}
      <div className="flex items-center justify-center px-6 py-12 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("auth.enterVerificationCode")}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("auth.sentCodeTo")}
                <br />
                <span className="font-semibold text-cyan-500 dark:text-cyan-400">
                  {getMaskedContact()}
                </span>
              </p>
            </div>

            {/* OTP Input */}
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
                  className="!w-14 h-14 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center text-xl font-semibold text-gray-800 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-900 transition-all [appearance:textfield]"
                />
              )}
            />

            {/* Timer */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              {t("auth.resendCodeIn")}{" "}
              <span className="font-semibold">{formatTime(timer)}</span>
            </p>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4 text-sm">
              <Link
                to={paths.auth.jwt.signUp}
                className="text-cyan-500 dark:text-cyan-400 font-medium hover:underline"
              >
                {t("auth.changeEmailPhone")}
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={
                  timer > 0 ||
                  isSendingOtp ||
                  isSendingPassword ||
                  (!email && !phone)
                }
                className="text-cyan-500 dark:text-cyan-400 font-medium hover:underline disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed disabled:no-underline"
              >
                {isSendingOtp || isSendingPassword
                  ? t("common.sending")
                  : t("auth.resendCode")}
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="primary"
              className="py-3 rounded-full font-semibold"
              isLoading={isPending}
              disabled={code.length !== OTP_LENGTH}
            >
              {t("common.verify")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
