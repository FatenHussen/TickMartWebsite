import React from"react";
import SideContentLayout from"@/layout/SideContentLayout";
import { cn } from"@/shared/lib/utils";

type StoreLayoutProps = {
 sidebar: React.ReactNode;
 children: React.ReactNode;
 sidebarPosition?:"left"|"right";
 sidebarClassName?: string;
 contentClassName?: string;
 containerClassName?: string;
 gapClassName?: string;
 header?: React.ReactNode;
 footer?: React.ReactNode;
};

export default function StoreLayout({
 sidebar,
 children,
 sidebarPosition ="left",
 sidebarClassName,
 contentClassName,
 containerClassName,
 gapClassName,
 header,
 footer,
}: StoreLayoutProps) {
 const actualSidebarPosition = sidebarPosition;

 return (
 <div className="min-h-screen py-4 sm:py-6 lg:py-8">
 <div className="page-container relative">
 <SideContentLayout
 sidebar={sidebar}
 sidebarPosition={actualSidebarPosition}
 stickySidebar
 stickyTopClassName="top-[calc(var(--app-navbar-offset)+0.5rem)]"
 sidebarClassName={cn(
 "lg:max-h-[calc(100dvh-var(--app-navbar-offset)-1.5rem)] lg:overflow-y-auto scrollbar-custom",
 sidebarClassName
 )}
 contentClassName={cn(contentClassName)}
 containerClassName={cn("", containerClassName)}
 gapClassName={gapClassName}
 header={header}
 footer={footer}
 >
 {children}
 </SideContentLayout>
 </div>
 </div>
 );
}
