import { HiMagnifyingGlass } from"react-icons/hi2";
import { useLanguage } from"@/context/LanguageContext";
import { cn } from"@/shared/lib/utils";

type OrderSearchBarProps = {
 value: string;
 onChange: (value: string) => void;
 placeholder?: string;
};

export default function OrderSearchBar({
 value,
 onChange,
 placeholder ="Search by order number, store or item",
}: OrderSearchBarProps) {
 const { isRTL } = useLanguage();

 return (
 <div className="relative flex-1"dir={isRTL ?"rtl":"ltr"}>
 <input
 type="text"
 value={value}
 onChange={(e) => onChange(e.target.value)}
 placeholder={placeholder}
 className={cn(
"w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors",
 isRTL ?"pl-10 pr-4":"pr-10",
"border-custom-secondary",
"bg-custom-primary",
"text-custom-primary",
"placeholder:text-custom-secondary",
"focus:ring-custom-accent",
"focus:border-custom-accent"
 )}
 />
 <div className={cn("absolute top-1/2 -translate-y-1/2", isRTL ?"left-3":"right-3")}>
 <HiMagnifyingGlass className="w-5 h-5 text-custom-secondary"/>
 </div>
 </div>
 );
}

