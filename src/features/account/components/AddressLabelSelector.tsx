import { useTranslation } from"react-i18next";
import { Controller } from"react-hook-form";
import type { Control, FieldError } from"react-hook-form";
import { HiHome, HiOfficeBuilding, HiLocationMarker } from"react-icons/hi";
import { cn } from"@/shared/lib/utils";
import type { AddressLabel } from"../types";

type AddressLabelSelectorProps = {
 control: Control<any>;
 name: string;
 error?: FieldError;
 className?: string;
};

const labelOptions: {
 value: AddressLabel;
 icon: typeof HiHome;
 labelKey: string;
}[] = [
 { value:"Home", icon: HiHome, labelKey:"home"},
 { value:"Work", icon: HiOfficeBuilding, labelKey:"work"},
 { value:"Other", icon: HiLocationMarker, labelKey:"other"},
];

export default function AddressLabelSelector({
 control,
 name,
 error,
 className,
}: AddressLabelSelectorProps) {
 const { t } = useTranslation();

 return (
 <div className={cn("space-y-2", className)}>
 <Controller
 name={name}
 control={control}
 rules={{ required: t("validation.required") }}
 render={({ field }) => (
 <div className="flex gap-3">
 {labelOptions.map((option) => {
 const Icon = option.icon;
 const isSelected = field.value === option.value;

 return (
 <button
 key={option.value}
 type="button"
 onClick={() => field.onChange(option.value)}
 className={cn(
"flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
 isSelected
 ?"bg-[var(--color-api-second)] text-white shadow-sm hover:bg-[var(--color-api-second-hover)]"
 :"border border-custom-primary bg-custom-card text-text-secondary hover:border-[var(--color-main)] dark:bg-bg-primary",
 )}
 >
 <Icon
 className={cn(
 "h-5 w-5 shrink-0",
 isSelected ? "text-white" : "text-current",
 )}
 />
 <span>
 {t(`account.addAddress.labels.${option.labelKey}`)}
 </span>
 </button>
 );
 })}
 </div>
 )}
 />
 {error && (
 <p className="text-sm text-[var(--color-ui-red-600)] dark:text-[var(--color-ui-red-400)]">
 {error.message as string}
 </p>
 )}
 </div>
 );
}
