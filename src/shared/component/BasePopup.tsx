import { useEffect, type ReactNode } from "react";
import { HiX } from "react-icons/hi";
import { useTranslation } from "react-i18next";

export type BasePopupProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  icon?: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  hideCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  contentClassName?: string;
};

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export default function BasePopup({
  isOpen,
  onClose,
  children,
  icon,
  title,
  description,
  actions,
  maxWidth = "md",
  hideCloseButton = false,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = "",
  contentClassName = "",
}: BasePopupProps) {
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
    if (!closeOnEscape) return;

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
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {!hideCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-black/10 transition-colors"
            aria-label={t("common.close")}
          >
            <HiX className="w-6 h-6 text-gray-500" />
          </button>
        )}

        {/* Content */}
        <div className={`relative z-10 p-6 pt-10 text-center ${contentClassName}`}>
          {/* Icon */}
          {icon && <div className="flex justify-center mb-4">{icon}</div>}

          {/* Title */}
          {title && (
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {title}
            </h2>
          )}

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-600 mb-4">{description}</p>
          )}

          {/* Custom Content */}
          {children}

          {/* Actions */}
          {actions && <div className="mt-6">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
