import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import type { CategoryDetail } from "../types/productDetails";

export interface CategoryDetailsTableProps {
    details: CategoryDetail[];
    className?: string;
}

export default function CategoryDetailsTable({
    details,
    className,
}: CategoryDetailsTableProps) {
    const { t } = useTranslation();
    if (!details || details.length === 0) {
        return null;
    }

    return (
        <div
            className={cn(
                "w-full overflow-hidden rounded-xl border",
                "border-[color-mix(in_srgb,var(--color-api-second)_32%,var(--color-border-primary))]",
                className
            )}
        >
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b-2 border-primary/20 bg-[color-mix(in_srgb,var(--color-primary)_9%,var(--color-bg-card))]">
                        <th className="px-4 py-3 text-start text-xs font-semibold text-primary">
                            {t("product.categoryDetailName", "Name")}
                        </th>
                        <th className="px-4 py-3 text-start text-xs font-semibold text-primary">
                            {t("product.categoryDetailValue", "Value")}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {details.map((detail, index) => (
                        <tr
                            key={detail.id}
                            className={cn(
                                "border-b border-[color-mix(in_srgb,var(--color-api-second)_22%,var(--color-border-primary))] last:border-b-0",
                                index % 2 === 0
                                    ? "bg-[color-mix(in_srgb,var(--color-api-second)_4%,var(--color-bg-card))]"
                                    : "bg-custom-primary"
                            )}
                        >
                            <td className="px-4 py-3 text-sm font-medium text-custom-secondary w-1/3">
                                {detail.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-custom-primary">
                                {detail.value}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
