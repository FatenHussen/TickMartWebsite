import { useForm } from"react-hook-form";
import { useTranslation } from"react-i18next";
import BasePopup from"@/shared/component/BasePopup";
import InputField from"@/shared/ui/InputField";
import Button from"@/shared/ui/Button";
import { useUpdateEmail } from"../hooks/useProfile";
import type { UpdateEmailPayload } from"../types";

interface UpdateEmailModalProps {
 isOpen: boolean;
 onClose: () => void;
 onVerify: (email: string) => void;
}

export default function UpdateEmailModal({
 isOpen,
 onClose,
 onVerify,
}: UpdateEmailModalProps) {
 const { t } = useTranslation();
 const { mutate: updateEmail, isPending } = useUpdateEmail();

 const {
 register,
 handleSubmit,
 formState: { errors },
 reset,
 } = useForm<UpdateEmailPayload>();

 const onSubmit = (data: UpdateEmailPayload) => {
 updateEmail(data, {
 onSuccess: () => {
 reset();
 onClose();
 // Open verify modal with the new email
 onVerify(data.email);
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
 title={t("account.profile.updateEmail","تحديث البريد الإلكتروني")}
 maxWidth="md"
 className=""
 contentClassName="text-start"
 >
 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
 {/* New Email */}
 <InputField
 label={t(
"account.profile.newEmail",
"البريد الإلكتروني الجديد"
 )}
 type="email"
 placeholder={t(
"account.profile.enterNewEmail",
"أدخل البريد الإلكتروني الجديد"
 )}
 error={errors.email}
 {...register("email", {
 required: t("validation.required","هذا الحقل مطلوب"),
 pattern: {
 value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
 message: t("validation.invalidEmail","بريد إلكتروني غير صالح"),
 },
 })}
 className="bg-custom-light"
 />

 {/* Info Message */}
 <p className="text-xs text-custom-secondary">
 {t(
"account.profile.emailUpdateInfo",
"سيتم إرسال رمز التحقق إلى البريد الإلكتروني الجديد"
 )}
 </p>

 {/* Actions */}
 <div className="flex gap-3 mt-6">
 <Button
 type="button"
 variant="outline"
 fullWidth
 onClick={handleClose}
 className=""
 >
 {t("common.cancel","إلغاء")}
 </Button>
 <Button
 type="submit"
 variant="primary"
 fullWidth
 isLoading={isPending}
 >
 {t("common.send","إرسال")}
 </Button>
 </div>
 </form>
 </BasePopup>
 );
}
