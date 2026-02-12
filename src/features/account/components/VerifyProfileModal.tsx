import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import BasePopup from "@/shared/component/BasePopup";
import InputField from "@/shared/ui/InputField";
import Button from "@/shared/ui/Button";
import { useVerifyProfile } from "../hooks/useProfile";
import type { VerifyProfilePayload } from "../types";

interface VerifyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  phone?: string;
}

export default function VerifyProfileModal({
  isOpen,
  onClose,
  email,
  phone,
}: VerifyProfileModalProps) {
  const { t } = useTranslation();
  const { mutate: verifyProfile, isPending } = useVerifyProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ code: string }>();

  const onSubmit = (data: { code: string }) => {
    const payload: VerifyProfilePayload = {
      code: data.code,
    };

    if (email) {
      payload.email = email;
    }
    if (phone) {
      payload.phone = phone;
    }

    verifyProfile(payload, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={handleClose}
      title={t("account.profile.verifyCode", "التحقق من الرمز")}
      maxWidth="md"
      className="dark:bg-gray-800"
      contentClassName="text-start"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        {/* Display info about where the code was sent */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {email
            ? t(
                "account.profile.verifyEmailInfo",
                `تم إرسال رمز التحقق إلى ${email}`
              )
            : phone
            ? t(
                "account.profile.verifyPhoneInfo",
                `تم إرسال رمز التحقق إلى ${phone}`
              )
            : t(
                "account.profile.verifyGenericInfo",
                "تم إرسال رمز التحقق. الرجاء إدخاله أدناه"
              )}
        </p>

        {/* Verification Code */}
        <InputField
          label={t("account.profile.verificationCode", "رمز التحقق")}
          type="text"
          placeholder={t(
            "account.profile.enterVerificationCode",
            "أدخل رمز التحقق"
          )}
          error={errors.code}
          {...register("code", {
            required: t("validation.required", "هذا الحقل مطلوب"),
            minLength: {
              value: 4,
              message: t("validation.codeMinLength", "4 أرقام على الأقل"),
            },
          })}
          className="bg-gray-50 dark:bg-gray-700 dark:text-white"
        />

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleClose}
            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {t("common.cancel", "إلغاء")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isPending}
          >
            {t("common.verify", "تحقق")}
          </Button>
        </div>
      </form>
    </BasePopup>
  );
}
