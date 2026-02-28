import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { HiX, HiShoppingBag } from "react-icons/hi";
import { paths } from "@/app/routes/path/paths";
import { useTranslation } from "react-i18next";
import { useTermsConditions } from "@/features/legal/hooks/useLegalDocument";

export default function BecomeVendor() {
  const { isRTL } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { data: termsData, isLoading, error } = useTermsConditions();

  const handleAgree = () => {
    setShowSuccessModal(true);
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
      className="min-h-screen bg-custom-primary py-8 px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="page-container max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-custom-primary mb-2">
            {t("vendor.title") || "Become a vendor"}
          </h1>
          <p className="text-custom-secondary">
            {t("vendor.subtitle") ||
              "Please review and accept the terms before joining as a vendor."}
          </p>
        </div>

        {/* Terms & Conditions Section */}
        <div className="bg-blue-off rounded-xl border border-primary-light/30 p-6 mb-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-light border-t-transparent" />
            </div>
          ) : error ? (
            <p className="text-red-500 py-6 text-center">
              {error.message || "Failed to load terms and conditions."}
            </p>
          ) : termsData ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-custom-primary">
                  {termsData.title}
                </h2>
                <span className="text-sm text-custom-secondary">
                  {t("vendor.lastUpdated") || "Last updated: 2026-01-01"}
                </span>
              </div>

              <div
                className="prose prose-gray max-w-none text-custom-secondary text-sm leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: termsData.content }}
              />

              <p className="text-sm text-custom-secondary mt-6 opacity-75">
                {t("vendor.agreeDisclaimer") ||
                  "By clicking 'I agree' you confirm you accept all vendor terms and conditions."}
              </p>
            </>
          ) : (
            <p className="text-custom-secondary py-6 text-center">
              {t("vendor.noTermsAvailable") ||
                "Terms and conditions not available."}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
          <Link
            to={paths.client.home}
            className="px-6 py-3 border border-gray-bold rounded-lg font-medium text-custom-primary hover:bg-gray-bold transition-colors text-center"
          >
            {t("common.cancel") || "Cancel"}
          </Link>
          <button
            onClick={handleAgree}
            disabled={isLoading || !!error || !termsData}
            className="px-6 py-3 bg-primary-light text-white rounded-lg font-medium hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("vendor.iAgree") || "I agree"}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleCloseModal}
          />
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-primary-light/20 text-primary-light flex items-center justify-center hover:bg-primary-light/30 transition-colors"
              >
                <HiX className="w-6 h-6" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary-light/20 flex items-center justify-center">
                    <HiShoppingBag className="w-10 h-10 text-primary-light" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-custom-primary text-center mb-4">
                {t("vendor.thankYouTitle") ||
                  "Thank you for your application!"}
              </h2>

              {/* Message */}
              <div className="text-custom-secondary text-center space-y-2 mb-8">
                <p>
                  {t("vendor.thankYouMessage1") ||
                    "Your request to join as a vendor has been submitted."}
                </p>
                <p>
                  {t("vendor.thankYouMessage2") ||
                    "Please wait while our team reviews your application."}
                </p>
                <p>
                  {t("vendor.thankYouMessage3") ||
                    "You'll be notified once it's approved."}
                </p>
                <p className="text-sm">
                  {t("vendor.thankYouMessage4") ||
                    "Approval may take up to 24-48 hours depending on review."}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <button
                  onClick={handleBackToHome}
                  className="w-full py-3 px-6 bg-primary-light text-white rounded-xl font-medium hover:bg-primary transition-colors"
                >
                  {t("vendor.backToHome") || "Back to home"}
                </button>
                <button
                  onClick={handleCloseModal}
                  className="w-full text-custom-secondary text-sm underline hover:text-primary-light transition-colors"
                >
                  {t("common.close") || "Close"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
