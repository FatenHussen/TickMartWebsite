import type { TFunction } from "i18next";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

type TablePaginationProps = {
    t: TFunction;
    currentPage: number;
    lastPage: number;
    onPrev: () => void;
    onNext: () => void;
};

export function TablePagination({ t, currentPage, lastPage, onPrev, onNext }: TablePaginationProps) {
    if (lastPage <= 1) return null;

    return (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={onPrev}
                className={cn(
                    "inline-flex min-w-[2.75rem] items-center justify-center rounded-full border-0 px-3 py-2",
                    "bg-custom-card shadow-sm shadow-black/[0.05] transition-all hover:shadow-md dark:shadow-black/30",
                )}
                aria-label={t("common.previous") ?? "Previous"}
            >
                <HiChevronLeft className="h-5 w-5" />
            </Button>
            <span
                className={cn(
                    "inline-flex min-w-[5.5rem] items-center justify-center rounded-full px-5 py-2.5",
                    "text-sm font-semibold tabular-nums text-custom-primary",
                    "bg-custom-muted/60 shadow-inner",
                )}
            >
                {currentPage} / {lastPage}
            </span>
            <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= lastPage}
                onClick={onNext}
                className={cn(
                    "inline-flex min-w-[2.75rem] items-center justify-center rounded-full border-0 px-3 py-2",
                    "bg-custom-card shadow-sm shadow-black/[0.05] transition-all hover:shadow-md dark:shadow-black/30",
                )}
                aria-label={t("common.next") ?? "Next"}
            >
                <HiChevronRight className="h-5 w-5" />
            </Button>
        </div>
    );
}
