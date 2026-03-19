import { useState } from"react";
import { Link, useNavigate } from"react-router-dom";
import { useLanguage } from"@/context/LanguageContext";
import { HiX, HiGift, HiClock } from"react-icons/hi";
import { paths } from"@/app/routes/path/paths";
import { useTranslation } from"react-i18next";
import { useMarketerTermsConditions } from"@/features/legal/hooks/useLegalDocument";
import { useSendMarketerRequest } from"@/features/marketer/hooks/useMarketer";
import { useAuthStore } from"@/store/auth";
import { toast } from"sonner";

export default function BecomeMarketer() {
 const { isRTL } = useLanguage();
 const { t } = useTranslation();
 const navigate = useNavigate();
 const [showSuccessModal, setShowSuccessModal] = useState(false);
 const { data: termsData, isLoading, error } = useMarketerTermsConditions();

 const { user } = useAuthStore();
 const sendRequest = useSendMarketerRequest();

 const affiliate = user?.affiliate;
 const isAffiliate = affiliate?.is_affiliate === true;
 const isApproved = affiliate?.approved === true;

 if (isAffiliate && isApproved) {
 navigate(paths.marketerDashboard, { replace: true });
 return null;
 }

 if (isAffiliate && !isApproved) {
 return (
 <div
 className="min-h-screen bg-custom-muted flex items-center justify-center p-4"
 dir={isRTL ?"rtl":"ltr"}
 >
 <div className="bg-custom-card rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
 <div className="flex justify-center mb-6">
 <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
 <HiClock className="w-12 h-12 text-amber-500"/>
 </div>
 </div>
 <h2 className="text-2xl font-bold text-custom-primary mb-3">
 {t("marketer.pendingTitle","Request Under Review")}
 </h2>
 <p className="text-custom-secondary mb-6">
 {t("marketer.pendingMessage","Your marketer request is being reviewed by our team. You'll be notified once it's approved.")}
 </p>
 <Link
 to={paths.client.home}
 className="block w-full py-3 px-6 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
 >
 {t("marketer.backToHome","Back to home")}
 </Link>
 </div>
 </div>
 );
 }

 const handleAgree = () => {
 sendRequest.mutate(undefined, {
 onSuccess: (res) => {
 if (res.status || res.success) {
 setShowSuccessModal(true);
 } else {
 toast.error(res.message);
 }
 },
 onError: (err: unknown) => {
 const msg =
 (err as { response?: { data?: { message?: string } }; message?: string })
 ?.response?.data?.message ||
 (err as { message?: string })?.message ||
"Request failed";
 toast.error(msg);
 },
 });
 };

 const handleCloseModal = () => {
 setShowSuccessModal(false);
 };

 const handleBackToHome = () => {
 setShowSuccessModal(false);
 navigate(paths.client.home);
 };

 return (
 <div
 className="min-h-screen bg-custom-muted py-8 px-4"
 dir={isRTL ?"rtl":"ltr"}
 >
 <div className="max-w-3xl mx-auto">
 {/* Page header */}
 <div className="mb-6">
 <h1 className="text-2xl md:text-3xl font-bold text-custom-primary mb-1">
 {t("marketer.title") ||"Become a marketer"}
 </h1>
 <p className="text-custom-secondary text-sm">
 {t("marketer.subtitle") ||
"Please review and accept the terms before joining the marketer program."}
 </p>
 </div>

 {/* Terms card */}
 <div className="bg-custom-card rounded-xl shadow-lg border border-custom-primary overflow-hidden">
 {isLoading ? (
 <div className="flex justify-center py-16">
 <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"/>
 </div>
 ) : error ? (
 <p className="text-red-500 py-8 text-center px-6">
 {error.message ||"Failed to load terms and conditions."}
 </p>
 ) : termsData ? (
 <>
 {/* Card header - light blue */}
 <div className="bg-cyan-50 dark:bg-cyan-900/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
 <h2 className="text-lg font-bold text-cyan-700 dark:text-cyan-400">
 {termsData.title}
 </h2>
 <span className="text-xs text-custom-secondary sm:text-right">
 {t("marketer.lastUpdated") ||"Last updated: 2026-01-01"}
 </span>
 </div>

 {/* Card body */}
 <div className="px-6 py-5">
 <div
 className="prose prose-sm max-w-none text-custom-secondary leading-relaxed space-y-4"
 dangerouslySetInnerHTML={{ __html: termsData.content }}
 />

 <p className="text-xs text-custom-secondary mt-6">
 {t("marketer.agreeDisclaimer") ||
"By clicking 'I agree' you confirm you accept all marketer terms and conditions."}
 </p>

 {/* Action buttons - right aligned */}
 <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end mt-6">
 <Link
 to={paths.client.home}
 className="px-5 py-2.5 border border-custom-secondary rounded-lg font-medium text-custom-primary hover:bg-custom-light transition-colors text-center"
 >
 {t("common.cancel") ||"Cancel"}
 </Link>
 <button
 onClick={handleAgree}
 disabled={isLoading || !!error || !termsData || sendRequest.isPending}
 className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {sendRequest.isPending
 ? t("common.loading","Loading...")
 : t("marketer.iAgree") ||"I agree"}
 </button>
 </div>
 </div>
 </>
 ) : (
 <p className="text-custom-secondary py-8 text-center px-6">
 {t("marketer.noTermsAvailable") ||"Terms and conditions not available."}
 </p>
 )}
 </div>
 </div>

 {/* Success modal */}
 {showSuccessModal && (
 <>
 <div
 className="fixed inset-0 bg-black/50 z-40"
 onClick={handleCloseModal}
 />
 <div
 className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
 isRTL ?"flex-row-reverse":""
 }`}
 >
 <div
 className="bg-custom-card rounded-2xl shadow-xl max-w-md w-full p-8 relative"
 onClick={(e) => e.stopPropagation()}
 >
 {/* Close button - light gray circle */}
 <button
 onClick={handleCloseModal}
 className="absolute top-4 end-4 w-9 h-9 rounded-full bg-custom-muted text-custom-secondary flex items-center justify-center hover:bg-custom-hover transition-colors"
 >
 <HiX className="w-5 h-5"/>
 </button>

 {/* Decorative icon - gift on yellow/amber background */}
 <div className="flex justify-center mb-5 pt-2">
 <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
 <HiGift className="w-9 h-9 text-amber-500"/>
 </div>
 </div>

 <h2 className="text-xl font-bold text-custom-primary text-center mb-4">
 {t("marketer.thankYouTitle") ||"Thank you for your application!"}
 </h2>

 <div className="text-custom-secondary text-center space-y-2 mb-8 text-sm">
 <p>
 {t("marketer.thankYouMessage1") ||
"Your request to join as a marketer has been submitted."}
 </p>
 <p>
 {t("marketer.thankYouMessage2") ||
"Please wait while our team reviews your application."}
 </p>
 <p>
 {t("marketer.thankYouMessage3") ||
"You'll be notified once it's approved."}
 </p>
 <p className="text-xs">
 {t("marketer.thankYouMessage4") ||
"Approval may take up to 24-48 hours depending on review."}
 </p>
 </div>

 <div className="flex flex-col items-center gap-3">
 <button
 onClick={handleBackToHome}
 className="w-full py-3 px-6 bg-gradient-to-r from-primary to-cyan-600 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
 >
 {t("marketer.backToHome") ||"Back to home"}
 </button>
 <button
 onClick={handleCloseModal}
 className="text-custom-secondary text-sm hover:text-primary transition-colors"
 >
 {t("common.close") ||"Close"}
 </button>
 </div>
 </div>
 </div>
 </>
 )}
 </div>
 );
}
