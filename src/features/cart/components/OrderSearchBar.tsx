import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";

type OrderSearchBarProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

export default function OrderSearchBar({
    value,
    onChange,
    placeholder = "Search by order number, store or item",
}: OrderSearchBarProps) {
    const { isRTL } = useLanguage();
    const hasValue = value.length > 0;

    return (
        <div className="relative w-full" dir={isRTL ? "rtl" : "ltr"}>
            <div
                className={cn(
                    "absolute top-1/2 -translate-y-1/2 pointer-events-none",
                    "text-custom-tertiary",
                    isRTL ? "right-3.5" : "left-3.5",
                )}
            >
                <HiMagnifyingGlass className="w-5 h-5" />
            </div>

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    "w-full text-sm",
                    "py-2.5",
                    isRTL ? "pr-11 pl-10" : "pl-11 pr-10",
                    "rounded-xl border bg-custom-card",
                    "border-custom-primary",
                    "text-[color:var(--color-text)] placeholder:text-custom-tertiary",
                    "transition-all duration-200",
                    "focus:outline-none focus:border-[color:var(--color-main)]",
                    "focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-main)_25%,transparent)]",
                )}
            />

            {hasValue && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    aria-label="Clear search"
                    className={cn(
                        "absolute top-1/2 -translate-y-1/2",
                        "p-1 rounded-full",
                        "text-custom-tertiary hover:text-custom-primary",
                        "hover:bg-custom-hover transition-colors",
                        isRTL ? "left-2" : "right-2",
                    )}
                >
                    <HiXMark className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
