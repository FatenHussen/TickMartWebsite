import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Category } from "../types";
import { nestedSubcategories } from "../data/mockData";
import CategoryFilters from "./CategoryFilters";

type CategoriesSidebarProps = {
  categories: Category[];
  selectedCategoryId: number;
  selectedSubcategoryId?: number;
  onCategorySelect: (category: Category) => void;
  onSubcategorySelect?: (subcategoryId: number) => void;
  title?: string;
};

export default function CategoriesSidebar({
  categories,
  selectedCategoryId,
  selectedSubcategoryId,
  onCategorySelect,
  onSubcategorySelect,
  title,
}: CategoriesSidebarProps) {
  const { t } = useTranslation();
  const currentSubcategories = useMemo(
    () => nestedSubcategories[selectedCategoryId] || [],
    [selectedCategoryId]
  );

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div className="bg-custom-primary rounded-2xl p-6 shadow-sm border border-custom-primary">
        <h2 className="text-lg font-bold text-custom-primary mb-6">
          {title || t("categories.mainCategories") || "Categories"}
        </h2>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id}>
              <button
                onClick={() => onCategorySelect(category)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all rtl:flex-row-reverse ${
                  selectedCategoryId === category.id
                    ? "bg-blue-off"
                    : "hover:bg-custom-hover text-custom-secondary"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                    selectedCategoryId === category.id
                      ? "bg-transparent"
                      : category.bgColor
                  }`}
                >
                  <span
                    className={
                      selectedCategoryId === category.id
                        ? "text-primary-light"
                        : ""
                    }
                  >
                    {category.icon}
                  </span>
                </div>
                <span
                  className={`font-medium text-sm ${
                    selectedCategoryId === category.id
                      ? "text-primary-light"
                      : ""
                  }`}
                >
                  {category.name}
                </span>
              </button>

              {/* Show subcategories for selected category with bullet points */}
              {selectedCategoryId === category.id &&
                currentSubcategories.length > 0 && (
                  <div className="mt-2 ml-4 space-y-2 pl-2 rtl:mr-4 rtl:ml-0 rtl:pr-2 rtl:pl-0">
                    {currentSubcategories
                      .filter((sc) => !sc.children)
                      .map((subcategory) => {
                        const isSelected =
                          selectedSubcategoryId === subcategory.id;
                        return (
                          <button
                            key={subcategory.id}
                            onClick={() =>
                              onSubcategorySelect?.(subcategory.id)
                            }
                            className="w-full text-left flex items-center gap-2 py-1 transition-all rtl:text-right rtl:flex-row-reverse"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelected ? "bg-primary-light" : "bg-gray-400"
                              }`}
                            />
                            <span
                              className={`text-sm ${
                                isSelected
                                  ? "text-primary-light font-medium"
                                  : "text-custom-secondary"
                              }`}
                            >
                              {subcategory.name}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                )}
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-custom-primary pt-6">
          <CategoryFilters />
        </div>
      </div>
    </div>
  );
}
