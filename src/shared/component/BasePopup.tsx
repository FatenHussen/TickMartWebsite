import { useEffect, type ReactNode } from"react";
import * as ReactDOM from"react-dom";
import { HiX } from"react-icons/hi";
import { useTranslation } from"react-i18next";
import { cn } from"@/shared/lib/utils";

export type BasePopupProps = {
 isOpen: boolean;
 onClose: () => void;
 children?: ReactNode;
 icon?: ReactNode;
 title?: string;
 description?: string;
 actions?: ReactNode;
 maxWidth?:"sm"|"md"|"lg"|"xl"|"2xl";
 hideCloseButton?: boolean;
 closeOnBackdrop?: boolean;
 closeOnEscape?: boolean;
 className?: string;
 contentClassName?: string;
 /** Merged with default backdrop (e.g. stronger blur, gradient overlay) */
 backdropClassName?: string;
};

const maxWidthClasses = {
 sm:"max-w-sm",
 md:"max-w-md",
 lg:"max-w-lg",
 xl:"max-w-xl",
"2xl":"max-w-2xl",
};

export default function BasePopup({
 isOpen,
 onClose,
 children,
 icon,
 title,
 description,
 actions,
 maxWidth ="md",
 hideCloseButton = false,
 closeOnBackdrop = true,
 closeOnEscape = true,
 className ="",
 contentClassName ="",
 backdropClassName,
}: BasePopupProps) {
 const { t } = useTranslation();

 // Prevent body scroll when modal is open
 useEffect(() => {
 if (isOpen) {
 document.body.style.overflow ="hidden";
 } else {
 document.body.style.overflow ="unset";
 }
 return () => {
 document.body.style.overflow ="unset";
 };
 }, [isOpen]);

 // Handle escape key
 useEffect(() => {
 if (!closeOnEscape) return;

 const handleEscape = (e: KeyboardEvent) => {
 if (e.key ==="Escape") {
 onClose();
 }
 };
 if (isOpen) {
 document.addEventListener("keydown", handleEscape);
 }
 return () => {
 document.removeEventListener("keydown", handleEscape);
 };
 }, [isOpen, onClose, closeOnEscape]);

 if (!isOpen) return null;

 const modalContent = (
 <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
 {/* Backdrop */}
 <div
 className={cn(
"absolute inset-0 bg-black/50 backdrop-blur-sm",
 backdropClassName
 )}
 onClick={closeOnBackdrop ? onClose : undefined}
 />

 {/* Modal */}
 <div
 className={cn(
`relative w-full ${maxWidthClasses[maxWidth]} mx-4 rounded-2xl overflow-hidden shadow-2xl bg-custom-card`,
 className
 )}
 onClick={(e) => e.stopPropagation()}
 >
 {/* Close Button - z-20 so it stays above content and remains clickable */}
 {!hideCloseButton && (
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 onClose();
 }}
 className="absolute top-4 right-4 z-20 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
 aria-label={t("common.close")}
 >
 <HiX className="w-6 h-6 text-custom-secondary"/>
 </button>
 )}

 {/* Content */}
 <div className={`relative z-10 p-6 pt-10 text-center ${contentClassName}`}>
 {/* Icon */}
 {icon && <div className="flex justify-center mb-4">{icon}</div>}

 {/* Title */}
 {title && (
 <h2 className="text-xl font-semibold text-custom-primary mb-2">
 {title}
 </h2>
 )}

 {/* Description */}
 {description && (
 <p className="text-sm text-custom-secondary mb-4">{description}</p>
 )}

 {/* Custom Content */}
 {children}

 {/* Actions */}
 {actions && <div className="mt-6">{actions}</div>}
 </div>
 </div>
 </div>
 );

 return ReactDOM.createPortal(modalContent, document.body);
}
