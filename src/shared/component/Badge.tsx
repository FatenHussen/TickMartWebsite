import { cn } from "@/shared/lib/utils";
import type { CSSProperties } from "react";

export type BadgeProps = {
    label: string;
    variant?: "default" | "blue" | "yellow" | "green" | "red" | "gray";
    className?: string;
    style?: CSSProperties;
    imageSrc?: string;
    type?: "image" | "text" | string;
    imageAlt?: string;
    imageClassName?: string;
};

const variantStyles = {
    default: "bg-blue-500 text-white",
    blue: "bg-blue-500 text-white",
    yellow: "bg-yellow-400 text-black",
    green: "bg-green-500 text-white",
    red: "bg-red-500 text-white",
    gray: "bg-custom-hover text-white",
};

export default function Badge({
    label,
    variant = "default",
    className,
    style,
    imageSrc,
    type,
    imageAlt,
    imageClassName,
}: BadgeProps) {
    const normalizedType = type?.toLowerCase();
    const shouldRenderImage = Boolean(imageSrc && normalizedType !== "text");

    if (shouldRenderImage) {
        return (
            <img
                src={imageSrc}
                alt={imageAlt ?? label}
                className={cn(
                    "h-6 w-auto max-w-[96px] rounded-lg object-contain",
                    imageClassName,
                    className,
                )}
                style={style}
            />
        );
    }

    return (
        <span
            className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-semibold",
                className || (!style && variantStyles[variant]),
            )}
            style={style}
        >
            {label}
        </span>
    );
}
