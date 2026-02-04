import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useRecipes } from "../hooks/useRecipes";
import { useSectionsByPosition } from "@/features/home/hooks/useSections";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import FullBleedSection from "@/shared/component/FullBleedSection";
import RecipeCard from "../components/RecipeCard";

export default function Recipes() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const {
    data: recipesData,
    isLoading: isRecipesLoading,
    error: recipesError,
  } = useRecipes();

  const { beforeSections, afterSections } = useSectionsByPosition("recipes");

  // Separate banner sections (display_type_id: 1) from other sections
  const bannerSections = beforeSections.filter((s) => s.display_type_id === 1);
  const otherBeforeSections = beforeSections.filter(
    (s) => s.display_type_id !== 1
  );

  return (
    <div className="min-h-screen bg-custom-primary" dir={isRTL ? "rtl" : "ltr"}>
      {/* Banner Sections - Full Width (display_type_id: 1) - BEFORE main content */}
      {bannerSections.length > 0 && (
        <div className="w-full">
          <ApiSectionsRenderer sections={bannerSections} />
        </div>
      )}

      <div className="page-container py-6">
        {/* Other Sections before recipes */}
        {otherBeforeSections.length > 0 && (
          <FullBleedSection>
            <ApiSectionsRenderer sections={otherBeforeSections} />
          </FullBleedSection>
        )}

        {/* Recipes Grid */}
        {isRecipesLoading ? (
          <div className="mt-8 flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-light" />
          </div>
        ) : recipesError ? (
          <div className="mt-8 flex items-center justify-center h-64 bg-custom-secondary rounded-2xl">
            <p className="text-custom-secondary">{t("recipes.failedToLoad")}</p>
          </div>
        ) : recipesData && recipesData.items.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-custom-primary mb-6">
              {t("recipes.allRecipes")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {recipesData.items.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            {/* Pagination - if needed */}
            {recipesData.pagination && recipesData.pagination.last_page > 1 && (
              <div className="mt-8 flex justify-center">
                <p className="text-custom-secondary text-sm">
                  {t("recipes.page")} {recipesData.pagination.current_page}{" "}
                  {t("recipes.of")} {recipesData.pagination.last_page}
                </p>
              </div>
            )}
          </div>
        ) : recipesData && recipesData.items.length === 0 ? (
          <div className="mt-8 flex items-center justify-center h-64 bg-custom-secondary rounded-2xl">
            <p className="text-custom-secondary">
              {t("recipes.noRecipesFound")}
            </p>
          </div>
        ) : null}

        {/* Sections after recipes */}
        {afterSections.length > 0 && (
          <FullBleedSection>
            <ApiSectionsRenderer sections={afterSections} />
          </FullBleedSection>
        )}
      </div>
    </div>
  );
}
