import { cn } from"@/shared/lib/utils";
import {
 PremiumSkeletonBlock,
 PremiumSkeletonCardShell,
} from"@/shared/component/loading";

type ProductCardSkeletonProps = {
 className?: string;
};

export default function ProductCardSkeleton({
 className,
}: ProductCardSkeletonProps) {
 return (
 <PremiumSkeletonCardShell className={cn(className)}>
 <PremiumSkeletonBlock
 tone="inset"
 className="aspect-square w-full rounded-none border-x-0 border-t-0"
 />

 <div className="space-y-3 p-4">
 <PremiumSkeletonBlock className="mb-2 h-5 w-16 rounded-full" />
 <PremiumSkeletonBlock className="h-5 w-4/5" />
 <div className="mb-3 flex items-center justify-between gap-2">
 <PremiumSkeletonBlock className="h-4 w-16" />
 <PremiumSkeletonBlock className="h-4 w-20" />
 </div>
 <div className="mb-3 flex items-center gap-2">
 <PremiumSkeletonBlock className="h-6 w-20" />
 <PremiumSkeletonBlock className="h-4 w-16" />
 </div>
 <PremiumSkeletonBlock className="mb-3 h-4 w-24" />
 <PremiumSkeletonBlock className="h-10 w-full rounded-lg" />
 </div>
 </PremiumSkeletonCardShell>
 );
}
