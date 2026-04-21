import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import type { Complaint } from "@/features/account/types";
import { HELP_FOCUS_RING } from "../focusRingClasses";
import { formatComplaintDate } from "../utils/formatComplaintDate";
import {
    getComplaintPreviewLine,
    getComplaintStatusTranslationKey,
    getComplaintTypeTranslationKey,
} from "../utils/complaintTranslationKeys";

type ComplaintTicketCardProps = {
    complaint: Complaint;
    expanded: boolean;
    onToggle: () => void;
};

export function ComplaintTicketCard({ complaint, expanded, onToggle }: ComplaintTicketCardProps) {
    const { t } = useTranslation();
    const typeKey = getComplaintTypeTranslationKey(complaint.type);
    const statusKey = getComplaintStatusTranslationKey(complaint.status);

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-2xl",
                "bg-gradient-to-br from-custom-card via-custom-card to-blue-off/[0.2] shadow-md shadow-primary/[0.06] transition-all duration-200",
                "hover:shadow-lg hover:shadow-primary/[0.1] dark:to-primary/[0.04]"
            )}
        >
            <div className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-mono text-custom-secondary">
                            {t("complaints.ticketId", { id: String(complaint.id).padStart(3, "0") })}{" "}
                            {formatComplaintDate(complaint.created_at)}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary">
                            {t(typeKey)}
                        </span>
                    </div>
                    <span
                        className={cn(
                            "px-2 py-0.5 rounded text-xs font-medium shrink-0",
                            complaint.status === "resolved" &&
                                "bg-[var(--color-ui-green-100)] text-[var(--color-ui-green-800)] dark:bg-[color-mix(in_srgb,var(--color-ui-green-900)_30%,transparent)] dark:text-[var(--color-ui-green-400)]",
                            complaint.status === "rejected" &&
                                "bg-[var(--color-ui-red-100)] text-[var(--color-ui-red-800)] dark:bg-[color-mix(in_srgb,var(--color-ui-red-900)_30%,transparent)] dark:text-[var(--color-ui-red-400)]",
                            complaint.status === "new" &&
                                "bg-[var(--color-ui-sky-100)] text-[var(--color-ui-sky-800)] dark:bg-[color-mix(in_srgb,var(--color-ui-sky-900)_30%,transparent)] dark:text-[var(--color-ui-sky-400)]",
                            complaint.status === "in_review" &&
                                "bg-[var(--color-ui-amber-100)] text-[var(--color-ui-amber-800)] dark:bg-[color-mix(in_srgb,var(--color-ui-amber-900)_30%,transparent)] dark:text-[var(--color-ui-amber-400)]"
                        )}
                    >
                        {t(statusKey)}
                    </span>
                </div>
                <p className="text-sm font-medium text-custom-primary mb-1">
                    {getComplaintPreviewLine(complaint)}
                </p>
                {!expanded && (
                    <p className="text-sm text-custom-secondary line-clamp-2 mb-2">
                        {complaint.message}
                    </p>
                )}
                <button
                    type="button"
                    onClick={onToggle}
                    className={cn(
                        "mt-2 flex items-center gap-1 rounded-md px-0.5 py-0.5 text-sm font-medium text-primary hover:underline",
                        HELP_FOCUS_RING
                    )}
                >
                    {expanded ? (
                        <>
                            {t("complaints.hideDetails")}
                            <ChevronUp className="w-4 h-4" aria-hidden />
                        </>
                    ) : (
                        <>
                            {t("complaints.viewDetails")}
                            <ChevronDown className="w-4 h-4" aria-hidden />
                        </>
                    )}
                </button>
            </div>

            {expanded && (
                <div className="space-y-4 bg-custom-light/60 px-4 py-4 dark:bg-custom-card/70">
                    <div>
                        <h4 className="text-sm font-semibold text-custom-primary mb-2">
                            {t("complaints.fullDescription")}
                        </h4>
                        <p className="text-sm text-custom-primary whitespace-pre-wrap">
                            {complaint.message}
                        </p>
                    </div>

                    {complaint.images?.length ? (
                        <div>
                            <h4 className="text-sm font-semibold text-custom-primary mb-2">
                                {t("complaints.attachments")}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {complaint.images.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt=""
                                        className="h-20 w-20 rounded-lg object-cover shadow-md sm:h-24 sm:w-24"
                                    />
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {complaint.admin_response && (
                        <div className="rounded-xl bg-primary/5 p-4 shadow-inner dark:bg-primary/10">
                            <p className="text-sm font-semibold text-custom-primary mb-1">
                                {t("complaints.adminResponse")}
                            </p>
                            <p className="text-sm text-custom-primary">{complaint.admin_response}</p>
                        </div>
                    )}

                    <div className="text-sm text-custom-secondary">
                        <span className="font-medium text-custom-primary">
                            {t("complaints.estimatedResolution")}:
                        </span>
                        {""}
                        {t("complaints.estimatedResolutionValue")}
                    </div>
                </div>
            )}
        </div>
    );
}
