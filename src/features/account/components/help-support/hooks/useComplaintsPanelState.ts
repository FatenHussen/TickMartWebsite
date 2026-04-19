import { useCallback, useState } from "react";
import type { ComplaintStatus, ComplaintType } from "@/features/account/types";

export function useComplaintsPanelState() {
    const [complaintFormVisible, setComplaintFormVisible] = useState(false);
    const [typeFilter, setTypeFilter] = useState<ComplaintType | "">("");
    const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "">("");
    const [expandedComplaintId, setExpandedComplaintId] = useState<number | null>(null);

    const toggleComplaintForm = useCallback(() => {
        setComplaintFormVisible((visible) => !visible);
    }, []);

    const closeComplaintForm = useCallback(() => {
        setComplaintFormVisible(false);
    }, []);

    const toggleTypeFilter = useCallback((value: ComplaintType) => {
        setTypeFilter((current) => (current === value ? "" : value));
    }, []);

    const selectStatusFilter = useCallback((value: ComplaintStatus | "") => {
        setStatusFilter(value);
    }, []);

    const toggleComplaintExpanded = useCallback((complaintId: number) => {
        setExpandedComplaintId((prev) => (prev === complaintId ? null : complaintId));
    }, []);

    const collapseComplaintFormOnSuccess = useCallback(() => {
        setComplaintFormVisible(false);
    }, []);

    return {
        complaintFormVisible,
        toggleComplaintForm,
        closeComplaintForm,
        collapseComplaintFormOnSuccess,
        typeFilter,
        toggleTypeFilter,
        statusFilter,
        selectStatusFilter,
        expandedComplaintId,
        toggleComplaintExpanded,
    };
}
