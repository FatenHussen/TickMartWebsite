import { useTranslation } from"react-i18next";
import { cn } from"@/shared/lib/utils";
import type { ProductExtra } from"../types/productDetails";

export interface ExtrasCheckboxTableProps {
 extras: ProductExtra[];
 selectedIds: number[];
 onToggle: (id: number) => void;
 className?: string;
}

export default function ExtrasCheckboxTable({
 extras,
 selectedIds,
 onToggle,
 className,
}: ExtrasCheckboxTableProps) {
 const { t } = useTranslation();

 if (!extras || extras.length === 0) return null;

 return (
 <div className={cn("w-full min-w-0", className)}>
 <div className="overflow-x-auto rounded-lg border border-custom-primary">
 <table className="w-full min-w-[280px] border-collapse text-sm">
 <thead>
 <tr className="bg-custom-light">
 <th className="w-10 px-2 py-2.5" aria-hidden>
 <span className="sr-only">{t("product.check", "Select")}</span>
 </th>
 <th className="px-4 py-2.5 text-left font-semibold text-text-primary">
 {t("product.extras","Extras")}
 </th>
 <th className="px-4 py-2.5 text-right font-semibold text-text-primary w-24">
 {t("product.price","Price")}
 </th>
 </tr>
 </thead>
 <tbody>
 {extras.map((extra) => {
 const isSelected = selectedIds.includes(extra.id);
 return (
 <tr
 key={extra.id}
 className="border-t border-custom-primary hover:bg-custom-light cursor-pointer"
 onClick={() => onToggle(extra.id)}
 >
 <td className="w-10 px-2 py-3">
 <input
 type="checkbox"
 checked={isSelected}
 onChange={() => onToggle(extra.id)}
 onClick={(e) => e.stopPropagation()}
 aria-label={extra.name}
 className="h-4 w-4 rounded border-custom-secondary text-primary-light accent-primary-light cursor-pointer"
 />
 </td>
 <td className="px-4 py-3 text-custom-primary">{extra.name}</td>
 <td className="px-4 py-3 text-right text-custom-primary">
 {typeof extra.price ==="number"
 ? extra.price.toFixed(3)
 : extra.price}
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>
 );
}
