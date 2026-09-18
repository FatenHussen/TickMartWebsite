import { cn } from "@/shared/lib/utils";
import {
    productIconImageUrl,
    visibleProductIcons,
} from "../lib/productIcons";
import type { ProductIcon } from "../types/productDetails";

export type ProductActionsProps = {
    icons?: ProductIcon[] | null;
    /** Called when icon is clicked. Receives the icon. Hide description on card when provided. */
    onIconClick?: (icon: ProductIcon) => void;
    className?: string;
};

export default function ProductActions({
    icons,
    onIconClick,
    className,
}: ProductActionsProps) {
    const items = visibleProductIcons(icons);
    if (!items.length) return null;

    return (
        <div className={cn("flex flex-col gap-4 ", className)}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {items.map((icon) => {
                    const src = productIconImageUrl(icon);
                    if (!src) return null;
                    const sharedClassName =
                        "flex flex-col items-center justify-center gap-1.5 rounded-xl bg-transparent px-2 py-2 text-center transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04]";
                    const isClickable = onIconClick && icon.description;
                    const content = (
                        <>
                            <img
                                src={src}
                                alt={icon.name}
                                className="h-10 w-10 object-contain"
                            />
                            <span className="text-xs font-medium text-custom-primary whitespace-nowrap">
                                {icon.name}
                            </span>
                            {!isClickable && icon.description && (
                                <span className="text-[10px] text-custom-secondary line-clamp-2">
                                    {icon.description}
                                </span>
                            )}
                        </>
                    );
                    return isClickable ? (
                        <button
                            key={icon.id}
                            type="button"
                            onClick={() => onIconClick(icon)}
                            className={cn(sharedClassName, "cursor-pointer")}
                        >
                            {content}
                        </button>
                    ) : (
                        <div key={icon.id} className={sharedClassName}>
                            {content}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
