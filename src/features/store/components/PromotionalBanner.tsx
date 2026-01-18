import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";

export type PromotionalBannerProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  backgroundImage?: string;
  illustrationImage?: string;
  className?: string;
  onButtonClick?: () => void;
};

export default function PromotionalBanner({
  title,
  description,
  buttonText,
  backgroundImage,
  illustrationImage,
  className,
  onButtonClick,
}: PromotionalBannerProps) {
  const { t } = useTranslation();

  const defaultTitle = t("store.promotionalBanner.title");
  const defaultDescription = t("store.promotionalBanner.description");
  const defaultButtonText = t("store.promotionalBanner.buttonText");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        className
      )}
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : "linear-gradient(135deg, #8B6F47 0%, #A0826D 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Faded background text overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <span className="text-8xl font-bold text-white whitespace-nowrap">
          {t("store.promotionalBanner.backgroundText")}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 grid grid-cols-1 gap-6 p-8 md:grid-cols-2 md:p-12 lg:p-16">
        {/* Left side - Text content */}
        <div className="flex flex-col justify-center gap-6">
          <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {title || defaultTitle}
          </h2>
          <p className="text-lg text-white/90 md:text-xl">
            {description || defaultDescription}
          </p>
          <div>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={onButtonClick}
              className="rounded-lg bg-white px-8 py-3 font-semibold text-slate-900 hover:bg-white/90"
            >
              {buttonText || defaultButtonText}
            </Button>
          </div>
        </div>

        {/* Right side - Illustration */}
        <div className="flex items-center justify-center md:justify-end">
          {illustrationImage ? (
            <img
              src={illustrationImage}
              alt={title || defaultTitle}
              className="h-auto max-h-96 w-full object-contain"
            />
          ) : (
            <div className="h-64 w-full max-w-md rounded-lg bg-white/10 md:h-80" />
          )}
        </div>
      </div>
    </div>
  );
}

