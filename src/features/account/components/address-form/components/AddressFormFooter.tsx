import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import { API_SECOND_BUTTON_CLASS } from "@/features/account/components/profile/apiPaletteClasses";

type AddressFormFooterProps = {
    isEditMode: boolean;
    isSubmitPending: boolean;
    onCancel: () => void;
};

export function AddressFormFooter({
    isEditMode,
    isSubmitPending,
    onCancel,
}: AddressFormFooterProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-4 border-t border-custom-primary pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitPending}
                className="text-sm font-medium text-custom-secondary transition-colors hover:text-custom-primary"
            >
                {t("common.cancel")}
            </button>
            <div className="flex flex-col gap-2 sm:items-end">
                <p className="text-xs text-custom-secondary">{t("account.addAddress.requiredFieldsNote")}</p>
                <button
                    type="submit"
                    disabled={isSubmitPending}
                    className={cn(
                        API_SECOND_BUTTON_CLASS,
                        "min-w-[10rem] rounded-xl px-8 disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                >
                    {isSubmitPending ? (
                        <>
                            <svg
                                className="h-4 w-4 shrink-0 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                aria-hidden
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            <span>{t("common.loading")}</span>
                        </>
                    ) : isEditMode ? (
                        t("account.editAddress.updateAddress")
                    ) : (
                        t("account.addAddress.saveAddress")
                    )}
                </button>
            </div>
        </div>
    );
}
