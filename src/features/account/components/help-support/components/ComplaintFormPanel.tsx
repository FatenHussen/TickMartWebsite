import { useRef } from "react";
import { HiChevronDown, HiCloudUpload } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import type { ComplaintType } from "@/features/account/types";
import {
    COMPLAINT_TEXTAREA_BORDER_CLASS,
    getComplaintTypeSelectClassName,
    getRelatedOrderSelectClassName,
} from "../complaintFormFieldClasses";
import { HELP_SUPPORT_PRIMARY_ACTION_CLASS } from "../ctaClasses";
import { HELP_FOCUS_RING } from "../focusRingClasses";
import { COMPLAINT_TYPE_OPTIONS } from "../constants";
import { useComplaintForm } from "../hooks/useComplaintForm";

type ComplaintFormPanelProps = {
    onCancel: () => void;
    onCreateSuccess: () => void;
};

export function ComplaintFormPanel({ onCancel, onCreateSuccess }: ComplaintFormPanelProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useComplaintForm(onCreateSuccess);

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        form.setIsDropZoneActive(true);
    };

    const handleDragLeave = () => {
        form.setIsDropZoneActive(false);
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        form.setIsDropZoneActive(false);
        form.addFilesFromFileList(event.dataTransfer.files);
    };

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        form.setComplaintType(event.target.value as ComplaintType | "");
    };

    const handleOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        form.setOrderId(event.target.value);
    };

    const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        form.addFilesFromFileList(event.target.files);
    };

    return (
        <form
            onSubmit={form.handleSubmit}
            className="mb-6 space-y-5 rounded-2xl bg-gradient-to-br from-custom-card via-custom-card to-blue-off/[0.28] p-6 shadow-md shadow-primary/[0.06] dark:to-primary/[0.05]"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-custom-primary mb-1.5">
                        {t("complaints.complaintType")}{" "}
                        <span className="text-[var(--color-ui-red-500)]">*</span>
                    </label>
                    <div className="overflow-hidden rounded-xl shadow-sm">
                        <div className="relative">
                            <select
                                value={form.complaintType}
                                onChange={handleTypeChange}
                                required
                                className={getComplaintTypeSelectClassName(isRTL)}
                            >
                                <option value="">{t("complaints.selectType")}</option>
                                {COMPLAINT_TYPE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {t(opt.translationKey)}
                                    </option>
                                ))}
                            </select>
                            <HiChevronDown
                                className={cn(
                                    "pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary",
                                    isRTL ? "left-3" : "right-3"
                                )}
                                aria-hidden
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-custom-primary mb-1.5">
                        {t("complaints.relatedOrder")}{" "}
                        <span className="text-[var(--color-ui-red-500)]">*</span>
                    </label>
                    <div className="overflow-hidden rounded-xl shadow-md shadow-primary/15">
                        <div className="relative">
                            <select
                                value={form.orderId}
                                onChange={handleOrderChange}
                                required
                                className={getRelatedOrderSelectClassName(isRTL)}
                            >
                                <option value="">{t("complaints.selectOrder")}</option>
                                {form.orders.map((order) => (
                                    <option key={order.id} value={order.id}>
                                        {t("complaints.orderOption", { code: order.order_code })}
                                    </option>
                                ))}
                            </select>
                            <HiChevronDown
                                className={cn(
                                    "pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-primary-dark",
                                    isRTL ? "left-3" : "right-3"
                                )}
                                aria-hidden
                            />
                        </div>
                    </div>
                    {form.orders.length === 0 && (
                        <p className="text-xs text-warning dark:text-warning mt-1">
                            {t("complaints.noOrdersAvailable", "No orders available for complaints")}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-custom-primary mb-1.5">
                    {t("complaints.describeIssue")}{" "}
                    <span className="text-[var(--color-ui-red-500)]">*</span>
                </label>
                <textarea
                    value={form.message}
                    onChange={(e) => form.setMessage(e.target.value)}
                    required
                    minLength={5}
                    rows={4}
                    placeholder={t("complaints.describeIssuePlaceholder")}
                    className={cn("w-full px-4 py-3 resize-none", COMPLAINT_TEXTAREA_BORDER_CLASS)}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-custom-primary mb-1.5">
                    {t("complaints.uploadImages")}
                </label>
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={openFilePicker}
                    className={cn(
                        "cursor-pointer rounded-xl bg-custom-tertiary/40 p-8 text-center transition-colors",
                        form.isDropZoneActive && "bg-primary/10 shadow-inner"
                    )}
                >
                    <HiCloudUpload className="w-12 h-12 mx-auto text-custom-tertiary mb-3" />
                    <p className="text-sm font-medium text-custom-primary mb-1">
                        {t("complaints.dropFilesHere")}
                    </p>
                    <p className="text-xs text-custom-secondary">{t("complaints.uploadHint")}</p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleFilesSelected}
                        className="hidden"
                    />
                </div>
                {form.imageFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {form.imageFiles.map((file, index) => (
                            <span
                                key={`${file.name}-${index}`}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-custom-tertiary text-sm"
                            >
                                {file.name}
                                <button
                                    type="button"
                                    onClick={() => form.removeImageAtIndex(index)}
                                    aria-label={t("common.removeImage")}
                                    className="rounded outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 focus-visible:ring-offset-0 text-[var(--color-ui-red-500)]"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 pt-2">
                <button
                    type="submit"
                    disabled={form.createPending}
                    className={HELP_SUPPORT_PRIMARY_ACTION_CLASS}
                >
                    {form.createPending ? t("common.loading") : t("complaints.submit")}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className={cn(
                        "rounded-lg px-1 py-0.5 text-sm font-medium text-custom-secondary hover:text-custom-primary",
                        HELP_FOCUS_RING
                    )}
                >
                    {t("common.cancel")}
                </button>
            </div>
        </form>
    );
}
