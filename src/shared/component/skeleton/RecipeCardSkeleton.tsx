import { cn } from"../../lib/utils";

type RecipeCardSkeletonProps = {
 className?: string;
};

export default function RecipeCardSkeleton({
 className,
}: RecipeCardSkeletonProps) {
 return (
 <div
 className={cn(
"bg-custom-primary rounded-2xl border border-custom-secondary shadow-sm overflow-hidden animate-pulse",
 className
 )}
 >
 {/* Image skeleton */}
 <div className="aspect-[4/3] bg-custom-hover"/>

 {/* Content skeleton */}
 <div className="p-4">
 {/* Title */}
 <div className="h-5 bg-custom-hover rounded mb-3 w-3/4"/>

 {/* Rating and orders */}
 <div className="flex items-center justify-between mb-3">
 <div className="h-4 w-16 bg-custom-hover rounded"/>
 <div className="h-4 w-20 bg-custom-hover rounded"/>
 </div>

 {/* Price */}
 <div className="flex items-center gap-2 mb-3">
 <div className="h-6 w-20 bg-custom-hover rounded"/>
 <div className="h-4 w-16 bg-custom-hover rounded"/>
 </div>

 {/* Button */}
 <div className="h-10 w-full bg-custom-hover rounded-lg"/>
 </div>
 </div>
 );
}
