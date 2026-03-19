import { HiCheck, HiTruck, HiCube } from"react-icons/hi";
import type { OrderStatusStep } from"../types";

type OrderStatusTimelineProps = {
 currentStatus: OrderStatusStep;
};

const steps: { key: OrderStatusStep; label: string; description: string }[] = [
 {
 key:"pending",
 label:"Pending",
 description:"Your order was received.",
 },
 {
 key:"preparing",
 label:"Preparing",
 description:"Store is preparing your order.",
 },
 {
 key:"out_for_delivery",
 label:"Out for Delivery",
 description:"Driver is on the way.",
 },
 {
 key:"delivered",
 label:"Delivered",
 description:"Order delivered.",
 },
];

export default function OrderStatusTimeline({
 currentStatus,
}: OrderStatusTimelineProps) {
 const getStepStatus = (stepKey: OrderStatusStep):"completed"|"active"|"upcoming"=> {
 const stepIndex = steps.findIndex((s) => s.key === stepKey);
 const currentIndex = steps.findIndex((s) => s.key === currentStatus);

 if (stepIndex < currentIndex) return"completed";
 if (stepIndex === currentIndex) return"active";
 return"upcoming";
 };

 const renderIcon = (stepKey: OrderStatusStep, status:"completed"|"active"|"upcoming") => {
 if (status ==="completed") {
 return (
 <div className="w-10 h-10 rounded-full bg-custom-accent flex items-center justify-center">
 <HiCheck className="w-6 h-6 text-custom-inverse"/>
 </div>
 );
 }

 if (status ==="active") {
 if (stepKey ==="out_for_delivery") {
 return (
 <div className="w-10 h-10 rounded-full flex items-center justify-center"style={{ backgroundColor: 'var(--color-secondary)' }}>
 <HiTruck className="w-6 h-6 text-custom-inverse"/>
 </div>
 );
 }
 return (
 <div className="w-10 h-10 rounded-full bg-custom-accent flex items-center justify-center">
 <HiCheck className="w-6 h-6 text-custom-inverse"/>
 </div>
 );
 }

 // upcoming
 return (
 <div className="w-10 h-10 rounded-full bg-custom-tertiary flex items-center justify-center">
 <HiCube className="w-6 h-6 text-custom-secondary"/>
 </div>
 );
 };

 return (
 <div className="bg-custom-primary rounded-2xl border border-custom-secondary shadow-sm p-6 mb-6">
 <div className="relative">
 {/* Timeline line */}
 <div className="absolute top-5 left-5 right-5 h-0.5 bg-custom-secondary"/>

 {/* Steps */}
 <div className="relative flex items-start justify-between">
 {steps.map((step) => {
 const stepStatus = getStepStatus(step.key);

 return (
 <div key={step.key} className="flex flex-col items-center flex-1">
 {/* Icon */}
 <div className="relative z-10 mb-3">
 {renderIcon(step.key, stepStatus)}
 </div>

 {/* Label and Description */}
 <div className="text-center">
 <div
 className={`text-sm font-semibold mb-1 ${
 stepStatus ==="active"
 ?"text-custom-accent"
 : stepStatus ==="completed"
 ?"text-custom-primary"
 :"text-custom-secondary"
 }`}
 >
 {step.label}
 </div>
 <div className="text-xs text-custom-secondary">{step.description}</div>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>
 );
}

