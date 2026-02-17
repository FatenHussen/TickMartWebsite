import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { HiX, HiHome, HiGift } from "react-icons/hi";
import { paths } from "@/app/routes/path/paths";
import { useTranslation } from "react-i18next";

export default function BecomeMarketer() {
  const { isRTL } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
            {t("marketer.title") || "Become a marketer"}
          </h1>
          <p className="text-custom-secondary">
            {t("marketer.subtitle") ||
              "Please review and accept the terms before joining the marketer program."}
          </p>
        </div>

        {/* Terms & Conditions Section */}
        <div className="bg-blue-off rounded-xl border border-primary-light/30 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-custom-primary">
              {t("marketer.termsTitle") || "Marketer Terms & Conditions"}
            </h2>
            <span className="text-sm text-custom-secondary">
              {t("marketer.lastUpdated") || "Last updated: 2026-01-01"}
            </span>
          </div>

          <div className="space-y-4 text-custom-secondary text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold text-custom-primary mb-2">
                {t("marketer.scopeOfProgram") || "Scope of the Program"}
              </h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </p>
          </div>

          <p className="text-sm text-custom-secondary mt-6 opacity-75">
            {t("marketer.agreeDisclaimer") ||
              "By clicking 'I agree' you confirm you accept all marketer terms and conditions."}
          </p>
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
            className="px-6 py-3 bg-primary-light text-white rounded-lg font-medium hover:bg-primary transition-colors"
          >
            {t("marketer.iAgree") || "I agree"}
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
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                    <HiHome className="w-10 h-10 text-orange-500" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
                    <HiGift className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-custom-primary text-center mb-4">
                {t("marketer.thankYouTitle") || "Thank you for your application!"}
              </h2>

              {/* Message */}
              <div className="text-custom-secondary text-center space-y-2 mb-8">
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
                <p className="text-sm">
                  {t("marketer.thankYouMessage4") ||
                    "Approval may take up to 24-48 hours depending on review."}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <button
                  onClick={handleBackToHome}
                  className="w-full py-3 px-6 bg-primary-light text-white rounded-xl font-medium hover:bg-primary transition-colors"
                >
                  {t("marketer.backToHome") || "Back to home"}
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
