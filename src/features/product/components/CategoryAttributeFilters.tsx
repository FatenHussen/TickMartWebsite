import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import { resolveLocalizedText } from "@/shared/lib/localizedText";
import {
    cssColorForAttributeLabel,
    isLikelyHexColorLabel,
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
                const values = attr.values.map((v) => ({
                    id: v.id,
                    name: labelOf(v.name),
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
    values: { id: number; name: string }[];
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
    values: { id: number; name: string }[];
    selected: Set<number>;
    onToggle: (id: number) => void;
}) {
    return (
        <div className="grid grid-cols-4 gap-x-2 gap-y-3" role="list">
            {values.map((v) => {
                const active = selected.has(v.id);
                const fill = cssColorForAttributeLabel(v.id, v.name);
                const hideLabel = isLikelyHexColorLabel(v.name);
                const light = isLightSwatchFill(fill);
                return (
                    <button
                        key={v.id}
                        type="button"
                        role="listitem"
                        title={v.name}
                        aria-label={v.name}
                        aria-pressed={active}
                        onClick={() => onToggle(v.id)}
                        className="flex min-w-0 flex-col items-center gap-1.5 rounded-lg py-0.5 transition-transform active:scale-[0.97]"
                    >
                        <span
                            className={cn(
                                "relative grid h-8 w-8 place-items-center rounded-full border shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)]",
                                light
                                    ? "border-slate-300 dark:border-white/35"
                                    : "border-black/10 dark:border-white/15",
                                active &&
                                    "ring-2 ring-[var(--color-main,#00ACC1)] ring-offset-2 ring-offset-[var(--color-bg-card,#fff)]",
                            )}
                            style={{ background: fill }}
                        >
                            {active && (
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={cn(
                                        "h-3.5 w-3.5",
                                        light ? "text-slate-800" : "text-white",
                                    )}
                                    aria-hidden
                                >
                                    <path d="M5 12.5 9.5 17 19 7.5" />
                                </svg>
                            )}
                        </span>
                        {!hideLabel && (
                            <span
                                className={cn(
                                    "w-full truncate text-center text-[11px] leading-tight",
                                    active
                                        ? "font-semibold text-custom-primary dark:text-[var(--color-text)]"
                                        : "text-custom-secondary dark:text-[color-mix(in_srgb,var(--color-text)_75%,transparent)]",
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

function CircleValues({
    values,
    selected,
    onToggle,
}: {
    values: { id: number; name: string }[];
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
