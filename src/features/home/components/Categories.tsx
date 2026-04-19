import { useTranslation } from"react-i18next";
import { useNavigate } from"react-router-dom";
import SliderSection from"@/shared/component/SliderSection";
import { useHomeCategories } from"../hooks/useCategories";
import { paths } from"@/app/routes/path/paths";

const PLACEHOLDER_ICON =
"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop";

export default function Categories() {
 const { t } = useTranslation();
 const navigate = useNavigate();
 const { categories, isLoading } = useHomeCategories();

 const handleViewAll = () => {
 navigate(paths.client.categories);
 };

 if (isLoading) {
 return (
 <div className="flex justify-center py-8">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-primary"/>
 </div>
 );
 }

 if (categories.length === 0) {
 return null;
 }

 return (
 <SliderSection
 title={t("home.categories")}
 viewAllLabel={t("home.viewAll")}
 onViewAllClick={handleViewAll}
 slidesPerView={3.5}
 items={categories}
 renderItem={(category) => (
 <button
 className="flex flex-col items-center gap-3 bg-transparent w-full hover:opacity-80 transition-opacity"
 onClick={() => navigate(`${paths.client.categories}?category=${category.id}`)}
 >
 <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-shadow">
 <img
 src={category.icon || PLACEHOLDER_ICON}
 alt={category.name}
 className="w-full h-full object-cover"
 />
 </div>
 <span className="text-sm font-medium text-custom-primary text-center">
 {category.name}
 </span>
 </button>
 )}
 breakpoints={{
 640: {
 slidesPerView: 3.5,
 },
 768: {
 slidesPerView: 4.5,
 },
 1024: {
 slidesPerView: 6,
 },
 1280: {
 slidesPerView: 7,
 },
 }}
 />
 );
}
