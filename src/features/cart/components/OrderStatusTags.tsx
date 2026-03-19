import { HiCheck, HiX } from"react-icons/hi";
import { cn } from"@/shared/lib/utils";
import type { OrderStatus } from"../types";

type StatusTag = {
 orderNumber: string;
 status: OrderStatus;
};

type OrderStatusTagsProps = {
 tags: StatusTag[];
 onTagClick?: (orderNumber: string) => void;
};

export default function OrderStatusTags({
 tags,
 onTagClick,
}: OrderStatusTagsProps) {
 const getTagConfig = (status: OrderStatus) => {
 switch (status) {
 case"delivered":
 return {
 bgColor:"",
 textColor:"",
 icon: HiCheck,
 style: {
 backgroundColor:"rgba(22, 163, 74, 0.1)",
 color:"var(--color-green)",
 },
 };
 case"out_for_delivery":
 return {
 bgColor:"",
 textColor:"",
 icon: null,
 style: {
 backgroundColor:"rgba(59, 130, 246, 0.1)",
 color:"var(--color-accent-primary)",
 },
 };
 case"preparing":
 return {
 bgColor:"",
 textColor:"",
 icon: null,
 style: {
 backgroundColor:"rgba(234, 179, 8, 0.1)",
 color:"#ca8a04",
 },
 };
 case"cancelled":
 return {
 bgColor:"",
 textColor:"",
 icon: HiX,
 style: {
 backgroundColor:"rgba(239, 68, 68, 0.1)",
 color:"#dc2626",
 },
 };
 default:
 return {
 bgColor:"bg-custom-tertiary",
 textColor:"text-custom-secondary",
 icon: null,
 style: undefined,
 };
 }
 };

 return (
 <div className="flex items-center gap-3 flex-wrap">
 {tags.map((tag, index) => {
 const config = getTagConfig(tag.status);
 const Icon = config.icon;

 return (
 <button
 key={index}
 type="button"
 onClick={() => onTagClick?.(tag.orderNumber)}
 className={cn(
"flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors hover:opacity-80",
 config.bgColor,
 config.textColor
 )}
 style={config.style}
 >
 {Icon && <Icon className="w-4 h-4"/>}
 <span>#{tag.orderNumber}</span>
 </button>
 );
 })}
 </div>
 );
}

