import { cn } from "@/shared/lib/utils";
import { cssColorForSwatch } from "../lib/attributeValueColor";
import type { AttributeOption, AttributePickerOption } from "../types";

export type { AttributeOption };

export interface AttributeSelectorProps {
    attribute: AttributeOption;
    selectedId?: number | null;
    onValueChange?: (optionId: number) => void;
    activeColor?: "dark" | "teal";
    className?: string;
}

function optionsOf(attribute: AttributeOption): AttributePickerOption[] {
    if (attribute.options?.length) return attribute.options;
    return (attribute.values ?? []).map((name, index) => ({
        id: -(index + 1),
        name,
    }));
}

export default function AttributeSelector({
    attribute,
    selectedId,
    onValueChange,
    activeColor = "teal",
    className,
}: AttributeSelectorProps) {
    const isColorType = attribute.type === "color";
    const disabledIds = new Set(attribute.disabledIds ?? []);
    const options = optionsOf(attribute);
    const selectedName =
        options.find((option) => option.id === selectedId)?.name ?? "";

    return (
        <div className={cn("flex flex-col gap-2.5", className)}>
            <label className="text-sm text-custom-secondary">
                {attribute.attribute}
                {selectedName ? (
                    <>
                        {": "}
                        <span className="font-semibold text-text-primary">
                            {selectedName}
                        </span>
                    </>
                ) : null}
            </label>

            <div className="flex flex-wrap items-center gap-2">
                {options.map((option) => {
                    const isSelected = selectedId === option.id;
                    const isDisabled = disabledIds.has(option.id);

                    if (isColorType) {
                        const fill = cssColorForSwatch({
                            hex: option.hex ?? attribute.valueHex?.[option.id],
                            id: option.id,
                            label: option.name,
                        });
                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() =>
                                    !isDisabled && onValueChange?.(option.id)
                                }
                                disabled={isDisabled}
                                className={cn(
                                    "h-9 w-9 rounded-full transition-all",
                                    "border-2",
                                    isSelected
                                        ? "border-text-primary ring-2 ring-primary/35 ring-offset-2 ring-offset-[var(--color-bg-primary)]"
                                        : "border-black/10 hover:border-black/25 dark:border-white/20",
                                    isDisabled && "opacity-30 cursor-not-allowed",
                                )}
                                style={{ backgroundColor: fill }}
                                aria-label={`Select color ${option.name}`}
                                title={option.name}
                            />
                        );
                    }

                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                                !isDisabled && onValueChange?.(option.id)
                            }
                            disabled={isDisabled}
                            className={cn(
                                "h-10 min-w-10 rounded-lg px-3.5 text-sm font-medium transition-all",
                                isSelected
                                    ? activeColor === "teal"
                                        ? "bg-primary text-white ring-2 ring-primary/25"
                                        : "bg-gray-800 text-white dark:bg-[var(--color-main)] dark:text-[var(--color-text)]"
                                    : "bg-custom-card text-custom-primary ring-1 ring-black/8 hover:ring-black/16 dark:ring-white/10 dark:hover:ring-white/20",
                                isDisabled && "opacity-30 cursor-not-allowed",
                            )}
                            aria-label={`Select ${attribute.attribute} ${option.name}`}
                        >
                            {option.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
