import { cn } from "@/shared/lib/utils";

type PremiumInlineLoaderProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "h-7 w-7",
  md: "h-10 w-10",
  lg: "h-12 w-12",
} as const;

/**
 * Compact loader: one slow glass ring + soft core (replaces fast spinners in calm contexts).
 */
export function PremiumInlineLoader({
  className,
  size = "md",
}: PremiumInlineLoaderProps) {
  return (
    <div
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      role="status"
      aria-hidden
    >
      <div
        className={cn(
          "relative rounded-full border border-white/[0.06] bg-[rgba(16,17,20,0.35)] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] backdrop-blur-sm dark:border-white/[0.07] dark:bg-[rgba(16,17,20,0.55)]",
          sizeMap[size],
        )}
      >
        <div
          className={cn(
            "premium-loader-glass-ring absolute inset-[3px] rounded-full border border-white/[0.05] border-t-white/[0.14] opacity-75 dark:border-white/[0.06] dark:border-t-white/[0.12]",
            size === "sm" && "inset-[2px]",
          )}
        />
        <span className="absolute inset-0 m-auto block h-[30%] w-[30%] rounded-sm bg-white/[0.12] opacity-80 dark:bg-white/[0.1]" />
      </div>
    </div>
  );
}
