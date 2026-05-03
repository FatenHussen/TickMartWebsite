import React from "react";
import clsx from "clsx";

type Props = {
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
    /** When false, children span full width (e.g. API sections manage their own page-container per block). */
    contain?: boolean;
    as?: React.ElementType;
};

export default function FullBleedSection({
    children,
    className,
    containerClassName,
    contain = true,
    as: Tag = "section",
}: Props) {
    return (
        <Tag className={clsx("w-full", className, "py-4")}>
            {contain ? (
                <div className={clsx("page-container", containerClassName)}>
                    {children}
                </div>
            ) : (
                children
            )}
        </Tag>
    );
}
