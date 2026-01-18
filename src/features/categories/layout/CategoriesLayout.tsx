import React from "react";
import SideContentLayout from "@/layout/SideContentLayout";
import { cn } from "@/shared/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

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
  const { isRTL } = useLanguage();
  // Keep original position, let SideContentLayout handle RTL logic
  const actualSidebarPosition = sidebarPosition;

  return (
    <div className="min-h-screen py-8">
      <div className="page-container relative">
        <SideContentLayout
          sidebar={sidebar}
          sidebarPosition={actualSidebarPosition}
          sidebarClassName={cn(
            "lg:fixed lg:top-8 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:z-10 lg:w-[320px] scrollbar-custom",
            "h-auto lg:max-h-[calc(100vh-4rem)]",
            isRTL
              ? "lg:pr-2 lg:pl-0 lg:right-[max(1rem,calc((100vw-1280px)/2))]"
              : "lg:pl-2 lg:pr-0 lg:left-[max(1rem,calc((100vw-1280px)/2))]",
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
