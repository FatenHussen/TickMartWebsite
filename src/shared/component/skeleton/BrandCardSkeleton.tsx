import { cn } from "../../lib/utils";

type BrandCardSkeletonProps = {
  className?: string;
};

export default function BrandCardSkeleton({
  className,
}: BrandCardSkeletonProps) {
  return (
    <div
      className={cn(
        "bg-[#E4F0FB] rounded-xl p-6 shadow-sm flex flex-col items-center animate-pulse",
        className
      )}
    >
      {/* Logo circle skeleton */}
      <div className="w-24 h-24 rounded-full bg-gray-300 mb-4" />

      {/* Brand name skeleton */}
      <div className="h-4 w-24 bg-gray-300 rounded mb-2" />

      {/* Rating skeleton */}
      <div className="h-3 w-16 bg-gray-300 rounded" />
    </div>
  );
}
