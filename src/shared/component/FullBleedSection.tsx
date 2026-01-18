import React from "react";
import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string; // full width wrapper (background/padding)
  containerClassName?: string; // inner container tweaks
  as?: any;
};

export default function FullBleedSection({
  children,
  className,
  containerClassName,
  as: Tag = "section",
}: Props) {
  return (
    <Tag className={clsx("w-full", className, "py-4")}>
      <div className={clsx("page-container", containerClassName)}>
        {children}
      </div>
    </Tag>
  );
}
