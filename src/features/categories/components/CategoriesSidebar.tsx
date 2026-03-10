import { useTranslation } from "react-i18next";
import type { ApiCategory, CategoryChild } from "../types";
import CategoryFilters from "./CategoryFilters";
import type { CategoryTypeFilter } from "./CategoryFilters";

type CategoriesSidebarProps = {
  categories: ApiCategory[];
  selectedCategoryId: number | undefined;
  selectedSubcategoryId: number | undefined;
  onCategorySelect: (category: ApiCategory) => void;
  onSubcategorySelect: (subcategory: CategoryChild) => void;
  isLoading?: boolean;
  title?: string;
  categoryTypeFilter?: CategoryTypeFilter;
  onCategoryTypeFilterChange?: (type: CategoryTypeFilter) => void;
};

export default function CategoriesSidebar({
  categories,
  selectedCategoryId,
  selectedSubcategoryId,
  onCategorySelect,
  onSubcategorySelect,
  isLoading,
  title,
  categoryTypeFilter,
  onCategoryTypeFilterChange,
}: CategoriesSidebarProps) {
  const { t } = useTranslation();

  // Get children of selected category
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const subcategories = selectedCategory?.children || [];

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-900 mb-4">
          {title || t("categories.categoriesTitle", "Categories")}
        </h2>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {categories.map((category) => {
              const isSelected = selectedCategoryId === category.id;
              const hasChildren = category.children.length > 0;

              return (
                <div key={category.id}>
                  {/* Category Item */}
                  <button
                    onClick={() => onCategorySelect(category)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                      isSelected
                        ? "bg-blue-50 text-primary-light"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {/* Icon */}
                    {category.icon ? (
                      <img
                        src={category.icon}
                        alt={category.name}
                        className="w-6 h-6 rounded object-cover"
                      />
                    ) : (
                      <span className="w-6 h-6 flex items-center justify-center text-lg">
                        📁
                      </span>
                    )}
                    <span
                      className={`text-sm flex-1 ${isSelected ? "font-semibold text-primary-light" : "font-medium"}`}
                    >
                      {category.name}
                    </span>
                    {/* Arrow - only for categories with children */}
                    {hasChildren && (
                      <svg
                        className={`w-4 h-4 transition-transform ${isSelected ? "rotate-90" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Subcategories - show when category is selected and has children */}
                  {isSelected && hasChildren && subcategories.length > 0 && (
                    <div className="ml-9 mt-1 space-y-0.5">
                      {subcategories.map((subcategory) => {
                        const isSubSelected =
                          selectedSubcategoryId === subcategory.id;
                        return (
                          <button
                            key={subcategory.id}
                            onClick={() => onSubcategorySelect(subcategory)}
                            className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                              isSubSelected
                                ? "bg-primary-light/10 text-primary-light font-medium"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                          >
                            {subcategory.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Filters Section - Separate card */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <CategoryFilters
          typeFilter={categoryTypeFilter}
          onTypeFilterChange={onCategoryTypeFilterChange}
        />
      </div>
    </div>
  );
}
