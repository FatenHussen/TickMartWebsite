import { useLanguage } from "@/context/LanguageContext";
import { useAppSettings } from "../../hooks/useAppSettings";
import { useComplaints } from "../../hooks/useComplaints";
import { useFaqs } from "../../hooks/useFaqs";
import { DEFAULT_FAQ_TYPE_IDS } from "./constants";
import { ComplaintsSection } from "./components/ComplaintsSection";
import { HelpCenterSection } from "./components/HelpCenterSection";
import { useComplaintsPanelState } from "./hooks/useComplaintsPanelState";
import { useFaqPanelState } from "./hooks/useFaqPanelState";

export default function HelpSupport() {
    const { isRTL } = useLanguage();
    const faqPanel = useFaqPanelState();
    const complaintsPanel = useComplaintsPanelState();

    const { data: faqsData, isLoading: faqsLoading } = useFaqs(faqPanel.selectedCategoryId);
    const { data: appSettings } = useAppSettings();
    const { data: complaintsData, isLoading: complaintsLoading } = useComplaints({
        ...(complaintsPanel.statusFilter && { status: complaintsPanel.statusFilter }),
    });

    const faqTypeIds = faqsData?.types ?? [...DEFAULT_FAQ_TYPE_IDS];
    const faqs = faqsData?.faqs ?? [];

    const rawComplaints = complaintsData?.data ?? [];
    const visibleComplaints = complaintsPanel.typeFilter
        ? rawComplaints.filter((c) => c.type === complaintsPanel.typeFilter)
        : rawComplaints;

    return (
        <div dir={isRTL ? "rtl" : "ltr"} className="relative space-y-10">
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
                <div className="absolute -right-20 -top-28 h-[22rem] w-[22rem] rounded-full bg-gradient-to-br from-primary/25 via-primary/[0.12] to-transparent blur-3xl dark:from-[color-mix(in_srgb,var(--color-main)_12%,transparent)] dark:via-[color-mix(in_srgb,var(--color-main)_5%,transparent)] dark:to-transparent" />
                <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-gradient-to-tr from-[var(--color-api-second)]/20 via-[var(--color-api-second)]/10 to-transparent blur-3xl dark:from-[color-mix(in_srgb,var(--color-api-second)_8%,transparent)] dark:via-[color-mix(in_srgb,var(--color-api-second)_4%,transparent)] dark:to-transparent" />
                <div className="absolute left-1/3 top-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-400/[0.07] via-primary/[0.06] to-[var(--color-api-second)]/[0.08] blur-3xl dark:from-transparent dark:via-[color-mix(in_srgb,var(--color-main)_4%,transparent)] dark:to-[color-mix(in_srgb,var(--color-api-second)_5%,transparent)]" />
            </div>
            <HelpCenterSection
                selectedCategoryId={faqPanel.selectedCategoryId}
                onSelectCategory={faqPanel.setSelectedCategoryId}
                searchQuery={faqPanel.searchQuery}
                onSearchQueryChange={faqPanel.setSearchQuery}
                openFaqId={faqPanel.openFaqId}
                onToggleFaq={faqPanel.toggleFaq}
                faqTypeIds={faqTypeIds}
                faqs={faqs}
                faqsLoading={faqsLoading}
                contact={appSettings?.contact}
                appColor={appSettings?.color}
            />

            <ComplaintsSection
                complaintFormVisible={complaintsPanel.complaintFormVisible}
                onToggleComplaintForm={complaintsPanel.toggleComplaintForm}
                onCloseComplaintForm={complaintsPanel.closeComplaintForm}
                onComplaintCreated={complaintsPanel.collapseComplaintFormOnSuccess}
                typeFilter={complaintsPanel.typeFilter}
                statusFilter={complaintsPanel.statusFilter}
                onToggleTypeFilter={complaintsPanel.toggleTypeFilter}
                onSelectStatusFilter={complaintsPanel.selectStatusFilter}
                complaintsLoading={complaintsLoading}
                complaints={visibleComplaints}
                expandedComplaintId={complaintsPanel.expandedComplaintId}
                onToggleComplaintExpanded={complaintsPanel.toggleComplaintExpanded}
            />
        </div>
    );
}
