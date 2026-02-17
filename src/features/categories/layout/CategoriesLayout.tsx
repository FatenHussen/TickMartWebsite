import React from "react";
import SideContentLayout from "@/layout/SideContentLayout";
import { cn } from "@/shared/lib/utils";
type CategoriesLayoutProps = {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  sidebarPosition?: "left" | "right";
  sidebarClassName?: string;
  contentClassName?: string;
  containerClassName?: string;
  gapClassName?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
};

export default function CategoriesLayout({
  sidebar,
  children,
  sidebarPosition = "left",
  sidebarClassName,
  contentClassName,
  containerClassName,
  gapClassName,
  header,
  footer,
}: CategoriesLayoutProps) {
  // Keep original position, let SideContentLayout handle RTL logic
  const actualSidebarPosition = sidebarPosition;

  return (
    <div className="min-h-screen py-8">
      <div className="page-container relative">
        <SideContentLayout
          sidebar={sidebar}
          sidebarPosition={actualSidebarPosition}
          sidebarClassName={cn(
            "lg:w-[320px] scrollbar-custom h-auto",
            sidebarClassName,
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
