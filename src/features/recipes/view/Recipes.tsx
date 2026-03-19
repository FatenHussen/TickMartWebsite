import { useState, useEffect } from"react";
import { useTranslation } from"react-i18next";
import { useLanguage } from"@/context/LanguageContext";
import { HiSearch } from"react-icons/hi";
import { useRecipes } from"../hooks/useRecipes";
import { useFavorites, useToggleFavorite } from"@/features/account/hooks/useFavorites";
import { useSectionsByPosition } from"@/features/home/hooks/useSections";
import ApiSectionsRenderer from"@/shared/component/sections/ApiSectionsRenderer";
import FullBleedSection from"@/shared/component/FullBleedSection";
import RecipeCard from"../components/RecipeCard";
import RecipeCardSkeleton from"@/shared/component/skeleton/RecipeCardSkeleton";
import { useInfiniteScroll } from"@/shared/hooks/useInfiniteScroll";
import type { Recipe } from"../types";
import type { RecipeFilters } from"../api/recipesApi";

const SORT_OPTIONS: { value: RecipeFilters["sortField"]; labelKey: string }[] = [
 { value: undefined, labelKey:"recipes.sortDefault"},
 { value:"rating", labelKey:"recipes.sortRating"},
 { value:"orders_count", labelKey:"recipes.sortMostOrdered"},
 { value:"discount", labelKey:"recipes.sortDiscount"},
 { value:"created_at", labelKey:"recipes.sortNewest"},
];

export default function Recipes() {
 const { t } = useTranslation();
 const { isRTL } = useLanguage();

 const [search, setSearch] = useState("");
 const [debouncedSearch, setDebouncedSearch] = useState("");
 const [sortField, setSortField] = useState<RecipeFilters["sortField"]>(undefined);
 const [currentPage, setCurrentPage] = useState(1);
 const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
 const [hasMore, setHasMore] = useState(true);

 // Debounce search input by 400ms
 useEffect(() => {
 const timer = setTimeout(() => setDebouncedSearch(search), 400);
 return () => clearTimeout(timer);
 }, [search]);

 // Reset list when filters change
 useEffect(() => {
 setAllRecipes([]);
 setCurrentPage(1);
 setHasMore(true);
 }, [debouncedSearch, sortField]);

 const filters: RecipeFilters = {
 search: debouncedSearch || undefined,
 sortField,
 sortOrder: sortField ?"desc": undefined,
 page: currentPage,
 };

 const {
 data: recipesData,
 isLoading: isRecipesLoading,
 error: recipesError,
 } = useRecipes(filters);

 useEffect(() => {
 if (recipesData?.items) {
 setAllRecipes((prev) => {
 const existingIds = new Set(prev.map((r) => r.id));
 const newRecipes = recipesData.items.filter((r) => !existingIds.has(r.id));
 return [...prev, ...newRecipes];
 });
 setHasMore(
 recipesData.pagination.current_page < recipesData.pagination.last_page
 );
 }
 }, [recipesData]);

 const observerTarget = useInfiniteScroll({
 onLoadMore: () => setCurrentPage((prev) => prev + 1),
 hasMore,
 isLoading: isRecipesLoading,
 threshold: 300,
 });

 const { data: favoriteRecipes = [] } = useFavorites("recipe", false);
 const toggleFavorite = useToggleFavorite();
 const favoriteRecipeIds = favoriteRecipes.map((f) => f.id);

 const { beforeSections, afterSections } = useSectionsByPosition("recipes");
 const bannerSections = beforeSections.filter((s) => s.display_type_id === 1);
 const otherBeforeSections = beforeSections.filter((s) => s.display_type_id !== 1);

 return (
 <div className="min-h-screen bg-custom-primary"dir={isRTL ?"rtl":"ltr"}>
 {bannerSections.length > 0 && (
 <div className="w-full">
 <ApiSectionsRenderer sections={bannerSections} />
 </div>
 )}

 <div className="page-container py-6">
 {otherBeforeSections.length > 0 && (
 <FullBleedSection>
 <ApiSectionsRenderer sections={otherBeforeSections} />
 </FullBleedSection>
 )}

 {recipesError ? (
 <div className="mt-8 flex items-center justify-center h-64 bg-custom-secondary rounded-2xl">
 <p className="text-custom-secondary">{t("recipes.failedToLoad")}</p>
 </div>
 ) : (
 <div className="mt-8">
 <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
 <h2 className="text-2xl font-bold text-custom-primary shrink-0">
 {t("recipes.allRecipes")}
 </h2>

 {/* Search */}
 <div className="relative flex-1">
 <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-custom-tertiary"/>
 <input
 type="text"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder={t("recipes.searchPlaceholder","Search recipes...")}
 className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-custom-primary bg-custom-card text-sm text-custom-primary outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
 />
 </div>

 {/* Sort */}
 <select
 value={sortField ??""}
 onChange={(e) =>
 setSortField((e.target.value || undefined) as RecipeFilters["sortField"])
 }
 className="px-4 py-2.5 rounded-xl border border-custom-primary bg-custom-card text-sm text-custom-primary outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
 >
 {SORT_OPTIONS.map((opt) => (
 <option key={opt.value ??"default"} value={opt.value ??""}>
 {t(opt.labelKey, opt.value ??"Default")}
 </option>
 ))}
 </select>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
 {allRecipes.map((recipe) => (
 <RecipeCard
 key={recipe.id}
 recipe={recipe}
 isFavorite={recipe.is_favorite ?? favoriteRecipeIds.includes(recipe.id)}
 onToggleFavorite={(id) =>
 toggleFavorite.mutate({ type:"recipe", id })
 }
 />
 ))}

 {isRecipesLoading &&
 Array.from({ length: 10 }).map((_, index) => (
 <RecipeCardSkeleton key={`skeleton-${index}`} />
 ))}
 </div>

 {!isRecipesLoading && allRecipes.length === 0 && (
 <div className="mt-8 flex items-center justify-center h-64 bg-custom-secondary rounded-2xl">
 <p className="text-custom-secondary">
 {t("recipes.noRecipesFound")}
 </p>
 </div>
 )}

 <div ref={observerTarget} className="h-10"/>
 </div>
 )}

 {afterSections.length > 0 && (
 <FullBleedSection>
 <ApiSectionsRenderer sections={afterSections} />
 </FullBleedSection>
 )}
 </div>
 </div>
 );
}
