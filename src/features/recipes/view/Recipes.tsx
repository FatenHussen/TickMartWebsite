import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useRecipes } from "../hooks/useRecipes";
import { useAuthStore } from "@/store/auth";
import { useFavorites, useToggleFavorite } from "@/features/account/hooks/useFavorites";
import { useSectionsByPosition } from "@/features/home/hooks/useSections";
import ApiSectionsRenderer from "@/shared/component/sections/ApiSectionsRenderer";
import FullBleedSection from "@/shared/component/FullBleedSection";
import RecipeCard from "../components/RecipeCard";
import RecipeCardSkeleton from "@/shared/component/skeleton/RecipeCardSkeleton";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import type { Recipe } from "../types";

export default function Recipes() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: recipesData,
    isLoading: isRecipesLoading,
    error: recipesError,
  } = useRecipes(currentPage);

  // Accumulate recipes from all pages
  useEffect(() => {
    if (recipesData?.items) {
      setAllRecipes((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newRecipes = recipesData.items.filter(
          (r) => !existingIds.has(r.id)
        );
        return [...prev, ...newRecipes];
      });

      setHasMore(
        recipesData.pagination.current_page < recipesData.pagination.last_page
      );
    }
  }, [recipesData]);

  // Infinite scroll
  const observerTarget = useInfiniteScroll({
    onLoadMore: () => setCurrentPage((prev) => prev + 1),
    hasMore,
    isLoading: isRecipesLoading,
    threshold: 300,
  });

  const { authenticated } = useAuthStore();
  const { data: favoriteRecipes = [] } = useFavorites("recipe", !!authenticated);
  const toggleFavorite = useToggleFavorite();
  const favoriteRecipeIds = favoriteRecipes.map((f) => f.id);

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
        {recipesError ? (
          <div className="mt-8 flex items-center justify-center h-64 bg-custom-secondary rounded-2xl">
            <p className="text-custom-secondary">{t("recipes.failedToLoad")}</p>
          </div>
        ) : (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-custom-primary mb-6">
              {t("recipes.allRecipes")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {/* Render actual recipes */}
              {allRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={favoriteRecipeIds.includes(recipe.id)}
                  onToggleFavorite={(id) =>
                    toggleFavorite.mutate({ type: "recipe", id })
                  }
                />
              ))}

              {/* Show skeleton loaders while loading more */}
              {isRecipesLoading &&
                Array.from({ length: 10 }).map((_, index) => (
                  <RecipeCardSkeleton key={`skeleton-${index}`} />
                ))}
            </div>

            {/* Empty state */}
            {!isRecipesLoading && allRecipes.length === 0 && (
              <div className="mt-8 flex items-center justify-center h-64 bg-custom-secondary rounded-2xl">
                <p className="text-custom-secondary">
                  {t("recipes.noRecipesFound")}
                </p>
              </div>
            )}

            {/* Infinite scroll trigger */}
            <div ref={observerTarget} className="h-10" />
          </div>
        )}

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
