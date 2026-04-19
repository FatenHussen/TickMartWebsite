import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import {
    cssColorForAttributeLabel,
    isLikelyHexColorLabel,
} from "@/features/product/lib/attributeValueColor";
import type {
    CategoryAttribute,
    CategoryAttributeUiType,
} from "@/features/product/types/categoryAttributes";

type CategoryAttributeFiltersProps = {
    attributes: CategoryAttribute[];
    selectedIds: number[];
    onToggleValue: (valueId: number) => void;
    isLoading?: boolean;
    error?: unknown;
};

function normalizeType(t: string): CategoryAttributeUiType {
    const raw = String(t).toLowerCase();
    if (raw === "color") return "color";
    if (raw === "circle") return "circle";
    return "square";
}

export default function CategoryAttributeFilters({
    attributes,
    selectedIds,
    onToggleValue,
    isLoading,
    error,
}: CategoryAttributeFiltersProps) {
    const { t } = useTranslation();
    const selected = new Set(selectedIds);

    if (isLoading) {
        return (
            <p className="text-xs text-slate-500 animate-pulse">
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
        return (
            <p className="text-xs text-slate-500">
                {t(
                    "productsListing.noCategoryAttributes",
                    "No attribute filters for this category."
                )}
            </p>
        );
    }

    return (
        <div className="space-y-5 border-t border-sky-200/60 pt-4">
            {attributes.map((attr) => {
                const type = normalizeType(attr.type);

                return (
                    <section key={attr.id} className="flex flex-col gap-3">
                        <h3 className="text-sm font-bold text-slate-800">
                            {attr.name}
                        </h3>
                        {type === "square" && (
                            <SquareValues
                                values={attr.values}
                                selected={selected}
                                onToggle={onToggleValue}
                            />
                        )}
                        {type === "color" && (
                            <ColorValues
                                values={attr.values}
                                selected={selected}
                                onToggle={onToggleValue}
                            />
                        )}
                        {type === "circle" && (
                            <CircleValues
                                values={attr.values}
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

/** Figma: 6px radius, 1px gradient border #4CDAF6 → #2C8090, padding ~4px / ~24px */
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
                                ? "rounded-[6px] bg-[#00ACC1] text-white shadow-sm"
                                : "rounded-[6px] bg-gradient-to-b from-[#4CDAF6] to-[#2C8090] p-px hover:opacity-95"
                        )}
                    >
                        {active ? (
                            <span className="px-[23.67px] py-1 leading-none">{v.name}</span>
                        ) : (
                            <span
                                className={cn(
                                    "flex min-h-[28px] items-center justify-center rounded-[5px] bg-white/95 px-[23.67px] py-1 leading-none text-slate-700"
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
        <div className="flex flex-wrap gap-x-4 gap-y-3">
            {values.map((v) => {
                const active = selected.has(v.id);
                const fill = cssColorForAttributeLabel(v.id, v.name);
                const hideLabel = isLikelyHexColorLabel(v.name);
                const isLight =
                    fill.includes("0% 100%)") || fill.includes("255 255 255");
                return (
                    <button
                        key={v.id}
                        type="button"
                        onClick={() => onToggle(v.id)}
                        className={cn(
                            "flex items-center gap-2 rounded-lg transition-colors",
                            active && "ring-2 ring-[#00ACC1] ring-offset-1 ring-offset-[#E5F3FF]"
                        )}
                    >
                        <span
                            className={cn(
                                "h-9 w-9 shrink-0 rounded-full border-2 border-slate-600/25",
                                isLight && "ring-1 ring-slate-300/90"
                            )}
                            style={{ background: fill }}
                            title={hideLabel ? undefined : v.name}
                            aria-label={v.name}
                        />
                        {!hideLabel && (
                            <span className="max-w-[140px] text-left text-sm text-slate-800">
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
                                ? "border-[#00ACC1]/40 bg-white/90"
                                : "hover:bg-white/50"
                        )}
                    >
                        <span
                            className={cn(
                                "h-8 w-8 shrink-0 rounded-full border-2 transition-colors",
                                active
                                    ? "border-[#00ACC1] bg-[#00ACC1] shadow-sm"
                                    : "border-slate-400 bg-white/90"
                            )}
                            aria-hidden
                        />
                        <span className="max-w-[140px] text-left text-sm text-slate-800">
                            {v.name}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
