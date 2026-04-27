import { useLanguage } from"@/context/LanguageContext";
import { cn } from"@/shared/lib/utils";

const GRADIENT_BORDER = {
 background:
 "linear-gradient(90deg, var(--color-main) 0%, var(--color-api-second) 100%)",
};
const ROW_BORDER_STYLE = {
 borderBottom:"1px solid",
 borderImage:
 "linear-gradient(90deg, var(--color-main) 0%, var(--color-api-second) 100%) 1",
};

type GradientTableProps = {
 title?: string;
 showTitle?: boolean;
 children: React.ReactNode;
 className?: string;
};

export function GradientTable({
 title,
 showTitle = true,
 children,
 className,
}: GradientTableProps) {
 return (
 <div className={className}>
 {showTitle && title && (
 <h2 className="text-lg font-bold text-custom-primary mb-4">{title}</h2>
 )}
 <div
 className="overflow-hidden shadow-[0_10px_30px_-18px_color-mix(in_srgb,var(--color-main)_45%,transparent)]"
 style={{
 ...GRADIENT_BORDER,
 padding:"1px",
 borderRadius:"12px",
 }}
 >
 <div
 className="bg-custom-card overflow-hidden"
 style={{
 borderRadius:"12px",
 backgroundImage:
 "linear-gradient(180deg, color-mix(in_srgb,var(--color-main)_3%,var(--color-bg-card)) 0%, var(--color-bg-card) 35%, color-mix(in_srgb,var(--color-api-second)_4%,var(--color-bg-card)) 100%)",
 }}
 >
 <div className="overflow-x-auto">
 <table className="w-full border-separate border-spacing-0">{children}</table>
 </div>
 </div>
 </div>
 </div>
 );
}

type GradientTableHeaderProps = {
 children: React.ReactNode;
};

export function GradientTableHeader({ children }: GradientTableHeaderProps) {
 return (
 <thead>
 <tr
 style={GRADIENT_BORDER}
 className="shadow-[inset_0_-1px_0_0_color-mix(in_srgb,var(--color-main)_40%,transparent)]"
 >
 {children}
 </tr>
 </thead>
 );
}

type GradientTableHeaderCellProps = {
 children: React.ReactNode;
 align?:"left"|"center"|"right";
 isFirst?: boolean;
 isLast?: boolean;
 className?: string;
};

export function GradientTableHeaderCell({
 children,
 align ="left",
 isFirst = false,
 isLast = false,
 className,
}: GradientTableHeaderCellProps) {
 const { isRTL } = useLanguage();
 const alignClass =
 align ==="center"
 ?"text-center"
 : align ==="right"
 ? isRTL ?"text-left":"text-right"
 : isRTL ?"text-right":"text-left";

 let borderRadius: string | undefined;
 if (isFirst && isLast) {
 borderRadius ="12px";
 } else if (isFirst) {
 borderRadius = isRTL ?"0 1px 1px 0":"1px 0 0 1px";
 } else if (isLast) {
 borderRadius = isRTL ?"1px 0 0 1px":"0 1px 1px 0";
 }

 return (
 <th
 className={cn(
"py-4 px-6 text-[11px] font-bold uppercase tracking-[0.08em] text-[color:var(--color-text)]",
 alignClass,
 className
 )}
 style={borderRadius ? { borderRadius } : undefined}
 >
 {children}
 </th>
 );
}

type GradientTableBodyProps = {
 children: React.ReactNode;
};

export function GradientTableBody({ children }: GradientTableBodyProps) {
 return <tbody>{children}</tbody>;
}

type GradientTableRowProps = {
 children: React.ReactNode;
 isLast?: boolean;
 className?: string;
};

export function GradientTableRow({
 children,
 isLast = false,
 className,
}: GradientTableRowProps) {
 return (
 <tr
 className={cn(
 "relative transition-colors hover:bg-[color-mix(in_srgb,var(--color-main)_6%,transparent)]",
 className
 )}
 style={isLast ? undefined : ROW_BORDER_STYLE}
 >
 {children}
 </tr>
 );
}

/** Table cell with standard padding */
type GradientTableCellProps = {
 children: React.ReactNode;
 align?:"left"|"center"|"right";
 className?: string;
};

export function GradientTableCell({
 children,
 align ="left",
 className,
}: GradientTableCellProps) {
 const { isRTL } = useLanguage();
 const alignClass =
 align ==="center"
 ?"text-center"
 : align ==="right"
 ? isRTL
 ?"text-left"
 :"text-right"
 : isRTL
 ?"text-right"
 :"text-left";
 return (
 <td
 className={cn("py-5 px-6 align-top", alignClass, className)}
 >
 {children}
 </td>
 );
}
