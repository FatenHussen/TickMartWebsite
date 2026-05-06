import type { Variants } from "framer-motion";

// ─── Backdrop ─────────────────────────────────────────────────────────────────

export const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.25, ease: "easeOut" },
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2, ease: "easeIn" },
    },
};

// ─── Modal (scale + fade) ─────────────────────────────────────────────────────

export const modalVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.94,
        y: 8,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 380,
            damping: 30,
            mass: 0.8,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.96,
        y: 4,
        transition: { duration: 0.18, ease: "easeIn" },
    },
};

// ─── Slide-in (from bottom) ───────────────────────────────────────────────────

export const slideInVariants: Variants = {
    hidden: {
        opacity: 0,
        y: "100%",
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 340,
            damping: 32,
            mass: 0.9,
        },
    },
    exit: {
        opacity: 0,
        y: "100%",
        transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
    },
};

// ─── Full-screen (fade + slight zoom) ────────────────────────────────────────

export const fullScreenVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.97,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: [0.16, 1, 0.3, 1],
        },
    },
    exit: {
        opacity: 0,
        scale: 0.98,
        transition: { duration: 0.2, ease: "easeIn" },
    },
};

// ─── Reduced-motion fallback ──────────────────────────────────────────────────

export const reducedMotionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.15 },
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.1 },
    },
};

// ─── Content stagger children ────────────────────────────────────────────────

export const contentContainerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.1,
        },
    },
};

export const contentItemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
    },
};
