import { PremiumSkeletonBlock } from "@/shared/component/loading";

export default function ScheduleCatalogSkeleton() {
    return (
        <div className="flex h-full flex-col rounded-[1.85rem] border border-stone-200 bg-white p-5 dark:border-white/12 dark:bg-zinc-900 sm:p-6">
            <PremiumSkeletonBlock className="h-14 w-16" />
            <PremiumSkeletonBlock className="mt-5 h-5 w-2/3" />
            <PremiumSkeletonBlock className="mt-2 h-3.5 w-24" />
            <PremiumSkeletonBlock className="mt-auto h-10 w-full rounded-full" />
        </div>
    );
}
