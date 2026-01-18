import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { NestedSubcategory } from "../types";

type NestedSubcategoriesSidebarProps = {
  subcategories: NestedSubcategory[];
  selectedSubcategoryId?: number;
  onSubcategorySelect?: (subcategoryId: number) => void;
  title?: string;
};

export default function NestedSubcategoriesSidebar({
  subcategories,
  selectedSubcategoryId,
  onSubcategorySelect,
  title,
}: NestedSubcategoriesSidebarProps) {
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderSubcategory = (subcategory: NestedSubcategory, level = 0) => {
    const hasChildren = subcategory.children && subcategory.children.length > 0;
    const isExpanded = expandedItems.has(subcategory.id);
    const isSelected = selectedSubcategoryId === subcategory.id;

    return (
      <div key={subcategory.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpand(subcategory.id);
            }
            onSubcategorySelect?.(subcategory.id);
          }}
          className={`w-full flex items-center justify-between gap-2 p-3 rounded-xl transition-all text-left ${
            isSelected
              ? "bg-custom-active text-custom-accent"
              : "hover:bg-custom-hover text-custom-secondary"
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          <span className="font-medium text-sm">{subcategory.name}</span>
          {hasChildren && (
            <span
              className={`text-xs transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            >
              ▶
            </span>
          )}
        </button>
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {subcategory.children!.map((child) =>
              renderSubcategory(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-custom-primary rounded-2xl p-6 shadow-sm border border-custom-primary">
      <h2 className="text-xl font-bold text-custom-primary mb-6">
        {title || t("categories.browseBySubcategory")}
      </h2>
      <div className="space-y-1">
        {subcategories.map((subcategory) => renderSubcategory(subcategory))}
      </div>
    </div>
  );
}
