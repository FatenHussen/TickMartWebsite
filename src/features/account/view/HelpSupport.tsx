import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { getApiErrorMessage, getApiSuccessMessage } from "@/shared/lib/apiMessage";
import {
    HiSearch,
    HiChevronDown,
    HiChevronUp,
    HiChat,
    HiPhone,
    HiMail,
    HiPlus,
    HiCloudUpload,
} from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import Button from "@/shared/ui/Button";
import { useComplaints, useComplaintOrders, useCreateComplaint } from "../hooks/useComplaints";
import { useFaqs, FAQ_TYPE_TO_LOCALE } from "../hooks/useFaqs";
import { useAppSettings } from "../hooks/useAppSettings";
import type { Complaint, ComplaintType, ComplaintStatus } from "../types";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE_MB = 10;

/** Default categories if API doesn't return types */
const DEFAULT_TYPES = ["orders", "delivery", "payments", "account", "stores&drivers", "other"];

function formatWhatsAppUrl(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    const withCountry = digits.startsWith("0") ? "966" + digits.slice(1) : digits;
    return `https://wa.me/${withCountry}`;
}

const COMPLAINT_TYPES: { value: ComplaintType; key: string }[] = [
    { value: "product", key: "complaints.typeProduct" },
    { value: "order", key: "complaints.typeOrder" },
    { value: "driver", key: "complaints.typeDelivery" },
    { value: "merchant", key: "complaints.typeStore" },
];

const STATUS_OPTIONS: { value: ComplaintStatus | ""; key: string }[] = [
    { value: "", key: "complaints.filterAll" },
    { value: "new", key: "complaints.statusNew" },
    { value: "in_review", key: "complaints.statusInReview" },
    { value: "resolved", key: "complaints.statusResolved" },
    { value: "rejected", key: "complaints.statusRejected" },
];

function formatComplaintDate(createdAt: string): string {
    try {
        const d = new Date(createdAt);
        return d.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return createdAt;
    }
}

export default function HelpSupport() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const [faqCategory, setFaqCategory] = useState("orders");
    const [faqSearchQuery, setFaqSearchQuery] = useState("");
    const [faqOpenId, setFaqOpenId] = useState<number | null>(null);
    const [complaintFormVisible, setComplaintFormVisible] = useState(false);
    const [typeFilter, setTypeFilter] = useState<ComplaintType | "">("");
    const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "">("");
    const [expandedComplaintId, setExpandedComplaintId] = useState<number | null>(null);

    const { data: faqsData, isLoading: faqsLoading } = useFaqs(faqCategory);
    const { data: appSettings } = useAppSettings();
    const contact = appSettings?.contact;

    const faqTypes = faqsData?.types ?? DEFAULT_TYPES;
    const faqsByCategory = faqsData?.faqs ?? [];

    const filteredFaqs = useMemo(() => {
        if (!faqSearchQuery.trim()) return faqsByCategory;
        const q = faqSearchQuery.toLowerCase().trim();
        return faqsByCategory.filter(
            (f) =>
                f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
        );
    }, [faqsByCategory, faqSearchQuery]);

    const { data: complaintsData, isLoading } = useComplaints({
        ...(statusFilter && { status: statusFilter }),
    });
    const createComplaint = useCreateComplaint();

    const rawComplaints = complaintsData?.data ?? [];
    const complaints = typeFilter
        ? rawComplaints.filter((c) => c.type === typeFilter)
        : rawComplaints;
    const hasComplaints = complaints.length > 0;

    const handleFaqToggle = (id: number) => {
        setFaqOpenId((prev) => (prev === id ? null : id));
    };

    const handleSubmitSuccess = useCallback(() => {
        setComplaintFormVisible(false);
    }, []);

    return (
        <div dir={isRTL ? "rtl" : "ltr"} className="space-y-10">
            {/* Section A: Help Center */}
            <div className="rounded-2xl border border-custom-primary bg-custom-card p-6 shadow-sm">
                <h2 className="text-xl font-bold text-custom-primary mb-1">
                    {t("helpCenter.title")}
                </h2>
                <p className="text-sm text-custom-secondary mb-4">
                    {t("helpCenter.subtitle")}
                </p>
                <div className="relative mb-6">
                    <HiSearch
                        className={cn(
                            "absolute top-1/2 -translate-y-1/2 w-5 h-5 text-custom-tertiary",
                            isRTL ? "right-3" : "left-3"
                        )}
                    />
                    <input
                        type="text"
                        value={faqSearchQuery}
                        onChange={(e) => setFaqSearchQuery(e.target.value)}
                        placeholder={t("helpCenter.searchPlaceholder")}
                        className={cn(
                            "w-full py-3 rounded-xl border border-custom-primary bg-custom-light text-custom-primary focus:outline-none focus:ring-2 focus:ring-primary",
                            isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
                        )}
                    />
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                    {faqTypes.map((typeId) => {
                        const isSelected = faqCategory === typeId;
                        const localeKey = FAQ_TYPE_TO_LOCALE[typeId] ?? typeId;
                        return (
                            <button
                                key={typeId}
                                type="button"
                                onClick={() => setFaqCategory(typeId)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isSelected
                                        ? "bg-primary text-white"
                                        : "bg-custom-tertiary text-custom-primary hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20"
                                )}
                            >
                                {t(localeKey)}
                            </button>
                        );
                    })}
                </div>

                <div className="space-y-2 mb-8">
                    {faqsLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
                        </div>
                    ) : filteredFaqs.length === 0 ? (
                        <div className="py-12 text-center text-custom-secondary text-sm">
                            {faqSearchQuery.trim()
                                ? t("helpCenter.noSearchResults", "No matching FAQs found.")
                                : t("helpCenter.noFaqs", "No FAQs available for this category.")}
                        </div>
                    ) : (
                        filteredFaqs.map((faq) => {
                            const isOpen = faqOpenId === faq.id;
                            return (
                                <div
                                    key={faq.id}
                                    className="rounded-xl border border-custom-primary overflow-hidden"
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleFaqToggle(faq.id)}
                                        className="w-full flex items-center justify-between px-4 py-3 text-left bg-custom-light hover:bg-custom-tertiary transition-colors"
                                    >
                                        <span className="font-medium text-custom-primary">
                                            {faq.question}
                                        </span>
                                        {isOpen ? (
                                            <HiChevronUp className="w-5 h-5 shrink-0 text-custom-secondary" />
                                        ) : (
                                            <HiChevronDown className="w-5 h-5 shrink-0 text-custom-secondary" />
                                        )}
                                    </button>
                                    {isOpen && (
                                        <div className="px-4 py-3 border-t border-custom-primary bg-custom-card text-custom-secondary text-sm">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                <div
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
                    style={
                        appSettings?.color
                            ? {
                                ["--contact-border" as string]: appSettings.color.main_color ?? "#E4F0FB",
                                ["--contact-text" as string]: appSettings.color.text_color ?? "#2A2A2A",
                            }
                            : undefined
                    }
                >
                    {contact?.whatsapp && (
                        <a
                            href={formatWhatsAppUrl(contact.whatsapp)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 bg-custom-card border-[var(--contact-border,#E4F0FB)] hover:border-primary/50 transition-colors min-h-[120px]"
                        >
                            <HiChat className="w-10 h-10 text-green-500 shrink-0" />
                            <span
                                className="text-sm font-medium text-center"
                                style={{ color: "var(--contact-text, #2A2A2A)" }}
                            >
                                {t("helpCenter.openWhatsApp")}
                            </span>
                        </a>
                    )}
                    {contact?.phone && (
                        <a
                            href={`tel:${contact.phone}`}
                            className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 bg-custom-card border-[var(--contact-border,#E4F0FB)] hover:border-primary/50 transition-colors min-h-[120px]"
                        >
                            <HiPhone className="w-10 h-10 shrink-0 text-[#2C8090]" />
                            <span
                                className="text-sm font-medium text-center"
                                style={{ color: "var(--contact-text, #2A2A2A)" }}
                            >
                                {t("helpCenter.callUs")}
                            </span>
                        </a>
                    )}
                    {contact?.email && (
                        <a
                            href={`mailto:${contact.email}`}
                            className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 bg-custom-card border-[var(--contact-border,#E4F0FB)] hover:border-primary/50 transition-colors min-h-[120px]"
                        >
                            <HiMail
                                className="w-10 h-10 text-custom-secondary shrink-0"
                            />
                            <span
                                className="text-sm font-medium text-center"
                                style={{ color: "var(--contact-text, #2A2A2A)" }}
                            >
                                {t("helpCenter.sendEmail")}
                            </span>
                        </a>
                    )}
                    {!contact?.whatsapp && !contact?.phone && !contact?.email && (
                        <div className="col-span-full py-8 text-center">
                            <p className="text-sm text-custom-secondary">
                                {t("helpCenter.contactUnavailable", "Contact information not available.")}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Section B: Support tickets & complaints */}
            <div className="rounded-2xl border border-custom-primary bg-custom-card p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-custom-primary mb-1">
                            {t("complaints.title")}
                        </h2>
                        <p className="text-sm text-custom-secondary">
                            {t("complaints.trackManage")}
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => setComplaintFormVisible((v) => !v)}
                        className="flex items-center gap-2"
                    >
                        <HiPlus className="w-5 h-5" />
                        {t("complaints.newComplaint")}
                    </Button>
                </div>

                {complaintFormVisible && (
                    <ComplaintFormSection
                        onCancel={() => setComplaintFormVisible(false)}
                        onCreateSuccess={handleSubmitSuccess}
                        createMutation={createComplaint}
                    />
                )}

                <div className="mt-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {COMPLAINT_TYPES.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setTypeFilter(typeFilter === opt.value ? "" : opt.value)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-sm font-medium",
                                    typeFilter === opt.value
                                        ? "bg-primary text-white"
                                        : "bg-custom-tertiary text-custom-primary"
                                )}
                            >
                                {t(opt.key)}
                            </button>
                        ))}
                        <span className="px-2 py-1.5 text-custom-secondary">|</span>
                        {STATUS_OPTIONS.map((opt) => (
                            <button
                                key={opt.value || "all"}
                                onClick={() => setStatusFilter(opt.value as ComplaintStatus)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-sm font-medium",
                                    statusFilter === opt.value
                                        ? "bg-primary text-white"
                                        : "bg-custom-tertiary text-custom-primary"
                                )}
                            >
                                {t(opt.key)}
                            </button>
                        ))}
                    </div>
                    <div className="text-sm text-custom-secondary mb-4">
                        {t("complaints.sortNewest")}
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
                        </div>
                    ) : !hasComplaints ? (
                        <div className="py-12 text-center text-custom-secondary">
                            {t("complaints.noComplaints")}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {complaints.map((c) => (
                                <ComplaintAccordionCard
                                    key={c.id}
                                    complaint={c}
                                    expanded={expandedComplaintId === c.id}
                                    onToggle={() =>
                                        setExpandedComplaintId((prev) => (prev === c.id ? null : c.id))
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ComplaintFormSection({
    onCancel,
    onCreateSuccess,
    createMutation,
}: {
    onCancel: () => void;
    onCreateSuccess: () => void;
    createMutation: ReturnType<typeof useCreateComplaint>;
}) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const { data: orders = [] } = useComplaintOrders();
    const [type, setType] = useState<ComplaintType | "">("");
    const [orderId, setOrderId] = useState<string>("");
    const [message, setMessage] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);

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
                    toast.success(getApiSuccessMessage(res, t("complaints.submit")));
                    onCreateSuccess();
                    setType("");
                    setOrderId("");
                    setMessage("");
                    setFiles([]);
                } else {
                    toast.error(getApiSuccessMessage(res, "Failed to submit complaint"));
                }
            },
            onError: (err) => toast.error(getApiErrorMessage(err, "Failed to submit complaint")),
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
        "rounded-xl border-2 border-[#E4F0FB] bg-custom-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

    /** Shared: fill linear #E4F0FB→#E5F3FF, 12px radius, 12/20/32 padding, custom chevron */
    const selectFieldInnerBase =
        "w-full min-h-[48px] rounded-[11px] border-0 bg-gradient-to-r from-[#E4F0FB] to-[#E5F3FF] py-3 text-custom-primary appearance-none cursor-pointer focus:outline-none";

    /** Complaint type: soft light blue/grey ring (no teal gradient border) */
    const complaintTypeSelectClass = cn(
        selectFieldInnerBase,
        "focus:ring-2 focus:ring-[#E4F0FB]/90",
        isRTL ? "pr-5 pl-8" : "pl-5 pr-8"
    );

    /** Related order: border linear #4CDAF6→#2C8090 */
    const relatedOrderSelectClass = cn(
        selectFieldInnerBase,
        "focus:ring-2 focus:ring-[#4CDAF6]/40",
        isRTL ? "pr-5 pl-8" : "pl-5 pr-8"
    );

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl bg-custom-card p-6 space-y-5 mb-6"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-custom-primary mb-1.5">
                        {t("complaints.complaintType")} <span className="text-red-500">*</span>
                    </label>
                    <div className="rounded-xl p-px bg-[#D6E4F0] shadow-sm">
                        <div className="relative">
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as ComplaintType | "")}
                                required
                                className={complaintTypeSelectClass}
                            >
                                <option value="">{t("complaints.selectType")}</option>
                                {COMPLAINT_TYPES.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {t(opt.key)}
                                    </option>
                                ))}
                            </select>
                            <HiChevronDown
                                className={cn(
                                    "pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-[#7A9BA8]",
                                    isRTL ? "left-3" : "right-3"
                                )}
                                aria-hidden
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-custom-primary mb-1.5">
                        {t("complaints.relatedOrder")} <span className="text-red-500">*</span>
                    </label>
                    <div
                        className="rounded-xl p-px bg-gradient-to-r from-[#4CDAF6] to-[#2C8090] shadow-sm"
                    >
                        <div className="relative">
                            <select
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                required
                                className={relatedOrderSelectClass}
                            >
                                <option value="">{t("complaints.selectOrder")}</option>
                                {orders.map((o) => (
                                    <option key={o.id} value={o.id}>
                                        Order #{o.order_code}
                                    </option>
                                ))}
                            </select>
                            <HiChevronDown
                                className={cn(
                                    "pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-[#2C8090]",
                                    isRTL ? "left-3" : "right-3"
                                )}
                                aria-hidden
                            />
                        </div>
                    </div>
                    {orders.length === 0 && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                            {t("complaints.noOrdersAvailable", "No orders available for complaints")}
                        </p>
                    )}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-custom-primary mb-1.5">
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
                <label className="block text-sm font-medium text-custom-primary mb-1.5">
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
                    onClick={() => document.getElementById("complaint-files")?.click()}
                    className={cn(
                        "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors border-[#E4F0FB]",
                        dragActive && "bg-primary/5 border-primary"
                    )}
                >
                    <HiCloudUpload className="w-12 h-12 mx-auto text-custom-tertiary mb-3" />
                    <p className="text-sm font-medium text-custom-primary mb-1">
                        {t("complaints.dropFilesHere")}
                    </p>
                    <p className="text-xs text-custom-secondary">
                        {t("complaints.uploadHint")}
                    </p>
                    <input
                        id="complaint-files"
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
                                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-custom-tertiary text-sm"
                            >
                                {f.name}
                                <button type="button" onClick={() => removeFile(i)} className="text-red-500">
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
                    onClick={onCancel}
                    className="text-custom-secondary hover:text-custom-primary text-sm font-medium"
                >
                    {t("common.cancel")}
                </button>
            </div>
        </form>
    );
}


function ComplaintAccordionCard({
    complaint,
    expanded,
    onToggle,
}: {
    complaint: Complaint;
    expanded: boolean;
    onToggle: () => void;
}) {
    const { t } = useTranslation();
    const typeKey = COMPLAINT_TYPES.find((o) => o.value === complaint.type)?.key ?? complaint.type;
    const statusKey = STATUS_OPTIONS.find((o) => o.value === complaint.status)?.key ?? complaint.status;

    return (
        <div className="rounded-xl border border-custom-primary overflow-hidden hover:shadow-md transition-shadow">
            {/* Summary row - always visible */}
            <div className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-mono text-custom-secondary">
                            #TC{String(complaint.id).padStart(3, "0")} {formatComplaintDate(complaint.created_at)}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary">
                            {t(typeKey)}
                        </span>
                    </div>
                    <span
                        className={cn(
                            "px-2 py-0.5 rounded text-xs font-medium shrink-0",
                            complaint.status === "resolved" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                            complaint.status === "rejected" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                            complaint.status === "new" && "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400",
                            complaint.status === "in_review" && "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        )}
                    >
                        {t(statusKey)}
                    </span>
                </div>
                <p className="text-sm font-medium text-custom-primary mb-1">
                    Order #{complaint.order_id} — {complaint.message.slice(0, 60)}
                    {complaint.message.length > 60 ? "…" : ""}
                </p>
                {!expanded && (
                    <p className="text-sm text-custom-secondary line-clamp-2 mb-2">
                        {complaint.message}
                    </p>
                )}
                <button
                    type="button"
                    onClick={onToggle}
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:underline mt-2"
                >
                    {expanded ? (
                        <>
                            {t("complaints.hideDetails")}
                            <HiChevronUp className="w-4 h-4" />
                        </>
                    ) : (
                        <>
                            {t("complaints.viewDetails")}
                            <HiChevronDown className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>

            {/* Accordion body */}
            {expanded && (
                <div className="border-t border-custom-primary bg-custom-light/50 px-4 py-4 space-y-4">
                    {/* Full Description */}
                    <div>
                        <h4 className="text-sm font-semibold text-custom-primary mb-2">
                            {t("complaints.fullDescription")}
                        </h4>
                        <p className="text-sm text-custom-primary whitespace-pre-wrap">
                            {complaint.message}
                        </p>
                    </div>

                    {/* Attachments */}
                    {complaint.images?.length ? (
                        <div>
                            <h4 className="text-sm font-semibold text-custom-primary mb-2">
                                {t("complaints.attachments")}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {complaint.images.map((url, i) => (
                                    <img
                                        key={i}
                                        src={url}
                                        alt=""
                                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-custom-primary"
                                    />
                                ))}
                            </div>
                        </div>
                    ) : null}



                    {/* Admin response (if any) */}
                    {complaint.admin_response && (
                        <div className="rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 p-4">
                            <p className="text-sm font-semibold text-custom-primary mb-1">
                                {t("complaints.adminResponse")}
                            </p>
                            <p className="text-sm text-custom-primary">
                                {complaint.admin_response}
                            </p>
                        </div>
                    )}

                    {/* Estimated resolution */}
                    <div className="text-sm text-custom-secondary">
                        <span className="font-medium text-custom-primary">
                            {t("complaints.estimatedResolution")}:
                        </span>{""}
                        {t("complaints.estimatedResolutionValue")}
                    </div>
                </div>
            )}
        </div>
    );
}
