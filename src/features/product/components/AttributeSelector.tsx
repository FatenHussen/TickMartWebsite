import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import { cssColorForSwatch, isLightSwatchFill } from "../lib/attributeValueColor";
import type { AttributeOption, AttributePickerOption } from "../types";

export type { AttributeOption };

export interface AttributeSelectorProps {
    attribute: AttributeOption;
    selectedId?: number | null;
    onValueChange?: (optionId: number) => void;
    activeColor?: "dark" | "teal";
    className?: string;
}

/** Above this, color picks use a compact dropdown instead of a swatch row. */
const COLOR_DROPDOWN_THRESHOLD = 6;

function optionsOf(attribute: AttributeOption): AttributePickerOption[] {
    if (attribute.options?.length) return attribute.options;
    return (attribute.values ?? []).map((name, index) => ({
        id: -(index + 1),
        name,
    }));
}

function ColorSwatch({
    fill,
    selected,
    size = "md",
}: {
    fill: string;
    selected?: boolean;
    size?: "sm" | "md";
}) {
    const light = isLightSwatchFill(fill);
    return (
        <span
            className={cn(
                "relative grid shrink-0 place-items-center rounded-full border",
                size === "sm" ? "h-5 w-5" : "h-7 w-7",
                light
                    ? "border-slate-300 dark:border-white/35"
                    : "border-black/10 dark:border-white/15",
                selected &&
                    "ring-2 ring-primary/40 ring-offset-1 ring-offset-[var(--color-bg-primary,#fff)]",
            )}
            style={{ backgroundColor: fill }}
            aria-hidden
        />
    );
}

export default function AttributeSelector({
    attribute,
    selectedId,
    onValueChange,
    activeColor = "teal",
    className,
}: AttributeSelectorProps) {
    const { t } = useTranslation();
    const isColorType = attribute.type === "color";
    const disabledIds = new Set(attribute.disabledIds ?? []);
    const allOptions = optionsOf(attribute);
    // Product page: only offer shades that exist for this item.
    const options = allOptions.filter((option) => !disabledIds.has(option.id));
    const selectedName =
        options.find((option) => option.id === selectedId)?.name ??
        allOptions.find((option) => option.id === selectedId)?.name ??
        "";
    const useColorDropdown =
        isColorType && options.length > COLOR_DROPDOWN_THRESHOLD;

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

            {options.length === 0 ? (
                <p className="text-sm text-custom-secondary">
                    {t("product.noAvailableOptions", "No options available")}
                </p>
            ) : useColorDropdown ? (
                <ColorDropdown
                    attributeName={attribute.attribute}
                    options={options}
                    selectedId={selectedId}
                    valueHex={attribute.valueHex}
                    onValueChange={onValueChange}
                    placeholder={t("product.selectColor", "Select color")}
                />
            ) : (
                <div className="flex flex-wrap items-center gap-2">
                    {options.map((option) => {
                        const isSelected = selectedId === option.id;

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
                                    onClick={() => onValueChange?.(option.id)}
                                    className={cn(
                                        "h-9 w-9 rounded-full transition-all",
                                        "border-2",
                                        isSelected
                                            ? "border-text-primary ring-2 ring-primary/35 ring-offset-2 ring-offset-[var(--color-bg-primary)]"
                                            : "border-black/10 hover:border-black/25 dark:border-white/20",
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
                                onClick={() => onValueChange?.(option.id)}
                                className={cn(
                                    "h-10 min-w-10 rounded-lg px-3.5 text-sm font-medium transition-all",
                                    isSelected
                                        ? activeColor === "teal"
                                            ? "bg-primary text-white ring-2 ring-primary/25"
                                            : "bg-gray-800 text-white dark:bg-[var(--color-main)] dark:text-[var(--color-text)]"
                                        : "bg-custom-card text-custom-primary ring-1 ring-black/8 hover:ring-black/16 dark:ring-white/10 dark:hover:ring-white/20",
                                )}
                                aria-label={`Select ${attribute.attribute} ${option.name}`}
                            >
                                {option.name}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function ColorDropdown({
    attributeName,
    options,
    selectedId,
    valueHex,
    onValueChange,
    placeholder,
}: {
    attributeName: string;
    options: AttributePickerOption[];
    selectedId?: number | null;
    valueHex?: Record<number, string>;
    onValueChange?: (optionId: number) => void;
    placeholder: string;
}) {
    const listId = useId();
    const rootRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const selected = options.find((o) => o.id === selectedId) ?? null;
    const selectedFill = selected
        ? cssColorForSwatch({
              hex: selected.hex ?? valueHex?.[selected.id],
              id: selected.id,
              label: selected.name,
          })
        : null;

    useEffect(() => {
        if (!open) return;
        const onPointer = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onPointer);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onPointer);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <div ref={rootRef} className="relative max-w-xs">
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => setOpen((v) => !v)}
                className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg border bg-custom-card px-3 py-2.5 text-start text-sm transition-colors",
                    "border-black/10 hover:border-black/20 dark:border-white/12 dark:hover:border-white/22",
                    open && "border-primary/50 ring-2 ring-primary/20",
                )}
            >
                {selectedFill ? (
                    <ColorSwatch fill={selectedFill} selected size="sm" />
                ) : (
                    <span
                        className="h-5 w-5 shrink-0 rounded-full border border-dashed border-black/20 dark:border-white/25"
                        aria-hidden
                    />
                )}
                <span className="min-w-0 flex-1 truncate font-medium text-text-primary">
                    {selected?.name ?? placeholder}
                </span>
                <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={cn(
                        "h-4 w-4 shrink-0 text-custom-secondary transition-transform",
                        open && "rotate-180",
                    )}
                    aria-hidden
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {open ? (
                <ul
                    id={listId}
                    role="listbox"
                    aria-label={attributeName}
                    className="absolute z-30 mt-1.5 max-h-56 w-full overflow-auto rounded-lg border border-black/10 bg-[var(--color-bg-card,#fff)] py-1 shadow-lg dark:border-white/12 dark:bg-[color-mix(in_srgb,var(--color-main)_14%,#13151c)]"
                >
                    {options.map((option) => {
                        const isSelected = selectedId === option.id;
                        const fill = cssColorForSwatch({
                            hex: option.hex ?? valueHex?.[option.id],
                            id: option.id,
                            label: option.name,
                        });
                        return (
                            <li key={option.id} role="option" aria-selected={isSelected}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onValueChange?.(option.id);
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        "flex w-full items-center gap-2.5 px-3 py-2 text-start text-sm transition-colors",
                                        isSelected
                                            ? "bg-primary/10 font-semibold text-text-primary"
                                            : "text-text-primary hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
                                    )}
                                >
                                    <ColorSwatch fill={fill} selected={isSelected} size="sm" />
                                    <span className="min-w-0 flex-1 truncate">
                                        {option.name}
                                    </span>
                                    {isSelected ? (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            className="h-3.5 w-3.5 shrink-0 text-primary"
                                            aria-hidden
                                        >
                                            <path d="M5 12.5 9.5 17 19 7.5" />
                                        </svg>
                                    ) : null}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            ) : null}
        </div>
    );
}
