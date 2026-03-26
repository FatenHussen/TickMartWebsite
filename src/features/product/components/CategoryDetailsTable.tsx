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
    if (!details || details.length === 0) {
        return null;
    }

    return (
        <div className={cn("w-full", className)}>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-custom-secondary bg-custom-tertiary">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-custom-primary">
                            Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-custom-primary">
                            Value
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {details.map((detail, index) => (
                        <tr
                            key={detail.id}
                            className={cn(
                                "border-b border-custom-secondary",
                                index % 2 === 0
                                    ? "bg-custom-primary"
                                    : "bg-custom-secondary"
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
