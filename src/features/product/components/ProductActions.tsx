import { cn } from "@/shared/lib/utils";
import type { ProductIcon } from "../types/productDetails";

export type ProductActionsProps = {
    icons?: ProductIcon[];
    className?: string;
};

export default function ProductActions({
    icons = [],
    className,
}: ProductActionsProps) {
    if (!icons.length) return null;

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {icons.map((icon) => (
                    <div
                        key={icon.id}
                        className="flex flex-col items-center justify-center gap-1 rounded-lg border border-custom-primary bg-custom-card px-3 py-3 text-center transition-all hover:border-primary-light hover:shadow-sm"
                    >
                        <img
                            src={icon.image}
                            alt={icon.name}
                            className="h-10 w-10 object-contain"
                        />
                        <span className="text-xs font-medium text-custom-primary whitespace-nowrap">
                            {icon.name}
                        </span>
                        {icon.description && (
                            <span className="text-[10px] text-custom-secondary line-clamp-2">
                                {icon.description}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
