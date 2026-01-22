import React from "react";
import { HiShoppingCart, HiClipboardList, HiCheckCircle } from "react-icons/hi";
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
  currentStep?: number | string; // Can be index or step id
  className?: string;
};

const defaultIcons = {
  cart: HiShoppingCart,
  details: HiClipboardList,
  review: HiCheckCircle,
};

export default function ProgressIndicator({
  steps,
  currentStep = 0,
  className = "",
}: ProgressIndicatorProps) {
  const { isRTL } = useLanguage();

  // Determine current step index
  const currentIndex =
    typeof currentStep === "number"
      ? currentStep
      : steps.findIndex((step) => step.id === currentStep);

  // Get step status
  const getStepStatus = (index: number): ProgressStepStatus => {
    if (index < currentIndex) return "completed";
    if (index === currentIndex) return "active";
    return "upcoming";
  };

  // Render step icon
  const renderStepIcon = (step: ProgressStep, status: ProgressStepStatus) => {
    if (step.icon) {
      return step.icon;
    }

    // Default icon rendering based on status
    const IconComponent = defaultIcons[step.id as keyof typeof defaultIcons] || HiCheckCircle;

    return (
      <IconComponent
        className={`w-5 h-5 ${
          status === "completed" || status === "active"
            ? "text-white"
            : "text-gray-light"
        }`}
      />
    );
  };

  return (
    <div className={`w-full ${className}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between relative">
        {/* Background connecting line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-bold -translate-y-1/2 z-0" />

        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isCompleted = status === "completed";
          const isActive = status === "active";

          // Determine line color - yellow for completed steps, gray for upcoming
          const lineColor =
            index < steps.length - 1
              ? index < currentIndex
                ? "bg-secondary"
                : "bg-gray-bold"
              : "";

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center flex-1">
              {/* Step Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted || isActive
                    ? "bg-primary-light border-primary-light"
                    : "bg-white border-gray-light"
                }`}
              >
                {renderStepIcon(step, status)}
              </div>

              {/* Step Label */}
              <div className="mt-2 text-center">
                <span
                  className={`text-sm font-medium ${
                    isCompleted || isActive
                      ? "text-primary-light"
                      : "text-gray-light"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting line to next step */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-6 ${
                    isRTL ? "right-full" : "left-full"
                  } w-full h-0.5 ${lineColor} z-0`}
                  style={{
                    width: "calc(100% - 3rem)",
                    [isRTL ? "marginRight" : "marginLeft"]: "1.5rem",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
