import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

type PremiumAppLoaderProps = {
  className?: string;
  /** Minimum vertical space (route fallbacks often use ~400px). */
  minHeight?: string;
  /** Optional label for accessibility */
  label?: string;
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Full-view cinematic loader: soft brand aurora, breathing logo mark with a
 * gradient progress ring, subtle floating glow particles. Dark-mode aware.
 */
export function PremiumAppLoader({
  className,
  minHeight = "min-h-[400px]",
  label = "Loading",
}: PremiumAppLoaderProps) {
  const [logoError, setLogoError] = useState(false);

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden",
        "bg-white dark:bg-[#070708]",
        minHeight,
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      {/* Drifting brand aurora — soft, blurred, light & dark friendly */}
      <div
        className="premium-loader-ambient pointer-events-none absolute h-[min(60vw,460px)] w-[min(60vw,460px)] rounded-full opacity-70 blur-3xl dark:opacity-50"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, color-mix(in srgb, var(--color-main) 32%, transparent) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="premium-loader-ambient premium-loader-ambient--delay pointer-events-none absolute h-[min(44vw,340px)] w-[min(44vw,340px)] -translate-x-1/4 translate-y-1/4 rounded-full opacity-60 blur-3xl dark:opacity-40"
        style={{
          background:
            "radial-gradient(circle at 40% 60%, color-mix(in srgb, var(--color-primary-light) 30%, transparent) 0%, transparent 72%)",
        }}
        aria-hidden
      />

      {/* Floating glow particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {[
          { left: "22%", top: "32%", size: 6, delay: 0 },
          { left: "74%", top: "28%", size: 4, delay: 1.1 },
          { left: "32%", top: "70%", size: 5, delay: 2.2 },
          { left: "68%", top: "66%", size: 3, delay: 0.6 },
          { left: "50%", top: "20%", size: 4, delay: 1.7 },
        ].map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: "var(--color-main)",
              boxShadow: "0 0 12px 2px color-mix(in srgb, var(--color-main) 60%, transparent)",
            }}
            animate={{ y: [0, -14, 0], opacity: [0, 0.7, 0] }}
            transition={{
              duration: 5 + i * 0.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-[1] flex flex-col items-center gap-7"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      >
        <div className="relative flex h-[112px] w-[112px] items-center justify-center">
          {/* Soft halo glow behind the mark */}
          <motion.div
            className="absolute inset-0 rounded-full blur-xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--color-main) 45%, transparent) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.75, 0.45] }}
            transition={{ duration: 3.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            aria-hidden
          />

          {/* Gradient progress ring sweeping around the mark */}
          <div
            className="premium-loader-ring absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, color-mix(in srgb, var(--color-primary-light) 70%, transparent) 200deg, var(--color-main) 320deg, transparent 360deg)",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            }}
            aria-hidden
          />

          {/* Glass disc holding the logo */}
          <motion.div
            className="relative flex h-[88px] w-[88px] items-center justify-center rounded-full border border-black/[0.05] bg-white/70 shadow-[0_10px_40px_-12px_color-mix(in_srgb,var(--color-main)_45%,transparent)] backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.04]"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 3.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            {!logoError ? (
              <img
                src="/images/shared/logo.png"
                alt="TickMart"
                className="h-12 w-12 object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span
                className="bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-main)] bg-clip-text text-3xl font-bold text-transparent"
                aria-hidden
              >
                T
              </span>
            )}
          </motion.div>
        </div>

        {/* Thin gradient progress line with shimmer — fast, polished cue */}
        <div
          className="premium-skeleton-shimmer relative h-[3px] w-[120px] overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.06]"
          aria-hidden
        >
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, var(--color-primary-light), var(--color-main))",
            }}
            animate={{ width: ["10%", "85%", "10%"], x: ["0%", "20%", "0%"] }}
            transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
