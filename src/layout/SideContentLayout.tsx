import { cn } from"@/shared/lib/utils";
import React, { useEffect, useState } from"react";

type SideContentLayoutProps = {
 sidebar: React.ReactNode;
 children: React.ReactNode;

 sidebarPosition?:"left"|"right";

 sidebarClassName?: string;

 contentClassName?: string;

 containerClassName?: string;

 gapClassName?: string;

 header?: React.ReactNode;

 footer?: React.ReactNode;

 // Custom column widths (e.g.,"1fr 1fr"for 50-50, or"[320px_1fr]"for fixed sidebar)
 columnTemplate?: string;
};

export default function SideContentLayout({
 sidebar,
 children,
 sidebarPosition ="left",
 sidebarClassName,
 contentClassName,
 containerClassName,
 gapClassName,
 header,
 footer,
 columnTemplate,
}: SideContentLayoutProps) {
 const isLeft = sidebarPosition ==="left";

 const [isLargeScreen, setIsLargeScreen] = useState(false);

 useEffect(() => {
 const checkScreenSize = () => {
 setIsLargeScreen(window.innerWidth >= 1024);
 };
 checkScreenSize();
 window.addEventListener("resize", checkScreenSize);
 return () => window.removeEventListener("resize", checkScreenSize);
 }, []);

 // Determine grid template for inline style
 const getGridTemplate = () => {
 if (columnTemplate) {
 // If it's just a number (e.g.,"2"), convert to equal columns (1fr 1fr, etc.)
 if (/^\d+$/.test(columnTemplate.trim())) {
 const numCols = parseInt(columnTemplate.trim(), 10);
 return Array(numCols).fill("1fr").join("");
 }
 // Otherwise, treat as custom template (e.g.,"1fr 1fr")
 return columnTemplate;
 }
 // Default: sidebar keeps its visual position regardless of RTL/LTR
 return isLeft ?"320px 1fr":"1fr 320px";
 };

 const gridTemplate = getGridTemplate();

 return (
 <div className={cn("w-full", containerClassName)}>
 {header && <div className="mb-4">{header}</div>}

 <div
 className={cn(
"grid items-start",
 !columnTemplate &&
 (isLeft
 ?"grid-cols-1 lg:grid-cols-[320px_1fr]"
 :"grid-cols-1 lg:grid-cols-[1fr_320px]"),
 gapClassName ??"gap-6",
 )}
 style={
 columnTemplate
 ? {
 gridTemplateColumns: isLargeScreen ? gridTemplate :"1fr",
 }
 : undefined
 }
 >
 {/* Sidebar */}
 <div className={isLeft ?"":"lg:order-2"}>
 <div className={cn("", sidebarClassName)}>
 {sidebar}
 </div>
 </div>

 {/* Main Content */}
 <div className={isLeft ?"":"lg:order-1"}>
 <div className={cn("", contentClassName)}>
 {children}
 </div>
 </div>
 </div>

 {footer && <div className="mt-8">{footer}</div>}
 </div>
 );
}
