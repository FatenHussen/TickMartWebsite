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
        <div dir={isRTL ? "rtl" : "ltr"} className="space-y-6">
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
