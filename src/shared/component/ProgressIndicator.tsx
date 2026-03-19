import React from"react";
import { HiShoppingCart, HiClipboardList, HiCheckCircle, HiCreditCard } from"react-icons/hi";
import { useLanguage } from"@/context/LanguageContext";

export type ProgressStepStatus ="completed"|"active"|"upcoming";

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
 className ="",
}: ProgressIndicatorProps) {
 const { isRTL } = useLanguage();

 const currentIndex =
 typeof currentStep ==="number"
 ? currentStep
 : steps.findIndex((step) => step.id === currentStep);

 const getStepStatus = (index: number): ProgressStepStatus => {
 if (index < currentIndex) return"completed";
 if (index === currentIndex) return"active";
 return"upcoming";
 };

 const renderStepIcon = (step: ProgressStep, status: ProgressStepStatus) => {
 if (step.icon) return step.icon;
 const IconComponent = defaultIcons[step.id] || HiCheckCircle;
 const isCheckoutActive = step.id ==="checkout"&& status ==="active";
 return (
 <IconComponent
 className={`w-5 h-5 ${
 isCheckoutActive
 ?"text-custom-primary"
 : status ==="completed"|| status ==="active"
 ?"text-white"
 :"text-gray-light"
 }`}
 />
 );
 };

 return (
 <div className={`w-full ${className}`} dir={isRTL ?"rtl":"ltr"}>
 <div className="flex items-start">
 {steps.map((step, index) => {
 const status = getStepStatus(index);
 const isCompleted = status ==="completed";
 const isActive = status ==="active";

 return (
 <React.Fragment key={step.id}>
 <div className="flex flex-col items-center shrink-0">
 <div
 className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
 isActive
 ?"border-transparent"
 : isCompleted
 ?"bg-primary-light border-primary-light"
 :"bg-custom-card border-gray-light"
 }`}
 style={
 isActive
 ? (steps[currentIndex]?.id ==="checkout"
 ? {
 background:"linear-gradient(180deg, #FFD700 0%, #F59E0B 100%)",
 boxShadow:
"0 4px 6px -4px rgba(245, 158, 11, 0.3), 0 10px 15px -3px rgba(245, 158, 11, 0.2)",
 }
 : {
 background:"linear-gradient(180deg, #4CDAF6 0%, #2C8090 100%)",
 boxShadow:
"0 4px 6px -4px #BFDBFE, 0 10px 15px -3px #BFDBFE",
 })
 : undefined
 }
 >
 {renderStepIcon(step, status)}
 </div>
 <span
 className={`mt-2 text-sm font-medium whitespace-nowrap ${
 step.id ==="checkout"&& isActive
 ?"text-custom-primary font-bold"
 : isCompleted || isActive
 ?"text-primary-light"
 :"text-gray-light"
 }`}
 >
 {step.label}
 </span>
 </div>

 {index < steps.length - 1 && (
 <div
 className={`flex-1 h-0.5 mt-6 ${
 index <= currentIndex ?"bg-secondary":"bg-gray-bold"
 }`}
 />
 )}
 </React.Fragment>
 );
 })}
 </div>
 </div>
 );
}
