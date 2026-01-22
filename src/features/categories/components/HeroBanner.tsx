import { useTranslation } from "react-i18next";

type HeroBannerProps = {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  backgroundImage?: string;
};

export default function HeroBanner({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  backgroundImage = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200",
}: HeroBannerProps) {
  const { t } = useTranslation();

  return (
    <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden mb-6">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent" />

      {/* Decorative text "Fashion Sale" - faded in background */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl sm:text-7xl md:text-8xl font-bold text-white/10 italic select-none pointer-events-none">
        Fashion
        <br />
        Sale
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center p-6 sm:p-8 md:p-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
          {title || t("categories.springCollection", "Spring Collection 2024")}
        </h1>
        <p className="text-sm sm:text-base text-white/80 mb-4 max-w-md">
          {subtitle ||
            t(
              "categories.discoverTrends",
              "Discover the latest trends in fashion. Up to 40% off on selected items."
            )}
        </p>
        <button
          onClick={onButtonClick}
          className="w-fit px-6 py-2.5 bg-white text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
        >
          {buttonText || t("categories.shopNow", "Shop Now")}
        </button>
      </div>
    </div>
  );
}
