import { forwardRef } from"react";
import { cn } from"@/shared/lib/utils";

export interface ToggleSwitchProps {
 checked?: boolean;
 onChange?: (checked: boolean) => void;
 disabled?: boolean;
 className?: string;
 label?: string;
}

const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(
 ({ checked = false, onChange, disabled = false, className, label }, ref) => {
 return (
 <label
 className={cn(
"relative inline-flex items-center cursor-pointer",
 className,
 )}
 >
 <input
 ref={ref}
 type="checkbox"
 checked={checked}
 onChange={(e) => onChange?.(e.target.checked)}
 disabled={disabled}
 className="sr-only peer"
 />
 <div className="w-11 h-6 bg-custom-hover peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-custom-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-custom-card after:border-custom-secondary after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-light peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"/>
 {label && (
 <span className="ml-3 text-sm text-text-primary">{label}</span>
 )}
 </label>
 );
 },
);

ToggleSwitch.displayName ="ToggleSwitch";

export default ToggleSwitch;
