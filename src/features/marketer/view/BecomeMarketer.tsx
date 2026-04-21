import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { paths } from "@/app/routes/path/paths";
import { useBecomeMarketerPage } from "@/features/marketer/hooks/useBecomeMarketerPage";
import { BecomeMarketerHero } from "@/features/marketer/components/become-marketer/BecomeMarketerHero";
import { BecomeMarketerPendingScreen } from "@/features/marketer/components/become-marketer/BecomeMarketerPendingScreen";
import { BecomeMarketerSuccessModal } from "@/features/marketer/components/become-marketer/BecomeMarketerSuccessModal";
import { BecomeMarketerTermsSection } from "@/features/marketer/components/become-marketer/BecomeMarketerTermsSection";

export default function BecomeMarketer() {
    const { isRTL } = useLanguage();
    const navigate = useNavigate();
    const page = useBecomeMarketerPage();

    if (page.shouldRedirectToDashboard) {
        navigate(paths.marketerDashboard, { replace: true });
        return null;
    }

    if (page.isAwaitingAffiliateApproval) {
        return <BecomeMarketerPendingScreen isRTL={isRTL} homePath={paths.client.home} />;
    }

    const isAgreeDisabled =
        page.isTermsLoading ||
        Boolean(page.termsError) ||
        !page.termsData ||
        page.sendMarketerRequest.isPending;

    return (
        <div
            className="min-h-screen bg-custom-muted px-4 py-8"
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div className="mx-auto max-w-3xl">
                <BecomeMarketerHero benefitItems={page.benefitItems} />

                <BecomeMarketerTermsSection
                    termsData={page.termsData}
                    isLoading={page.isTermsLoading}
                    termsLoadError={page.termsError}
                    cancelHref={paths.client.home}
                    isSubmitDisabled={isAgreeDisabled}
                    isRequestPending={page.sendMarketerRequest.isPending}
                    onAgree={page.submitMarketerAgreement}
                />

                <BecomeMarketerSuccessModal
                    isOpen={page.isSuccessModalOpen}
                    isRTL={isRTL}
                    onDismiss={page.dismissSuccessModal}
                    onNavigateHome={page.navigateHomeAndDismissModal}
                />
            </div>
        </div>
    );
}
