import { type CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
    AnimatePresence,
    motion,
    useMotionTemplate,
    type Variants,
} from "framer-motion";
import { HiChevronRight } from "react-icons/hi";
import { Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { QuickActionItem } from "../../types";
import { useMagneticTilt } from "./useMagneticTilt";

/** Circle geometry for the orbiting progress ring (viewBox 0 0 120 120). */
const RING_RADIUS = 56;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type FeaturedActionPanelProps = {
    action: QuickActionItem;
    index: number;
    total: number;
    to: string;
    label: string;
    eyebrow: string;
    routeLabel: string;
    isRTL: boolean;
    reducedMotion: boolean;
    isPaused: boolean;
    autoplayMs: number;
    autoAdvance: boolean;
    onOpen: (to: string, event: React.MouseEvent) => void;
    onCycleEnd: () => void;
};

export default function FeaturedActionPanel({
    action,
    index,
    total,
    to,
    label,
    eyebrow,
    routeLabel,
    isRTL,
    reducedMotion,
    isPaused,
    autoplayMs,
    autoAdvance,
    onOpen,
    onCycleEnd,
}: FeaturedActionPanelProps) {
    const tilt = useMagneticTilt({ max: 7, enabled: !reducedMotion });

    const glow = useMotionTemplate`radial-gradient(22rem 22rem at ${tilt.glowX} ${tilt.glowY}, color-mix(in srgb, var(--color-main) 26%, transparent), transparent 62%)`;

    const contentVariants: Variants = reducedMotion
        ? {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
          }
        : {
              initial: { opacity: 0, y: 22, scale: 0.96, filter: "blur(10px)" },
              animate: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: {
                      type: "spring",
                      stiffness: 210,
                      damping: 26,
                      mass: 0.7,
                  },
              },
              exit: {
                  opacity: 0,
                  y: -18,
                  scale: 0.97,
                  filter: "blur(8px)",
                  transition: { duration: 0.22, ease: "easeIn" },
              },
          };

    const iconVariants: Variants = reducedMotion
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : {
              initial: { opacity: 0, scale: 0.6, rotate: isRTL ? 12 : -12 },
              animate: {
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                  transition: {
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                      delay: 0.05,
                  },
              },
              exit: { opacity: 0, scale: 0.7, transition: { duration: 0.18 } },
          };

    return (
        <motion.div
            ref={tilt.ref}
            onPointerMove={tilt.handlers.onPointerMove}
            onPointerEnter={tilt.handlers.onPointerEnter}
            onPointerLeave={tilt.handlers.onPointerLeave}
            className="relative h-full"
            style={{ perspective: 1200 }}
        >
            <motion.article
                style={{
                    rotateX: tilt.rotateX,
                    rotateY: tilt.rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="relative flex h-full min-h-[19rem] flex-col justify-between overflow-hidden rounded-[1.9rem] border border-[color-mix(in_srgb,var(--color-main)_16%,var(--color-border-primary))] bg-[color-mix(in_srgb,var(--color-bg-card)_88%,transparent)] p-6 shadow-[0_40px_90px_-46px_color-mix(in_srgb,var(--color-main)_50%,transparent)] backdrop-blur-xl sm:p-8 dark:border-white/10"
            >
                {/* Pointer-following glow */}
                <motion.div
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{ background: glow, opacity: tilt.pointerActive }}
                    aria-hidden
                />
                {/* Top glass highlight */}
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 z-0 h-24 bg-gradient-to-b from-white/12 to-transparent"
                    aria-hidden
                />

                {/* Header row */}
                <div
                    className="relative z-[2] flex items-center justify-between gap-3"
                    style={{ transform: "translateZ(24px)" }}
                >
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--color-main)_12%,var(--color-bg-card))] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-main)] ring-1 ring-[color-mix(in_srgb,var(--color-main)_24%,var(--color-border-primary))]">
                        <Sparkles className="h-3 w-3" />
                        {eyebrow}
                    </span>
                    <span className="font-mono text-xs font-semibold text-[var(--color-text-secondary)] tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                        <span className="opacity-50">
                            {" / "}
                            {String(total).padStart(2, "0")}
                        </span>
                    </span>
                </div>

                {/* Icon well + orbiting ring */}
                <div
                    className="relative z-[2] mx-auto my-4 grid h-40 w-40 place-items-center"
                    style={{ transform: "translateZ(55px)" }}
                >
                    {/* Ring */}
                    <div
                        key={`ring-${index}`}
                        className={cn(
                            "qa-ring absolute inset-0",
                            (isPaused || !autoAdvance) && "is-paused"
                        )}
                        style={
                            {
                                "--qa-ring-c": RING_CIRCUMFERENCE,
                                "--qa-ring-duration": `${autoplayMs}ms`,
                            } as CSSProperties
                        }
                        aria-hidden
                    >
                        <svg viewBox="0 0 120 120" className="h-full w-full">
                            <circle
                                cx="60"
                                cy="60"
                                r={RING_RADIUS}
                                fill="none"
                                stroke="color-mix(in srgb, var(--color-main) 16%, transparent)"
                                strokeWidth="2.5"
                            />
                            {autoAdvance && !reducedMotion && (
                                <circle
                                    className="qa-ring__progress"
                                    cx="60"
                                    cy="60"
                                    r={RING_RADIUS}
                                    fill="none"
                                    stroke="var(--color-main)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    onAnimationEnd={onCycleEnd}
                                />
                            )}
                        </svg>
                    </div>

                    {/* Halo */}
                    <div
                        className="absolute inset-4 rounded-[1.6rem] bg-[radial-gradient(circle_at_50%_35%,color-mix(in_srgb,var(--color-main)_26%,transparent),transparent_70%)] blur-md"
                        aria-hidden
                    />
                    {/* Glass well */}
                    <div className="relative grid h-28 w-28 place-items-center overflow-hidden rounded-[1.5rem] border border-white/20 bg-[linear-gradient(150deg,color-mix(in_srgb,var(--color-main)_16%,var(--color-bg-card)),var(--color-bg-card))] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_18px_40px_-18px_color-mix(in_srgb,var(--color-main)_55%,transparent)]">
                        <div className="qa-sheen pointer-events-none absolute inset-0 z-[2]" aria-hidden />
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.div
                                key={action.id}
                                variants={iconVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="relative z-[1] grid h-full w-full place-items-center p-3"
                            >
                                {action.icon ? (
                                    <img
                                        src={action.icon}
                                        alt=""
                                        className="h-full w-full object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.28)]"
                                        referrerPolicy="no-referrer"
                                        loading={index === 0 ? "eager" : "lazy"}
                                        decoding="async"
                                    />
                                ) : (
                                    <Sparkles className="h-12 w-12 text-[var(--color-main)]" />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Text + CTA */}
                <div
                    className="relative z-[2] flex flex-col gap-4"
                    style={{ transform: "translateZ(34px)" }}
                >
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                            key={action.id}
                            variants={contentVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex flex-col items-center gap-1.5 text-center"
                        >
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--color-main)_18%,var(--color-border-primary))] bg-[color-mix(in_srgb,var(--color-main)_7%,var(--color-bg-card))] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--color-text-secondary)]">
                                {routeLabel}
                            </span>
                            <h3
                                className="text-balance font-black leading-[1.1] tracking-tight text-[var(--color-text-heading)]"
                                style={{
                                    fontSize:
                                        "clamp(1.5rem, min(4vw, 4vh), 2.25rem)",
                                }}
                            >
                                {action.title}
                            </h3>
                        </motion.div>
                    </AnimatePresence>

                    <Link
                        to={to}
                        onClick={(event) => onOpen(to, event)}
                        style={{ transform: "translateZ(46px)" }}
                        className="group/cta relative flex min-h-[3.25rem] w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,var(--color-main),color-mix(in_srgb,var(--color-main)_74%,#000))] px-5 text-base font-bold text-[var(--color-text-inverse)] shadow-[0_16px_38px_-14px_color-mix(in_srgb,var(--color-main)_70%,transparent)] transition hover:brightness-[1.06] hover:shadow-[0_22px_50px_-14px_color-mix(in_srgb,var(--color-main)_80%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-main)] active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100"
                    >
                        <span
                            className="pointer-events-none absolute inset-y-0 -start-1/3 w-1/3 -skew-x-12 bg-white/25 blur-md transition-transform duration-700 group-hover/cta:translate-x-[320%] motion-reduce:transition-none rtl:group-hover/cta:-translate-x-[320%]"
                            aria-hidden
                        />
                        <span className="relative max-w-[80%] truncate text-center">
                            {label}
                        </span>
                        <HiChevronRight
                            className={cn(
                                "relative h-5 w-5 shrink-0 transition-transform duration-300 group-hover/cta:translate-x-1 motion-reduce:transition-none",
                                isRTL && "rotate-180 group-hover/cta:-translate-x-1"
                            )}
                            aria-hidden
                        />
                    </Link>
                </div>
            </motion.article>
        </motion.div>
    );
}
