import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useMarketerTermsConditions } from "@/features/legal/hooks/useLegalDocument";
import { useSendMarketerRequest } from "@/features/marketer/hooks/useMarketer";
import { useAuthStore } from "@/store/auth";
import { getApiErrorMessage, getApiSuccessMessage } from "@/shared/lib/apiMessage";
import { paths } from "@/app/routes/path/paths";
import type { LegalDocumentData } from "@/features/legal/types";
import { buildBecomeMarketerBenefitItems } from "@/features/marketer/utils/buildBecomeMarketerBenefitItems";

export function useBecomeMarketerPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const {
        data: termsData,
        isLoading: isTermsLoading,
        error: termsError,
    } = useMarketerTermsConditions();
    const sendMarketerRequest = useSendMarketerRequest();
    const { user } = useAuthStore();

    const affiliate = user?.affiliate;
    const isAffiliate = affiliate?.is_affiliate === true;
    const isApproved = affiliate?.approved === true;

    const shouldRedirectToDashboard = isAffiliate && isApproved;
    const isAwaitingAffiliateApproval = isAffiliate && !isApproved;

    const benefitItems = useMemo(() => buildBecomeMarketerBenefitItems(t), [t]);

    const submitMarketerAgreement = useCallback(() => {
        sendMarketerRequest.mutate(undefined, {
            onSuccess: (res) => {
                if (res.status || res.success) {
                    setIsSuccessModalOpen(true);
                } else {
                    toast.error(getApiSuccessMessage(res, "Request failed"));
                }
            },
            onError: (err: unknown) => {
                toast.error(getApiErrorMessage(err, "Request failed"));
            },
        });
    }, [sendMarketerRequest]);

    const dismissSuccessModal = useCallback(() => {
        setIsSuccessModalOpen(false);
    }, []);

    const navigateHomeAndDismissModal = useCallback(() => {
        setIsSuccessModalOpen(false);
        navigate(paths.client.home);
    }, [navigate]);

    return {
        termsData: termsData as LegalDocumentData | null | undefined,
        isTermsLoading,
        termsError,
        sendMarketerRequest,
        isSuccessModalOpen,
        shouldRedirectToDashboard,
        isAwaitingAffiliateApproval,
        benefitItems,
        submitMarketerAgreement,
        dismissSuccessModal,
        navigateHomeAndDismissModal,
    };
}
