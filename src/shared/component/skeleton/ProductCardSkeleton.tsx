import { cn } from "../../lib/utils";

type ProductCardSkeletonProps = {
  className?: string;
};

export default function ProductCardSkeleton({
  className,
}: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        "bg-custom-primary rounded-2xl border border-custom-secondary shadow-sm overflow-hidden animate-pulse",
        className
      )}
    >
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-300" />

      {/* Content skeleton */}
      <div className="p-4">
        {/* Category badge */}
        <div className="h-5 w-16 bg-gray-300 rounded-full mb-2" />

        {/* Title */}
        <div className="h-5 bg-gray-300 rounded mb-2 w-4/5" />

        {/* Rating and sold */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 w-16 bg-gray-300 rounded" />
          <div className="h-4 w-20 bg-gray-300 rounded" />
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 w-20 bg-gray-300 rounded" />
          <div className="h-4 w-16 bg-gray-300 rounded" />
        </div>

        {/* Savings */}
        <div className="h-4 w-24 bg-gray-300 rounded mb-3" />

        {/* Button */}
        <div className="h-10 w-full bg-gray-300 rounded-lg" />
      </div>
    </div>
  );
}
