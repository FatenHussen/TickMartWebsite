import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

type PremiumAppLoaderProps = {
  className?: string;
  /** Minimum vertical space (route fallbacks often use ~400px). */
  minHeight?: string;
  /** Optional label for accessibility */
  label?: string;
};

/**
 * Full-view cinematic loader: soft orb, breathing glass mark, minimal particles.
 */
export function PremiumAppLoader({
  className,
  minHeight = "min-h-[400px]",
  label = "Loading",
}: PremiumAppLoaderProps) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden",
        minHeight,
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[#050505]/0 dark:bg-[#050505]/40"
        aria-hidden
      />

      {/* Soft radial wash */}
      <div
        className="pointer-events-none absolute h-[min(52vw,420px)] w-[min(52vw,420px)] rounded-full bg-[radial-gradient(circle_at_50%_45%,color-mix(in_srgb,var(--color-main)_14%,transparent)_0%,transparent_68%)] opacity-90 blur-3xl dark:opacity-[0.55]"
        aria-hidden
      />
      <div
        className="premium-loader-ambient premium-loader-ambient--delay pointer-events-none absolute h-[min(40vw,320px)] w-[min(40vw,320px)] rounded-full bg-[radial-gradient(circle_at_40%_60%,rgba(255,255,255,0.06)_0%,transparent_70%)] blur-2xl dark:bg-[radial-gradient(circle_at_40%_60%,rgba(255,255,255,0.045)_0%,transparent_72%)]"
        aria-hidden
      />

      <motion.div
        className="relative z-[1] flex flex-col items-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="relative flex h-[72px] w-[72px] items-center justify-center"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.72, 0.95, 0.72],
          }}
          transition={{
            duration: 4.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {/* Glass tile */}
          <div
            className="absolute inset-0 rounded-2xl border border-white/[0.06] bg-[rgba(16,17,20,0.45)] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-md dark:border-white/[0.07] dark:bg-[rgba(16,17,20,0.72)]"
            aria-hidden
          />
          {/* Slow inner ring — minimal, not neon */}
          <div
            className="premium-loader-glass-ring absolute inset-[5px] rounded-[13px] border border-white/[0.05] border-t-white/[0.12] opacity-70 dark:border-white/[0.06] dark:border-t-white/[0.11]"
            aria-hidden
          />
          <div
            className="relative h-7 w-7 rounded-lg bg-gradient-to-br from-white/[0.14] to-white/[0.04] opacity-80 shadow-inner dark:from-white/[0.1] dark:to-white/[0.03]"
            aria-hidden
          />
        </motion.div>

        <div
          className="pointer-events-none -mt-1 flex h-4 items-end justify-center gap-3.5"
          aria-hidden
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1 w-1 rounded-full bg-white/22 dark:bg-white/18"
              animate={{
                y: [0, -8, 0],
                opacity: [0.2, 0.38, 0.2],
              }}
              transition={{
                duration: 5.5 + i * 0.7,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.45,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
