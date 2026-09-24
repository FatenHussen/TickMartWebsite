import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import { resolveLocalizedText } from "@/shared/lib/localizedText";
import {
    cssColorForSwatch,
    isLightSwatchFill,
} from "@/features/product/lib/attributeValueColor";
import type {
    CategoryAttribute,
    CategoryAttributeUiType,
    CategoryAttributeValue,
} from "@/features/product/types/categoryAttributes";

type CategoryAttributeFiltersProps = {
    attributes: CategoryAttribute[];
    selectedIds: number[];
    onToggleValue: (valueId: number) => void;
    isLoading?: boolean;
    error?: unknown;
    /** When true, empty list renders nothing (root has no attributes — not an error). */
    hideEmptyMessage?: boolean;
    /** Skip the extra top rule — parent already draws a section divider. */
    embedded?: boolean;
};

function normalizeType(t: string): CategoryAttributeUiType {
    const raw = String(t).toLowerCase();
    if (raw === "color") return "color";
    if (raw === "circle") return "circle";
    return "square";
}

function useAttrLabel() {
    const { language } = useLanguage();
    return (value: CategoryAttributeValue["name"] | CategoryAttribute["name"]) =>
        resolveLocalizedText(value, language);
}

export default function CategoryAttributeFilters({
    attributes,
    selectedIds,
    onToggleValue,
    isLoading,
    error,
    hideEmptyMessage = false,
    embedded = false,
}: CategoryAttributeFiltersProps) {
    const { t } = useTranslation();
    const labelOf = useAttrLabel();
    const selected = new Set(selectedIds);

    if (isLoading) {
        return (
            <p className="text-xs text-slate-500 dark:text-[color-mix(in_srgb,var(--color-text)_70%,transparent)] animate-pulse">
                {t("productsListing.attributesLoading")}
            </p>
        );
    }

    if (error) {
        return (
            <p className="text-xs text-red-600">
                {t("productsListing.attributesError")}
            </p>
        );
    }

    if (!attributes.length) {
        if (hideEmptyMessage) return null;
        return (
            <p className="text-xs text-slate-500 dark:text-[color-mix(in_srgb,var(--color-text)_70%,transparent)]">
                {t(
                    "productsListing.noCategoryAttributes",
                    "No attribute filters for this category.",
                )}
            </p>
        );
    }

    return (
        <div
            className={cn(
                "space-y-5",
                !embedded &&
                    "border-t border-sky-200/60 pt-4 dark:border-[color-mix(in_srgb,var(--color-main)_22%,#1f2230)]",
            )}
        >
            {attributes.map((attr, index) => {
                const type = normalizeType(String(attr.type));
                // Filter key = `values[].id`. Label = latest GET `values[].name`.
                const values = attr.values.map((v) => ({
                    id: v.id,
                    name: labelOf(v.name),
                    hex: v.hex,
                }));

                return (
                    <section
                        key={attr.id}
                        className={cn(
                            "flex flex-col",
                            embedded ? "gap-2.5" : "gap-3",
                            embedded &&
                                index > 0 &&
                                "border-t border-slate-200/80 pt-4 dark:border-[color-mix(in_srgb,var(--color-main)_22%,#1f2230)]",
                        )}
                    >
                        <h3
                            className={cn(
                                embedded
                                    ? "text-xs font-semibold text-custom-secondary dark:text-[color-mix(in_srgb,var(--color-text)_82%,transparent)]"
                                    : "text-sm font-bold text-slate-800 dark:text-[var(--color-text)]",
                            )}
                        >
                            {labelOf(attr.name)}
                        </h3>
                        {type === "square" && (
                            <SquareValues
                                values={values}
                                selected={selected}
                                onToggle={onToggleValue}
                            />
                        )}
                        {type === "color" && (
                            <ColorValues
                                values={values}
                                selected={selected}
                                onToggle={onToggleValue}
                            />
                        )}
                        {type === "circle" && (
                            <CircleValues
                                values={values}
                                selected={selected}
                                onToggle={onToggleValue}
                            />
                        )}
                    </section>
                );
            })}
        </div>
    );
}

function SquareValues({
    values,
    selected,
    onToggle,
}: {
    values: { id: number; name: string; hex?: string | null }[];
    selected: Set<number>;
    onToggle: (id: number) => void;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {values.map((v) => {
                const active = selected.has(v.id);
                return (
                    <button
                        key={v.id}
                        type="button"
                        onClick={() => onToggle(v.id)}
                        className={cn(
                            "inline-flex min-h-[30px] items-center justify-center text-xs font-semibold transition-[opacity,transform] active:scale-[0.98]",
                            active
                                ? "rounded-[6px] bg-[#00ACC1] dark:bg-[var(--color-main)] text-white dark:text-[var(--color-text)] shadow-sm"
                                : "rounded-[6px] bg-gradient-to-b from-[#4CDAF6] to-[#2C8090] dark:from-[color-mix(in_srgb,var(--color-main)_45%,#1f2230)] dark:to-[color-mix(in_srgb,var(--color-api-second)_45%,#1f2230)] p-px hover:opacity-95",
                        )}
                    >
                        {active ? (
                            <span className="px-[23.67px] py-1 leading-none">{v.name}</span>
                        ) : (
                            <span
                                className={cn(
                                    "flex min-h-[28px] items-center justify-center rounded-[5px] bg-white/95 dark:bg-[color-mix(in_srgb,var(--color-main)_18%,#13151c)] px-[23.67px] py-1 leading-none text-slate-700 dark:text-[var(--color-text)]",
                                )}
                            >
                                {v.name}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

function ColorValues({
    values,
    selected,
    onToggle,
}: {
    values: { id: number; name: string; hex?: string | null }[];
    selected: Set<number>;
    onToggle: (id: number) => void;
}) {
    const { t } = useTranslation();
    const listId = useId();
    const rootRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const selectedValues = values.filter((v) => selected.has(v.id));

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

    const summary =
        selectedValues.length === 0
            ? t("productsListing.selectColor", "Select color")
            : selectedValues.length === 1
              ? selectedValues[0].name
              : t("productsListing.colorsSelected", {
                    count: selectedValues.length,
                    defaultValue: "{{count}} colors",
                });

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => setOpen((v) => !v)}
                className={cn(
                    "flex w-full items-center gap-2 rounded-lg border bg-white/95 px-3 py-2.5 text-start text-sm transition-colors dark:bg-[color-mix(in_srgb,var(--color-main)_18%,#13151c)]",
                    "border-slate-200 hover:border-slate-300 dark:border-[color-mix(in_srgb,var(--color-main)_22%,#1f2230)] dark:hover:border-[color-mix(in_srgb,var(--color-main)_40%,#1f2230)]",
                    open &&
                        "border-[var(--color-main,#00ACC1)]/50 ring-2 ring-[var(--color-main,#00ACC1)]/20",
                )}
            >
                <span className="flex min-w-0 flex-1 items-center gap-1.5">
                    {selectedValues.length > 0 ? (
                        <span className="flex shrink-0 items-center -space-x-1.5 rtl:space-x-reverse">
                            {selectedValues.slice(0, 4).map((v) => {
                                const fill = cssColorForSwatch({
                                    hex: v.hex,
                                    id: v.id,
                                    label: v.name,
                                });
                                const light = isLightSwatchFill(fill);
                                return (
                                    <span
                                        key={v.id}
                                        title={v.name}
                                        className={cn(
                                            "h-5 w-5 rounded-full border shadow-sm",
                                            light
                                                ? "border-slate-300 dark:border-white/35"
                                                : "border-black/10 dark:border-white/15",
                                        )}
                                        style={{ background: fill }}
                                    />
                                );
                            })}
                        </span>
                    ) : (
                        <span
                            className="h-5 w-5 shrink-0 rounded-full border border-dashed border-slate-300 dark:border-white/25"
                            aria-hidden
                        />
                    )}
                    <span
                        className={cn(
                            "min-w-0 truncate",
                            selectedValues.length
                                ? "font-medium text-slate-800 dark:text-[var(--color-text)]"
                                : "text-slate-500 dark:text-[color-mix(in_srgb,var(--color-text)_70%,transparent)]",
                        )}
                    >
                        {summary}
                    </span>
                </span>
                <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={cn(
                        "h-4 w-4 shrink-0 text-slate-400 transition-transform dark:text-[color-mix(in_srgb,var(--color-text)_55%,transparent)]",
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
                    aria-multiselectable
                    className="absolute z-30 mt-1.5 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-[color-mix(in_srgb,var(--color-main)_22%,#1f2230)] dark:bg-[color-mix(in_srgb,var(--color-main)_14%,#13151c)]"
                >
                    {values.map((v) => {
                        const active = selected.has(v.id);
                        const fill = cssColorForSwatch({
                            hex: v.hex,
                            id: v.id,
                            label: v.name,
                        });
                        const light = isLightSwatchFill(fill);
                        return (
                            <li key={v.id} role="option" aria-selected={active}>
                                <button
                                    type="button"
                                    onClick={() => onToggle(v.id)}
                                    className={cn(
                                        "flex w-full items-center gap-2.5 px-3 py-2 text-start text-sm transition-colors",
                                        active
                                            ? "bg-[color-mix(in_srgb,var(--color-main,#00ACC1)_12%,transparent)] font-semibold text-slate-800 dark:text-[var(--color-text)]"
                                            : "text-slate-700 hover:bg-slate-50 dark:text-[var(--color-text)] dark:hover:bg-[color-mix(in_srgb,var(--color-main)_18%,#13151c)]",
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "relative grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                                            light
                                                ? "border-slate-300 dark:border-white/35"
                                                : "border-black/10 dark:border-white/15",
                                        )}
                                        style={{ background: fill }}
                                        aria-hidden
                                    >
                                        {active ? (
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                className={cn(
                                                    "h-3 w-3",
                                                    light
                                                        ? "text-slate-800"
                                                        : "text-white",
                                                )}
                                            >
                                                <path d="M5 12.5 9.5 17 19 7.5" />
                                            </svg>
                                        ) : null}
                                    </span>
                                    <span className="min-w-0 flex-1 truncate">
                                        {v.name}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            ) : null}
        </div>
    );
}

function CircleValues({
    values,
    selected,
    onToggle,
}: {
    values: { id: number; name: string; hex?: string | null }[];
    selected: Set<number>;
    onToggle: (id: number) => void;
}) {
    return (
        <div className="flex flex-wrap gap-x-4 gap-y-3">
            {values.map((v) => {
                const active = selected.has(v.id);
                return (
                    <button
                        key={v.id}
                        type="button"
                        onClick={() => onToggle(v.id)}
                        className={cn(
                            "flex items-center gap-2 rounded-lg border border-transparent px-1 py-1 transition-colors",
                            active
                                ? "border-[#00ACC1]/40 bg-white/90 dark:border-[color-mix(in_srgb,var(--color-main)_45%,transparent)] dark:bg-[color-mix(in_srgb,var(--color-main)_18%,#13151c)]"
                                : "hover:bg-white/50 dark:hover:bg-[color-mix(in_srgb,var(--color-main)_14%,#13151c)]",
                        )}
                    >
                        <span
                            className={cn(
                                "h-8 w-8 shrink-0 rounded-full border-2 transition-colors",
                                active
                                    ? "border-[#00ACC1] bg-[#00ACC1] shadow-sm dark:border-[var(--color-main)] dark:bg-[var(--color-main)]"
                                    : "border-slate-400 bg-white/90 dark:border-[color-mix(in_srgb,var(--color-main)_22%,#1f2230)] dark:bg-[color-mix(in_srgb,var(--color-main)_18%,#13151c)]",
                            )}
                            aria-hidden
                        />
                        <span className="max-w-[140px] text-start text-sm text-slate-800 dark:text-[var(--color-text)]">
                            {v.name}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
