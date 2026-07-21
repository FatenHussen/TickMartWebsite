import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { HiX } from "react-icons/hi";
import {
    backdropVariants,
    modalVariants,
    slideInVariants,
    fullScreenVariants,
    reducedMotionVariants,
} from "../animations/variants";
import type { PopupCloseReason, PopupType } from "../types";

type Props = {
    isOpen: boolean;
    popupType: PopupType;
    onClose: (reason: PopupCloseReason) => void;
    children: ReactNode;
};

function normalizeType(type: string): "modal" | "slide_in" | "full_screen" {
    const t = type.trim().toLowerCase().replace(/[-\s]+/g, "_");
    if (t === "slide_in" || t === "slidein") return "slide_in";
    if (t === "full_screen" || t === "fullscreen") return "full_screen";
    return "modal";
}

export function PopupShell({ isOpen, popupType, onClose, children }: Props) {
    const shouldReduce = useReducedMotion();
    const focusTrapRef = useRef<HTMLDivElement>(null);
    const type = normalizeType(popupType || "modal");

    // Lock body scroll while open
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    // Focus trap — move focus into the dialog on open
    useEffect(() => {
        if (!isOpen || !focusTrapRef.current) return;
        const focusable = focusTrapRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        first?.focus();

        const trap = (e: KeyboardEvent) => {
            if (e.key === "Tab") {
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last?.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first?.focus();
                    }
                }
            }
            if (e.key === "Escape") {
                onClose("escape");
            }
        };

        document.addEventListener("keydown", trap);
        return () => document.removeEventListener("keydown", trap);
    }, [isOpen, onClose]);

    const contentVariants = shouldReduce
        ? reducedMotionVariants
        : type === "slide_in"
          ? slideInVariants
          : type === "full_screen"
            ? fullScreenVariants
            : modalVariants;

    const isSlideIn = type === "slide_in";
    const isFullScreen = type === "full_screen";

    const containerClass = isSlideIn
        ? "fixed inset-x-0 bottom-0 z-[99999] flex justify-center sm:items-end p-0 sm:p-4"
        : isFullScreen
          ? "fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-6"
          : "fixed inset-0 z-[99999] flex items-center justify-center p-4";

    const dialogClass = isSlideIn
        ? "relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10"
        : isFullScreen
          ? "relative w-full max-w-5xl max-h-[96vh] rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
          : "relative w-full max-w-lg rounded-3xl overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.45)] ring-1 ring-white/10";

    const portal =
        typeof document !== "undefined" ? document.body : null;
    if (!portal) return null;

    return createPortal(
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className={containerClass} role="presentation">
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        variants={shouldReduce ? reducedMotionVariants : backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
                        aria-hidden="true"
                        onClick={() => onClose("backdrop")}
                    />

                    {/* Dialog */}
                    <motion.div
                        key="dialog"
                        ref={focusTrapRef}
                        role="dialog"
                        aria-modal="true"
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={dialogClass}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button — end-aligned so it flips for RTL */}
                        <button
                            type="button"
                            onClick={() => onClose("close_button")}
                            className="absolute top-3.5 end-3.5 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white/85 backdrop-blur-md ring-1 ring-white/15 transition-all duration-200 hover:bg-black/45 hover:text-white hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-white/50"
                            aria-label="Close"
                        >
                            <HiX className="h-4 w-4" aria-hidden="true" />
                        </button>

                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        portal
    );
}
