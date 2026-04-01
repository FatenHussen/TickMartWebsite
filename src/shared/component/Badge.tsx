import { cn } from"@/shared/lib/utils";

export type BadgeProps = {
 label: string;
 variant?:"default"|"blue"|"yellow"|"green"|"red"|"gray";
 className?: string;
 imageSrc?: string;
 type?: "image" | "text" | string;
 imageAlt?: string;
 imageClassName?: string;
};

const variantStyles = {
 default:"bg-blue-500 text-white",
 blue:"bg-blue-500 text-white",
 yellow:"bg-yellow-400 text-black",
 green:"bg-green-500 text-white",
 red:"bg-red-500 text-white",
 gray:"bg-custom-hover text-white",
};

export default function Badge({
 label,
 variant ="default",
 className,
 imageSrc,
 type,
 imageAlt,
 imageClassName,
}: BadgeProps) {
 const shouldRenderImage = Boolean(imageSrc && (type === "image" || !type));

 if (shouldRenderImage) {
 return (
 <img
 src={imageSrc}
 alt={imageAlt ?? label}
 className={cn(
 "h-6 w-auto max-w-[96px] rounded-lg object-contain",
 imageClassName,
 className
 )}
 />
 );
 }

 return (
 <span
 className={cn(
"rounded-lg px-2.5 py-1 text-xs font-semibold",
 className || variantStyles[variant]
 )}
 >
 {label}
 </span>
 );
}
