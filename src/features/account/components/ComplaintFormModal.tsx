import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { HiCloudUpload } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import BasePopup from "@/shared/component/BasePopup";
import Button from "@/shared/ui/Button";
import { useComplaintOrders, useCreateComplaint } from "../hooks/useComplaints";
import type { ComplaintType } from "../types";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE_MB = 10;

const COMPLAINT_TYPES: { value: ComplaintType; key: string }[] = [
  { value: "product", key: "complaints.typeProduct" },
  { value: "order", key: "complaints.typeOrder" },
  { value: "driver", key: "complaints.typeDelivery" },
  { value: "merchant", key: "complaints.typeStore" },
];

type ComplaintFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  /** Pre-fill order when opened from OrderCard / OrderDetailsModal */
  prefillOrderId?: number | string | null;
};

export default function ComplaintFormModal({
  isOpen,
  onClose,
  onSuccess,
  prefillOrderId,
}: ComplaintFormModalProps) {
  const { t } = useTranslation();
  const { data: orders = [] } = useComplaintOrders();
  const createMutation = useCreateComplaint();
  const [type, setType] = useState<ComplaintType | "">("");
  const [orderId, setOrderId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (isOpen && prefillOrderId != null) {
      setOrderId(String(prefillOrderId));
    }
  }, [isOpen, prefillOrderId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !message.trim() || message.trim().length < 5) return;
    if (!orderId) return;

    const formData = new FormData();
    formData.append("order_id", orderId);
    formData.append("type", type as ComplaintType);
    formData.append("message", message.trim());
    files.forEach((f, i) => formData.append(`images[${i}]`, f));

    createMutation.mutate(formData, {
      onSuccess: (res) => {
        if (res.success) {
          toast.success(res.message || t("common.complaintSubmitted"));
          onSuccess?.();
          onClose();
          setType("");
          setOrderId("");
          setMessage("");
          setFiles([]);
        } else {
          toast.error(res.message || t("common.failedToSubmitComplaint"));
        }
      },
      onError: () => toast.error(t("common.failedToSubmitComplaint")),
    });
  };

  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

  const handleFileChange = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const list = Array.from(newFiles).filter(
      (f) =>
        f.size <= MAX_FILE_SIZE_MB * 1024 * 1024 &&
        /\.(jpe?g|png)$/i.test(f.name) &&
        ALLOWED_IMAGE_TYPES.includes(f.type)
    );
    setFiles((prev) => [...prev, ...list].slice(0, MAX_IMAGES));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const inputBorder =
    "rounded-xl border-2 border-[#E4F0FB] dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={onClose}
      title={t("complaints.newComplaint")}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t("complaints.complaintType")} <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ComplaintType | "")}
              required
              className={cn("w-full px-4 py-3", inputBorder)}
            >
              <option value="">{t("complaints.selectType")}</option>
              {COMPLAINT_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.key)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t("complaints.relatedOrder")} <span className="text-red-500">*</span>
            </label>
            <select
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
              className={cn("w-full px-4 py-3", inputBorder)}
            >
              <option value="">{t("complaints.selectOrder")}</option>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  Order #{o.order_code}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {t("complaints.describeIssue")} <span className="text-red-500">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            minLength={5}
            rows={4}
            placeholder={t("complaints.describeIssuePlaceholder")}
            className={cn("w-full px-4 py-3 resize-none", inputBorder)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {t("complaints.uploadImages")}
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleFileChange(e.dataTransfer.files);
            }}
            onClick={() => document.getElementById("complaint-modal-files")?.click()}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors border-[#E4F0FB] dark:border-gray-600",
              dragActive && "bg-primary/5 border-primary"
            )}
          >
            <HiCloudUpload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("complaints.dropFilesHere")}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("complaints.uploadHint")}
            </p>
            <input
              id="complaint-modal-files"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/jpg"
              onChange={(e) => handleFileChange(e.target.files)}
              className="hidden"
            />
          </div>
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {files.map((f, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-sm"
                >
                  {f.name}
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-red-500 hover:underline"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={createMutation.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {createMutation.isPending ? t("common.loading") : t("complaints.submit")}
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium"
          >
            {t("common.cancel")}
          </button>
        </div>
      </form>
    </BasePopup>
  );
}
