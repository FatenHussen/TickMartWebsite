import { HiCheck, HiTruck, HiCube } from "react-icons/hi";
import { HiClock } from "react-icons/hi2";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import type { OrderStatusStep } from "../types";

type OrderStatusTimelineProps = {
    currentStatus: OrderStatusStep;
};

type StepDef = {
    key: OrderStatusStep;
    labelKey: string;
    descriptionKey: string;
    fallbackLabel: string;
    fallbackDescription: string;
};

const steps: StepDef[] = [
    {
        key: "pending",
        labelKey: "orders.timeline.pending.label",
        descriptionKey: "orders.timeline.pending.description",
        fallbackLabel: "Pending",
        fallbackDescription: "Your order was received.",
    },
    {
        key: "preparing",
        labelKey: "orders.timeline.preparing.label",
        descriptionKey: "orders.timeline.preparing.description",
        fallbackLabel: "Preparing",
        fallbackDescription: "Store is preparing your order.",
    },
    {
        key: "out_for_delivery",
        labelKey: "orders.timeline.out_for_delivery.label",
        descriptionKey: "orders.timeline.out_for_delivery.description",
        fallbackLabel: "Out for Delivery",
        fallbackDescription: "Driver is on the way.",
    },
    {
        key: "delivered",
        labelKey: "orders.timeline.delivered.label",
        descriptionKey: "orders.timeline.delivered.description",
        fallbackLabel: "Delivered",
        fallbackDescription: "Order delivered.",
    },
];

type StepStatus = "completed" | "active" | "upcoming";

const getStepIcon = (stepKey: OrderStatusStep) => {
    switch (stepKey) {
        case "pending":
            return HiClock;
        case "preparing":
            return HiCube;
        case "out_for_delivery":
            return HiTruck;
        case "delivered":
            return HiCheck;
    }
};

export default function OrderStatusTimeline({
    currentStatus,
}: OrderStatusTimelineProps) {
    const { t } = useTranslation();
    const currentIndex = steps.findIndex((s) => s.key === currentStatus);
    const progressPct =
        currentIndex <= 0
            ? 0
            : (currentIndex / (steps.length - 1)) * 100;

    const getStepStatus = (idx: number): StepStatus => {
        if (idx < currentIndex) return "completed";
        if (idx === currentIndex) return "active";
        return "upcoming";
    };

    return (
        <div className="bg-custom-card rounded-2xl border border-custom-primary shadow-sm p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-custom-primary">
                    {t("orders.statusTimeline", "Order Status")}
                </h3>
                <span className="text-xs font-medium text-custom-secondary">
                    {Math.max(currentIndex, 0) + 1} / {steps.length}
                </span>
            </div>

            <div className="relative">
                {/* Background track */}
                <div
                    className="absolute top-5 h-1 rounded-full bg-custom-tertiary"
                    style={{ insetInlineStart: "1.25rem", insetInlineEnd: "1.25rem" }}
                />
                {/* Progress fill */}
                <div
                    className="absolute top-5 h-1 rounded-full transition-all duration-500 ease-out"
                    style={{
                        insetInlineStart: "1.25rem",
                        width: `calc((100% - 2.5rem) * ${progressPct / 100})`,
                        background:
                            "linear-gradient(90deg, var(--color-main) 0%, var(--color-api-second) 100%)",
                        boxShadow:
                            "0 0 12px -2px color-mix(in srgb, var(--color-main) 45%, transparent)",
                    }}
                />

                <div className="relative flex items-start justify-between gap-2">
                    {steps.map((step, idx) => {
                        const status = getStepStatus(idx);
                        const Icon = getStepIcon(step.key);
                        return (
                            <div
                                key={step.key}
                                className="flex flex-col items-center flex-1 min-w-0"
                            >
                                <div
                                    className={cn(
                                        "relative z-10 mb-2 sm:mb-3 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center",
                                        "transition-all duration-300 ring-4 ring-custom-card",
                                        status === "completed" &&
                                            "text-custom-inverse",
                                        status === "active" &&
                                            "text-custom-inverse animate-step-pop",
                                        status === "upcoming" &&
                                            "bg-custom-tertiary text-custom-secondary",
                                    )}
                                    style={
                                        status === "completed"
                                            ? {
                                                  backgroundColor: "var(--color-main)",
                                              }
                                            : status === "active"
                                              ? {
                                                    background:
                                                        "linear-gradient(135deg, var(--color-main), var(--color-api-second))",
                                                    boxShadow:
                                                        "0 0 0 6px color-mix(in srgb, var(--color-main) 14%, transparent)",
                                                }
                                              : undefined
                                    }
                                >
                                    <Icon className="w-5 h-5" />
                                </div>

                                <div className="text-center px-1">
                                    <div
                                        className={cn(
                                            "text-xs sm:text-sm font-semibold mb-0.5 truncate",
                                            status === "active" &&
                                                "text-[color:var(--color-main)]",
                                            status === "completed" &&
                                                "text-[color:var(--color-text)]",
                                            status === "upcoming" &&
                                                "text-custom-tertiary",
                                        )}
                                    >
                                        {t(step.labelKey, step.fallbackLabel)}
                                    </div>
                                    <div className="hidden sm:block text-[11px] text-custom-tertiary leading-snug">
                                        {t(
                                            step.descriptionKey,
                                            step.fallbackDescription,
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
