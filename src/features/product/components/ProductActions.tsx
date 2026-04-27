import { cn } from "@/shared/lib/utils";
import type { ProductIcon } from "../types/productDetails";

export type ProductActionsProps = {
    icons?: ProductIcon[];
    /** Called when icon is clicked. Receives the icon. Hide description on card when provided. */
    onIconClick?: (icon: ProductIcon) => void;
    className?: string;
};

export default function ProductActions({
    icons = [],
    onIconClick,
    className,
}: ProductActionsProps) {
    if (!icons.length) return null;

    return (
        <div className={cn("flex flex-col gap-4 ", className)}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {icons.map((icon) => {
                    const sharedClassName =
                        "flex flex-col items-center justify-center gap-1 rounded-lg border border-[color-mix(in_srgb,var(--color-api-second)_32%,var(--color-border-primary))] bg-custom-card px-3 py-3 text-center transition-all hover:border-primary hover:bg-[color-mix(in_srgb,var(--color-api-second)_6%,var(--color-bg-card))] hover:shadow-sm";
                    const isClickable = onIconClick && icon.description;
                    const content = (
                        <>
                            <img
                                src={icon.image}
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
