import { cn } from"@/shared/lib/utils";
import {
 PremiumSkeletonBlock,
 PremiumSkeletonCardShell,
} from"@/shared/component/loading";

type RecipeCardSkeletonProps = {
 className?: string;
};

export default function RecipeCardSkeleton({
 className,
}: RecipeCardSkeletonProps) {
 return (
 <PremiumSkeletonCardShell className={cn(className)}>
 <PremiumSkeletonBlock
 tone="inset"
 className="aspect-[4/3] w-full rounded-none border-x-0 border-t-0"
 />

 <div className="space-y-3 p-4">
 <PremiumSkeletonBlock className="h-5 w-3/4" />
 <div className="mb-3 flex items-center justify-between gap-2">
 <PremiumSkeletonBlock className="h-4 w-16" />
 <PremiumSkeletonBlock className="h-4 w-20" />
 </div>
 <div className="mb-3 flex items-center gap-2">
 <PremiumSkeletonBlock className="h-6 w-20" />
 <PremiumSkeletonBlock className="h-4 w-16" />
 </div>
 <PremiumSkeletonBlock className="h-10 w-full rounded-lg" />
 </div>
 </PremiumSkeletonCardShell>
 );
}
