import { useEffect } from "react";
import { HiX } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/Button";

export type SuccessPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  description?: string;
  pointsEarned?: number;
  pointsDescription?: string;
  primaryButtonText?: string;
  onPrimaryClick?: () => void;
  secondaryButtonText?: string;
  onSecondaryClick?: () => void;
};

export default function SuccessPopup({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  pointsEarned,
  pointsDescription,
  primaryButtonText,
  onPrimaryClick,
  secondaryButtonText,
  onSecondaryClick,
}: SuccessPopupProps) {
  const { t } = useTranslation();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayTitle = title ?? t("successPopup.title");
  const displaySubtitle = subtitle ?? t("successPopup.subtitle");
  const displayDescription = description ?? t("successPopup.description");
  const displayPrimaryButton =
    primaryButtonText ?? t("successPopup.backToHome");
  const displayPointsDescription =
    pointsDescription ?? t("successPopup.pointsDescription");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white"
        style={{ maxHeight: "100vh" }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/shared/scucces.png')" }}
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-black/10 transition-colors"
          aria-label={t("common.close")}
        >
          <HiX className="w-6 h-6 text-gray-500" />
        </button>

        {/* Content */}
        <div className="relative z-10 p-8 pt-12 text-center">
          {/* Title */}
          <h1
            className="text-4xl font-black mb-4 tracking-wide"
            style={{
              color: "#2C8090",
              textShadow: "2px 2px 0 rgba(0,0,0,0.1)",
            }}
          >
            {displayTitle}
          </h1>

          {/* Subtitle */}
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            {displaySubtitle}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-500 mb-6">{displayDescription}</p>

          {/* Points Earned Card */}
          {pointsEarned !== undefined && pointsEarned > 0 && (
            <div
              className="bg-white rounded-xl p-4 mb-6 shadow-md border border-gray-100 flex items-center gap-4"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
            >
              {/* Gift Box Image */}
              <div className="shrink-0">
                <img
                  src="/images/shared/box.png"
                  alt="Gift"
                  className="w-16 h-16 object-contain"
                />
              </div>

              {/* Points Info */}
              <div className="text-left flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-lg font-bold"
                    style={{ color: "#22C55E" }}
                  >
                    {t("successPopup.youEarned")} {pointsEarned}{" "}
                    {t("successPopup.points")}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {displayPointsDescription}
                </p>
              </div>
            </div>
          )}

          {/* Primary Button */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={onPrimaryClick ?? onClose}
            className="text-white rounded-xl mb-3"
            style={{
              background: "linear-gradient(135deg, #4CDAF6 0%, #2C8090 100%)",
            }}
          >
            {displayPrimaryButton}
          </Button>

          {/* Secondary Button */}
          {secondaryButtonText && (
            <button
              type="button"
              onClick={onSecondaryClick ?? onClose}
              className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors"
            >
              {secondaryButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
