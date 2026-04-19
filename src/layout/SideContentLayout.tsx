import { cn } from "@/shared/lib/utils";
import React, { useEffect, useState } from "react";

type Breakpoint = "md" | "lg";

type SideContentLayoutProps = {
    sidebar: React.ReactNode;
    children: React.ReactNode;

    sidebarPosition?: "left" | "right";

    sidebarClassName?: string;

    contentClassName?: string;

    containerClassName?: string;

    gapClassName?: string;

    header?: React.ReactNode;

    footer?: React.ReactNode;

    /** Custom column widths (e.g. "1fr 1fr", or "[320px_1fr]" for fixed sidebar) */
    columnTemplate?: string;

    /** When sidebar and main sit side-by-side (default `lg` = 1024px) */
    twoColumnFrom?: Breakpoint;

    /** Keep sidebar visible while scrolling the main column (desktop two-column layout only) */
    stickySidebar?: boolean;

    /** Offset from top when sticky (e.g. `top-20` if using a fixed navbar) */
    stickyTopClassName?: string;
};

export default function SideContentLayout({
    sidebar,
    children,
    sidebarPosition = "left",
    sidebarClassName,
    contentClassName,
    containerClassName,
    gapClassName,
    header,
    footer,
    columnTemplate,
    twoColumnFrom = "lg",
    stickySidebar = false,
    stickyTopClassName = "top-4",
}: SideContentLayoutProps) {
    const isLeft = sidebarPosition === "left";
    const bp = twoColumnFrom;
    const breakpointPx = twoColumnFrom === "md" ? 768 : 1024;

    const [isWideEnoughForTwoColumns, setIsWideEnoughForTwoColumns] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsWideEnoughForTwoColumns(window.innerWidth >= breakpointPx);
        };
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, [breakpointPx]);

    const getGridTemplate = () => {
        if (columnTemplate) {
            if (/^\d+$/.test(columnTemplate.trim())) {
                const numCols = parseInt(columnTemplate.trim(), 10);
                return Array(numCols).fill("1fr").join("");
            }
            return columnTemplate;
        }
        return isLeft ? "minmax(0,320px) 1fr" : "1fr minmax(0,320px)";
    };

    const gridTemplate = getGridTemplate();

    const orderSidebarRight =
        !isLeft && (bp === "md" ? "md:order-2" : "lg:order-2");
    const orderContentRight =
        !isLeft && (bp === "md" ? "md:order-1" : "lg:order-1");

    const stickyAside =
        stickySidebar &&
        (bp === "md"
            ? cn("md:sticky md:z-10 md:self-start", stickyTopClassName)
            : cn("lg:sticky lg:z-10 lg:self-start", stickyTopClassName));

    return (
        <div className={cn("w-full min-w-0", containerClassName)}>
            {header && <div className="mb-4">{header}</div>}

            {columnTemplate ? (
                <div
                    className={cn("grid w-full min-w-0 grid-cols-1 items-start", gapClassName ?? "gap-6")}
                    style={{
                        gridTemplateColumns: isWideEnoughForTwoColumns ? gridTemplate : "1fr",
                    }}
                >
                    <div className={cn("min-w-0", orderSidebarRight, stickyAside)}>
                        <div className={cn("min-w-0", sidebarClassName)}>{sidebar}</div>
                    </div>

                    <div className={cn("min-w-0", orderContentRight)}>
                        <div className={cn("min-w-0", contentClassName)}>{children}</div>
                    </div>
                </div>
            ) : (
                <div
                    className={cn(
                        "flex w-full min-w-0 flex-col",
                        isLeft
                            ? bp === "md"
                                ? "md:flex-row md:items-start"
                                : "lg:flex-row lg:items-start"
                            : bp === "md"
                              ? "md:flex-row-reverse md:items-start"
                              : "lg:flex-row-reverse lg:items-start",
                        gapClassName ?? "gap-6"
                    )}
                >
                    <div
                        className={cn(
                            "min-w-0",
                            bp === "md"
                                ? "w-full md:w-[320px] md:max-w-[320px] md:shrink-0"
                                : "w-full lg:w-[320px] lg:max-w-[320px] lg:shrink-0",
                            stickyAside
                        )}
                    >
                        <div className={cn("min-w-0", sidebarClassName)}>{sidebar}</div>
                    </div>

                    <div className="min-w-0 min-h-0 flex-1">
                        <div className={cn("min-w-0", contentClassName)}>{children}</div>
                    </div>
                </div>
            )}

            {footer && <div className="mt-8">{footer}</div>}
        </div>
    );
}
