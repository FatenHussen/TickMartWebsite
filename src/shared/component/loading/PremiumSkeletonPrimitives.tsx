import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type SkeletonTone = "surface" | "inset" | "lightCard";

const toneClass: Record<SkeletonTone, string> = {
  surface:
    "border border-[rgba(255,255,255,0.06)] bg-[rgba(16,17,20,0.42)] dark:bg-[rgba(16,17,20,0.55)]",
  inset: "border border-transparent bg-[color-mix(in_srgb,var(--color-bg-hover)_92%,transparent)] dark:border-white/[0.04] dark:bg-white/[0.06]",
  lightCard:
    "border border-custom-secondary/50 bg-custom-primary dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(16,17,20,0.48)]",
};

type PremiumSkeletonBlockProps = {
  className?: string;
  tone?: SkeletonTone;
  /** Use softer sweep on light-tinted card shells */
  shimmer?: "default" | "light";
  rounded?: string;
};

export function PremiumSkeletonBlock({
  className,
  tone = "inset",
  shimmer = "default",
  rounded = "rounded-lg",
}: PremiumSkeletonBlockProps) {
  return (
    <div
      className={cn(
        toneClass[tone],
        shimmer === "light" ? "premium-skeleton-shimmer-light" : "premium-skeleton-shimmer",
        rounded,
        className,
      )}
    />
  );
}

type PremiumSkeletonCardShellProps = {
  className?: string;
  children: ReactNode;
};

/** Outer card for grid skeletons: glass panel + border */
export function PremiumSkeletonCardShell({
  className,
  children,
}: PremiumSkeletonCardShellProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-custom-secondary bg-custom-primary shadow-sm dark:border-[rgba(255,255,255,0.07)] dark:bg-[rgba(16,17,20,0.38)] dark:shadow-[0_8px_32px_-16px_rgba(0,0,0,0.55)] dark:backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

type PremiumShimmerBarsProps = {
  className?: string;
  lines?: number;
};

/** Text placeholder for buttons or dense rows */
export function PremiumShimmerBars({
  className,
  lines = 1,
}: PremiumShimmerBarsProps) {
  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <PremiumSkeletonBlock
          key={i}
          tone="inset"
          className={cn("h-2.5 w-full", i === lines - 1 && lines > 1 && "w-4/5")}
          rounded="rounded-md"
        />
      ))}
    </div>
  );
}
