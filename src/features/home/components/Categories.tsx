import { useTranslation } from "react-i18next";
import SliderSection from "@/shared/component/SliderSection";

type Category = {
  id: number;
  name: string;
  image: string;
};

const categories: Category[] = [
  {
    id: 1,
    name: "food",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "grocery",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "home",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "gifts",
    image:
      "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=400&fit=crop",
  },
  {
    id: 5,
    name: "pharmacy",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    name: "fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop",
  },
  {
    id: 7,
    name: "beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
  },
  {
    id: 8,
    name: "beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
  },
];

export default function Categories() {
  const { t } = useTranslation();

  return (
    <SliderSection
      title={t("home.categories")}
      viewAllLabel={t("home.viewAll")}
      items={categories}
      renderItem={(category) => (
        <button
          className="flex flex-col items-center gap-3 bg-transparent w-full hover:opacity-80 transition-opacity"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img
              src={category.image}
              alt={t(`home.${category.name}`)}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm font-medium text-custom-primary text-center">
            {t(`home.${category.name}`)}
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
