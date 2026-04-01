import { cn } from "@/shared/lib/utils";

type OrderFlowHeaderProps = {
    className?: string;
};

export default function OrderFlowHeader({
    className,
}: OrderFlowHeaderProps) {
    return (
        <div className={cn("mb-8 w-full overflow-hidden ", className)}>
            <img
                src="/images/shared/headerOrder.png"
                alt="Order flow header"
                className="block h-[180px] w-full object-cover sm:h-[220px]"
            />
        </div>
    );
}
