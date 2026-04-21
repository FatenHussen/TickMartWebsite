import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import SliderSection from "@/shared/component/SliderSection";
import { useHomeCategories } from "../hooks/useCategories";
import { paths } from "@/app/routes/path/paths";

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
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-custom-primary" />
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
                    type="button"
                    className="flex w-full flex-col items-center gap-3 bg-transparent transition-opacity hover:opacity-80"
                    onClick={() =>
                        navigate(`${paths.client.categories}?category=${category.id}`)
                    }
                >
                    <div className="h-20 w-20 overflow-hidden rounded-full shadow-md transition-shadow hover:shadow-lg sm:h-24 sm:w-24 md:h-32 md:w-32">
                        <img
                            src={category.icon || PLACEHOLDER_ICON}
                            alt={category.name}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <span className="text-center text-sm font-semibold text-stone-900 dark:text-custom-primary">
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
