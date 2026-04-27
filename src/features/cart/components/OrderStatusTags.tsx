import { HiCheck, HiX } from "react-icons/hi";
import { HiTruck, HiClock } from "react-icons/hi2";
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/shared/lib/utils";
import type { OrderStatus } from "../types";

type StatusTag = {
    orderNumber: string;
    status: OrderStatus;
};

type OrderStatusTagsProps = {
    tags: StatusTag[];
    onTagClick?: (orderNumber: string) => void;
};

type TagConfig = {
    icon: ComponentType<SVGProps<SVGSVGElement>> | null;
    color: string;
};

const getTagConfig = (status: OrderStatus): TagConfig => {
    switch (status) {
        case "delivered":
            return { icon: HiCheck, color: "var(--color-success)" };
        case "out_for_delivery":
            return { icon: HiTruck, color: "var(--color-accent-primary)" };
        case "preparing":
            return { icon: HiClock, color: "var(--color-ui-amber-400)" };
        case "cancelled":
            return { icon: HiX, color: "var(--color-error)" };
        case "pending":
        default:
            return { icon: HiClock, color: "var(--color-text-tertiary)" };
    }
};

export default function OrderStatusTags({
    tags,
    onTagClick,
}: OrderStatusTagsProps) {
    if (tags.length === 0) return null;

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {tags.map((tag, index) => {
                const { icon: Icon, color } = getTagConfig(tag.status);

                return (
                    <button
                        key={`${tag.orderNumber}-${index}`}
                        type="button"
                        onClick={() => onTagClick?.(tag.orderNumber)}
                        className={cn(
                            "group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
                            "text-xs font-medium",
                            "border transition-all duration-200",
                            "hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus-visible:ring-2",
                        )}
                        style={{
                            backgroundColor: `color-mix(in srgb, ${color} 10%, var(--color-bg-card))`,
                            borderColor: `color-mix(in srgb, ${color} 28%, transparent)`,
                            color,
                        }}
                    >
                        {Icon && <Icon className="w-3.5 h-3.5" />}
                        <span className="text-custom-primary">#{tag.orderNumber}</span>
                    </button>
                );
            })}
        </div>
    );
}
