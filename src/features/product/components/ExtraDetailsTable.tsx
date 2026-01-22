import { cn } from "@/shared/lib/utils";
import type { ExtraDetail } from "../types/productDetails";

export interface ExtraDetailsTableProps {
  details: ExtraDetail[];
  className?: string;
}

export default function ExtraDetailsTable({
  details,
  className,
}: ExtraDetailsTableProps) {
  if (!details || details.length === 0) {
    return null;
  }

  return (
    <div className={cn("w-full", className)}>
      <table className="w-full border-collapse">
        <tbody>
          {details.map((detail, index) => (
            <tr
              key={detail.id}
              className={cn(
                "border-b border-custom-secondary",
                index % 2 === 0 ? "bg-custom-primary" : "bg-custom-secondary"
              )}
            >
              <td className="px-4 py-3 text-sm font-medium text-custom-secondary w-1/3">
                {detail.key}
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
