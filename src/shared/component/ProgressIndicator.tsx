import React from "react";
import {
    HiShoppingCart,
    HiClipboardList,
    HiCheckCircle,
    HiCreditCard,
    HiCheck,
} from "react-icons/hi";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";

export type ProgressStepStatus = "completed" | "active" | "upcoming";

export type ProgressStep = {
    id: string;
    label: string;
    icon?: React.ReactNode;
    status?: ProgressStepStatus;
};

type ProgressIndicatorProps = {
    steps: ProgressStep[];
    currentStep?: number | string;
    className?: string;
};

const defaultIcons: Record<
    string,
    React.ComponentType<{ className?: string }>
> = {
    cart: HiShoppingCart,
    checkout: HiCreditCard,
    details: HiClipboardList,
    review: HiCheckCircle,
};

export default function ProgressIndicator({
    steps,
    currentStep = 0,
    className = "",
}: ProgressIndicatorProps) {
    const { isRTL } = useLanguage();

    const currentIndex =
        typeof currentStep === "number"
            ? currentStep
            : steps.findIndex((step) => step.id === currentStep);

    const getStepStatus = (index: number): ProgressStepStatus => {
        if (index < currentIndex) return "completed";
        if (index === currentIndex) return "active";
        return "upcoming";
    };

    const renderStepIcon = (step: ProgressStep, status: ProgressStepStatus) => {
        // Always show check on completed steps
        if (status === "completed") {
            return (
                <HiCheck
                    className="h-5 w-5 sm:h-6 sm:w-6 text-white animate-check-pop"
                    strokeWidth={3}
                />
            );
        }
        if (step.icon) return step.icon;
        const IconComponent = defaultIcons[step.id] || HiCheckCircle;
        return (
            <IconComponent
                className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5 transition-colors",
                    status === "active"
                        ? "text-white"
                        : "text-custom-tertiary",
                )}
            />
        );
    };

    return (
        <div
            className={cn("block w-full", className)}
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Step counter for screen readers + small visual cue */}
            <p className="sr-only">
                Step {currentIndex + 1} of {steps.length}
            </p>

            <div className="flex w-full items-start justify-between">
                {steps.map((step, index) => {
                    const status = getStepStatus(index);
                    const isCompleted = status === "completed";
                    const isActive = status === "active";
                    const isUpcoming = status === "upcoming";
                    const showConnector = index < steps.length - 1;
                    const connectorFilled = index < currentIndex;
                    const connectorActive = index === currentIndex - 1; // last completed → animated edge

                    return (
                        <div
                            key={step.id}
                            className="relative flex-1 min-w-0"
                        >
                            {showConnector && (
                                <div
                                    className="absolute top-[18px] z-0 sm:top-[22px] overflow-hidden rounded-full"
                                    style={{
                                        width: "calc(100% - 2.25rem)",
                                        height: 3,
                                        insetInlineStart: "calc(50% + 1.25rem)",
                                        backgroundColor:
                                            "color-mix(in srgb, var(--color-text) 12%, var(--color-bg-card))",
                                    }}
                                >
                                    {(connectorFilled || isActive) && (
                                        <div
                                            className="h-full rounded-full transition-all duration-500 ease-out"
                                            style={{
                                                width: connectorFilled
                                                    ? "100%"
                                                    : "0%",
                                                background:
                                                    "linear-gradient(90deg, var(--color-main) 0%, var(--color-api-second) 100%)",
                                                boxShadow: connectorFilled
                                                    ? "0 0 12px -2px color-mix(in srgb, var(--color-main) 50%, transparent)"
                                                    : "none",
                                            }}
                                        />
                                    )}
                                    {/* Animated shimmer along just-completed connector */}
                                    {connectorActive && (
                                        <div
                                            className="absolute inset-y-0 w-1/3 animate-connector-flow"
                                            style={{
                                                background:
                                                    "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--color-main) 60%, transparent) 50%, transparent 100%)",
                                            }}
                                            aria-hidden
                                        />
                                    )}
                                </div>
                            )}

                            <div className="relative z-10 flex flex-col items-center">
                                {/* Step badge wrapper with halo for active */}
                                <div className="relative">
                                    {/* Active halo */}
                                    {isActive && (
                                        <span
                                            className="pointer-events-none absolute inset-0 -m-1.5 rounded-full animate-label-glow"
                                            style={{
                                                background:
                                                    "color-mix(in srgb, var(--color-main) 18%, transparent)",
                                            }}
                                            aria-hidden
                                        />
                                    )}
                                    <div
                                        className={cn(
                                            "relative flex h-10 w-10 items-center justify-center rounded-full",
                                            "transition-all duration-300 sm:h-12 sm:w-12",
                                            "ring-4 ring-custom-card",
                                            isActive && "animate-step-pop",
                                        )}
                                        style={
                                            isActive
                                                ? {
                                                      background:
                                                          "linear-gradient(135deg, var(--color-main) 0%, var(--color-api-second) 100%)",
                                                      boxShadow:
                                                          "0 8px 22px -8px color-mix(in srgb, var(--color-main) 55%, transparent), 0 0 0 4px color-mix(in srgb, var(--color-main) 12%, transparent)",
                                                  }
                                                : isCompleted
                                                  ? {
                                                        backgroundColor:
                                                            "var(--color-main)",
                                                        boxShadow:
                                                            "0 4px 12px -4px color-mix(in srgb, var(--color-main) 40%, transparent)",
                                                    }
                                                  : {
                                                        backgroundColor:
                                                            "var(--color-bg-card)",
                                                        border: "2px solid color-mix(in srgb, var(--color-text) 18%, transparent)",
                                                    }
                                        }
                                    >
                                        {renderStepIcon(step, status)}
                                    </div>

                                    {/* Step number chip */}
                                    <span
                                        className={cn(
                                            "absolute -bottom-1.5 start-1/2 -translate-x-1/2 rtl:translate-x-1/2",
                                            "flex items-center justify-center",
                                            "h-4 min-w-[1rem] px-1 rounded-full",
                                            "text-[9px] font-bold leading-none",
                                            "ring-2 ring-custom-card",
                                            "transition-all duration-200",
                                        )}
                                        style={
                                            isActive || isCompleted
                                                ? {
                                                      backgroundColor:
                                                          "var(--color-api-second)",
                                                      color: "white",
                                                  }
                                                : {
                                                      backgroundColor:
                                                          "var(--color-bg-tertiary)",
                                                      color: "var(--color-text-tertiary)",
                                                  }
                                        }
                                    >
                                        {index + 1}
                                    </span>
                                </div>

                                <span
                                    className={cn(
                                        "mt-4 text-center leading-snug max-w-[5rem] sm:max-w-[8.5rem] transition-colors px-1",
                                        "text-[10px] sm:text-sm",
                                        isActive &&
                                            "font-bold text-[color:var(--color-main)]",
                                        isCompleted &&
                                            "font-semibold text-[color:var(--color-text)]",
                                        isUpcoming &&
                                            "font-medium text-custom-tertiary",
                                    )}
                                >
                                    {step.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
