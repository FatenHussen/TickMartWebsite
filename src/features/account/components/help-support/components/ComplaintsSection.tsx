import { ClipboardList, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Complaint, ComplaintStatus, ComplaintType } from "@/features/account/types";
import { HELP_SUPPORT_PRIMARY_ACTION_CLASS } from "../ctaClasses";
import { ComplaintFiltersBar } from "./ComplaintFiltersBar";
import { ComplaintFormPanel } from "./ComplaintFormPanel";
import { ComplaintsListPanel } from "./ComplaintsListPanel";
import { HelpSupportSectionCard } from "./HelpSupportSectionCard";
import { HelpSupportSectionHeader } from "./HelpSupportSectionHeader";

type ComplaintsSectionProps = {
    complaintFormVisible: boolean;
    onToggleComplaintForm: () => void;
    onCloseComplaintForm: () => void;
    onComplaintCreated: () => void;
    typeFilter: ComplaintType | "";
    statusFilter: ComplaintStatus | "";
    onToggleTypeFilter: (value: ComplaintType) => void;
    onSelectStatusFilter: (value: ComplaintStatus | "") => void;
    complaintsLoading: boolean;
    complaints: Complaint[];
    expandedComplaintId: number | null;
    onToggleComplaintExpanded: (complaintId: number) => void;
};

export function ComplaintsSection({
    complaintFormVisible,
    onToggleComplaintForm,
    onCloseComplaintForm,
    onComplaintCreated,
    typeFilter,
    statusFilter,
    onToggleTypeFilter,
    onSelectStatusFilter,
    complaintsLoading,
    complaints,
    expandedComplaintId,
    onToggleComplaintExpanded,
}: ComplaintsSectionProps) {
    const { t } = useTranslation();

    return (
        <HelpSupportSectionCard>
            <HelpSupportSectionHeader
                icon={<ClipboardList className="h-7 w-7 text-[var(--color-api-second)]" aria-hidden />}
                title={t("complaints.title")}
                subtitle={t("complaints.trackManage")}
                action={
                    <button
                        type="button"
                        onClick={onToggleComplaintForm}
                        className={HELP_SUPPORT_PRIMARY_ACTION_CLASS}
                    >
                        <Plus className="h-5 w-5" aria-hidden />
                        {t("complaints.newComplaint")}
                    </button>
                }
            />

            {complaintFormVisible && (
                <ComplaintFormPanel onCancel={onCloseComplaintForm} onCreateSuccess={onComplaintCreated} />
            )}

            <div className="mt-8">
                <ComplaintFiltersBar
                    typeFilter={typeFilter}
                    statusFilter={statusFilter}
                    onToggleType={onToggleTypeFilter}
                    onSelectStatus={onSelectStatusFilter}
                />
                <div className="text-sm text-custom-secondary mb-4">{t("complaints.sortNewest")}</div>

                <ComplaintsListPanel
                    isLoading={complaintsLoading}
                    complaints={complaints}
                    expandedComplaintId={expandedComplaintId}
                    onToggleComplaint={onToggleComplaintExpanded}
                />
            </div>
        </HelpSupportSectionCard>
    );
}
