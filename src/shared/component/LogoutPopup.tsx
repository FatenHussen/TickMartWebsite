import { MdLogout } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/Button";
import BasePopup from "./BasePopup";

export type LogoutPopupProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
};

export default function LogoutPopup({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmButtonText,
    cancelButtonText,
}: LogoutPopupProps) {
    const { t } = useTranslation();

    const displayTitle = title ?? t("logoutPopup.title");
    const displayDescription = description ?? t("logoutPopup.description");
    const displayConfirmButton = confirmButtonText ?? t("logoutPopup.logout");
    const displayCancelButton = cancelButtonText ?? t("common.cancel");

    return (
        <BasePopup
            isOpen={isOpen}
            onClose={onClose}
            icon={
                <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                    <MdLogout className="w-10 h-10 text-white" />
                </div>
            }
            title={displayTitle}
            description={displayDescription}
            contentClassName="pt-12 p-8"
            actions={
                <div className="flex flex-col gap-3">
                    <Button
                        type="button"
                        variant="danger"
                        size="lg"
                        fullWidth
                        onClick={onConfirm}
                        className="text-white rounded-xl"
                    >
                        {displayConfirmButton}
                    </Button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-sm text-custom-secondary hover:text-custom-primary hover:underline transition-colors"
                    >
                        {displayCancelButton}
                    </button>
                </div>
            }
        />
    );
}
