import React from "react";
import { HiShoppingCart, HiClipboardList, HiCheckCircle, HiCreditCard } from "react-icons/hi";
import { useLanguage } from "@/context/LanguageContext";

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

const defaultIcons: Record<string, React.ComponentType<{ className?: string }>> = {
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
        if (step.icon) return step.icon;
        const IconComponent = defaultIcons[step.id] || HiCheckCircle;
        const isCheckoutActive = step.id === "checkout" && status === "active";
        return (
            <IconComponent
                className={`h-4 w-4 sm:h-5 sm:w-5 ${status === "upcoming"
                        ? "text-gray-light"
                        : isCheckoutActive
                            ? "text-custom-primary"
                            : "text-white"
                    }`}
            />
        );
    };

    return (
        <div className={`block w-full ${className}`} dir={isRTL ? "rtl" : "ltr"}>
            <div className="flex w-full items-start justify-between">
                {steps.map((step, index) => {
                    const status = getStepStatus(index);
                    const isCompleted = status === "completed";
                    const isActive = status === "active";
                    const isCheckoutStep = step.id === "checkout";

                    return (
                        <div key={step.id} className="relative flex-1 min-w-0">
                            {index < steps.length - 1 && (
                                <div
                                    className="absolute top-[18px] z-0 rounded-full sm:top-[22px]"
                                    style={{
                                        width: 128,
                                        height: 4,
                                        left: "100%",
                                        transform: "translateX(-50%)",
                                        borderRadius: 9999,
                                        backgroundColor:
                                            index < currentIndex
                                                ? "#F59E0B"
                                                : index === currentIndex
                                                    ? "#16A34A"
                                                    : "#D1D5DB",
                                    }}
                                />
                            )}

                            <div className="relative z-10 flex flex-col items-center">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all sm:h-12 sm:w-12 ${isActive
                                            ? ""
                                            : isCompleted
                                                ? "border-2 border-primary-light bg-primary-light"
                                                : "border-2 border-gray-light bg-custom-card"
                                        }`}
                                    style={
                                        isActive
                                            ? (step.id === "checkout"
                                                ? {
                                                    background: "linear-gradient(180deg, #FFD700 0%, #F59E0B 100%)",
                                                    boxShadow:
                                                        "0 4px 6px -4px rgba(245, 158, 11, 0.3), 0 10px 15px -3px rgba(245, 158, 11, 0.2)",
                                                }
                                                : step.id === "review"
                                                    ? {
                                                        background: "linear-gradient(180deg, #34D399 0%, #059669 100%)",
                                                        boxShadow:
                                                            "0 4px 6px -4px rgba(5, 150, 105, 0.3), 0 10px 15px -3px rgba(5, 150, 105, 0.2)",
                                                    }
                                                    : {
                                                        background: "linear-gradient(180deg, #4CDAF6 0%, #2C8090 100%)",
                                                        boxShadow:
                                                            "0 4px 6px -4px #BFDBFE, 0 10px 15px -3px #BFDBFE",
                                                    })
                                            : undefined
                                    }
                                >
                                    {renderStepIcon(step, status)}
                                </div>

                                <span
                                    className={`mt-3 text-center text-xs font-medium leading-5 sm:text-sm ${isCheckoutStep && isActive
                                            ? "font-bold text-custom-primary"
                                            : step.id === "review" && isActive
                                                ? "font-bold text-secondary"
                                                : isCompleted || isActive
                                                    ? "text-primary-light"
                                                    : "text-gray-light"
                                        }`}
                                    style={{ maxWidth: isCheckoutStep ? "8.5rem" : "7rem" }}
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
