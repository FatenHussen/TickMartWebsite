import { cn } from"@/shared/lib/utils";
import {
 PremiumSkeletonBlock,
 PremiumSkeletonCardShell,
} from"@/shared/component/loading";

type BrandCardSkeletonProps = {
 className?: string;
};

export default function BrandCardSkeleton({
 className,
}: BrandCardSkeletonProps) {
 return (
 <PremiumSkeletonCardShell
 className={cn(
 "flex flex-col items-center rounded-xl p-6 dark:bg-[rgba(16,17,20,0.42)]",
 className,
 )}
 >
 <PremiumSkeletonBlock
 tone="lightCard"
 shimmer="light"
 className="mb-4 h-24 w-24 rounded-full"
 />
 <PremiumSkeletonBlock
 tone="lightCard"
 shimmer="light"
 className="mb-2 h-4 w-24"
 />
 <PremiumSkeletonBlock
 tone="lightCard"
 shimmer="light"
 className="h-3 w-16"
 />
 </PremiumSkeletonCardShell>
 );
}
