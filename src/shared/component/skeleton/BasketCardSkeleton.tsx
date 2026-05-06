import { cn } from"@/shared/lib/utils";
import {
 PremiumSkeletonBlock,
 PremiumSkeletonCardShell,
} from"@/shared/component/loading";

type BasketCardSkeletonProps = {
 className?: string;
};

export default function BasketCardSkeleton({
 className,
}: BasketCardSkeletonProps) {
 return (
 <PremiumSkeletonCardShell className={cn("relative", className)}>
 <div className="relative">
 <PremiumSkeletonBlock
 tone="inset"
 className="aspect-[4/3] w-full rounded-none border-x-0 border-t-0"
 />
 <PremiumSkeletonBlock
 tone="surface"
 className="absolute right-3 top-3 h-8 w-8 rounded-full"
 />
 </div>

 <div className="space-y-3 p-4">
 <PremiumSkeletonBlock className="h-5 w-3/4" />
 <PremiumSkeletonBlock className="h-4 w-full" />
 <PremiumSkeletonBlock className="h-4 w-2/3" />
 <div className="mb-3 flex items-center gap-2">
 <PremiumSkeletonBlock className="h-6 w-20" />
 <PremiumSkeletonBlock className="h-4 w-16" />
 <PremiumSkeletonBlock className="ml-auto h-4 w-16" />
 </div>
 <PremiumSkeletonBlock className="h-4 w-32" />
 <PremiumSkeletonBlock className="mb-4 h-4 w-40" />
 <PremiumSkeletonBlock className="h-10 w-full rounded-lg" />
 </div>
 </PremiumSkeletonCardShell>
 );
}
