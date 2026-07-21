import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionTemplate } from "framer-motion";
import { HiChevronRight } from "react-icons/hi";
import { Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { QuickActionItem } from "../../types";
import { useMagneticTilt } from "./useMagneticTilt";

type ActionRailItemProps = {
    action: QuickActionItem;
    index: number;
    to: string;
    eyebrow: string;
    isActive: boolean;
    isRTL: boolean;
    reducedMotion: boolean;
    onPreview: (index: number) => void;
    onOpen: (to: string, event: React.MouseEvent) => void;
};

/**
 * A single command-rail tile. Hover/focus previews it into the spotlight;
 * click opens it. The active tile hosts a shared-layout highlight pill that
 * morphs between siblings.
 */
const ActionRailItem = forwardRef<HTMLAnchorElement, ActionRailItemProps>(
    function ActionRailItem(
        {
            action,
            index,
            to,
            eyebrow,
            isActive,
            isRTL,
            reducedMotion,
            onPreview,
            onOpen,
        },
        ref
    ) {
        const tilt = useMagneticTilt({ max: 5, enabled: !reducedMotion });
        const glow = useMotionTemplate`radial-gradient(10rem 10rem at ${tilt.glowX} ${tilt.glowY}, color-mix(in srgb, var(--color-main) 22%, transparent), transparent 65%)`;

        return (
            <motion.div
                ref={tilt.ref}
                onPointerMove={tilt.handlers.onPointerMove}
                onPointerEnter={tilt.handlers.onPointerEnter}
                onPointerLeave={tilt.handlers.onPointerLeave}
                style={{ perspective: 900 }}
                className="relative w-[15rem] shrink-0 lg:w-full"
            >
                <motion.div
                    style={{
                        rotateX: tilt.rotateX,
                        rotateY: tilt.rotateY,
                        transformStyle: "preserve-3d",
                    }}
                >
                    <Link
                        ref={ref}
                        to={to}
                        data-qa-rail-item={index}
                        aria-current={isActive ? "true" : undefined}
                        onMouseEnter={() => onPreview(index)}
                        onFocus={() => onPreview(index)}
                        onClick={(event) => onOpen(to, event)}
                        className={cn(
                            "group/tile relative flex items-center gap-3 overflow-hidden rounded-2xl border p-2.5 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-main)]",
                            isActive
                                ? "border-transparent"
                                : "border-[color-mix(in_srgb,var(--color-main)_10%,var(--color-border-primary))] hover:border-[color-mix(in_srgb,var(--color-main)_26%,var(--color-border-primary))]"
                        )}
                    >
                        {/* Morphing active highlight */}
                        {isActive && (
                            <motion.span
                                layoutId="qa-rail-active"
                                className="absolute inset-0 -z-[1] rounded-2xl border border-[color-mix(in_srgb,var(--color-main)_35%,var(--color-border-primary))] bg-[color-mix(in_srgb,var(--color-main)_12%,var(--color-bg-card))] shadow-[0_14px_34px_-18px_color-mix(in_srgb,var(--color-main)_60%,transparent)]"
                                transition={
                                    reducedMotion
                                        ? { duration: 0 }
                                        : {
                                              type: "spring",
                                              stiffness: 380,
                                              damping: 34,
                                          }
                                }
                                aria-hidden
                            />
                        )}

                        {/* Pointer glow */}
                        <motion.span
                            className="pointer-events-none absolute inset-0 -z-[1] opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100"
                            style={{ background: glow }}
                            aria-hidden
                        />

                        {/* Mini icon well */}
                        <span
                            className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/20 bg-[linear-gradient(150deg,color-mix(in_srgb,var(--color-main)_14%,var(--color-bg-card)),var(--color-bg-card))] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
                            style={{ transform: "translateZ(18px)" }}
                        >
                            {action.icon ? (
                                <img
                                    src={action.icon}
                                    alt=""
                                    className="h-8 w-8 object-contain"
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                    decoding="async"
                                />
                            ) : (
                                <Sparkles className="h-5 w-5 text-[var(--color-main)]" />
                            )}
                        </span>

                        {/* Label */}
                        <span
                            className="min-w-0 flex-1"
                            style={{ transform: "translateZ(12px)" }}
                        >
                            <span className="block truncate text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                                {eyebrow}
                            </span>
                            <span className="block truncate text-sm font-bold text-[var(--color-text-heading)]">
                                {action.title}
                            </span>
                        </span>

                        {/* Shortcut number / chevron */}
                        <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                            <span
                                className={cn(
                                    "font-mono text-[11px] font-bold tabular-nums transition-opacity duration-200",
                                    isActive
                                        ? "opacity-0"
                                        : "text-[var(--color-text-secondary)] opacity-100 group-hover/tile:opacity-0"
                                )}
                                aria-hidden
                            >
                                {index + 1}
                            </span>
                            <HiChevronRight
                                className={cn(
                                    "absolute h-4 w-4 text-[var(--color-main)] transition-all duration-300",
                                    isActive
                                        ? "translate-x-0 opacity-100"
                                        : "-translate-x-1 opacity-0 group-hover/tile:translate-x-0 group-hover/tile:opacity-100",
                                    isRTL && "rotate-180"
                                )}
                                aria-hidden
                            />
                        </span>
                    </Link>
                </motion.div>
            </motion.div>
        );
    }
);

export default ActionRailItem;
