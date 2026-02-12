import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import BasePopup from "@/shared/component/BasePopup";
import InputField from "@/shared/ui/InputField";
import Button from "@/shared/ui/Button";
import { useUpdatePhone } from "../hooks/useProfile";
import type { UpdatePhonePayload } from "../types";

interface UpdatePhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (phone: string) => void;
}

export default function UpdatePhoneModal({
  isOpen,
  onClose,
  onVerify,
}: UpdatePhoneModalProps) {
  const { t } = useTranslation();
  const { mutate: updatePhone, isPending } = useUpdatePhone();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdatePhonePayload>();

  const onSubmit = (data: UpdatePhonePayload) => {
    updatePhone(data, {
      onSuccess: () => {
        reset();
        onClose();
        // Open verify modal with the new phone
        onVerify(data.phone);
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
      title={t("account.profile.updatePhone", "تحديث رقم الهاتف")}
      maxWidth="md"
      className="dark:bg-gray-800"
      contentClassName="text-start"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        {/* New Phone */}
        <InputField
          label={t("account.profile.newPhone", "رقم الهاتف الجديد")}
          type="tel"
          placeholder={t(
            "account.profile.enterNewPhone",
            "أدخل رقم الهاتف الجديد"
          )}
          error={errors.phone}
          {...register("phone", {
            required: t("validation.required", "هذا الحقل مطلوب"),
            pattern: {
              value: /^[0-9+\s()-]+$/,
              message: t("validation.invalidPhone", "رقم هاتف غير صالح"),
            },
            minLength: {
              value: 8,
              message: t("validation.phoneMinLength", "8 أرقام على الأقل"),
            },
          })}
          className="bg-gray-50 dark:bg-gray-700 dark:text-white"
        />

        {/* Info Message */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t(
            "account.profile.phoneUpdateInfo",
            "سيتم إرسال رمز التحقق إلى رقم الهاتف الجديد"
          )}
        </p>

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
            {t("common.send", "إرسال")}
          </Button>
        </div>
      </form>
    </BasePopup>
  );
}
