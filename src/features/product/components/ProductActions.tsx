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

/** Short text for hover tooltip — prefer brief `description`, else `name`. */
export function iconShortDescription(icon: ProductIcon): string | undefined {
    const name = icon.name?.trim() || undefined;
    const desc = icon.description?.trim() || undefined;
    if (desc && desc.length <= 80) return desc;
    return name;
}

/** Full text for the click popup. */
export function iconFullDescription(icon: ProductIcon): string | undefined {
    return (
        icon.full_description?.trim() ||
        icon.description?.trim() ||
        icon.name?.trim() ||
        undefined
    );
}

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
                    const shortDesc = iconShortDescription(icon);
                    const fullDesc = iconFullDescription(icon);
                    const sharedClassName =
                        "group relative flex flex-col items-center justify-center gap-1.5 rounded-xl bg-transparent px-2 py-2 text-center transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04]";
                    const isClickable = Boolean(onIconClick && fullDesc);
                    const content = (
                        <>
                            <img
                                key={src}
                                src={src}
                                alt={icon.name}
                                className="h-16 w-16 object-contain"
                            />
                            <span className="text-xs font-medium text-custom-primary whitespace-nowrap">
                                {icon.name}
                            </span>
                            {shortDesc ? (
                                <span
                                    role="tooltip"
                                    className={cn(
                                        "pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[14rem] -translate-x-1/2 rounded-lg px-3 py-1.5 text-xs font-medium leading-snug shadow-lg",
                                        "bg-[var(--color-text-primary)] text-[var(--color-bg-card)]",
                                        "opacity-0 transition-opacity duration-150 delay-75",
                                        "group-hover:opacity-100 group-focus-visible:opacity-100",
                                    )}
                                >
                                    {shortDesc}
                                </span>
                            ) : null}
                        </>
                    );
                    return isClickable ? (
                        <button
                            key={src}
                            type="button"
                            aria-label={
                                shortDesc
                                    ? `${icon.name}: ${shortDesc}`
                                    : icon.name
                            }
                            onClick={() => onIconClick?.(icon)}
                            className={cn(sharedClassName, "cursor-pointer")}
                        >
                            {content}
                        </button>
                    ) : (
                        <div key={src} className={sharedClassName}>
                            {content}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
