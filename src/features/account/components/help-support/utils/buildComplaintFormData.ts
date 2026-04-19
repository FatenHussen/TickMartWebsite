import type { ComplaintType } from "@/features/account/types";

export function buildComplaintFormData(params: {
    orderId: string;
    type: ComplaintType;
    message: string;
    images: File[];
}): FormData {
    const { orderId, type, message, images } = params;
    const formData = new FormData();
    formData.append("order_id", orderId);
    formData.append("type", type);
    formData.append("message", message);
    images.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
    });
    return formData;
}
