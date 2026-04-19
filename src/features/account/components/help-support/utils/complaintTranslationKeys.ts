import i18n from "@/i18n/config";
import type { Complaint, ComplaintStatus, ComplaintType } from "@/features/account/types";
import {
    COMPLAINT_STATUS_FILTER_OPTIONS,
    COMPLAINT_TYPE_OPTIONS,
} from "../constants";

export function getComplaintTypeTranslationKey(type: ComplaintType): string {
    return COMPLAINT_TYPE_OPTIONS.find((opt) => opt.value === type)?.translationKey ?? type;
}

export function getComplaintStatusTranslationKey(status: ComplaintStatus): string {
    return COMPLAINT_STATUS_FILTER_OPTIONS.find((opt) => opt.value === status)?.translationKey ?? status;
}

export function getComplaintPreviewLine(complaint: Complaint): string {
    const preview = complaint.message.slice(0, 60);
    const suffix = complaint.message.length > 60 ? "…" : "";
    return i18n.t("complaints.previewLine", {
        orderId: complaint.order_id,
        preview,
        suffix,
    });
}
