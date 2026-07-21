import { cn } from "@/shared/lib/utils";
import {
    PremiumSkeletonBlock,
    PremiumSkeletonCardShell,
} from "@/shared/component/loading";

type BrandCardSkeletonProps = {
    className?: string;
};

export default function BrandCardSkeleton({
    className,
}: BrandCardSkeletonProps) {
    return (
        <PremiumSkeletonCardShell
            className={cn("rounded-3xl", className)}
        >
            <PremiumSkeletonBlock
                tone="inset"
                className="h-36 w-full rounded-none border-x-0 border-t-0 sm:h-40"
            />

            <div className="flex flex-col items-center px-4 pb-4 pt-3">
                <PremiumSkeletonBlock className="mb-3 h-5 w-28" />
                <PremiumSkeletonBlock className="mb-3 h-4 w-20 rounded-full" />
                <PremiumSkeletonBlock className="mt-2 h-10 w-full rounded-xl" />
            </div>
        </PremiumSkeletonCardShell>
    );
}
