import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import * as ReactDOM from "react-dom";
import { HiX } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";

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
    /** Merged with default backdrop (e.g. stronger blur, gradient overlay) */
    backdropClassName?: string;
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
    backdropClassName,
}: BasePopupProps) {
    const { t } = useTranslation();
    const footerRef = useRef<HTMLDivElement>(null);
    const [footerHeight, setFooterHeight] = useState(0);

    // The page itself must not scroll while a dialog is open.
    useEffect(() => {
        if (!isOpen) return;
        const previousBody = document.body.style.overflow;
        const previousHtml = document.documentElement.style.overflow;
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousBody;
            document.documentElement.style.overflow = previousHtml;
        };
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        if (!closeOnEscape || !isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose, closeOnEscape]);

    // Footer height is subtracted from the scroll region so actions stay visible.
    useLayoutEffect(() => {
        if (!isOpen) return;
        const el = footerRef.current;
        if (!el) {
            setFooterHeight(0);
            return;
        }
        const update = () => setFooterHeight(el.offsetHeight);
        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, [isOpen, actions]);

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden p-4">
            <div
                className={cn(
                    "absolute inset-0 bg-black/50 backdrop-blur-sm",
                    backdropClassName,
                )}
                onClick={closeOnBackdrop ? onClose : undefined}
            />

            <div
                role="dialog"
                aria-modal="true"
                className={cn(
                    "relative flex w-full min-h-0 flex-col overflow-hidden rounded-2xl bg-custom-card shadow-2xl",
                    "max-h-[min(90vh,calc(100dvh-2rem))]",
                    maxWidthClasses[maxWidth],
                    className,
                )}
                style={{
                    maxHeight: "min(90vh, calc(100dvh - 2rem))",
                    minHeight: 0,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {!hideCloseButton && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="absolute top-4 right-4 z-30 cursor-pointer rounded-full bg-inherit p-1.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
                        aria-label={t("common.close")}
                    >
                        <HiX className="h-6 w-6 text-custom-secondary" />
                    </button>
                )}

                <div
                    className={cn(
                        "min-h-0 overflow-y-auto overscroll-contain p-6 pt-12 text-center",
                        contentClassName,
                    )}
                    style={{
                        maxHeight: `calc(min(90vh, 100dvh - 2rem) - ${footerHeight}px)`,
                    }}
                >
                    {icon && <div className="mb-4 flex justify-center">{icon}</div>}

                    {title && (
                        <h2 className="mb-2 text-xl font-semibold text-custom-primary">
                            {title}
                        </h2>
                    )}

                    {description && (
                        <p className="mb-4 text-sm text-custom-secondary">{description}</p>
                    )}

                    {children}
                </div>

                {actions ? (
                    <div
                        ref={footerRef}
                        className="shrink-0 border-t border-black/5 bg-inherit px-6 py-4 dark:border-white/10"
                    >
                        {actions}
                    </div>
                ) : null}
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
}
