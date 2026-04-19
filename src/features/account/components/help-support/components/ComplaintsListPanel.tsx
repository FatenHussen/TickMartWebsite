import { useTranslation } from "react-i18next";
import type { Complaint } from "@/features/account/types";
import { ComplaintTicketCard } from "./ComplaintTicketCard";
import { HelpSupportInlineSpinner } from "./HelpSupportInlineSpinner";

type ComplaintsListPanelProps = {
    isLoading: boolean;
    complaints: Complaint[];
    expandedComplaintId: number | null;
    onToggleComplaint: (complaintId: number) => void;
};

export function ComplaintsListPanel({
    isLoading,
    complaints,
    expandedComplaintId,
    onToggleComplaint,
}: ComplaintsListPanelProps) {
    const { t } = useTranslation();

    if (isLoading) {
        return <HelpSupportInlineSpinner />;
    }

    if (complaints.length === 0) {
        return (
            <div className="py-12 text-center text-custom-secondary">{t("complaints.noComplaints")}</div>
        );
    }

    return (
        <div className="space-y-3">
            {complaints.map((complaint) => (
                <ComplaintTicketCard
                    key={complaint.id}
                    complaint={complaint}
                    expanded={expandedComplaintId === complaint.id}
                    onToggle={() => onToggleComplaint(complaint.id)}
                />
            ))}
        </div>
    );
}
