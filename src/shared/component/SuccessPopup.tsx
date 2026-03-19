import { useTranslation } from"react-i18next";
import Button from"@/shared/ui/Button";
import BasePopup from"./BasePopup";

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

 const displayTitle = title ?? t("successPopup.title");
 const displaySubtitle = subtitle ?? t("successPopup.subtitle");
 const displayDescription = description ?? t("successPopup.description");
 const displayPrimaryButton =
 primaryButtonText ?? t("successPopup.backToHome");
 const displayPointsDescription =
 pointsDescription ?? t("successPopup.pointsDescription");

 return (
 <BasePopup
 isOpen={isOpen}
 onClose={onClose}
 maxWidth="2xl"
 contentClassName="pt-12 p-8"
 actions={
 <div className="flex flex-col gap-3">
 <Button
 type="button"
 variant="primary"
 size="lg"
 fullWidth
 onClick={onPrimaryClick ?? onClose}
 className="text-white rounded-xl"
 style={{
 background:"linear-gradient(135deg, #4CDAF6 0%, #2C8090 100%)",
 }}
 >
 {displayPrimaryButton}
 </Button>
 {secondaryButtonText && (
 <button
 type="button"
 onClick={onSecondaryClick ?? onClose}
 className="text-sm text-custom-secondary hover:text-custom-primary hover:underline transition-colors"
 >
 {secondaryButtonText}
 </button>
 )}
 </div>
 }
 >
 {/* Background Image */}
 <div
 className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
 style={{ backgroundImage:"url('/images/shared/scucces.png')"}}
 />

 {/* Title */}
 <h1
 className="text-4xl font-black mb-4 tracking-wide"
 style={{
 color:"#2C8090",
 textShadow:"2px 2px 0 rgba(0,0,0,0.1)",
 }}
 >
 {displayTitle}
 </h1>

 {/* Subtitle */}
 <h2 className="text-lg font-semibold text-custom-primary mb-2">
 {displaySubtitle}
 </h2>

 {/* Description */}
 <p className="text-sm text-custom-secondary mb-6">{displayDescription}</p>

 {/* Points Earned Card */}
 {pointsEarned !== undefined && pointsEarned > 0 && (
 <div
 className="bg-custom-card rounded-xl p-4 shadow-md border border-custom-primary flex items-center gap-4"
 style={{ backgroundColor:"rgba(255, 255, 255, 0.95)"}}
 >
 <div className="shrink-0">
 {/* <img
 src="/images/shared/box.png"
 alt="Gift"
 className="w-16 h-16 object-contain"
 /> */}
 </div>
 <div className="text-left flex-1">
 <div className="flex items-center gap-2 mb-1">
 <span className="text-lg font-bold"style={{ color:"#22C55E"}}>
 {t("successPopup.youEarned")} {pointsEarned}{""}
 {t("successPopup.points")}
 </span>
 </div>
 <p className="text-xs text-custom-secondary">{displayPointsDescription}</p>
 </div>
 </div>
 )}
 </BasePopup>
 );
}
