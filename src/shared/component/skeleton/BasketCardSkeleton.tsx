import { cn } from "../../lib/utils";

type BasketCardSkeletonProps = {
  className?: string;
};

export default function BasketCardSkeleton({
  className,
}: BasketCardSkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-custom-primary shadow-sm animate-pulse",
        className
      )}
    >
      {/* Image skeleton */}
      <div className="aspect-[4/3] bg-gray-300 relative">
        {/* Favorite icon skeleton */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-400" />
      </div>

      {/* Content skeleton */}
      <div className="p-4">
        {/* Title */}
        <div className="h-5 bg-gray-300 rounded mb-3 w-3/4" />

        {/* Description */}
        <div className="h-4 bg-gray-300 rounded mb-2 w-full" />
        <div className="h-4 bg-gray-300 rounded mb-3 w-2/3" />

        {/* Price and save amount */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 w-20 bg-gray-300 rounded" />
          <div className="h-4 w-16 bg-gray-300 rounded" />
          <div className="h-4 w-16 bg-gray-300 rounded ml-auto" />
        </div>

        {/* Savings */}
        <div className="h-4 w-32 bg-gray-300 rounded mb-3" />

        {/* Offer ending date */}
        <div className="h-4 w-40 bg-gray-300 rounded mb-4" />

        {/* Button */}
        <div className="h-10 w-full bg-gray-300 rounded-lg" />
      </div>
    </div>
  );
}
