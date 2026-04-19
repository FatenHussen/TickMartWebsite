import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getApiErrorMessage, getApiSuccessMessage } from "@/shared/lib/apiMessage";
import type { ComplaintType } from "@/features/account/types";
import { useComplaintOrders, useCreateComplaint } from "../../../hooks/useComplaints";
import { mergeComplaintImageFiles } from "../utils/collectValidComplaintImages";
import { buildComplaintFormData } from "../utils/buildComplaintFormData";

export function useComplaintForm(onCreateSuccess: () => void) {
    const { t } = useTranslation();
    const { data: orders = [] } = useComplaintOrders();
    const createComplaint = useCreateComplaint();

    const [complaintType, setComplaintType] = useState<ComplaintType | "">("");
    const [orderId, setOrderId] = useState("");
    const [message, setMessage] = useState("");
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [isDropZoneActive, setIsDropZoneActive] = useState(false);

    const resetForm = () => {
        setComplaintType("");
        setOrderId("");
        setMessage("");
        setImageFiles([]);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!complaintType || !message.trim() || message.trim().length < 5) return;
        if (!orderId) return;

        const formData = buildComplaintFormData({
            orderId,
            type: complaintType,
            message: message.trim(),
            images: imageFiles,
        });

        createComplaint.mutate(formData, {
            onSuccess: (res) => {
                if (res.success) {
                    toast.success(getApiSuccessMessage(res, t("complaints.submit")));
                    onCreateSuccess();
                    resetForm();
                } else {
                    toast.error(getApiSuccessMessage(res, t("common.failedToSubmitComplaint")));
                }
            },
            onError: (err) => toast.error(getApiErrorMessage(err, t("common.failedToSubmitComplaint"))),
        });
    };

    const addFilesFromFileList = (fileList: FileList | null) => {
        setImageFiles((prev) => mergeComplaintImageFiles(prev, fileList));
    };

    const removeImageAtIndex = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return {
        orders,
        complaintType,
        setComplaintType,
        orderId,
        setOrderId,
        message,
        setMessage,
        imageFiles,
        isDropZoneActive,
        setIsDropZoneActive,
        handleSubmit,
        addFilesFromFileList,
        removeImageAtIndex,
        createPending: createComplaint.isPending,
    };
}
