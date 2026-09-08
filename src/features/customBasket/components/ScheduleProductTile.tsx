import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";
import { HiPlus } from "react-icons/hi";
import FormattedPrice from "@/shared/component/FormattedPrice";
import { getCategoryInitials } from "@/shared/lib/getCategoryInitials";
import { cn } from "@/shared/lib/utils";
import { resolveListingCardPrices } from "@/shared/lib/formatApiPrice";
import type { ProductItem } from "@/features/home/types";

type ScheduleProductTileProps = {
    product: ProductItem;
    onAdd: () => void;
};

export default function ScheduleProductTile({
    product,
    onAdd,
}: ScheduleProductTileProps) {
    const { t } = useTranslation();
    const { currency } = useCurrency();
    const listing = resolveListingCardPrices(
        product,
        t("product.youSaved", "You saved"),
        currency,
    );
    const price = listing.price;
    const original = listing.originalPrice ?? null;

    return (
        <button
            type="button"
            onClick={onAdd}
            aria-label={`${t("customBasket.addToBasket")}: ${product.name}`}
            className={cn(
                "group flex flex-col text-start transition-transform duration-300",
                "hover:-translate-y-0.5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AED1] focus-visible:ring-offset-2",
                "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
            )}
        >
            <div className="relative aspect-square overflow-hidden rounded-[1.15rem] bg-[#F3F4F6] dark:bg-zinc-800">
                {product.image ? (
                    <img
                        src={product.image}
                        alt=""
                        className="h-full w-full object-contain p-4"
                    />
                ) : (
                    <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-zinc-400 dark:text-zinc-500">
                        {getCategoryInitials(product.name) || "•"}
                    </span>
                )}
                <span
                    className={cn(
                        "absolute bottom-2.5 end-2.5 grid h-9 w-9 place-items-center rounded-full",
                        "bg-zinc-900 text-white shadow-[0_8px_18px_-10px_rgba(15,23,42,0.55)]",
                        "transition-colors group-hover:bg-primary",
                        "dark:bg-white dark:text-zinc-900 dark:group-hover:bg-primary dark:group-hover:text-white",
                    )}
                >
                    <HiPlus className="h-4 w-4" />
                </span>
            </div>

            <h3 className="mt-2.5 line-clamp-2 text-[13px] font-medium leading-snug text-zinc-800 dark:text-white sm:text-sm">
                {product.name}
            </h3>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
                <FormattedPrice
                    value={price}
                    prominent
                    className="text-[15px] font-semibold text-zinc-900 dark:text-white"
                />
                {original ? (
                    <FormattedPrice
                        value={original}
                        strikethrough
                        className="text-xs text-zinc-400"
                    />
                ) : null}
            </div>
        </button>
    );
}

export function ScheduleProductTileSkeleton() {
    return (
        <div>
            <div className="aspect-square animate-pulse rounded-[1.15rem] bg-zinc-100 dark:bg-zinc-800" />
            <div className="mt-2.5 h-3.5 w-4/5 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="mt-2 h-3.5 w-16 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
    );
}
