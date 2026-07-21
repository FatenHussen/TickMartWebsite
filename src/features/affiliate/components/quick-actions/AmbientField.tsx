import { motion, useMotionTemplate, type MotionValue } from "framer-motion";

type AmbientFieldProps = {
    /** Pointer X in %, springed, from the deck root. */
    pointerX: MotionValue<number>;
    /** Pointer Y in %, springed, from the deck root. */
    pointerY: MotionValue<number>;
    /** 0 → 1 spring easing the cursor spotlight in/out. */
    pointerActive: MotionValue<number>;
};

/**
 * Premium backdrop for the command deck: drifting brand orbs, a fine grid,
 * grain, and a radial spotlight that follows the cursor. Purely decorative.
 */
export default function AmbientField({
    pointerX,
    pointerY,
    pointerActive,
}: AmbientFieldProps) {
    const spotlight = useMotionTemplate`radial-gradient(38rem 38rem at ${pointerX}% ${pointerY}%, color-mix(in srgb, var(--color-main) 16%, transparent), transparent 60%)`;

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            {/* Base wash */}
            <div className="absolute inset-0 bg-[linear-gradient(160deg,color-mix(in_srgb,var(--color-main)_7%,var(--color-bg-primary)),var(--color-bg-primary)_45%,color-mix(in_srgb,var(--color-api-second)_7%,var(--color-bg-primary)))]" />

            {/* Fine grid */}
            <div
                className="absolute inset-0 opacity-[0.5]"
                style={{
                    backgroundImage:
                        "linear-gradient(color-mix(in srgb, var(--color-main) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-main) 6%, transparent) 1px, transparent 1px)",
                    backgroundSize: "44px 44px",
                    maskImage:
                        "radial-gradient(120% 120% at 50% 0%, #000 35%, transparent 78%)",
                    WebkitMaskImage:
                        "radial-gradient(120% 120% at 50% 0%, #000 35%, transparent 78%)",
                }}
            />

            {/* Drifting brand orbs */}
            <div className="qa-ambient-orb qa-ambient-orb--a -start-[10%] top-[-18%] h-[24rem] w-[24rem] bg-[color-mix(in_srgb,var(--color-main)_45%,transparent)]" />
            <div className="qa-ambient-orb qa-ambient-orb--b -end-[12%] bottom-[-22%] h-[22rem] w-[22rem] bg-[color-mix(in_srgb,var(--color-api-second)_45%,transparent)]" />

            {/* Cursor spotlight */}
            <motion.div
                className="absolute inset-0"
                style={{ background: spotlight, opacity: pointerActive }}
            />

            {/* Grain */}
            <div className="qa-grain" />

            {/* Top hairline */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--color-main)_45%,transparent)] to-transparent opacity-60" />
        </div>
    );
}
